'use client'

import { useTranslation } from '@/context/LanguageContext'

type Props = {
  type: 'error' | 'empty'
}

export default function ProductsEmptyState({ type }: Props) {
  const { t } = useTranslation()

  if (type === 'error') {
    return (
      <div className="text-center py-10 text-gray-500">
        {t('loadingError')}
      </div>
    )
  }

  return (
    <div className="text-center py-20">
      <div className="text-6xl mb-4">📦</div>
      <p className="text-gray-500">{t('noProducts')}</p>
    </div>
  )
}
