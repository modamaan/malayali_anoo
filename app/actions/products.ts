'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

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
  const supabase = await createClient()
  const { error } = await supabase.from('products').insert([{ 
    name, description, price, currency, images, sizes, colors, sort_order 
  }])
  if (error) throw new Error(error.message)
  
  revalidatePath('/admin/shop')
  revalidatePath('/shop')
}

export async function deleteProduct(id: string) {
  const supabase = await createClient()
  
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
  const supabase = await createClient()
  
  const promises = updates.map(update => 
    supabase.from('products').update({ sort_order: update.sort_order }).eq('id', update.id)
  )
  
  await Promise.all(promises)
  
  revalidatePath('/admin/shop')
  revalidatePath('/shop')
}
