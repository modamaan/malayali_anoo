'use client'

import { useCart, CartItem } from '@/lib/cart-context'
import { useState, useEffect } from 'react'
import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

function CartItemRow({ item }: { item: CartItem }) {
  const { removeFromCart, updateQuantity } = useCart()
  const currency = item.product.currency || '£'

  return (
    <div className="flex gap-3 py-4 border-b border-white/5 last:border-0">
      {/* Image */}
      <div className="w-16 h-16 rounded-xl bg-zinc-800 overflow-hidden shrink-0">
        {item.product.images?.[0] ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-500 text-xs">No Image</div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h4 className="text-white font-semibold text-sm truncate">{item.product.name}</h4>
        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
          {item.selectedSize && (
            <span className="text-xs text-gray-400 bg-white/5 px-2 py-0.5 rounded">{item.selectedSize}</span>
          )}
          {item.selectedColor && (
            <span className="w-4 h-4 rounded-full border border-white/20 inline-block shrink-0" style={{ backgroundColor: item.selectedColor }} />
          )}
        </div>
        <p className="text-primary-400 font-bold text-sm mt-1">{currency}{(item.product.price * item.quantity).toLocaleString()}</p>
      </div>

      {/* Quantity + Remove */}
      <div className="flex flex-col items-end gap-2 shrink-0">
        <button onClick={() => removeFromCart(item.cartItemId)} className="text-gray-500 hover:text-red-400 transition-colors text-xs">✕</button>
        <div className="flex items-center gap-2 bg-white/5 rounded-lg px-2 py-1">
          <button
            onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
            className="text-gray-400 hover:text-white transition-colors w-5 h-5 flex items-center justify-center"
          >−</button>
          <span className="text-white font-bold text-sm w-4 text-center">{item.quantity}</span>
          <button
            onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
            className="text-gray-400 hover:text-white transition-colors w-5 h-5 flex items-center justify-center"
          >+</button>
        </div>
      </div>
    </div>
  )
}

export default function CartDrawer() {
  const { items, cartCount, isOpen, closeCart, clearCart } = useCart()
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const currency = items[0]?.product.currency || '£'

  const handleCheckout = async () => {
    if (items.length === 0) return
    setIsCheckingOut(true)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Checkout failed')
      }

      const { url } = await res.json()
      window.location.href = url
    } catch (err: any) {
      alert('Checkout error: ' + err.message)
    } finally {
      setIsCheckingOut(false)
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={closeCart}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-sm bg-zinc-950 border-l border-white/10 z-50 flex flex-col shadow-2xl transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white">Your Cart</h2>
            {cartCount > 0 && (
              <span className="bg-primary-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">{cartCount}</span>
            )}
          </div>
          <button onClick={closeCart} className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white flex items-center justify-center transition-all">✕</button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <div className="text-5xl">🛒</div>
              <p className="text-gray-400">Your cart is empty.</p>
              <button onClick={closeCart} className="text-primary-400 hover:text-primary-300 font-medium text-sm transition-colors">Continue Shopping →</button>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {items.map(item => <CartItemRow key={item.cartItemId} item={item} />)}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-5 border-t border-white/10 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400 font-medium">Subtotal</span>
              <span className="text-white font-black text-xl">{currency}{subtotal.toLocaleString()}</span>
            </div>
            <p className="text-xs text-gray-500">Shipping & taxes calculated at checkout</p>
            <button
              onClick={handleCheckout}
              disabled={isCheckingOut}
              className="w-full py-3.5 bg-primary-600 hover:bg-primary-500 disabled:opacity-60 text-white font-bold rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-primary-500/20 flex items-center justify-center gap-2"
            >
              {isCheckingOut ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Redirecting to Stripe...
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                  Checkout
                </>
              )}
            </button>
            <button onClick={clearCart} className="w-full text-xs text-gray-500 hover:text-red-400 transition-colors">Clear cart</button>
          </div>
        )}
      </div>
    </>
  )
}
