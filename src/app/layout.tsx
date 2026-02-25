import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import { CartProvider } from '@/context/CartContext'
import { Toaster } from 'react-hot-toast'

const geist = Geist({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Glow Algérie – Beauté & Lifestyle',
  description: 'Découvrez notre collection de produits de beauté et lifestyle',
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
    shortcut: '/logo.png',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className={`${geist.className} bg-gray-50 text-gray-900 antialiased`}>
        <CartProvider>
          {children}
          <Toaster
            position="bottom-center"
            toastOptions={{
              style: { borderRadius: '12px', fontFamily: 'inherit', fontSize: '14px' },
              success: { iconTheme: { primary: '#f43f5e', secondary: 'white' } },
            }}
          />
        </CartProvider>
      </body>
    </html>
  )
}
