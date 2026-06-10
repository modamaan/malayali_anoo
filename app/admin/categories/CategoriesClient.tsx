'use client'

import { useState, useEffect, useTransition } from 'react'
import { addCategory, deleteCategory, reorderCategories } from '@/app/actions/categories'

type Category = {
  id: string
  title: string
  subtitle: string
  sort_order: number
}

export default function CategoriesClient({ initialCategories }: { initialCategories: Category[] }) {
  const [categories, setCategories] = useState<Category[]>(initialCategories)
  const [formData, setFormData] = useState({ title: '', subtitle: '' })
  const [isAdding, setIsAdding] = useState(false)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    setCategories(initialCategories)
  }, [initialCategories])

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title || !formData.subtitle) return
    setIsAdding(true)
    const nextSortOrder = categories.length > 0
      ? Math.max(...categories.map(c => c.sort_order)) + 1
      : 1
    try {
      await addCategory(formData.title, formData.subtitle, nextSortOrder)
      setFormData({ title: '', subtitle: '' })
    } catch (error: any) {
      alert('Error adding category: ' + error.message)
    } finally {
      setIsAdding(false)
    }
  }

  // --- Mobile: Up/Down arrow buttons ---
  const moveCategory = (index: number, direction: 'up' | 'down') => {
    const newCategories = [...categories]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= newCategories.length) return
    ;[newCategories[index], newCategories[targetIndex]] = [newCategories[targetIndex], newCategories[index]]
    setCategories(newCategories)
    persistOrder(newCategories)
  }

  // --- Desktop: Drag and drop ---
  const handleDragStart = (index: number) => setDraggedIndex(index)

  const handleDragEnter = (index: number) => {
    if (draggedIndex === null || draggedIndex === index) return
    const newCategories = [...categories]
    const draggedItem = newCategories[draggedIndex]
    newCategories.splice(draggedIndex, 1)
    newCategories.splice(index, 0, draggedItem)
    setDraggedIndex(index)
    setCategories(newCategories)
  }

  const handleDragEnd = () => {
    if (draggedIndex === null) return
    setDraggedIndex(null)
    persistOrder(categories)
  }

  // --- Shared: Save order to DB ---
  const persistOrder = (ordered: Category[]) => {
    startTransition(async () => {
      try {
        const updates = ordered.map((cat, i) => ({ id: cat.id, sort_order: i + 1 }))
        await reorderCategories(updates)
      } catch (error: any) {
        alert('Error reordering: ' + error.message)
        setCategories(initialCategories) // rollback
      }
    })
  }

  const handleDeleteCategory = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete the category "${title}"?`)) return
    setIsDeleting(id)
    try {
      await deleteCategory(id)
    } catch (error: any) {
      alert('Error deleting category: ' + error.message)
    } finally {
      setIsDeleting(null)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
      {/* Add Category Form */}
      <div className="lg:col-span-1">
        <div className="glass p-6 rounded-2xl border border-white/10 sticky top-24">
          <h2 className="text-xl font-bold text-white mb-4">Add New Category</h2>
          <form onSubmit={handleAddCategory} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Title</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Short Films"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Subtitle</label>
              <input
                type="text"
                required
                value={formData.subtitle}
                onChange={e => setFormData({ ...formData, subtitle: e.target.value })}
                placeholder="e.g. Our best short films"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-primary-500"
              />
            </div>
            <button
              type="submit"
              disabled={isAdding || isPending}
              className="w-full bg-primary-600 hover:bg-primary-500 text-white font-bold py-2.5 rounded-lg transition-colors mt-4 disabled:opacity-50"
            >
              {isAdding ? 'Adding...' : 'Add Category'}
            </button>
          </form>
        </div>
      </div>

      {/* Category List */}
      <div className="lg:col-span-2">
        <div className="space-y-3">
          {isPending && (
            <div className="text-center py-2 text-primary-400 text-sm animate-pulse">
              Saving order...
            </div>
          )}
          {categories.length === 0 ? (
            <div className="text-center py-12 text-gray-400 glass rounded-2xl border border-white/10">
              No categories found. Add one to get started.
            </div>
          ) : (
            categories.map((category, index) => (
              <div
                key={category.id}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragEnter={() => handleDragEnter(index)}
                onDragEnd={handleDragEnd}
                onDragOver={(e) => e.preventDefault()}
                className={`glass p-4 rounded-xl border border-white/10 flex items-center gap-3 transition-all ${
                  draggedIndex === index
                    ? 'opacity-50 scale-[0.98] border-primary-500 bg-white/5 shadow-xl'
                    : 'hover:border-white/30'
                }`}
              >
                {/* MOBILE ONLY: Up/Down arrow buttons */}
                <div className="flex flex-col gap-1 shrink-0 lg:hidden">
                  <button
                    onClick={() => moveCategory(index, 'up')}
                    disabled={index === 0 || isPending}
                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-all active:scale-95"
                    title="Move up"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 15l-6-6-6 6"/>
                    </svg>
                  </button>
                  <button
                    onClick={() => moveCategory(index, 'down')}
                    disabled={index === categories.length - 1 || isPending}
                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-all active:scale-95"
                    title="Move down"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 9l6 6 6-6"/>
                    </svg>
                  </button>
                </div>

                {/* DESKTOP ONLY: Drag handle */}
                <div className="hidden lg:flex text-gray-500 cursor-grab hover:text-white transition-colors shrink-0" title="Drag to reorder">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="9" cy="5" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="9" cy="19" r="1"/>
                    <circle cx="15" cy="5" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="19" r="1"/>
                  </svg>
                </div>

                {/* Category Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="bg-primary-500/20 text-primary-500 font-mono text-xs font-bold px-2 py-0.5 rounded shrink-0">
                      Order: {category.sort_order}
                    </span>
                    <h3 className="text-white font-bold truncate">{category.title}</h3>
                  </div>
                  <p className="text-sm text-gray-400 mt-0.5 truncate">{category.subtitle}</p>
                </div>

                {/* Delete Button */}
                <button
                  onClick={() => handleDeleteCategory(category.id, category.title)}
                  disabled={isDeleting === category.id || isPending}
                  className="shrink-0 px-3 py-1.5 sm:px-4 sm:py-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-colors font-medium text-sm disabled:opacity-50"
                >
                  {isDeleting === category.id ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
