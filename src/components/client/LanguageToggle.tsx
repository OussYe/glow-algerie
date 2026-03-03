'use client'

import { useTranslation } from '@/context/LanguageContext'

export default function LanguageToggle() {
  const { lang, setLang } = useTranslation()

  return (
    <button
      onClick={() => setLang(lang === 'ar' ? 'fr' : 'ar')}
      className="text-sm font-semibold text-gray-400 hover:text-white transition-colors px-2 py-1 rounded hover:bg-white/10"
      aria-label="Changer la langue / تغيير اللغة"
    >
      {lang === 'ar' ? 'FR' : 'عربي'}
    </button>
  )
}
