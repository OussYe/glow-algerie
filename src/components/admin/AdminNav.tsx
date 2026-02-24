'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  Squares2X2Icon,
  TagIcon,
  ShoppingBagIcon,
  ClipboardDocumentListIcon,
  ArrowRightOnRectangleIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline'

const links = [
  { href: '/admin', label: 'Tableau de bord', icon: Squares2X2Icon, exact: true },
  { href: '/admin/categories', label: 'Catégories', icon: TagIcon },
  { href: '/admin/produits', label: 'Produits', icon: ShoppingBagIcon },
  { href: '/admin/commandes', label: 'Commandes', icon: ClipboardDocumentListIcon },
]

export default function AdminNav() {
  const pathname = usePathname()
  const router = useRouter()

  const logout = () => {
    sessionStorage.removeItem('admin_auth')
    router.push('/admin/login')
  }

  return (
    <aside className="w-64 bg-gray-900 text-white flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-rose-400 to-pink-600 rounded-xl flex items-center justify-center">
            <SparklesIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-bold text-white">Glow Algérie</p>
            <p className="text-xs text-gray-400">Administration</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {links.map(({ href, label, icon: Icon, exact }) => {
          const isActive = exact ? pathname === href : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
                isActive
                  ? 'bg-rose-500 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <Icon className="w-5 h-5" />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Déconnexion */}
      <div className="p-4 border-t border-gray-800">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-gray-800 transition w-full"
        >
          <ArrowRightOnRectangleIcon className="w-5 h-5" />
          Déconnexion
        </button>
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-gray-800 transition mt-1"
        >
          <ShoppingBagIcon className="w-5 h-5" />
          Voir la boutique
        </Link>
      </div>
    </aside>
  )
}
