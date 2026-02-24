'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Header from '@/components/client/Header'
import { useCart } from '@/context/CartContext'
import { formatPrice, getDiscountedPrice } from '@/lib/cart'
import { supabase, OrderItem } from '@/lib/supabase'
import { WILAYAS } from '@/lib/wilayas'
import {
  TrashIcon,
  MinusIcon,
  PlusIcon,
  ShoppingBagIcon,
  ArrowLeftIcon,
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

type FormData = {
  full_name: string
  phone: string
  wilaya: string
  commune: string
  address: string
  notes: string
}

export default function CartPage() {
  const { items, total, updateQuantity, removeFromCart, clearCart } = useCart()
  const router = useRouter()
  const [form, setForm] = useState<FormData>({
    full_name: '', phone: '', wilaya: '', commune: '', address: '', notes: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState<Partial<FormData>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
    if (errors[name as keyof FormData]) {
      setErrors(e => ({ ...e, [name]: '' }))
    }
  }

  const validate = () => {
    const newErrors: Partial<FormData> = {}
    if (!form.full_name.trim()) newErrors.full_name = 'Nom requis'
    if (!form.phone.trim()) newErrors.phone = 'Téléphone requis'
    else if (!/^(0[5-7]\d{8})$/.test(form.phone.replace(/\s/g, '')))
      newErrors.phone = 'Numéro invalide (ex: 0550123456)'
    if (!form.wilaya) newErrors.wilaya = 'Wilaya requise'
    if (!form.commune.trim()) newErrors.commune = 'Commune requise'
    if (!form.address.trim()) newErrors.address = 'Adresse requise'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    if (items.length === 0) {
      toast.error('Votre panier est vide')
      return
    }

    setSubmitting(true)
    try {
      const orderItems: OrderItem[] = items.map(item => ({
        product_id: item.product.id,
        title: item.product.title,
        price: getDiscountedPrice(item.product.price, item.product.discount_percent),
        quantity: item.quantity,
        image: item.product.images?.[0] || '',
      }))

      const { data, error } = await supabase.from('orders').insert({
        full_name: form.full_name.trim(),
        phone: form.phone.trim(),
        wilaya: form.wilaya,
        commune: form.commune.trim(),
        address: form.address.trim(),
        notes: form.notes.trim() || null,
        items: orderItems,
        total_amount: total,
        status: 'pending',
      }).select('id').single()

      if (error) throw error

      clearCart()
      router.push(`/confirmation?id=${data.id}`)
    } catch (err) {
      console.error(err)
      toast.error('Erreur lors de l\'envoi. Veuillez réessayer.')
    } finally {
      setSubmitting(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="max-w-2xl mx-auto px-4 py-20 text-center">
          <ShoppingBagIcon className="w-20 h-20 text-gray-200 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Votre panier est vide</h1>
          <p className="text-gray-500 mb-8">Ajoutez des articles pour commencer.</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-rose-500 text-white px-6 py-3 rounded-2xl font-semibold hover:bg-rose-600 transition"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Continuer les achats
          </Link>
        </main>
      </div>
    )
  }

  const fieldClass = (name: keyof FormData) =>
    `w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 transition ${
      errors[name] ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-white hover:border-gray-300'
    }`

  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Link href="/" className="text-gray-400 hover:text-rose-500 transition">
            <ArrowLeftIcon className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Mon Panier</h1>
          <span className="bg-rose-100 text-rose-600 text-sm font-semibold px-2 py-0.5 rounded-full">
            {items.length} article{items.length > 1 ? 's' : ''}
          </span>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Articles */}
          <div className="lg:col-span-3 space-y-3">
            {items.map(({ product, quantity }) => {
              const price = getDiscountedPrice(product.price, product.discount_percent)
              return (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl p-4 flex gap-4 shadow-sm border border-gray-100"
                >
                  <Link href={`/produit/${product.id}`} className="flex-shrink-0">
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100">
                      {product.images?.[0] ? (
                        <Image
                          src={product.images[0]}
                          alt={product.title}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl">📦</div>
                      )}
                    </div>
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link href={`/produit/${product.id}`}>
                      <h3 className="font-medium text-gray-800 text-sm hover:text-rose-500 transition line-clamp-2">
                        {product.title}
                      </h3>
                    </Link>
                    <p className="text-rose-600 font-bold mt-1">{formatPrice(price)}</p>
                    {product.discount_percent > 0 && (
                      <p className="text-xs text-gray-400 line-through">{formatPrice(product.price)}</p>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-2 py-1">
                        <button
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          className="w-6 h-6 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-gray-50"
                        >
                          <MinusIcon className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-sm font-bold">{quantity}</span>
                        <button
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          className="w-6 h-6 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-gray-50"
                        >
                          <PlusIcon className="w-3 h-3" />
                        </button>
                      </div>
                      <span className="text-xs text-gray-400">
                        Total: {formatPrice(price * quantity)}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromCart(product.id)}
                    className="text-gray-400 hover:text-red-500 transition p-1 self-start"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              )
            })}

            {/* Résumé */}
            <div className="bg-rose-50 rounded-2xl p-4 border border-rose-100">
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-medium">Total commande</span>
                <span className="text-2xl font-bold text-gray-900">{formatPrice(total)}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Frais de livraison calculés à la confirmation</p>
            </div>
          </div>

          {/* Formulaire commande */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-5">Informations de livraison</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet *</label>
                  <input
                    name="full_name"
                    value={form.full_name}
                    onChange={handleChange}
                    placeholder="Prénom et nom"
                    className={fieldClass('full_name')}
                  />
                  {errors.full_name && <p className="text-red-500 text-xs mt-1">{errors.full_name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone *</label>
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="0550 123 456"
                    className={fieldClass('phone')}
                  />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Wilaya *</label>
                  <select
                    name="wilaya"
                    value={form.wilaya}
                    onChange={handleChange}
                    className={fieldClass('wilaya')}
                  >
                    <option value="">Sélectionner une wilaya...</option>
                    {WILAYAS.map(w => <option key={w} value={w}>{w}</option>)}
                  </select>
                  {errors.wilaya && <p className="text-red-500 text-xs mt-1">{errors.wilaya}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Commune / Ville *</label>
                  <input
                    name="commune"
                    value={form.commune}
                    onChange={handleChange}
                    placeholder="Votre commune"
                    className={fieldClass('commune')}
                  />
                  {errors.commune && <p className="text-red-500 text-xs mt-1">{errors.commune}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Adresse *</label>
                  <textarea
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    placeholder="Rue, quartier, immeuble..."
                    rows={2}
                    className={fieldClass('address')}
                  />
                  {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optionnel)</label>
                  <textarea
                    name="notes"
                    value={form.notes}
                    onChange={handleChange}
                    placeholder="Instructions spéciales pour la livraison..."
                    rows={2}
                    className={fieldClass('notes')}
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-rose-500 hover:bg-rose-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl transition text-base shadow-lg shadow-rose-200 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      Envoi en cours...
                    </>
                  ) : (
                    <>🛒 Passer la commande</>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
