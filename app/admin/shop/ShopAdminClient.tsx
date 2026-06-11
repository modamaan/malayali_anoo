'use client'

import { useState, useEffect, useTransition } from 'react'
import { addProduct, deleteProduct, reorderProducts, updateProduct } from '@/app/actions/products'
import { createClient } from '@/lib/supabase/client'
import type { MerchItem } from '@/lib/types'

const AVAILABLE_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL']
const AVAILABLE_COLORS = [
  { hex: '#000000', name: 'Black' },
  { hex: '#ffffff', name: 'White' },
  { hex: '#ff0000', name: 'Red' },
  { hex: '#00ff00', name: 'Green' },
  { hex: '#0000ff', name: 'Blue' },
  { hex: '#ffff00', name: 'Yellow' },
  { hex: '#800080', name: 'Purple' },
  { hex: '#ffa500', name: 'Orange' },
  { hex: '#808080', name: 'Grey' },
  { hex: '#c0c0c0', name: 'Silver' },
]

// ─── Edit Modal ────────────────────────────────────────────────────────────────
function EditModal({
  product,
  onClose,
  onSave,
}: {
  product: MerchItem
  onClose: () => void
  onSave: (updated: MerchItem) => void
}) {
  const supabase = createClient()
  const [formData, setFormData] = useState({
    name: product.name,
    description: product.description || '',
    price: String(product.price),
  })
  const [currency, setCurrency] = useState(product.currency || '£')
  const [selectedSizes, setSelectedSizes] = useState<string[]>(product.sizes || [])
  const [colors, setColors] = useState<string[]>(product.colors || [])
  const [existingImages, setExistingImages] = useState<string[]>(product.images || [])
  const [newFiles, setNewFiles] = useState<File[]>([])
  const [isSaving, setIsSaving] = useState(false)

  const handleRemoveExistingImage = (url: string) => {
    setExistingImages(prev => prev.filter(img => img !== url))
  }

  const handleNewFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    const files = Array.from(e.target.files)
    if (existingImages.length + files.length > 4) {
      alert('Maximum 4 images total.'); return
    }
    setNewFiles(files)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      // Upload any new images
      const uploadedUrls = await Promise.all(
        newFiles.map(async (file) => {
          const fileName = `${Math.random()}.${file.name.split('.').pop()}`
          const { error } = await supabase.storage.from('product-images').upload(fileName, file)
          if (error) throw new Error(error.message)
          return supabase.storage.from('product-images').getPublicUrl(fileName).data.publicUrl
        })
      )

      const finalImages = [...existingImages, ...uploadedUrls]
      const updatedProduct: MerchItem = {
        ...product,
        name: formData.name,
        description: formData.description,
        price: parseInt(formData.price),
        currency,
        images: finalImages,
        sizes: selectedSizes,
        colors,
      }

      // Optimistic update
      onSave(updatedProduct)
      onClose()

      // Persist in background
      await updateProduct(
        product.id,
        formData.name,
        formData.description,
        parseInt(formData.price),
        currency,
        finalImages,
        selectedSizes,
        colors,
      )
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
        className="relative z-10 w-full max-w-lg max-h-[90vh] overflow-y-auto bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 sticky top-0 bg-zinc-900 z-10">
          <h2 className="text-xl font-bold text-white">Edit Product</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white flex items-center justify-center transition-all">✕</button>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-5">
          {/* Name */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">Name</label>
            <input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary-500" />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">Description</label>
            <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary-500 min-h-[80px]" />
          </div>

          {/* Price + Currency */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Price</label>
              <input type="number" required min="0" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary-500" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Currency</label>
              <select value={currency} onChange={e => setCurrency(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary-500 appearance-none">
                <option value="£" className="bg-zinc-900">£ Pound</option>
                <option value="€" className="bg-zinc-900">€ Euro</option>
                <option value="₹" className="bg-zinc-900">₹ Rupee</option>
              </select>
            </div>
          </div>

          {/* Sizes */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">Sizes</label>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_SIZES.map(size => (
                <button key={size} type="button"
                  onClick={() => setSelectedSizes(prev => prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size])}
                  className={`px-3 py-1.5 rounded-lg text-sm font-bold border transition-all ${selectedSizes.includes(size) ? 'bg-primary-500 border-primary-500 text-white' : 'bg-transparent border-white/10 text-gray-400 hover:border-white/30'}`}
                >{size}</button>
              ))}
            </div>
          </div>

          {/* Colors */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">Colors</label>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_COLORS.map(color => (
                <button key={color.hex} type="button"
                  onClick={() => setColors(prev => prev.includes(color.hex) ? prev.filter(c => c !== color.hex) : [...prev, color.hex])}
                  className={`px-3 py-1.5 rounded-lg text-sm font-bold border transition-all flex items-center gap-2 ${colors.includes(color.hex) ? 'bg-transparent border-primary-500 text-white' : 'bg-transparent border-white/10 text-gray-400 hover:border-white/30'}`}
                >
                  <span className="w-3 h-3 rounded-full border border-white/20" style={{ backgroundColor: color.hex }} />
                  {color.name}
                </button>
              ))}
            </div>
          </div>

          {/* Existing Images */}
          {existingImages.length > 0 && (
            <div>
              <label className="block text-sm text-gray-400 mb-2">Current Images</label>
              <div className="flex flex-wrap gap-3">
                {existingImages.map((url, i) => (
                  <div key={i} className="relative group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt="" className="w-16 h-16 object-cover rounded-lg border border-white/10" />
                    <button
                      type="button"
                      onClick={() => handleRemoveExistingImage(url)}
                      className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs shadow-md transition-colors"
                    >✕</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add New Images */}
          {existingImages.length < 4 && (
            <div>
              <label className="block text-sm text-gray-400 mb-1">Add Images ({4 - existingImages.length} slots left)</label>
              <input type="file" accept="image/*" multiple onChange={handleNewFiles} className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-500/10 file:text-primary-500 hover:file:bg-primary-500/20" />
            </div>
          )}

          {/* Footer Buttons */}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-lg border border-white/10 text-gray-400 hover:text-white hover:border-white/30 transition-all font-medium">Cancel</button>
            <button type="submit" disabled={isSaving} className="flex-1 py-2.5 rounded-lg bg-primary-600 hover:bg-primary-500 text-white font-bold transition-colors disabled:opacity-50">
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ─── Main Admin Client ─────────────────────────────────────────────────────────
export default function ShopAdminClient({ initialProducts }: { initialProducts: MerchItem[] }) {
  const [products, setProducts] = useState<MerchItem[]>(initialProducts)
  const supabase = createClient()

  // Form State
  const [formData, setFormData] = useState({ name: '', description: '', price: '' })
  const [currency, setCurrency] = useState('£')
  const [selectedSizes, setSelectedSizes] = useState<string[]>([])
  const [colors, setColors] = useState<string[]>([])
  const [files, setFiles] = useState<File[]>([])

  const [isAdding, setIsAdding] = useState(false)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [editingProduct, setEditingProduct] = useState<MerchItem | null>(null)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [isPending, startTransition] = useTransition()

  useEffect(() => { setProducts(initialProducts) }, [initialProducts])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selected = Array.from(e.target.files)
      if (selected.length > 4) { alert("Maximum 4 images."); return }
      setFiles(selected)
    }
  }

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.price) return
    setIsAdding(true)
    try {
      const uploadPromises = files.map(async (file) => {
        const fileName = `${Math.random()}.${file.name.split('.').pop()}`
        const { error } = await supabase.storage.from('product-images').upload(fileName, file)
        if (error) throw new Error(error.message)
        return supabase.storage.from('product-images').getPublicUrl(fileName).data.publicUrl
      })
      const uploadedImageUrls = await Promise.all(uploadPromises)
      const nextSortOrder = products.length > 0 ? Math.max(...products.map(p => p.sort_order || 0)) + 1 : 1

      const optimisticProduct: MerchItem = {
        id: `optimistic-${Date.now()}`, name: formData.name, description: formData.description,
        price: parseInt(formData.price), currency, images: uploadedImageUrls,
        sizes: selectedSizes, colors, sort_order: nextSortOrder,
      }
      setProducts(prev => [...prev, optimisticProduct])
      setFormData({ name: '', description: '', price: '' })
      setSelectedSizes([]); setColors(['#000000']); setFiles([])
      const fi = document.querySelector('input[type="file"]') as HTMLInputElement
      if (fi) fi.value = ''

      await addProduct(formData.name, formData.description, parseInt(formData.price), currency, uploadedImageUrls, selectedSizes, colors, nextSortOrder)
    } catch (error: any) {
      alert('Error adding product: ' + error.message)
      setProducts(initialProducts)
    } finally {
      setIsAdding(false)
    }
  }

  const moveProduct = (index: number, direction: 'up' | 'down') => {
    const newProducts = [...products]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= newProducts.length) return
    ;[newProducts[index], newProducts[targetIndex]] = [newProducts[targetIndex], newProducts[index]]
    setProducts(newProducts); persistOrder(newProducts)
  }

  const handleDragStart = (index: number) => setDraggedIndex(index)
  const handleDragEnter = (index: number) => {
    if (draggedIndex === null || draggedIndex === index) return
    const newProducts = [...products]
    const dragged = newProducts[draggedIndex]
    newProducts.splice(draggedIndex, 1); newProducts.splice(index, 0, dragged)
    setDraggedIndex(index); setProducts(newProducts)
  }
  const handleDragEnd = () => { if (draggedIndex === null) return; setDraggedIndex(null); persistOrder(products) }

  const persistOrder = (ordered: MerchItem[]) => {
    startTransition(async () => {
      try {
        await reorderProducts(ordered.map((p, i) => ({ id: p.id, sort_order: i + 1 })))
      } catch (error: any) {
        alert('Error reordering: ' + error.message); setProducts(initialProducts)
      }
    })
  }

  const handleDeleteProduct = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"?`)) return
    setIsDeleting(id)
    const rollback = [...products]
    setProducts(prev => prev.filter(p => p.id !== id))
    try {
      await deleteProduct(id)
    } catch (error: any) {
      alert('Error deleting: ' + error.message); setProducts(rollback)
    } finally {
      setIsDeleting(null)
    }
  }

  const handleProductSaved = (updated: MerchItem) => {
    setProducts(prev => prev.map(p => p.id === updated.id ? updated : p))
  }

  return (
    <>
      {/* Edit Modal */}
      {editingProduct && (
        <EditModal
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onSave={handleProductSaved}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
        {/* Add Product Form */}
        <div className="lg:col-span-1">
          <div className="glass p-6 rounded-2xl border border-white/10 sticky top-24">
            <h2 className="text-xl font-bold text-white mb-4">Add New Product</h2>
            <form onSubmit={handleAddProduct} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Name</label>
                <input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary-500" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Description</label>
                <textarea required value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary-500 min-h-[80px]" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Price</label>
                  <input type="number" required min="0" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary-500" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Currency</label>
                  <select value={currency} onChange={e => setCurrency(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary-500 appearance-none">
                    <option value="£" className="bg-zinc-900">£ Pound</option>
                    <option value="€" className="bg-zinc-900">€ Euro</option>
                    <option value="₹" className="bg-zinc-900">₹ Rupee</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Sizes</label>
                <div className="flex flex-wrap gap-2">
                  {AVAILABLE_SIZES.map(size => (
                    <button key={size} type="button"
                      onClick={() => setSelectedSizes(prev => prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size])}
                      className={`px-3 py-1.5 rounded-lg text-sm font-bold border transition-all ${selectedSizes.includes(size) ? 'bg-primary-500 border-primary-500 text-white' : 'bg-transparent border-white/10 text-gray-400 hover:border-white/30'}`}
                    >{size}</button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Colors</label>
                <div className="flex flex-wrap gap-2">
                  {AVAILABLE_COLORS.map(color => (
                    <button key={color.hex} type="button"
                      onClick={() => setColors(prev => prev.includes(color.hex) ? prev.filter(c => c !== color.hex) : [...prev, color.hex])}
                      className={`px-3 py-1.5 rounded-lg text-sm font-bold border transition-all flex items-center gap-2 ${colors.includes(color.hex) ? 'bg-transparent border-primary-500 text-white' : 'bg-transparent border-white/10 text-gray-400 hover:border-white/30'}`}
                    >
                      <span className="w-3 h-3 rounded-full border border-white/20" style={{ backgroundColor: color.hex }} />
                      {color.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Images (Max 4)</label>
                <input type="file" accept="image/*" multiple onChange={handleFileChange} className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-500/10 file:text-primary-500 hover:file:bg-primary-500/20" />
              </div>

              <button type="submit" disabled={isAdding || isPending || files.length === 0} className="w-full bg-primary-600 hover:bg-primary-500 text-white font-bold py-2.5 rounded-lg transition-colors mt-4 disabled:opacity-50">
                {isAdding ? 'Uploading & Adding...' : 'Add Product'}
              </button>
            </form>
          </div>
        </div>

        {/* Product List */}
        <div className="lg:col-span-2">
          <div className="space-y-3">
            {isPending && <div className="text-center py-2 text-primary-400 text-sm animate-pulse">Saving order...</div>}
            {products.length === 0 ? (
              <div className="text-center py-12 text-gray-400 glass rounded-2xl border border-white/10">No products found. Add one to get started.</div>
            ) : (
              products.map((product, index) => (
                <div
                  key={product.id}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragEnter={() => handleDragEnter(index)}
                  onDragEnd={handleDragEnd}
                  onDragOver={(e) => e.preventDefault()}
                  className={`glass p-4 rounded-xl border border-white/10 flex items-center gap-3 transition-all ${
                    draggedIndex === index ? 'opacity-50 scale-[0.98] border-primary-500 bg-white/5 shadow-xl' : 'hover:border-white/30'
                  }`}
                >
                  {/* Mobile Arrows */}
                  <div className="flex flex-col gap-1 shrink-0 lg:hidden">
                    <button onClick={() => moveProduct(index, 'up')} disabled={index === 0 || isPending} className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white disabled:opacity-20 transition-all">▲</button>
                    <button onClick={() => moveProduct(index, 'down')} disabled={index === products.length - 1 || isPending} className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white disabled:opacity-20 transition-all">▼</button>
                  </div>

                  {/* Desktop Drag Handle */}
                  <div className="hidden lg:flex text-gray-500 cursor-grab hover:text-white transition-colors shrink-0">⠿</div>

                  {/* Thumbnail */}
                  <div className="w-14 h-14 bg-zinc-800 rounded-lg overflow-hidden shrink-0 flex items-center justify-center">
                    {product.images && product.images.length > 0 ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xs text-gray-500">No Img</span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-bold truncate">{product.name}</h3>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className="text-primary-500 font-bold text-sm">{product.currency || '£'}{product.price}</span>
                      {product.sizes && product.sizes.length > 0 && (
                        <span className="text-xs text-gray-400 bg-white/5 px-2 py-0.5 rounded">Sizes: {product.sizes.join(', ')}</span>
                      )}
                      <div className="flex gap-1">
                        {product.colors?.map((c, i) => (
                          <div key={i} className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: c }} />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => setEditingProduct(product)}
                      disabled={isPending}
                      className="px-3 py-1.5 bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white rounded-lg transition-colors font-medium text-sm disabled:opacity-50"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.id, product.name)}
                      disabled={isDeleting === product.id || isPending}
                      className="px-3 py-1.5 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-colors font-medium text-sm disabled:opacity-50"
                    >
                      {isDeleting === product.id ? '...' : 'Delete'}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  )
}
