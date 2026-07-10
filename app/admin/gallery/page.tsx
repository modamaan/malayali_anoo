'use client'

import { useState, useEffect, useTransition } from 'react'
import { createClient } from '@/lib/supabase/client'
import { addGalleryItem, deleteGalleryItem, reorderGallery } from '@/app/actions/gallery'
import Image from 'next/image'

export default function AdminGallery() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [isPending, startTransition] = useTransition()
  
  const supabase = createClient()

  // Form State
  const [title, setTitle] = useState('')
  const [imageFiles, setImageFiles] = useState<File[]>([])

  useEffect(() => {
    fetchItems()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchItems = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('gallery')
      .select('*')
      .order('sort_order', { ascending: true })

    if (error) {
      alert("Error fetching gallery: " + error.message)
    } else if (data) {
      setItems(data)
    }
    setLoading(false)
  }

  const uploadImage = async (file: File) => {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`
    const filePath = `${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('gallery')
      .upload(filePath, file)

    if (uploadError) {
      throw uploadError
    }

    const { data } = supabase.storage.from('gallery').getPublicUrl(filePath)
    return data.publicUrl
  }

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault()
    if (imageFiles.length === 0) {
      alert("Please select at least one image file")
      return
    }

    setIsAdding(true)

    try {
      let currentSortOrder = items.length > 0
        ? Math.max(...items.map(c => c.sort_order))
        : 0

      for (const file of imageFiles) {
        const imageUrl = await uploadImage(file)
        currentSortOrder += 1
        await addGalleryItem(title, imageUrl, currentSortOrder)
      }

      setTitle('')
      setImageFiles([])
      
      // Reset file input
      const form = e.target as HTMLFormElement
      form.reset()
      
      fetchItems()
    } catch (err: any) {
      alert("Error adding photo: " + err.message)
    } finally {
      setIsAdding(false)
    }
  }

  const handleDeleteItem = async (id: string, url: string) => {
    if (!window.confirm("Are you sure you want to delete this photo?")) return

    setIsDeleting(id)
    try {
      // Extract filename from URL to delete from storage as well
      const urlParts = url.split('/')
      const fileName = urlParts[urlParts.length - 1]
      
      // We ignore storage deletion errors as the file might have been deleted already
      await supabase.storage.from('gallery').remove([fileName])
      
      await deleteGalleryItem(id)
      setItems(items.filter(e => e.id !== id))
    } catch (error: any) {
      alert("Error deleting photo: " + error.message)
    } finally {
      setIsDeleting(null)
    }
  }

  // --- Drag and Drop logic ---
  const handleDragStart = (index: number) => setDraggedIndex(index)

  const handleDragEnter = (index: number) => {
    if (draggedIndex === null || draggedIndex === index) return
    const newItems = [...items]
    const draggedItem = newItems[draggedIndex]
    newItems.splice(draggedIndex, 1)
    newItems.splice(index, 0, draggedItem)
    setDraggedIndex(index)
    setItems(newItems)
  }

  const handleDragEnd = () => {
    if (draggedIndex === null) return
    setDraggedIndex(null)
    persistOrder(items)
  }

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const newItems = [...items]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= newItems.length) return
    ;[newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]]
    setItems(newItems)
    persistOrder(newItems)
  }

  const persistOrder = (ordered: any[]) => {
    startTransition(async () => {
      try {
        const updates = ordered.map((item, i) => ({ id: item.id, sort_order: i + 1 }))
        await reorderGallery(updates)
      } catch (error: any) {
        alert('Error reordering: ' + error.message)
        fetchItems() // rollback
      }
    })
  }

  return (
    <div className="space-y-10">
      <section>
        <div className="glass p-6 md:p-8 rounded-2xl border border-white/10">
          <h2 className="text-2xl font-bold text-white mb-6">Add Photo</h2>
          
          <form onSubmit={handleAddItem} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Image Files *</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => setImageFiles(Array.from(e.target.files || []))}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-500 file:text-white hover:file:bg-primary-600"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Caption / Title (Optional)</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Onam Celebration 2023"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isAdding}
              className="px-6 py-3 bg-primary-600 hover:bg-primary-500 text-white font-bold rounded-lg transition-colors disabled:opacity-50"
            >
              {isAdding ? 'Uploading...' : 'Upload Photos'}
            </button>
          </form>
        </div>
      </section>

      <section>
        <div className="flex justify-between items-end border-b border-white/10 pb-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Gallery Photos</h2>
            <p className="text-gray-400">
              Manage the photos displayed on the Gallery page. Drag and drop to reorder.
            </p>
          </div>
        </div>

        {isPending && (
          <div className="text-center py-2 text-primary-400 text-sm animate-pulse mb-4">
            Saving order...
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-10">
            <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-10 bg-white/5 rounded-xl border border-white/10">
            <p className="text-gray-400">No photos found. Upload one above!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.map((item, index) => (
              <div 
                key={item.id} 
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragEnter={() => handleDragEnter(index)}
                onDragEnd={handleDragEnd}
                onDragOver={(e) => e.preventDefault()}
                className={`glass rounded-xl overflow-hidden border flex flex-col transition-all cursor-grab active:cursor-grabbing ${
                  draggedIndex === index
                    ? 'opacity-50 scale-[0.98] border-primary-500 shadow-xl'
                    : 'border-white/10 hover:border-white/30'
                }`}
              >
                <div className="aspect-square relative overflow-hidden bg-black/50 group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <Image
                    src={item.image_url}
                    alt={item.title || "Gallery photo"}
                    fill
                    sizes="(max-width: 640px) 100vw, 33vw"
                    className="object-cover"
                  />
                  
                  {/* Mobile move buttons overlay */}
                  <div className="absolute top-2 right-2 flex flex-col gap-1 md:hidden">
                    <button
                      onClick={(e) => { e.stopPropagation(); moveItem(index, 'up') }}
                      disabled={index === 0 || isPending}
                      className="w-8 h-8 flex items-center justify-center rounded-lg bg-black/50 text-white backdrop-blur-sm disabled:opacity-30"
                    >
                      ↑
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); moveItem(index, 'down') }}
                      disabled={index === items.length - 1 || isPending}
                      className="w-8 h-8 flex items-center justify-center rounded-lg bg-black/50 text-white backdrop-blur-sm disabled:opacity-30"
                    >
                      ↓
                    </button>
                  </div>
                </div>
                
                <div className="p-3 flex flex-col flex-grow bg-white/5">
                  <p className="text-sm font-medium text-white mb-2 truncate">
                    {item.title || <span className="text-gray-500 italic">No caption</span>}
                  </p>
                  
                  <button
                    onClick={() => handleDeleteItem(item.id, item.image_url)}
                    disabled={isDeleting === item.id || isPending}
                    className="w-full py-1.5 mt-auto bg-red-500/20 hover:bg-red-500 text-red-500 hover:text-white text-xs font-bold rounded transition-colors disabled:opacity-50"
                  >
                    {isDeleting === item.id ? 'Deleting...' : 'Delete'}
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
