import { CartItem, Product } from './supabase'

const CART_KEY = 'glow_algerie_cart'

export function getCart(): CartItem[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(CART_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function saveCart(items: CartItem[]): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(CART_KEY, JSON.stringify(items))
}

export function addToCart(product: Product, quantity = 1): CartItem[] {
  const cart = getCart()
  const existing = cart.find(item => item.product.id === product.id)
  let updated: CartItem[]
  if (existing) {
    updated = cart.map(item =>
      item.product.id === product.id
        ? { ...item, quantity: item.quantity + quantity }
        : item
    )
  } else {
    updated = [...cart, { product, quantity }]
  }
  saveCart(updated)
  return updated
}

export function removeFromCart(productId: string): CartItem[] {
  const updated = getCart().filter(item => item.product.id !== productId)
  saveCart(updated)
  return updated
}

export function updateQuantity(productId: string, quantity: number): CartItem[] {
  if (quantity <= 0) return removeFromCart(productId)
  const updated = getCart().map(item =>
    item.product.id === productId ? { ...item, quantity } : item
  )
  saveCart(updated)
  return updated
}

export function clearCart(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(CART_KEY)
}

export function getCartTotal(items: CartItem[]): number {
  return items.reduce((total, item) => {
    const price = getDiscountedPrice(item.product.price, item.product.discount_percent)
    return total + price * item.quantity
  }, 0)
}

export function getCartCount(items: CartItem[]): number {
  return items.reduce((count, item) => count + item.quantity, 0)
}

export function getDiscountedPrice(price: number, discountPercent: number): number {
  if (!discountPercent || discountPercent <= 0) return price
  return price * (1 - discountPercent / 100)
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('fr-DZ', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price) + ' DA'
}
