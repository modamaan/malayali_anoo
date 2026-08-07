'use server'

import { revalidatePath, revalidateTag } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function revalidateSite() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')
  
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('role')
    .ilike('email', user.email!)
    .single()

  if (error || !profile || profile.role !== 'admin') {
    throw new Error('Unauthorized')
  }

  // Revalidate the entire site cache (all pages and layouts)
  revalidatePath('/', 'layout')
  
  // Also explicitly purge all Supabase fetch requests
  // 'max' keeps the revalidated data cached until the next explicit invalidation
  // @ts-ignore - Next.js canary types require 2 arguments, 'max' is the recommended value
  revalidateTag('supabase', 'max')
}
