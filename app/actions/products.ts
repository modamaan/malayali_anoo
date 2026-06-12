'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// ─── Auth Guard ────────────────────────────────────────────────────────────────
// Call this at the top of every write action.
// Throws immediately if the caller is not a verified admin.
async function requireAdmin() {
  const supabase = await createClient()

  // getUser() hits the Supabase server to verify the JWT — cannot be faked
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user?.email) {
    throw new Error('Unauthorized: not logged in')
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('email', user.email)
    .single()

  if (profileError || profile?.role !== 'admin') {
    throw new Error('Forbidden: admin access required')
  }

  return supabase
}

// ─── Actions ───────────────────────────────────────────────────────────────────

export async function addProduct(
  name: string,
  description: string,
  price: number,
  currency: string,
  images: string[],
  sizes: string[],
  colors: string[],
  sort_order: number
) {
  const supabase = await requireAdmin()
  const { error } = await supabase.from('products').insert([{ 
    name, description, price, currency, images, sizes, colors, sort_order 
  }])
  if (error) throw new Error(error.message)
  
  revalidatePath('/admin/shop')
  revalidatePath('/shop')
}

export async function deleteProduct(id: string) {
  const supabase = await requireAdmin()
  
  // First get the product to find its images
  const { data: product } = await supabase.from('products').select('images').eq('id', id).single()
  
  // Delete the product from database
  const { error } = await supabase.from('products').delete().eq('id', id)
  if (error) throw new Error(error.message)
  
  // Delete images from storage to save space
  if (product && product.images && product.images.length > 0) {
    // Extract file paths from public URLs
    // URL format: https://[project].supabase.co/storage/v1/object/public/product-images/[filename]
    const filePaths = product.images.map((url: string) => {
      const parts = url.split('/product-images/')
      return parts.length > 1 ? parts[1] : null
    }).filter(Boolean)

    if (filePaths.length > 0) {
      await supabase.storage.from('product-images').remove(filePaths)
    }
  }
  
  revalidatePath('/admin/shop')
  revalidatePath('/shop')
}

export async function reorderProducts(updates: { id: string, sort_order: number }[]) {
  const supabase = await requireAdmin()
  
  const promises = updates.map(update => 
    supabase.from('products').update({ sort_order: update.sort_order }).eq('id', update.id)
  )
  
  await Promise.all(promises)
  
  revalidatePath('/admin/shop')
  revalidatePath('/shop')
}

export async function updateProduct(
  id: string,
  name: string,
  description: string,
  price: number,
  currency: string,
  images: string[],
  sizes: string[],
  colors: string[]
) {
  const supabase = await requireAdmin()
  const { error } = await supabase
    .from('products')
    .update({ name, description, price, currency, images, sizes, colors })
    .eq('id', id)
  if (error) throw new Error(error.message)

  revalidatePath('/admin/shop')
  revalidatePath('/shop')
}
