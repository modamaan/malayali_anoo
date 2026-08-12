'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

type Sponsor = {
  id: string
  name: string
  website: string
  logo_url: string
}

// ─── Edit Modal ────────────────────────────────────────────────────────────────
function EditModal({
  sponsor,
  onClose,
  onSave,
}: {
  sponsor: Sponsor
  onClose: () => void
  onSave: (updated: Sponsor) => void
}) {
  const supabase = createClient()
  const [name, setName] = useState(sponsor.name)
  const [website, setWebsite] = useState(sponsor.website || '')
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const uploadLogo = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`
    const { error } = await supabase.storage.from('sponsors').upload(fileName, file)
    if (error) throw error
    return supabase.storage.from('sponsors').getPublicUrl(fileName).data.publicUrl
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name) return
    setIsSaving(true)
    try {
      let logo_url = sponsor.logo_url
      if (logoFile) {
        logo_url = await uploadLogo(logoFile)
      }

      const { error } = await supabase
        .from('sponsors')
        .update({ name, website, logo_url })
        .eq('id', sponsor.id)

      if (error) throw error

      onSave({ ...sponsor, name, website, logo_url })
      onClose()
    } catch (err: any) {
      alert('Error saving: ' + err.message)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        className="relative z-10 w-full max-w-md bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-xl font-bold text-white">Edit Sponsor</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white flex items-center justify-center transition-all"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Company Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Website URL</label>
            <input
              type="url"
              value={website}
              placeholder="https://..."
              onChange={e => setWebsite(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Replace Logo (optional)</label>
            {/* Current logo preview */}
            <div className="flex items-center gap-3 mb-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={sponsor.logo_url} alt={sponsor.name} className="h-10 w-16 object-contain rounded border border-white/10 bg-white/5 p-1" />
              <span className="text-xs text-gray-500">Current logo</span>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={e => setLogoFile(e.target.files?.[0] || null)}
              className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-500/10 file:text-primary-500 hover:file:bg-primary-500/20"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-lg border border-white/10 text-gray-400 hover:text-white hover:border-white/30 transition-all font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 py-2.5 rounded-lg bg-primary-600 hover:bg-primary-500 text-white font-bold transition-colors disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function AdminSponsors() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([])
  const [loading, setLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [editingSponsor, setEditingSponsor] = useState<Sponsor | null>(null)
  const supabase = createClient()

  // Form State
  const [name, setName] = useState('')
  const [website, setWebsite] = useState('')
  const [logoFile, setLogoFile] = useState<File | null>(null)

  useEffect(() => {
    fetchSponsors()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchSponsors = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('sponsors')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      alert("Error fetching sponsors: " + error.message)
    } else if (data) {
      setSponsors(data)
    }
    setLoading(false)
  }

  const uploadLogo = async (file: File) => {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`
    const filePath = `${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('sponsors')
      .upload(filePath, file)

    if (uploadError) {
      throw uploadError
    }

    const { data } = supabase.storage.from('sponsors').getPublicUrl(filePath)
    return data.publicUrl
  }

  const handleAddSponsor = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !logoFile) return

    setIsAdding(true)

    try {
      const publicUrl = await uploadLogo(logoFile)

      const { error } = await supabase.from('sponsors').insert([
        {
          name,
          website,
          logo_url: publicUrl,
        }
      ])

      if (error) throw error

      setName('')
      setWebsite('')
      setLogoFile(null)
      // Reset file input visually
      const form = e.target as HTMLFormElement;
      form.reset();

      fetchSponsors()
    } catch (err: any) {
      alert("Error adding sponsor: " + err.message)
    } finally {
      setIsAdding(false)
    }
  }

  const handleDeleteSponsor = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this sponsor?")) return

    setIsDeleting(id)
    const { error } = await supabase.from('sponsors').delete().eq('id', id)

    if (error) {
      alert("Error deleting sponsor: " + error.message)
    } else {
      setSponsors(sponsors.filter(s => s.id !== id))
    }
    setIsDeleting(null)
  }

  const handleSponsorSaved = (updated: Sponsor) => {
    setSponsors(prev => prev.map(s => s.id === updated.id ? updated : s))
  }

  return (
    <div className="space-y-10">
      {/* Edit Modal */}
      {editingSponsor && (
        <EditModal
          sponsor={editingSponsor}
          onClose={() => setEditingSponsor(null)}
          onSave={handleSponsorSaved}
        />
      )}

      {/* ADD NEW SPONSOR FORM */}
      <section>
        <div className="glass p-6 md:p-8 rounded-2xl border border-white/10">
          <h2 className="text-2xl font-bold text-white mb-6">Add New Sponsor</h2>

          <form onSubmit={handleAddSponsor} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Company Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Website URL (Optional)</label>
                <input
                  type="url"
                  value={website}
                  placeholder="https://..."
                  onChange={(e) => setWebsite(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-1">Logo Image *</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-500 file:text-white hover:file:bg-primary-600"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isAdding || !logoFile}
              className="px-6 py-3 bg-primary-600 hover:bg-primary-500 text-white font-bold rounded-lg transition-colors disabled:opacity-50"
            >
              {isAdding ? 'Adding Sponsor...' : 'Add Sponsor'}
            </button>
          </form>
        </div>
      </section>

      {/* SPONSORS LIST */}
      <section>
        <div className="flex justify-between items-end border-b border-white/10 pb-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Current Sponsors</h2>
            <p className="text-gray-400">
              Manage the sponsors displayed on the website.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-10">
            <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : sponsors.length === 0 ? (
          <div className="text-center py-10 bg-white/5 rounded-xl border border-white/10">
            <p className="text-gray-400">No sponsors found. Add one above!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {sponsors.map((sponsor) => (
              <div key={sponsor.id} className="glass rounded-xl overflow-hidden border border-white/10 flex flex-col items-center p-6 text-center">
                <div className="h-20 w-full mb-4 flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={sponsor.logo_url}
                    alt={sponsor.name}
                    className="max-h-full max-w-full object-contain transition-all"
                  />
                </div>

                <h3 className="font-bold text-white mb-1 line-clamp-1 w-full">{sponsor.name}</h3>
                {sponsor.website && (
                  <a href={sponsor.website} target="_blank" rel="noopener noreferrer" className="text-sm text-primary-500 hover:underline mb-4 line-clamp-1 w-full">
                    {sponsor.website.replace(/^https?:\/\//, '')}
                  </a>
                )}

                {/* Actions */}
                <div className="flex gap-2 w-full mt-auto">
                  <button
                    onClick={() => setEditingSponsor(sponsor)}
                    className="flex-1 py-2 bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white font-medium rounded-lg transition-colors border border-blue-500/20 text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteSponsor(sponsor.id)}
                    disabled={isDeleting === sponsor.id}
                    className="flex-1 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 font-medium rounded-lg transition-colors border border-red-500/20 disabled:opacity-50 text-sm"
                  >
                    {isDeleting === sponsor.id ? '...' : 'Delete'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

    </div>
  )
}
