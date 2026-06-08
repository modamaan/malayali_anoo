'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isAuthorized, setIsAuthorized] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      // Not logged in
      if (!session?.user?.email) {
        router.push('/login')
        return
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .ilike('email', session.user.email)
        .limit(1)

      if (error) {
        alert("Database Error: " + error.message)
        await supabase.auth.signOut()
        router.push('/')
        return
      }

      if (!data || data.length === 0) {
        alert(`Access Denied [Code 101]: We couldn't find a profile for ${session.user.email}. Are you sure you saved the file and refreshed the page?`)
        await supabase.auth.signOut()
        router.push('/')
        return
      }

      if (data[0].role !== 'admin') {
        alert(`Access Denied [Code 102]: Profile found, but role is "${data[0].role}", not "admin".`)
        await supabase.auth.signOut()
        router.push('/')
        return
      }

      // Authorized!
      setIsAuthorized(true)
    }

    checkAuth()
  }, [router, supabase])

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div className="flex flex-col min-h-screen pb-24">
       <div className="border-b border-white/10 bg-black/50 mb-8 pt-8">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="flex justify-between items-center mb-6">
             <h1 className="text-3xl font-heading font-black">ADMIN <span className="text-primary-500">DASHBOARD</span></h1>
             <button 
               onClick={handleLogout}
               className="text-sm text-gray-400 hover:text-white transition-colors"
             >
               Logout
             </button>
           </div>
           <div className="flex space-x-8">
             <Link 
               href="/admin/portfolio" 
               className={`pb-4 border-b-2 font-medium transition-colors ${pathname === '/admin/portfolio' ? 'border-primary-500 text-white' : 'border-transparent text-gray-400 hover:text-white'}`}
             >
               Portfolio Videos
             </Link>
             <Link 
               href="/admin/users" 
               className={`pb-4 border-b-2 font-medium transition-colors ${pathname === '/admin/users' ? 'border-primary-500 text-white' : 'border-transparent text-gray-400 hover:text-white'}`}
             >
               Manage Admins
             </Link>
           </div>
         </div>
       </div>
       
       <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
         {children}
       </div>
    </div>
  )
}
