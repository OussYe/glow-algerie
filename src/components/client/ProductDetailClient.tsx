'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Product } from '@/lib/supabase'
import { formatPrice, getDiscountedPrice } from '@/lib/cart'
import { useCart } from '@/context/CartContext'
import { useTranslation } from '@/context/LanguageContext'
import ImageLightbox, { LightboxItem } from '@/components/ui/ImageLightbox'
import { loadPixelScript, initPixel, trackSingle } from '@/lib/pixel'
import toast from 'react-hot-toast'
import {
  ShoppingCartIcon,
  MinusIcon,
  PlusIcon,
  PlayIcon,
  ArrowsPointingOutIcon,
} from '@heroicons/react/24/outline'
import { CheckBadgeIcon } from '@heroicons/react/24/solid'

type Props = { product: Product; pixelId?: string | null }

type MediaItem =
  | { type: 'image'; url: string; imgIndex: number }
  | { type: 'video'; url: string }

export default function ProductDetailClient({ product, pixelId }: Props) {
  const [selectedIdx, setSelectedIdx] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [qty, setQty] = useState(1)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [sizeError, setSizeError] = useState(false)
  const { addToCart, items } = useCart()
  const cartCount = items.reduce((s, i) => s + i.quantity, 0)
  const { t, lang } = useTranslation()

  const hasDiscount = product.discount_percent > 0
  const finalPrice  = getDiscountedPrice(product.price, product.discount_percent)
  useEffect(() => {
    if (!pixelId) return
    const id = setTimeout(() => {
      loadPixelScript()
      initPixel(pixelId)
      trackSingle(pixelId, 'ViewContent', {
        value: finalPrice,
        currency: 'DZD',
        content_ids: [product.id],
        content_name: product.title,
        content_type: 'product',
      })
    }, 100)
    return () => clearTimeout(id)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pixelId])
  const images      = product.images || []
  const videos      = product.videos || []
  const sizes       = product.sizes?.filter(Boolean) || []
  const hasSizes    = sizes.length > 0

  // Titre et description dans la bonne langue
  const displayTitle       = lang === 'ar' ? (product.title_ar || product.title) : product.title
  const displayDescription = lang === 'ar' ? (product.description_ar || product.description) : product.description

  // Liste unifiée images + vidéos
  const mediaList: MediaItem[] = [
    ...images.map((url, i) => ({ type: 'image' as const, url, imgIndex: i })),
    ...videos.map((url)      => ({ type: 'video' as const, url })),
  ]

  // Pour la lightbox : même liste au format LightboxItem
  const lightboxMedia: LightboxItem[] = mediaList.map(m => ({ type: m.type, url: m.url }))

  const selected = mediaList[selectedIdx]

  const openLightbox = () => setLightboxOpen(true)

  const handleAdd = () => {
    if (hasSizes && !selectedSize) {
      setSizeError(true)
      toast.error(t('sizeRequired'), { duration: 2500 })
      return
    }
    addToCart(product, qty, selectedSize ?? undefined)
    const sizeLabel = selectedSize ? ` — ${selectedSize}` : ''
    toast.success(t('addedQtyToCart', { qty }) + sizeLabel, { duration: 2000 })
    if (pixelId) {
      trackSingle(pixelId, 'AddToCart', {
        value: finalPrice * qty,
        currency: 'DZD',
        content_ids: [product.id],
        content_name: product.title,
        content_type: 'product',
      })
    }
  }

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size)
    setSizeError(false)
  }

  return (
    <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
      {/* ── Galerie ── */}
      <div className="space-y-3">

        {/* Zone principale — taille FIXE aspect-square */}
        <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50 border border-gray-100">

          {/* Badge promo */}
          {hasDiscount && (
            <div className="absolute top-3 left-3 z-10 bg-rose-500 text-white text-sm font-bold px-3 py-1 rounded-full">
              -{product.discount_percent}%
            </div>
          )}

          {/* Bouton agrandir */}
          {selected && (
            <button
              onClick={openLightbox}
              className="absolute top-3 right-3 z-10 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white transition"
              title={t('enlarge')}
            >
              <ArrowsPointingOutIcon className="w-4 h-4" />
            </button>
          )}

          {/* Pas de média */}
          {!selected && (
            <div className="w-full h-full flex items-center justify-center text-8xl">📦</div>
          )}

          {/* Image */}
          {selected?.type === 'image' && (
            <div
              className="w-full h-full cursor-zoom-in"
              onClick={openLightbox}
            >
              <Image
                src={selected.url}
                alt={displayTitle}
                fill
                className="object-contain"
                priority
              />
              <div className="absolute bottom-3 right-3 bg-black/40 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm pointer-events-none">
                {t('clickToEnlarge')}
              </div>
            </div>
          )}

          {/* Vidéo — conteneur fixe aspect-square, vidéo en 16:9 centrée */}
          {selected?.type === 'video' && (
            <div className="w-full h-full flex items-center justify-center bg-black">
              <video
                key={selected.url}
                src={selected.url}
                controls
                className="w-full max-h-full object-contain"
                preload="metadata"
              />
            </div>
          )}
        </div>

        {/* Miniatures unifiées */}
        {mediaList.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {mediaList.map((media, i) => (
              <button
                key={i}
                onClick={() => setSelectedIdx(i)}
                className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition ${
                  i === selectedIdx
                    ? 'border-rose-400 ring-2 ring-rose-200'
                    : 'border-gray-200 hover:border-gray-400'
                }`}
              >
                {media.type === 'image' ? (
                  <Image
                    src={media.url}
                    alt=""
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                    <PlayIcon className="w-7 h-7 text-white drop-shadow" />
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Infos produit ── */}
      <div className="space-y-5">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
            {displayTitle}
          </h1>
          {!product.in_stock && (
            <span className="inline-block mt-2 bg-gray-100 text-gray-500 text-sm px-3 py-1 rounded-full">
              {t('outOfStock')}
            </span>
          )}
          {product.in_stock && (
            <span className="inline-flex items-center gap-1 mt-2 text-emerald-600 text-sm font-medium">
              <CheckBadgeIcon className="w-4 h-4" />
              {t('inStock')}
            </span>
          )}
        </div>

        {/* Prix */}
        <div className="bg-rose-50 rounded-2xl p-4">
          <div className="flex items-baseline gap-3 flex-wrap">
            <span className="text-3xl font-bold text-emerald-600">
              {formatPrice(finalPrice)}
            </span>
            {hasDiscount && (
              <>
                <span className="text-lg text-red-400 line-through">
                  {formatPrice(product.price)}
                </span>
                <span className="bg-rose-500 text-white text-sm font-bold px-2 py-0.5 rounded-lg">
                  {t('savings', { amount: formatPrice(product.price - finalPrice) })}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Description */}
        {displayDescription && (
          <div>
            <h2 className="font-semibold text-gray-700 mb-2">{t('description')}</h2>
            <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
              {displayDescription}
            </p>
          </div>
        )}

        {/* Sélecteur de taille */}
        {hasSizes && product.in_stock && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-semibold text-gray-700">{t('selectSize')}</h2>
              {selectedSize && (
                <span className="text-sm font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-lg">
                  {selectedSize}
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {sizes.map(size => (
                <button
                  key={size}
                  onClick={() => handleSizeSelect(size)}
                  className={`min-w-[3rem] px-3 py-2 rounded-xl border-2 font-semibold text-sm transition ${
                    selectedSize === size
                      ? 'border-rose-500 bg-rose-500 text-white shadow-md shadow-rose-200'
                      : sizeError
                      ? 'border-red-300 text-gray-700 hover:border-rose-400 hover:bg-rose-50'
                      : 'border-gray-200 text-gray-700 hover:border-rose-400 hover:bg-rose-50'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
            {sizeError && (
              <p className="text-red-500 text-xs mt-2">{t('sizeRequired')}</p>
            )}
          </div>
        )}

        {/* Quantité + Ajout panier */}
        {product.in_stock && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-4">
              <span className="text-gray-700 font-medium">{t('quantity')}</span>
              <div className="flex items-center gap-3 bg-gray-100 rounded-xl px-3 py-2">
                <button
                  onClick={() => setQty(q => Math.max(1, q - 1))}
                  className="w-7 h-7 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-gray-50 transition"
                >
                  <MinusIcon className="w-4 h-4" />
                </button>
                <span className="w-8 text-center font-bold text-lg">{qty}</span>
                <button
                  onClick={() => setQty(q => q + 1)}
                  className="w-7 h-7 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-gray-50 transition"
                >
                  <PlusIcon className="w-4 h-4" />
                </button>
              </div>
            </div>

            <button
              onClick={handleAdd}
              className="w-full bg-rose-500 hover:bg-rose-600 text-white font-semibold py-4 rounded-2xl flex items-center justify-center gap-3 transition text-lg shadow-lg shadow-rose-200 hover:shadow-rose-300 active:scale-[0.98]"
            >
              <ShoppingCartIcon className="w-5 h-5" />
              {t('addToCart')}
            </button>

            <Link
                href="/panier"
                className="w-full flex items-center justify-center gap-3 py-3.5 rounded-2xl border-2 border-emerald-500 text-emerald-600 font-semibold text-base hover:bg-emerald-50 transition active:scale-[0.98]"
              >
                <ShoppingCartIcon className="w-5 h-5" />
                {t('viewCart')}
                {cartCount > 0 && (
                  <span className="bg-emerald-500 text-white text-xs font-bold px-2 py-0.5 rounded-full min-w-[1.25rem] text-center">
                    {cartCount}
                  </span>
                )}
              </Link>
          </div>
        )}

        {/* Info livraison */}
        <div className="border border-gray-100 rounded-2xl p-4 space-y-2 text-sm text-gray-600">
          <div className="flex items-center gap-2"><span>{t('deliveryInfo')}</span></div>
          <div className="flex items-center gap-2"><span>{t('paymentInfo')}</span></div>
          <div className="flex items-center gap-2"><span>{t('qualityInfo')}</span></div>
        </div>
      </div>

      {/* Lightbox (images + vidéos) */}
      {lightboxOpen && lightboxMedia.length > 0 && (
        <ImageLightbox
          media={lightboxMedia}
          initialIndex={selectedIdx}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </div>
  )
}
