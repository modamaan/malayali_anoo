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
    <div className={`fixed top-24 left-1/2 -translate-x-1/2 z-40 px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border transition-all animate-fade-in-up max-w-sm w-full mx-4 ${
      type === 'success'
        ? 'bg-green-500/10 border-green-500/30 text-green-300'
        : 'bg-yellow-500/10 border-yellow-500/30 text-yellow-300'
    }`}>
      <span className="text-2xl">{type === 'success' ? '🎉' : '😕'}</span>
      <div className="flex-1">
        <p className="font-bold text-white text-sm">
          {type === 'success' ? 'Payment Successful!' : 'Order Cancelled'}
        </p>
        <p className="text-xs opacity-80 mt-0.5">
          {type === 'success'
            ? 'Thank you! Your order is confirmed and we\'ll ship it soon.'
            : 'Your order was not completed. Your cart is still saved.'}
        </p>
      </div>
      <button onClick={() => setVisible(false)} className="text-white/50 hover:text-white text-lg">✕</button>
    </div>
  )
}
