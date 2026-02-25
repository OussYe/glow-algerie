'use client'

import Link from 'next/link'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { useTranslation } from '@/context/LanguageContext'

type Props = {
  /** Last segment label (category name or product title) — French version */
  label: string
  /** Arabic version of the last segment (optional) */
  labelAr?: string | null
  /** Optional intermediate segment (e.g. category when on product page) */
  middle?: { href: string; name: string; nameAr?: string | null }
}

export default function Breadcrumb({ label, labelAr, middle }: Props) {
  const { t, isRTL } = useTranslation()
  const ChevronIcon = isRTL ? ChevronRightIcon : ChevronLeftIcon

  const displayLabel  = isRTL && labelAr       ? labelAr        : label
  const displayMiddle = isRTL && middle?.nameAr ? middle.nameAr  : middle?.name

  return (
    <div className="flex items-center gap-2 text-sm text-gray-500 mb-6 flex-wrap">
      <Link href="/" className="hover:text-rose-500 transition flex items-center gap-1">
        <ChevronIcon className="w-4 h-4" />
        {t('home')}
      </Link>

      {middle && (
        <>
          <span>/</span>
          <Link href={middle.href} className="hover:text-rose-500 transition">
            {displayMiddle}
          </Link>
        </>
      )}

      <span>/</span>
      <span className="text-gray-800 font-medium line-clamp-1">{displayLabel}</span>
    </div>
  )
}
