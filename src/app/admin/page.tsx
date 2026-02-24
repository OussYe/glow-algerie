'use client'

import { useEffect, useState } from 'react'
import AdminGuard from '@/components/admin/AdminGuard'
import AdminNav from '@/components/admin/AdminNav'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import {
  TagIcon,
  ShoppingBagIcon,
  ClipboardDocumentListIcon,
  ClockIcon,
} from '@heroicons/react/24/outline'

type Stats = {
  categories: number
  products: number
  orders: number
  pending: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ categories: 0, products: 0, orders: 0, pending: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [cats, prods, orders, pending] = await Promise.all([
        supabase.from('categories').select('id', { count: 'exact', head: true }),
        supabase.from('products').select('id', { count: 'exact', head: true }),
        supabase.from('orders').select('id', { count: 'exact', head: true }),
        supabase.from('orders').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
      ])
      setStats({
        categories: cats.count ?? 0,
        products: prods.count ?? 0,
        orders: orders.count ?? 0,
        pending: pending.count ?? 0,
      })
      setLoading(false)
    }
    load()
  }, [])

  const cards = [
    { label: 'Catégories', value: stats.categories, icon: TagIcon, href: '/admin/categories', color: 'bg-blue-500' },
    { label: 'Produits', value: stats.products, icon: ShoppingBagIcon, href: '/admin/produits', color: 'bg-violet-500' },
    { label: 'Commandes', value: stats.orders, icon: ClipboardDocumentListIcon, href: '/admin/commandes', color: 'bg-emerald-500' },
    { label: 'En attente', value: stats.pending, icon: ClockIcon, href: '/admin/commandes', color: 'bg-rose-500' },
  ]

  return (
    <AdminGuard>
      <div className="flex min-h-screen bg-gray-50">
        <AdminNav />
        <main className="flex-1 p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
            <p className="text-gray-500 mt-1">Vue d&apos;ensemble de votre boutique</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {cards.map(({ label, value, icon: Icon, href, color }) => (
              <Link
                key={label}
                href={href}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition"
              >
                <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center mb-3`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <p className="text-3xl font-bold text-gray-900">
                  {loading ? '...' : value}
                </p>
                <p className="text-sm text-gray-500 mt-1">{label}</p>
              </Link>
            ))}
          </div>

          {/* Actions rapides */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="font-semibold text-gray-800 mb-4">Actions rapides</h2>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/admin/categories"
                className="bg-rose-50 hover:bg-rose-100 text-rose-600 font-medium px-4 py-2 rounded-xl text-sm transition"
              >
                + Nouvelle catégorie
              </Link>
              <Link
                href="/admin/produits"
                className="bg-rose-50 hover:bg-rose-100 text-rose-600 font-medium px-4 py-2 rounded-xl text-sm transition"
              >
                + Nouveau produit
              </Link>
              <Link
                href="/admin/commandes"
                className="bg-rose-50 hover:bg-rose-100 text-rose-600 font-medium px-4 py-2 rounded-xl text-sm transition"
              >
                Voir les commandes
              </Link>
            </div>
          </div>
        </main>
      </div>
    </AdminGuard>
  )
}
