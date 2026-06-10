'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function AdminNav() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
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
        <div className="flex space-x-8 overflow-x-auto whitespace-nowrap hide-scrollbar">
          <Link
            href="/admin/portfolio"
            className={`pb-4 border-b-2 font-medium transition-colors ${pathname === '/admin/portfolio' ? 'border-primary-500 text-white' : 'border-transparent text-gray-400 hover:text-white'}`}
          >
            Portfolio Videos
          </Link>
          {/* <Link
              href="/admin/banners"
              className={`pb-4 border-b-2 font-medium transition-colors ${pathname === '/admin/banners' ? 'border-primary-500 text-white' : 'border-transparent text-gray-400 hover:text-white'}`}
            >
              Manage Banners
            </Link> */}
          <Link
            href="/admin/events"
            className={`pb-4 border-b-2 font-medium transition-colors ${pathname === '/admin/events' ? 'border-primary-500 text-white' : 'border-transparent text-gray-400 hover:text-white'}`}
          >
            Manage Events
          </Link>
          <Link
            href="/admin/categories"
            className={`pb-4 border-b-2 font-medium transition-colors ${pathname === '/admin/categories' ? 'border-primary-500 text-white' : 'border-transparent text-gray-400 hover:text-white'}`}
          >
            Manage Categories
          </Link>
          <Link
            href="/admin/sponsors"
            className={`pb-4 border-b-2 font-medium transition-colors ${pathname === '/admin/sponsors' ? 'border-primary-500 text-white' : 'border-transparent text-gray-400 hover:text-white'}`}
          >
            Manage Sponsors
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
  )
}
