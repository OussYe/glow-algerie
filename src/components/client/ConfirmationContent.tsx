'use client'

import Link from 'next/link'
import { CheckCircleIcon } from '@heroicons/react/24/solid'
import { useTranslation } from '@/context/LanguageContext'

type Props = {
  shortId?: string
}

export default function ConfirmationContent({ shortId }: Props) {
  const { t } = useTranslation()

  return (
    <main className="max-w-xl mx-auto px-4 py-20 text-center">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-10">
        <CheckCircleIcon className="w-16 h-16 text-rose-400 mx-auto mb-6" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('orderConfirmed')}</h1>
        <p className="text-gray-500 mb-6">{t('orderSuccess')}</p>

        {shortId && (
          <div className="bg-rose-50 rounded-2xl px-6 py-4 mb-6">
            <p className="text-sm text-gray-500 mb-1">{t('orderNumber')}</p>
            <p className="text-xl font-bold text-rose-500">#{shortId}</p>
          </div>
        )}

        <p className="text-gray-500 text-sm mb-8">{t('orderContact')}</p>

        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white font-semibold px-6 py-3 rounded-2xl transition"
        >
          {t('continueShopping')}
        </Link>
      </div>
    </main>
  )
}
