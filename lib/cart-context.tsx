'use client'

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import type { MerchItem } from '@/lib/types'

export type CartItem = {
  product: MerchItem
  selectedSize: string | null
  selectedColor: string | null
  quantity: number
  cartItemId: string // unique key: productId + size + color
}

type CartContextType = {
  items: CartItem[]
  cartCount: number
  addToCart: (product: MerchItem, size: string | null, color: string | null) => void
  removeFromCart: (cartItemId: string) => void
  updateQuantity: (cartItemId: string, quantity: number) => void
  clearCart: () => void
  isOpen: boolean
  openCart: () => void
  closeCart: () => void
}

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isOpen, setIsOpen] = useState(false)

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('cart')
      if (saved) setItems(JSON.parse(saved))
    } catch {}
  }, [])

  // Save to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items))
  }, [items])

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0)

  const addToCart = useCallback((product: MerchItem, selectedSize: string | null, selectedColor: string | null) => {
    const cartItemId = `${product.id}-${selectedSize || 'no-size'}-${selectedColor || 'no-color'}`
    setItems(prev => {
      const existing = prev.find(i => i.cartItemId === cartItemId)
      if (existing) {
        return prev.map(i =>
          i.cartItemId === cartItemId ? { ...i, quantity: i.quantity + 1 } : i
        )
      }
      return [...prev, { product, selectedSize, selectedColor, quantity: 1, cartItemId }]
    })
    setIsOpen(true)
  }, [])

  const removeFromCart = useCallback((cartItemId: string) => {
    setItems(prev => prev.filter(i => i.cartItemId !== cartItemId))
  }, [])

  const updateQuantity = useCallback((cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId)
      return
    }
    setItems(prev => prev.map(i => i.cartItemId === cartItemId ? { ...i, quantity } : i))
  }, [removeFromCart])

  const clearCart = useCallback(() => {
    setItems([])
    try { localStorage.removeItem('cart') } catch {}
  }, [])
  const openCart = useCallback(() => setIsOpen(true), [])
  const closeCart = useCallback(() => setIsOpen(false), [])

  return (
    <CartContext.Provider value={{ items, cartCount, addToCart, removeFromCart, updateQuantity, clearCart, isOpen, openCart, closeCart }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within a CartProvider')
  return ctx
}
