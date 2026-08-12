'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// Call this at the top of every write action.
// Throws immediately if the caller is not a verified admin.
async function requireAdmin() {
  const supabase = await createClient()

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

export async function addCustomColor(hex: string, name: string) {
  const supabase = await requireAdmin()
  
  // We don't care if it fails due to UNIQUE constraint, 
  // we just want it in the database.
  const { error } = await supabase
    .from('shop_colors')
    .insert([{ hex, name }])
    
  if (error && error.code !== '23505') { // 23505 is unique violation in Postgres
    throw new Error(error.message)
  }
  
  revalidatePath('/admin/shop')
}

export async function deleteCustomColor(hex: string, name: string) {
  const supabase = await requireAdmin()
  const { error } = await supabase
    .from('shop_colors')
    .delete()
    .match({ hex, name })
    
  if (error) throw new Error(error.message)
  revalidatePath('/admin/shop')
}
