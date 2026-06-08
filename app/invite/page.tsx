'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

function InviteForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  useEffect(() => {
    const queryEmail = searchParams.get('email')
    if (queryEmail) {
      setEmail(queryEmail)
    }
  }, [searchParams])

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // 1. Create the account
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    })

    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
      return
    }

    // Sign out just in case signUp automatically logged them in behind the scenes
    await supabase.auth.signOut()

    // Redirect to the login page
    router.push('/login')
  }

  return (
    <>
      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg mb-6 text-sm">
          {error}
        </div>
      )}
      <form onSubmit={handleSignUp} className="space-y-4" suppressHydrationWarning>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
        <input
          type="email"
          value={email}
          readOnly
          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-gray-400 focus:outline-none cursor-not-allowed"
          required
          suppressHydrationWarning
        />
        <p className="text-xs text-gray-500 mt-1">This email has been pre-approved for Admin access.</p>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Create a Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500"
          required
          minLength={6}
          placeholder="Minimum 6 characters"
          suppressHydrationWarning
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-primary-600 hover:bg-primary-500 text-white font-bold py-3 rounded-lg transition-colors mt-6 disabled:opacity-50"
        suppressHydrationWarning
      >
        {loading ? 'Creating Account...' : 'Create Account'}
      </button>
    </form>
    </>
  )
}

export default function InvitePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full glass p-8 rounded-2xl border border-white/10 shadow-2xl">
        <h1 className="text-3xl font-heading font-black text-white mb-2 text-center">Accept Invitation</h1>
        <p className="text-gray-400 text-center text-sm mb-8">Create your account to access the Admin Dashboard</p>
        
        <Suspense fallback={<div className="text-center text-gray-500">Loading...</div>}>
          <InviteForm />
        </Suspense>
      </div>
    </div>
  )
}
