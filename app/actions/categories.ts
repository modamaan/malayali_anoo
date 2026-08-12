'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { revalidateSite } from '@/app/actions/revalidate'

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

export async function addCategory(title: string, subtitle: string, sort_order: number) {
  const supabase = await requireAdmin()
  const { error } = await supabase.from('video_categories').insert([{ title, subtitle, sort_order }])
  if (error) throw new Error(error.message)
  
  revalidatePath('/admin/categories')
  await revalidateSite()
}

export async function deleteCategory(id: string) {
  const supabase = await requireAdmin()
  const { error } = await supabase.from('video_categories').delete().eq('id', id)
  if (error) throw new Error(error.message)
  
  revalidatePath('/admin/categories')
  await revalidateSite()
}

export async function updateCategory(id: string, title: string, subtitle: string) {
  const supabase = await requireAdmin()
  const { error } = await supabase
    .from('video_categories')
    .update({ title, subtitle })
    .eq('id', id)
  if (error) throw new Error(error.message)

  revalidatePath('/admin/categories')
  await revalidateSite()
}

export async function reorderCategories(updates: { id: string, sort_order: number }[]) {
  const supabase = await requireAdmin()
  
  // Update all categories in parallel
  const promises = updates.map(update => 
    supabase.from('video_categories').update({ sort_order: update.sort_order }).eq('id', update.id)
  )
  
  await Promise.all(promises)
  
  revalidatePath('/admin/categories')
  await revalidateSite()
}
