'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

type Profile = {
  id: string
  email: string
  role: 'admin' | 'user'
  created_at: string
}

type Invitation = {
  email: string
  created_at: string
}

export default function AdminUsersPage() {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [invitations, setInvitations] = useState<Invitation[]>([])
  const [loading, setLoading] = useState(true)
  const [newEmail, setNewEmail] = useState('')
  const [isAdding, setIsAdding] = useState(false)
  const supabase = createClient()
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null)

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setCurrentUserId(session?.user?.id || null)
      setCurrentUserEmail(session?.user?.email || null)
      fetchData()
    }
    init()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchData = async () => {
    setLoading(true)
    const [profilesRes, invitesRes] = await Promise.all([
      supabase.from('profiles').select('*').eq('role', 'admin').order('created_at', { ascending: false }),
      supabase.from('admin_invitations').select('*').order('created_at', { ascending: false })
    ])

    if (profilesRes.data) setProfiles(profilesRes.data)
    if (invitesRes.data) setInvitations(invitesRes.data)
    setLoading(false)
  }

  const toggleRole = async (userId: string, currentRole: 'admin' | 'user') => {
    if (userId === currentUserId) {
      alert("You cannot change your own role!")
      return
    }

    const newRole = currentRole === 'admin' ? 'user' : 'admin'
    const actionText = newRole === 'admin' ? 'upgrade this user to Admin' : 'downgrade this Admin to a regular User'

    if (!confirm(`Are you sure you want to ${actionText}?`)) return

    const { error } = await supabase
      .from('profiles')
      .update({ role: newRole })
      .eq('id', userId)

    if (error) {
      alert('Error updating role: ' + error.message)
    } else {
      fetchData()
    }
  }

  const handleAddInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newEmail) return

    setIsAdding(true)

    // 1. Check if they already exist in the database (even if they are a regular user)
    const { data: dbProfile } = await supabase.from('profiles').select('id, role').eq('email', newEmail).single()

    if (dbProfile) {
      if (dbProfile.role === 'admin') {
        alert("This person is already an Admin!")
      } else {
        // They exist but aren't an admin, so upgrade them instantly!
        const { error } = await supabase.from('profiles').update({ role: 'admin' }).eq('id', dbProfile.id)
        if (error) {
          alert('Error upgrading user: ' + error.message)
        } else {
          alert("This person already had a regular account. They have been instantly upgraded to Admin!")
          setNewEmail('')
          fetchData()
        }
      }
    } else {
      // 2. They don't exist yet, so add them to the invitations list
      const { error } = await supabase
        .from('admin_invitations')
        .insert([{ email: newEmail, created_by: currentUserEmail }])

      if (error) {
        alert('Error adding invitation: Details: ' + error.message)
      } else {
        const link = `${window.location.origin}/invite?email=${encodeURIComponent(newEmail)}`;
        navigator.clipboard.writeText(link);
        alert(`Invitation added! The invite link for ${newEmail} has been copied to your clipboard.`);
        setNewEmail('')
        fetchData()
      }
    }

    setIsAdding(false)
  }

  const handleRevokeInvite = async (emailToRemove: string) => {
    if (!confirm(`Are you sure you want to revoke the invitation for ${emailToRemove}?`)) return

    const { error } = await supabase
      .from('admin_invitations')
      .delete()
      .eq('email', emailToRemove)

    if (error) {
      alert('Error removing invitation: ' + error.message)
    } else {
      fetchData()
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
      {/* Existing Users */}
      <div className="lg:col-span-2 space-y-6">
        <div className="flex justify-between items-end border-b border-white/10 pb-4">
          <div>
            <h1 className="text-3xl font-heading font-black text-white mb-2">Manage Admins</h1>
            <p className="text-gray-400">
              Manage the administrators who have access to this dashboard.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-10">
            <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="space-y-6">

            {/* Admin Profiles */}
            <div className="bg-[#1a1a1d] border border-white/10 rounded-xl overflow-hidden">
              <div className="divide-y divide-white/10">
                {/* Pending Invitations rendered as Admins */}
                {invitations.map((invite) => (
                  <div key={invite.email} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 hover:bg-white/5 transition-colors gap-4">
                    <div>
                      <p className="font-medium text-white flex items-center gap-2">
                        {invite.email}
                        <span className="text-[10px] font-bold bg-yellow-500/20 text-yellow-500 px-2 py-0.5 rounded uppercase tracking-wider">Pending Invite</span>
                      </p>
                      <p className="text-xs text-gray-400 mt-1">Invited: {new Date(invite.created_at).toLocaleDateString()}</p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-400">Role:</span>
                        <span className="text-sm font-bold uppercase tracking-wider px-2 py-1 rounded bg-primary-500/10 text-primary-500">
                          admin
                        </span>
                      </div>

                      <button
                        onClick={() => handleRevokeInvite(invite.email)}
                        className="text-sm font-medium px-4 py-2 rounded transition-colors bg-red-500/10 text-red-500 hover:bg-red-500/20"
                      >
                        Revoke Admin
                      </button>
                    </div>
                  </div>
                ))}

                {/* Existing Profiles */}
                {profiles.map((profile) => (
                  <div key={profile.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 hover:bg-white/5 transition-colors gap-4">
                    <div>
                      <p className="font-medium text-white flex items-center gap-2">
                        {profile.email}
                        {profile.id === currentUserId && (
                          <span className="text-[10px] font-bold bg-primary-500/20 text-primary-500 px-2 py-0.5 rounded uppercase tracking-wider">You</span>
                        )}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">Joined: {new Date(profile.created_at).toLocaleDateString()}</p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-400">Role:</span>
                        <span className={`text-sm font-bold uppercase tracking-wider px-2 py-1 rounded ${profile.role === 'admin' ? 'bg-primary-500/10 text-primary-500' : 'bg-gray-500/10 text-gray-400'
                          }`}>
                          {profile.role}
                        </span>
                      </div>

                      {profile.id !== currentUserId && (
                        <button
                          onClick={() => toggleRole(profile.id, profile.role)}
                          className={`text-sm font-medium px-4 py-2 rounded transition-colors ${profile.role === 'admin'
                              ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20'
                              : 'bg-white/10 text-white hover:bg-white/20'
                            }`}
                        >
                          {profile.role === 'admin' ? 'Revoke Admin' : 'Make Admin'}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                {profiles.length === 0 && invitations.length === 0 && (
                  <div className="p-8 text-center text-gray-400">No users found.</div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add New Admin Box */}
      <div>
        <div className="bg-[#1a1a1d] border border-white/10 rounded-xl p-6 sticky top-24">
          <h2 className="text-xl font-bold mb-6">Pre-Approve an Admin</h2>
          <form onSubmit={handleAddInvite} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Email Address</label>
              <input
                type="email"
                required
                value={newEmail}
                onChange={e => setNewEmail(e.target.value)}
                placeholder="colleague@example.com"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-primary-500"
              />
              <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                If they haven't created an account yet, you can invite them here. When they finally log in, they will automatically be assigned the Admin role!
              </p>
            </div>

            <button
              type="submit"
              disabled={isAdding || !newEmail}
              className="w-full bg-primary-600 hover:bg-primary-500 text-white font-bold py-2.5 rounded-lg transition-colors disabled:opacity-50"
            >
              {isAdding ? 'Inviting...' : 'Grant Access & Copy Link'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
