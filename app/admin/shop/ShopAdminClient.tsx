'use client'

import { useState, useEffect, useTransition } from 'react'
import { addProduct, deleteProduct, reorderProducts } from '@/app/actions/products'
import { createClient } from '@/lib/supabase/client'
import type { MerchItem } from '@/lib/types'

export default function ShopAdminClient({ initialProducts }: { initialProducts: MerchItem[] }) {
  const [products, setProducts] = useState<MerchItem[]>(initialProducts)
  const supabase = createClient()
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
  })
  const [currency, setCurrency] = useState('£')
  const AVAILABLE_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL']
  const [selectedSizes, setSelectedSizes] = useState<string[]>([])
  const [colors, setColors] = useState<string[]>(['#000000'])
  const [files, setFiles] = useState<File[]>([])
  
  const [isAdding, setIsAdding] = useState(false)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    setProducts(initialProducts)
  }, [initialProducts])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files)
      if (selectedFiles.length > 4) {
        alert("Maximum 4 images allowed per product.")
        return
      }
      setFiles(selectedFiles)
    }
  }

  const handleAddColor = () => {
    setColors([...colors, '#000000'])
  }

  const handleColorChange = (index: number, value: string) => {
    const newColors = [...colors]
    newColors[index] = value
    setColors(newColors)
  }

  const handleRemoveColor = (index: number) => {
    setColors(colors.filter((_, i) => i !== index))
  }

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.price) return
    
    setIsAdding(true)
    
    try {
      // Parallel Image Uploads
      const uploadPromises = files.map(async (file) => {
        const fileExt = file.name.split('.').pop()
        const fileName = `${Math.random()}.${fileExt}`

        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(fileName, file)

        if (uploadError) throw new Error("Image upload failed: " + uploadError.message)

        const { data } = supabase.storage.from('product-images').getPublicUrl(fileName)
        return data.publicUrl
      })

      const uploadedImageUrls = await Promise.all(uploadPromises)

      const nextSortOrder = products.length > 0
        ? Math.max(...products.map(p => p.sort_order || 0)) + 1
        : 1

      // Optimistic update — instantly show in UI
      const optimisticProduct: MerchItem = {
        id: `optimistic-${Date.now()}`,
        name: formData.name,
        description: formData.description,
        price: parseInt(formData.price),
        currency,
        images: uploadedImageUrls,
        sizes: selectedSizes,
        colors,
        sort_order: nextSortOrder,
      }
      setProducts(prev => [...prev, optimisticProduct])

      // Reset Form immediately for fast feel
      setFormData({ name: '', description: '', price: '' })
      setSelectedSizes([])
      setColors(['#000000'])
      setFiles([])
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
      if (fileInput) fileInput.value = ''

      // Then persist to server in background
      await addProduct(
        formData.name,
        formData.description,
        parseInt(formData.price),
        currency,
        uploadedImageUrls,
        selectedSizes,
        colors,
        nextSortOrder
      )

    } catch (error: any) {
      alert('Error adding product: ' + error.message)
      // Rollback optimistic update on failure
      setProducts(initialProducts)
    } finally {
      setIsAdding(false)
    }
  }

  // --- Mobile: Up/Down arrow buttons ---
  const moveProduct = (index: number, direction: 'up' | 'down') => {
    const newProducts = [...products]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= newProducts.length) return
    ;[newProducts[index], newProducts[targetIndex]] = [newProducts[targetIndex], newProducts[index]]
    setProducts(newProducts)
    persistOrder(newProducts)
  }

  // --- Desktop: Drag and drop ---
  const handleDragStart = (index: number) => setDraggedIndex(index)

  const handleDragEnter = (index: number) => {
    if (draggedIndex === null || draggedIndex === index) return
    const newProducts = [...products]
    const draggedItem = newProducts[draggedIndex]
    newProducts.splice(draggedIndex, 1)
    newProducts.splice(index, 0, draggedItem)
    setDraggedIndex(index)
    setProducts(newProducts)
  }

  const handleDragEnd = () => {
    if (draggedIndex === null) return
    setDraggedIndex(null)
    persistOrder(products)
  }

  // --- Shared: Save order to DB ---
  const persistOrder = (ordered: MerchItem[]) => {
    startTransition(async () => {
      try {
        const updates = ordered.map((prod, i) => ({ id: prod.id, sort_order: i + 1 }))
        await reorderProducts(updates)
      } catch (error: any) {
        alert('Error reordering: ' + error.message)
        setProducts(initialProducts) // rollback
      }
    })
  }

  const handleDeleteProduct = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete the product "${name}"?`)) return
    setIsDeleting(id)

    // Optimistic: remove from UI immediately
    const rollback = [...products]
    setProducts(prev => prev.filter(p => p.id !== id))

    try {
      await deleteProduct(id)
    } catch (error: any) {
      alert('Error deleting product: ' + error.message)
      setProducts(rollback) // rollback on failure
    } finally {
      setIsDeleting(null)
    }
  }

  return (
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
                  <option value="£" className="bg-zinc-900">£</option>
                  <option value="€" className="bg-zinc-900">Euro (€)</option>
                  <option value="₹" className="bg-zinc-900">₹</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm text-gray-400 mb-1">Sizes</label>
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_SIZES.map(size => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSizes(prev => prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size])}
                    className={`px-3 py-1.5 rounded-lg text-sm font-bold border transition-all ${selectedSizes.includes(size) ? 'bg-primary-500 border-primary-500 text-white' : 'bg-transparent border-white/10 text-gray-400 hover:border-white/30'}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-3">Colors</label>
              <div className="flex flex-wrap gap-4 items-center">
                {colors.map((color, idx) => (
                  <div key={idx} className="relative flex items-center justify-center">
                    {/* Custom Styled Color Picker */}
                    <label 
                      className="relative w-12 h-12 rounded-full cursor-pointer shadow-lg border-2 border-white/20 hover:border-primary-500 hover:scale-105 transition-all block" 
                      style={{ backgroundColor: color }}
                    >
                      <input 
                        type="color" 
                        value={color} 
                        onChange={e => handleColorChange(idx, e.target.value)} 
                        className="opacity-0 absolute inset-0 w-full h-full cursor-pointer" 
                      />
                    </label>
                    
                    {/* Remove Button */}
                    {colors.length > 1 && (
                      <button 
                        type="button" 
                        onClick={() => handleRemoveColor(idx)} 
                        className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs shadow-md z-10 transition-colors"
                        title="Remove Color"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
                
                {/* Add New Color Button */}
                <button 
                  type="button" 
                  onClick={handleAddColor} 
                  className="w-12 h-12 rounded-full border-2 border-dashed border-gray-600 text-gray-400 hover:text-white hover:border-white transition-all flex items-center justify-center hover:scale-105"
                  title="Add Color"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                </button>
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
                className={`glass p-4 rounded-xl border border-white/10 flex items-center gap-4 transition-all ${
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
                <div className="w-16 h-16 bg-zinc-800 rounded-lg overflow-hidden shrink-0 flex items-center justify-center">
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
                  <div className="flex items-center gap-3 mt-1 flex-wrap">
                    <span className="text-primary-500 font-bold text-sm">{product.currency || '£'}{product.price}</span>
                    {product.sizes && product.sizes.length > 0 && (
                      <span className="text-xs text-gray-400 bg-white/5 px-2 py-0.5 rounded">Sizes: {product.sizes.join(', ')}</span>
                    )}
                    <div className="flex gap-1">
                      {product.colors && product.colors.map((c, i) => (
                        <div key={i} className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: c }} title={c} />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Delete */}
                <button onClick={() => handleDeleteProduct(product.id, product.name)} disabled={isDeleting === product.id || isPending} className="shrink-0 px-3 py-1.5 sm:px-4 sm:py-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-colors font-medium text-sm disabled:opacity-50">
                  {isDeleting === product.id ? '...' : 'Delete'}
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
