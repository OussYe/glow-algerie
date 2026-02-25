'use client'

import { useTranslation } from '@/context/LanguageContext'

type Props = {
  nameFr: string
  nameAr?: string | null
  descriptionFr?: string | null
  descriptionAr?: string | null
}

export default function CategoryHeader({ nameFr, nameAr, descriptionFr, descriptionAr }: Props) {
  const { lang } = useTranslation()
  const name        = lang === 'ar' ? (nameAr || nameFr) : nameFr
  const description = lang === 'ar' ? (descriptionAr || descriptionFr) : descriptionFr

  return (
    <div className="mb-8">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{name}</h1>
      {description && (
        <p className="text-gray-500 mt-2 max-w-xl">{description}</p>
      )}
    </div>
  )
}
