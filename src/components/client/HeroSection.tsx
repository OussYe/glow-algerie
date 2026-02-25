'use client'

import { SparklesIcon } from '@heroicons/react/24/solid'
import { useTranslation } from '@/context/LanguageContext'

export function HeroSection() {
  const { t } = useTranslation()

  return (
    <section className="bg-gradient-to-br from-rose-50 via-pink-50 to-white py-10 px-4 border-b border-rose-100">
      <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 bg-rose-100 text-rose-600 px-4 py-1.5 rounded-full text-sm font-medium mb-3">
          <SparklesIcon className="w-4 h-4" />
          {t('heroBadge')}
        </div>
        <h1 className="text-2xl md:text-4xl font-bold text-gray-900">
          {t('heroTitle')}
        </h1>
        <p className="text-gray-500 mt-1 text-sm md:text-base max-w-lg">
          {t('heroSubtitle')}
        </p>
      </div>
    </section>
  )
}

export function FooterSection() {
  const { t } = useTranslation()

  return (
    <footer className="mt-10 border-t border-gray-100 py-8 text-center text-gray-400 text-sm bg-white">
      <p>{t('copyright')}</p>
    </footer>
  )
}
