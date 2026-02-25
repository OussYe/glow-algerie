'use client'

import { useTranslation } from '@/context/LanguageContext'

export default function LanguageToggle() {
  const { lang, setLang } = useTranslation()

  return (
    <button
      onClick={() => setLang(lang === 'ar' ? 'fr' : 'ar')}
      className="text-sm font-semibold text-gray-500 hover:text-rose-500 transition-colors px-2 py-1 rounded-lg hover:bg-rose-50"
      aria-label="Changer la langue / تغيير اللغة"
    >
      {lang === 'ar' ? 'FR' : 'عربي'}
    </button>
  )
}
