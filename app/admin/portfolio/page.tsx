'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

type Video = {
  id: string
  title: string
  thumbnail_url: string
  link: string
  date: string
  trending: boolean
  category: string
}

export default function AdminPortfolioPage() {
  const [videos, setVideos] = useState<Video[]>([])
  const [categories, setCategories] = useState<{title: string}[]>([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    title: '',
    thumbnail_url: '',
    link: '',
    date: new Date().toISOString().split('T')[0],
    trending: false,
    category: 'Others',
  })
  const [isAdding, setIsAdding] = useState(false)
  
  const supabase = createClient()

  useEffect(() => {
    fetchVideosAndCategories()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchVideosAndCategories = async () => {
    setLoading(true)
    const [videosResponse, categoriesResponse] = await Promise.all([
      supabase.from('portfolio_videos').select('*').order('date', { ascending: false }),
      supabase.from('video_categories').select('title').order('sort_order', { ascending: true })
    ])
    
    if (videosResponse.data) setVideos(videosResponse.data)
    if (categoriesResponse.data) setCategories(categoriesResponse.data)
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsAdding(true)

    // Extract YouTube ID to generate thumbnail
    const getYouTubeId = (url: string) => {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\/shorts\/)([^#\&\?]*).*/;
      const match = url.match(regExp);
      return (match && match[2].length === 11) ? match[2] : null;
    }

    const videoId = getYouTubeId(formData.link);
    let generatedThumbnailUrl = formData.thumbnail_url;
    
    if (videoId) {
      generatedThumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    } else {
      alert('Could not detect a valid YouTube ID from the link. Please check the URL.');
      setIsAdding(false);
      return;
    }

    const payload = {
      title: formData.title,
      link: formData.link,
      date: formData.date,
      trending: formData.trending,
      category: formData.category,
      thumbnail_url: generatedThumbnailUrl
    }

    const { error } = await supabase
      .from('portfolio_videos')
      .insert([payload])

    if (!error) {
      setFormData({
        title: '',
        thumbnail_url: '',
        link: '',
        date: new Date().toISOString().split('T')[0],
        trending: false,
        category: categories.length > 0 ? categories[0].title : 'Others',
      })
      fetchVideosAndCategories()
    } else {
      alert('Error adding video: ' + error.message)
    }
    
    setIsAdding(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this video?')) return

    const { error } = await supabase
      .from('portfolio_videos')
      .delete()
      .eq('id', id)

    if (!error) {
      fetchVideosAndCategories()
    } else {
      alert('Error deleting video: ' + error.message)
    }
  }

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  )

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
      {/* Add Video Form */}
          <div className="lg:col-span-1">
            <div className="glass p-6 rounded-2xl border border-white/10 sticky top-24">
              <h2 className="text-xl font-bold text-white mb-4">Add New Video</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">YouTube Link</label>
                  <input
                    type="url"
                    required
                    value={formData.link}
                    onChange={e => setFormData({...formData, link: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Category</label>
                  <select
                    required
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white [&>option]:bg-[#1a1a1d]"
                  >
                    {categories.length === 0 ? (
                      <option value="Others">Others</option>
                    ) : (
                      categories.map(cat => (
                        <option key={cat.title} value={cat.title}>{cat.title}</option>
                      ))
                    )}
                  </select>
                  <div className="flex justify-end mt-2">
                    <Link href="/admin/categories" className="text-xs text-primary-400 hover:text-primary-300 transition-colors font-medium">
                      + Create new category
                    </Link>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={e => setFormData({...formData, date: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white"
                  />
                </div>
                <div className="flex items-center gap-3 mt-2">
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      id="trending"
                      checked={formData.trending}
                      onChange={e => setFormData({...formData, trending: e.target.checked})}
                      className="peer appearance-none w-5 h-5 border border-white/20 rounded bg-white/5 checked:bg-primary-500 checked:border-primary-500 cursor-pointer transition-all"
                    />
                    <svg className="absolute w-3.5 h-3.5 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <label htmlFor="trending" className="text-sm text-gray-300 cursor-pointer select-none">Trending (shows in 'Trending' filter)</label>
                </div>
                <button
                  type="submit"
                  disabled={isAdding}
                  className="w-full bg-primary-600 hover:bg-primary-500 text-white font-bold py-2 rounded-lg transition-colors mt-4"
                >
                  {isAdding ? 'Adding...' : 'Add Video'}
                </button>
              </form>
            </div>
          </div>

          {/* Video List */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {videos.length === 0 ? (
                <div className="text-center py-12 text-gray-400 glass rounded-2xl border border-white/10">
                  No videos found. Add one to get started.
                </div>
              ) : (
                videos.map(video => (
                  <div key={video.id} className="glass p-4 rounded-xl border border-white/10 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={video.thumbnail_url} alt={video.title} className="w-full sm:w-32 h-48 sm:h-20 object-cover rounded-lg shrink-0" />
                    <div className="flex-1 min-w-0 w-full">
                      <h3 className="text-white font-bold truncate">{video.title}</h3>
                      <div className="text-sm text-gray-400 flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                        <span>{video.date}</span>
                        <span className="bg-white/10 px-2 py-0.5 rounded text-xs font-medium text-white">{video.category || 'Others'}</span>
                        {video.trending && <span className="text-primary-500">Trending</span>}
                        <a href={video.link} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline truncate">Link</a>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(video.id)}
                      className="w-full sm:w-auto px-4 py-2 bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-colors shrink-0"
                    >
                      Delete
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
    </div>
  )
}
