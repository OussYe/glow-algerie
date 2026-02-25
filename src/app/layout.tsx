import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import { CartProvider } from '@/context/CartContext'
import { LanguageProvider } from '@/context/LanguageContext'
import type { Lang } from '@/lib/translations'
import { Toaster } from 'react-hot-toast'
import { cookies } from 'next/headers'

const geist = Geist({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Glow-Algérie',
  description: 'Découvrez notre collection de produits de beauté et lifestyle',
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
    shortcut: '/logo.png',
  },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const lang = (cookieStore.get('lang')?.value ?? 'ar') as Lang
  const dir = lang === 'ar' ? 'rtl' : 'ltr'

  return (
    <html lang={lang} dir={dir} suppressHydrationWarning>
      <body className={`${geist.className} bg-gray-50 text-gray-900 antialiased`}>
        <CartProvider>
          <LanguageProvider initialLang={lang}>
            {children}
            <Toaster
              position="bottom-center"
              toastOptions={{
                style: { borderRadius: '12px', fontFamily: 'inherit', fontSize: '14px' },
                success: { iconTheme: { primary: '#f43f5e', secondary: 'white' } },
              }}
            />
          </LanguageProvider>
        </CartProvider>
      </body>
    </html>
  )
}
