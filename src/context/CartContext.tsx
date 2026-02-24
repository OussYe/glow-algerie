'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import {
  CartItem,
  Product,
} from '@/lib/supabase'
import {
  getCart,
  addToCart as addToCartLib,
  removeFromCart as removeLib,
  updateQuantity as updateQtyLib,
  clearCart as clearLib,
  getCartTotal,
  getCartCount,
} from '@/lib/cart'

type CartContextType = {
  items: CartItem[]
  count: number
  total: number
  addToCart: (product: Product, qty?: number) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, qty: number) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  useEffect(() => {
    setItems(getCart())
  }, [])

  const addToCart = (product: Product, qty = 1) => {
    setItems(addToCartLib(product, qty))
  }

  const removeFromCart = (productId: string) => {
    setItems(removeLib(productId))
  }

  const updateQuantity = (productId: string, qty: number) => {
    setItems(updateQtyLib(productId, qty))
  }

  const clearCart = () => {
    clearLib()
    setItems([])
  }

  return (
    <CartContext.Provider value={{
      items,
      count: getCartCount(items),
      total: getCartTotal(items),
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
