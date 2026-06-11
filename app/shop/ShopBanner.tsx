'use client'

import { useState, useEffect } from 'react'
import { useCart } from '@/lib/cart-context'

export default function ShopBanner({ type }: { type: 'success' | 'cancelled' }) {
  const [visible, setVisible] = useState(true)
  const { clearCart } = useCart()

  useEffect(() => {
    if (type === 'success') clearCart()
    const t = setTimeout(() => setVisible(false), 8000)
    return () => clearTimeout(t)
  }, [type, clearCart])

  if (!visible) return null

  return (
    <div className={`fixed top-24 left-4 right-4 sm:left-1/2 sm:-translate-x-1/2 z-50 px-5 py-4 rounded-xl shadow-2xl flex items-start sm:items-center gap-4 border transition-all duration-500 animate-fade-in-up sm:max-w-md ${
      type === 'success'
        ? 'bg-green-950/80 border-green-500/30 backdrop-blur-md'
        : 'bg-yellow-950/80 border-yellow-500/30 backdrop-blur-md'
    }`}>
      {/* Icon */}
      <div className={`flex items-center justify-center shrink-0 w-10 h-10 rounded-full ${type === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
        {type === 'success' ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        )}
      </div>
      
      {/* Text Content */}
      <div className="flex-1 min-w-0 pt-0.5">
        <p className={`font-bold text-base tracking-tight ${type === 'success' ? 'text-green-100' : 'text-yellow-100'}`}>
          {type === 'success' ? 'Payment Successful!' : 'Order Cancelled'}
        </p>
        <p className={`text-sm leading-snug mt-1 ${type === 'success' ? 'text-green-200/70' : 'text-yellow-200/70'}`}>
          {type === 'success'
            ? 'Thank you! Your order is confirmed and we\'ll ship it soon.'
            : 'Your order was not completed. Your cart is still saved.'}
        </p>
      </div>
      
      {/* Close Button */}
      <button 
        onClick={() => setVisible(false)} 
        className={`shrink-0 p-2 -mr-2 -mt-1 sm:mt-0 rounded-lg transition-colors ${type === 'success' ? 'text-green-400/50 hover:text-green-400 hover:bg-green-500/10' : 'text-yellow-400/50 hover:text-yellow-400 hover:bg-yellow-500/10'}`}
        aria-label="Close"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>
  )
}
