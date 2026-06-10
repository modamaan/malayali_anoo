'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addCategory(title: string, subtitle: string, sort_order: number) {
  const supabase = await createClient()
  const { error } = await supabase.from('video_categories').insert([{ title, subtitle, sort_order }])
  if (error) throw new Error(error.message)
  
  revalidatePath('/admin/categories')
  revalidatePath('/')
}

export async function deleteCategory(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('video_categories').delete().eq('id', id)
  if (error) throw new Error(error.message)
  
  revalidatePath('/admin/categories')
  revalidatePath('/')
}

export async function reorderCategories(updates: { id: string, sort_order: number }[]) {
  const supabase = await createClient()
  
  // Update all categories in parallel
  const promises = updates.map(update => 
    supabase.from('video_categories').update({ sort_order: update.sort_order }).eq('id', update.id)
  )
  
  await Promise.all(promises)
  
  revalidatePath('/admin/categories')
  revalidatePath('/')
}
