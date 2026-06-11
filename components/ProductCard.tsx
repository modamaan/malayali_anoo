'use client'

import { useState } from 'react'
import type { MerchItem } from '@/lib/types'
import { useCart } from '@/lib/cart-context'

export default function ProductCard({ product }: { product: MerchItem }) {
  const { addToCart } = useCart()
  const [currentImageIdx, setCurrentImageIdx] = useState(0)
  const [selectedSize, setSelectedSize] = useState<string | null>(product.sizes?.[0] || null)
  const [selectedColor, setSelectedColor] = useState<string | null>(product.colors?.[0] || null)
  const [addedFeedback, setAddedFeedback] = useState(false)

  const handleNextImage = (e: React.MouseEvent) => {
    e.preventDefault()
    if (!product.images || product.images.length <= 1) return
    setCurrentImageIdx((prev) => (prev + 1) % product.images.length)
  }

  const handlePrevImage = (e: React.MouseEvent) => {
    e.preventDefault()
    if (!product.images || product.images.length <= 1) return
    setCurrentImageIdx((prev) => (prev - 1 + product.images.length) % product.images.length)
  }

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColor)
    setAddedFeedback(true)
    setTimeout(() => setAddedFeedback(false), 1500)
  }

  return (
    <div className="bg-white rounded-[2rem] flex flex-col w-full shadow-2xl hover:shadow-primary-500/10 transition-shadow duration-300 relative group">
      {/* Image Gallery Container */}
      <div className="aspect-[4/3] relative bg-zinc-100 overflow-hidden rounded-[1.5rem] m-3">
        {product.images && product.images.length > 0 ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={product.images[currentImageIdx]} 
              alt={product.name} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {/* Gallery Arrows */}
            {product.images.length > 1 && (
              <div className="absolute inset-0 flex items-center justify-between p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={handlePrevImage} className="w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm text-zinc-900 flex items-center justify-center shadow hover:bg-white hover:scale-110 transition-all">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
                </button>
                <button onClick={handleNextImage} className="w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm text-zinc-900 flex items-center justify-center shadow hover:bg-white hover:scale-110 transition-all">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
                </button>
              </div>
            )}
            {/* Gallery Dots */}
            {product.images.length > 1 && (
              <div className="absolute bottom-3 inset-x-0 flex justify-center gap-1.5 z-10">
                {product.images.map((_, i) => (
                  <div key={i} className={`h-1.5 rounded-full transition-all ${i === currentImageIdx ? 'w-4 bg-primary-500' : 'w-1.5 bg-black/30'}`} />
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-400">No Image</div>
        )}
      </div>
      
      {/* Content Area */}
      <div className="px-6 pb-6 pt-3 flex flex-col flex-grow">
        <h3 className="text-2xl font-bold text-zinc-900 mb-2">{product.name}</h3>
        <p className="text-zinc-500 text-sm leading-relaxed mb-4 line-clamp-2 flex-grow">{product.description}</p>
        
        {/* Pickers */}
        <div className="flex flex-col gap-4 mb-6">
          {/* Colors */}
          {product.colors && product.colors.length > 0 && (
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider w-10">Color</span>
              <div className="flex flex-wrap gap-2">
                {product.colors.map(color => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-6 h-6 rounded-full border-2 transition-all ${selectedColor === color ? 'border-primary-500 scale-110 shadow-md' : 'border-zinc-200 scale-100 hover:scale-110'}`}
                    style={{ backgroundColor: color }}
                    title={color}
                    aria-label={`Select color ${color}`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Sizes */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider w-10">Size</span>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-3 py-1 rounded-lg text-sm font-bold border-2 transition-all ${selectedSize === size ? 'border-zinc-900 bg-zinc-900 text-white shadow-md' : 'border-zinc-200 text-zinc-400 hover:border-zinc-900 hover:text-zinc-900'}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Footer: Price & Action */}
        <div className="flex justify-between items-center mt-auto pt-4 border-t border-zinc-100">
          <span className="text-2xl font-black text-zinc-900">{product.currency || '£'}{product.price}</span>
          <button
            onClick={handleAddToCart}
            className={`px-6 py-2.5 rounded-full font-medium transition-all duration-300 shadow-md flex items-center gap-2 ${
              addedFeedback
                ? 'bg-green-500 text-white scale-105'
                : 'bg-zinc-900 text-white hover:bg-black hover:scale-105 active:scale-95'
            }`}
          >
            {addedFeedback ? (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                Added!
              </>
            ) : (
              'Add To Cart'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
