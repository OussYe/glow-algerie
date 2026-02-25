'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Header from '@/components/client/Header'
import { useCart } from '@/context/CartContext'
import { useTranslation } from '@/context/LanguageContext'
import { formatPrice, getDiscountedPrice } from '@/lib/cart'
import { supabase, OrderItem } from '@/lib/supabase'
import {
  TrashIcon,
  MinusIcon,
  PlusIcon,
  ShoppingBagIcon,
  ArrowLeftIcon,
  TruckIcon,
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

// ── Types (calqués sur les vrais champs Ecotrack) ───────────────────
type EcoWilaya = {
  wilaya_id?: number; id?: number
  wilaya_name?: string; name?: string
}
type EcoCommune = {
  commune_id?: number; id?: number; code_postal?: string
  commune_name?: string; name?: string; nom?: string
}
type EcoFee = {
  wilaya_id: number
  tarif?: string | number
  [key: string]: unknown
}

// helpers
const wId   = (w: EcoWilaya)  => w.wilaya_id  ?? w.id  ?? 0
const wName = (w: EcoWilaya)  => w.wilaya_name ?? w.name ?? ''
const cName = (c: EcoCommune) => c.commune_name ?? c.name ?? c.nom ?? ''

type FormData = {
  full_name: string
  phone:     string
  wilaya:    string   // "id - name" — enregistré en base
  wilayaId:  string   // id numérique pour les appels API
  commune:   string
  notes:     string
}

export default function CartPage() {
  const { items, total, updateQuantity, removeFromCart, clearCart } = useCart()
  const { t } = useTranslation()
  const router = useRouter()

  // ── Ecotrack state ──────────────────────────────────────────────
  const [wilayas,         setWilayas]         = useState<EcoWilaya[]>([])
  const [communes,        setCommunes]        = useState<EcoCommune[]>([])
  const [allFees,         setAllFees]         = useState<EcoFee[]>([])
  const [deliveryFee,     setDeliveryFee]     = useState<number | null>(null)
  const [loadingWilayas,  setLoadingWilayas]  = useState(true)
  const [loadingCommunes, setLoadingCommunes] = useState(false)

  // ── Form state ──────────────────────────────────────────────────
  const [form, setForm] = useState<FormData>({
    full_name: '', phone: '', wilaya: '', wilayaId: '', commune: '', notes: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})

  // ── Chargement wilays + tarifs au montage ────────────────────────
  useEffect(() => {
    const init = async () => {
      setLoadingWilayas(true)
      try {
        const [wRes, fRes] = await Promise.all([
          fetch('/api/ecotrack/wilayas').then(r => r.json()),
          fetch('/api/ecotrack/fees').then(r => r.json()),
        ])
        // L'API peut renvoyer { data: [...] } ou directement [...]
        setWilayas(wRes?.data || wRes || [])
        // Les frais sont sous "livraison", "data", ou directement un tableau
        setAllFees(fRes?.livraison || fRes?.data || fRes || [])
      } catch {
        toast.error(t('loadingWilayasError'))
      } finally {
        setLoadingWilayas(false)
      }
    }
    init()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── Changement de wilaya → communes + tarif ─────────────────────
  const handleWilayaChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const wilayaId = e.target.value   // juste l'id numérique

    if (!wilayaId) {
      setForm(f => ({ ...f, wilaya: '', wilayaId: '', commune: '' }))
      setCommunes([])
      setDeliveryFee(null)
      return
    }

    // Récupérer le nom depuis la liste déjà chargée
    const found = wilayas.find(w => String(wId(w)) === wilayaId)
    const label = found ? `${wilayaId} - ${wName(found)}` : wilayaId

    setForm(f => ({ ...f, wilaya: label, wilayaId: wilayaId, commune: '' }))
    setErrors(prev => ({ ...prev, wilaya: '', commune: '' }))

    // Tarif de livraison (champ "tarif", défaut 600 DA)
    const feeObj = allFees.find(f => String(f.wilaya_id) === wilayaId)
    const tarif = feeObj?.tarif ? parseFloat(String(feeObj.tarif)) : 600
    setDeliveryFee(tarif)

    // Communes via proxy
    setLoadingCommunes(true)
    setCommunes([])
    try {
      const res = await fetch(`/api/ecotrack/communes/${wilayaId}`).then(r => r.json())
      setCommunes(res?.data || res || [])
    } catch {
      toast.error(t('loadingCommunesError'))
    } finally {
      setLoadingCommunes(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  // ── Validation ──────────────────────────────────────────────────
  const validate = () => {
    const e: Partial<Record<keyof FormData, string>> = {}
    if (!form.full_name.trim()) e.full_name = t('nameRequired')
    if (!form.phone.trim())     e.phone = t('phoneRequired')
    else if (!/^(0[5-7]\d{8})$/.test(form.phone.replace(/\s/g, '')))
      e.phone = t('phoneInvalid')
    if (!form.wilayaId)         e.wilaya = t('wilayaRequired')
    if (!form.commune)          e.commune = t('communeRequired')
    setErrors(e)
    return Object.keys(e).length === 0
  }

  // ── Soumission ──────────────────────────────────────────────────
  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault()
    if (!validate()) return
    if (items.length === 0) { toast.error(t('cartEmpty')); return }

    setSubmitting(true)
    try {
      const orderItems: OrderItem[] = items.map(item => ({
        product_id: item.product.id,
        title:      item.product.title,
        price:      getDiscountedPrice(item.product.price, item.product.discount_percent),
        quantity:   item.quantity,
        image:      item.product.images?.[0] || '',
      }))

      const totalWithDelivery = total + (deliveryFee ?? 0)

      const { data, error } = await supabase.from('orders').insert({
        full_name:    form.full_name.trim(),
        phone:        form.phone.trim(),
        wilaya:       form.wilaya,
        commune:      form.commune,
        address:      '',
        notes:        form.notes.trim() || null,
        items:        orderItems,
        total_amount: totalWithDelivery,
        status:       'pending',
      }).select('id').single()

      if (error) throw error
      clearCart()
      router.push(`/confirmation?id=${data.id}`)
    } catch (err) {
      console.error(err)
      toast.error(t('sendingError'))
    } finally {
      setSubmitting(false)
    }
  }

  // ── Panier vide ─────────────────────────────────────────────────
  if (items.length === 0) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="max-w-2xl mx-auto px-4 py-20 text-center">
          <ShoppingBagIcon className="w-20 h-20 text-gray-200 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">{t('cartEmpty')}</h1>
          <p className="text-gray-500 mb-8">{t('cartEmptyHint')}</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-rose-500 text-white px-6 py-3 rounded-2xl font-semibold hover:bg-rose-600 transition"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            {t('continueShopping')}
          </Link>
        </main>
      </div>
    )
  }

  const fieldClass = (name: keyof FormData) =>
    `w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 transition ${
      errors[name] ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-white hover:border-gray-300'
    }`

  const totalWithDelivery = total + (deliveryFee ?? 0)
  const totalQty = items.reduce((s, i) => s + i.quantity, 0)

  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-5xl mx-auto px-4 py-8">

        <div className="flex items-center gap-3 mb-8">
          <Link href="/" className="text-gray-400 hover:text-rose-500 transition">
            <ArrowLeftIcon className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">{t('myCart')}</h1>
          <span className="bg-rose-100 text-rose-600 text-sm font-semibold px-2 py-0.5 rounded-full">
            {t('productCount', { count: items.length, s: items.length > 1 ? 's' : '' })}
          </span>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">

          {/* ── Articles ─────────────────────────────────── */}
          <div className="lg:col-span-3 space-y-3">
            {items.map(({ product, quantity }) => {
              const price = getDiscountedPrice(product.price, product.discount_percent)
              return (
                <div key={product.id} className="bg-white rounded-2xl p-4 flex gap-4 shadow-sm border border-gray-100">
                  <Link href={`/produit/${product.id}`} className="flex-shrink-0">
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100">
                      {product.images?.[0] ? (
                        <Image src={product.images[0]} alt={product.title} width={80} height={80} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl">📦</div>
                      )}
                    </div>
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link href={`/produit/${product.id}`}>
                      <h3 className="font-medium text-gray-800 text-sm hover:text-rose-500 transition line-clamp-2">{product.title}</h3>
                    </Link>
                    <p className="text-rose-600 font-bold mt-1">{formatPrice(price)}</p>
                    {product.discount_percent > 0 && (
                      <p className="text-xs text-gray-400 line-through">{formatPrice(product.price)}</p>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-2 py-1">
                        <button onClick={() => updateQuantity(product.id, quantity - 1)} className="w-6 h-6 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-gray-50">
                          <MinusIcon className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-sm font-bold">{quantity}</span>
                        <button onClick={() => updateQuantity(product.id, quantity + 1)} className="w-6 h-6 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-gray-50">
                          <PlusIcon className="w-3 h-3" />
                        </button>
                      </div>
                      <span className="text-xs text-gray-400">= {formatPrice(price * quantity)}</span>
                    </div>
                  </div>
                  <button onClick={() => removeFromCart(product.id)} className="text-gray-400 hover:text-red-500 transition p-1 self-start">
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              )
            })}

            {/* Récapitulatif */}
            <div className="bg-rose-50 rounded-2xl p-4 border border-rose-100 space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>{t('subtotal', { count: totalQty, s: totalQty > 1 ? 's' : '' })}</span>
                <span className="font-semibold">{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span className="flex items-center gap-1"><TruckIcon className="w-4 h-4" /> {t('delivery')}</span>
                <span className={`font-semibold ${deliveryFee !== null ? 'text-emerald-600' : 'text-gray-400'}`}>
                  {deliveryFee === null ? t('selectWilaya') : deliveryFee === 0 ? t('freeDelivery') : formatPrice(deliveryFee)}
                </span>
              </div>
              <div className="pt-2 border-t border-rose-200 flex justify-between items-center">
                <span className="font-semibold text-gray-800">{t('totalTTC')}</span>
                <span className="text-2xl font-bold text-gray-900">{formatPrice(totalWithDelivery)}</span>
              </div>
            </div>
          </div>

          {/* ── Formulaire ───────────────────────────────── */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-5">{t('deliveryInfoSection')}</h2>

              <form onSubmit={handleSubmit} className="space-y-4">

                {/* Nom complet */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('fullName')}</label>
                  <input name="full_name" value={form.full_name} onChange={handleChange} placeholder={t('fullNamePlaceholder')} className={fieldClass('full_name')} />
                  {errors.full_name && <p className="text-red-500 text-xs mt-1">{errors.full_name}</p>}
                </div>

                {/* Téléphone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('phone')}</label>
                  <input name="phone" value={form.phone} onChange={handleChange} placeholder={t('phonePlaceholder')} className={fieldClass('phone')} />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                </div>

                {/* Wilaya */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('wilaya')}</label>
                  <select
                    value={form.wilayaId}
                    onChange={handleWilayaChange}
                    disabled={loadingWilayas}
                    className={`${fieldClass('wilaya')} disabled:opacity-60 disabled:cursor-wait`}
                  >
                    <option value="">
                      {loadingWilayas ? t('loading') : t('wilayaPlaceholder')}
                    </option>
                    {wilayas.map(w => (
                      <option key={wId(w)} value={String(wId(w))}>
                        {String(wId(w)).padStart(2, '0')} — {wName(w)}
                      </option>
                    ))}
                  </select>
                  {errors.wilaya && <p className="text-red-500 text-xs mt-1">{errors.wilaya}</p>}
                </div>

                {/* Commune */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('commune')}</label>
                  <select
                    name="commune"
                    value={form.commune}
                    onChange={handleChange}
                    disabled={!form.wilayaId || loadingCommunes}
                    className={`${fieldClass('commune')} disabled:opacity-60 disabled:cursor-wait`}
                  >
                    <option value="">
                      {!form.wilayaId ? t('communeDisabled') : loadingCommunes ? t('loading') : t('communePlaceholder')}
                    </option>
                    {communes.map((c, i) => (
                      <option key={c.commune_id ?? c.id ?? i} value={cName(c)}>
                        {cName(c)}
                      </option>
                    ))}
                  </select>
                  {errors.commune && <p className="text-red-500 text-xs mt-1">{errors.commune}</p>}
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('notes')}</label>
                  <textarea name="notes" value={form.notes} onChange={handleChange} placeholder={t('notesPlaceholder')} rows={2} className={fieldClass('notes')} />
                </div>

                {/* Récapitulatif dans le formulaire */}
                <div className="bg-gray-50 rounded-xl p-3 space-y-1.5 text-sm border border-gray-100">
                  <div className="flex justify-between text-gray-600">
                    <span>{t('subtotalLabel')}</span>
                    <span className="font-medium">{formatPrice(total)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span className="flex items-center gap-1"><TruckIcon className="w-3.5 h-3.5" /> {t('delivery')}</span>
                    <span className={`font-medium ${deliveryFee !== null ? 'text-emerald-600' : 'text-gray-400'}`}>
                      {deliveryFee === null ? '—' : deliveryFee === 0 ? t('freeDelivery') : formatPrice(deliveryFee)}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold text-gray-900 pt-1 border-t border-gray-200">
                    <span>{t('totalToPay')}</span>
                    <span className="text-rose-600">{formatPrice(totalWithDelivery)}</span>
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-rose-500 hover:bg-rose-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl transition text-base shadow-lg shadow-rose-200 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <><div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />{t('sending')}</>
                  ) : (
                    <>{t('placeOrder')}</>
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
