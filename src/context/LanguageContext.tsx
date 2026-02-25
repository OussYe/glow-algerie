'use client'

import { createContext, useContext, useState, useCallback } from 'react'
import { translations, interpolate, type Lang, type TranslationKey } from '@/lib/translations'

type LanguageContextValue = {
  lang: Lang
  setLang: (lang: Lang) => void
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: 'ar',
  setLang: () => {},
})

export function LanguageProvider({
  children,
  initialLang = 'ar',
}: {
  children: React.ReactNode
  initialLang?: Lang
}) {
  const [lang, setLangState] = useState<Lang>(initialLang)

  const setLang = useCallback((newLang: Lang) => {
    setLangState(newLang)
    // Persist in cookie (1 year)
    document.cookie = `lang=${newLang};path=/;max-age=31536000`
    // Update <html> attributes immediately
    document.documentElement.lang = newLang
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr'
  }, [])

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useTranslation() {
  const { lang, setLang } = useContext(LanguageContext)

  const t = useCallback(
    (key: TranslationKey, params?: Record<string, string | number>): string => {
      const dict = translations[lang] as Record<string, string>
      const fallback = translations['fr'] as Record<string, string>
      const str = dict[key] ?? fallback[key] ?? key
      return params ? interpolate(str, params) : str
    },
    [lang]
  )

  return { t, lang, setLang, isRTL: lang === 'ar' }
}
