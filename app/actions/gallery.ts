'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidateSite } from '@/app/actions/revalidate'
import { revalidatePath } from 'next/cache'

// ─── Auth Guard ────────────────────────────────────────────────────────────────
async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user?.email) throw new Error('Unauthorized: not logged in')

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('email', user.email)
    .single()

  if (profileError || profile?.role !== 'admin') throw new Error('Forbidden: admin access required')
  return supabase
}

// ─── Actions ───────────────────────────────────────────────────────────────────

export async function addGalleryItem(title: string, imageUrl: string, sortOrder: number, categoryId: string | null = null) {
  const supabase = await requireAdmin()
  const { error } = await supabase.from('gallery').insert([{ 
    title, 
    image_url: imageUrl, 
    sort_order: sortOrder,
    category_id: categoryId
  }])
  
  if (error) throw new Error(error.message)
  
  revalidatePath('/admin/gallery')
  revalidatePath('/gallery')
  await revalidateSite()
}

export async function deleteGalleryItem(id: string) {
  const supabase = await requireAdmin()
  const { error } = await supabase.from('gallery').delete().eq('id', id)
  if (error) throw new Error(error.message)
  
  revalidatePath('/admin/gallery')
  revalidatePath('/gallery')
  await revalidateSite()
}

export async function updateGalleryItem(id: string, title: string, categoryId: string | null) {
  const supabase = await requireAdmin()
  const { error } = await supabase.from('gallery').update({ 
    title,
    category_id: categoryId
  }).eq('id', id)
  if (error) throw new Error(error.message)
  
  revalidatePath('/admin/gallery')
  revalidatePath('/gallery')
  await revalidateSite()
}

export async function reorderGallery(updates: { id: string, sort_order: number }[]) {
  const supabase = await requireAdmin()
  
  const promises = updates.map(update => 
    supabase.from('gallery').update({ sort_order: update.sort_order }).eq('id', update.id)
  )
  
  await Promise.all(promises)
  
  revalidatePath('/admin/gallery')
  revalidatePath('/gallery')
  await revalidateSite()
}
