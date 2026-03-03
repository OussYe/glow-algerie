import { CartItem, Product } from './supabase'

const CART_KEY = 'glow_algerie_cart'

function cartKey(productId: string, size?: string): string {
  return size ? `${productId}:${size}` : productId
}

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

export function addToCart(product: Product, quantity = 1, size?: string): CartItem[] {
  const cart = getCart()
  const key = cartKey(product.id, size)
  const existing = cart.find(item => cartKey(item.product.id, item.selectedSize) === key)
  let updated: CartItem[]
  if (existing) {
    updated = cart.map(item =>
      cartKey(item.product.id, item.selectedSize) === key
        ? { ...item, quantity: item.quantity + quantity }
        : item
    )
  } else {
    updated = [...cart, { product, quantity, selectedSize: size }]
  }
  saveCart(updated)
  return updated
}

export function removeFromCart(productId: string, size?: string): CartItem[] {
  const key = cartKey(productId, size)
  const updated = getCart().filter(item => cartKey(item.product.id, item.selectedSize) !== key)
  saveCart(updated)
  return updated
}

export function updateQuantity(productId: string, quantity: number, size?: string): CartItem[] {
  if (quantity <= 0) return removeFromCart(productId, size)
  const key = cartKey(productId, size)
  const updated = getCart().map(item =>
    cartKey(item.product.id, item.selectedSize) === key ? { ...item, quantity } : item
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
