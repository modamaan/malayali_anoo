'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

type Banner = {
  id: string
  title: string
  subtitle: string
  link: string
  sort_order: number
}

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    link: '',
  })
  const [isAdding, setIsAdding] = useState(false)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [isReordering, setIsReordering] = useState(false)
  
  const supabase = createClient()

  useEffect(() => {
    fetchBanners()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchBanners = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('hero_banners')
      .select('*')
      .order('sort_order', { ascending: true })
    
    if (data) setBanners(data)
    if (error) console.error("Error fetching banners:", error.message)
    setLoading(false)
  }

  const handleAddBanner = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title) return

    setIsAdding(true)

    const nextSortOrder = banners.length > 0 
      ? Math.max(...banners.map(b => b.sort_order)) + 1 
      : 1

    const { error } = await supabase
      .from('hero_banners')
      .insert([{
        title: formData.title,
        subtitle: formData.subtitle,
        link: formData.link,
        sort_order: nextSortOrder
      }])

    if (error) {
      alert('Error adding banner: ' + error.message)
    } else {
      setFormData({ title: '', subtitle: '', link: '' })
      fetchBanners()
    }
    
    setIsAdding(false)
  }

  const handleDragStart = (index: number) => {
    setDraggedIndex(index)
  }

  const handleDragEnter = (index: number) => {
    if (draggedIndex === null || draggedIndex === index) return
    
    const newBanners = [...banners]
    const draggedItem = newBanners[draggedIndex]
    newBanners.splice(draggedIndex, 1)
    newBanners.splice(index, 0, draggedItem)
    
    setDraggedIndex(index)
    setBanners(newBanners)
  }

  const handleDragEnd = async () => {
    if (draggedIndex === null) return
    setDraggedIndex(null)
    setIsReordering(true)

    try {
      const updates = banners.map((banner, index) => 
        supabase
          .from('hero_banners')
          .update({ sort_order: index + 1 })
          .eq('id', banner.id)
      )
      
      await Promise.all(updates)
      fetchBanners()
    } catch (error: any) {
      alert("Error reordering: " + error.message)
    } finally {
      setIsReordering(false)
    }
  }

  const handleDeleteBanner = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete the banner "${title}"?`)) return
    
    setIsDeleting(id)

    const { error } = await supabase
      .from('hero_banners')
      .delete()
      .eq('id', id)

    if (error) {
      alert('Error deleting banner: ' + error.message)
    } else {
      fetchBanners()
    }
    
    setIsDeleting(null)
  }

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  )

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
      {/* Add Banner Form */}
      <div className="lg:col-span-1">
        <div className="glass p-6 rounded-2xl border border-white/10 sticky top-24">
          <h2 className="text-xl font-bold text-white mb-4">Add New Banner</h2>
          <form onSubmit={handleAddBanner} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Title *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Subtitle</label>
              <input
                type="text"
                value={formData.subtitle}
                onChange={e => setFormData({...formData, subtitle: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Link URL (YouTube)</label>
              <input
                type="url"
                value={formData.link}
                placeholder="https://youtu.be/..."
                onChange={e => setFormData({...formData, link: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary-500"
              />
              <p className="text-xs text-gray-500 mt-1">Paste any YouTube URL</p>
            </div>

            
            <button
              type="submit"
              disabled={isAdding}
              className="w-full bg-primary-600 hover:bg-primary-500 text-white font-bold py-2.5 rounded-lg transition-colors mt-4 disabled:opacity-50"
            >
              {isAdding ? 'Adding...' : 'Add Banner'}
            </button>
          </form>
        </div>
      </div>

      {/* Banner List */}
      <div className="lg:col-span-2">
        <div className="space-y-4">
          {isReordering && (
            <div className="text-center py-2 text-primary-400 text-sm animate-pulse">
              Saving new order...
            </div>
          )}
          {banners.length === 0 ? (
            <div className="text-center py-12 text-gray-400 glass rounded-2xl border border-white/10">
              No banners found. Add one to get started.
            </div>
          ) : (
            banners.map((banner, index) => (
              <div 
                key={banner.id} 
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragEnter={() => handleDragEnter(index)}
                onDragEnd={handleDragEnd}
                onDragOver={(e) => e.preventDefault()}
                className={`glass p-5 rounded-xl border border-white/10 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between cursor-move transition-all ${draggedIndex === index ? 'opacity-50 scale-[0.98] border-primary-500 bg-white/5 shadow-xl' : 'hover:border-white/30'}`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <div className="text-gray-500 cursor-grab flex items-center justify-center hover:text-white transition-colors" title="Drag to reorder">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="9" cy="5" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="19" r="1"/>
                      </svg>
                    </div>
                    <span className="bg-primary-500/20 text-primary-500 font-mono text-xs font-bold px-2 py-0.5 rounded">
                      Order: {banner.sort_order}
                    </span>
                    <h3 className="text-white font-bold text-lg truncate">{banner.title}</h3>
                  </div>
                  <div className="pl-8 mt-2 space-y-1">
                    <p className="text-sm text-gray-400">{banner.subtitle}</p>
                    <p className="text-xs text-gray-500 truncate max-w-xs">
                      {banner.link || 'No Link'}
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={() => handleDeleteBanner(banner.id, banner.title)}
                  disabled={isDeleting === banner.id}
                  className="w-full sm:w-auto px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-colors shrink-0 font-medium text-sm disabled:opacity-50"
                >
                  {isDeleting === banner.id ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
