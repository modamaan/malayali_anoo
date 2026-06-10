import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AdminNav from '@/components/AdminNav'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  // 1. Not logged in or invalid token? Redirect immediately before the page even renders.
  if (authError || !user?.email) {
    redirect('/login')
  }

  // 2. Check role securely on the server
  const { data, error } = await supabase
    .from('profiles')
    .select('role')
    .ilike('email', user.email)
    .single()

  // 3. Not an admin? Redirect away.
  if (error || !data || data.role !== 'admin') {
    redirect('/')
  }

  // Clean up any pending invitations for this email since they are now an active admin
  await supabase.from('admin_invitations').delete().eq('email', user.email)

  // Authorized! Return the layout.
  return (
    <div className="flex flex-col min-h-screen pb-24">
      <AdminNav />
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </div>
  )
}
