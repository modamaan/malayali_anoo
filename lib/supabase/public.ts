import { createClient as createSupabaseClient } from '@supabase/supabase-js'

export function createPublicClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      global: {
        fetch: (url, options) => {
          return fetch(url, { ...options, next: { tags: ['supabase'] } })
        }
      }
    }
  )
}
