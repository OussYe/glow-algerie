'use client'

import { useEffect, useState } from 'react'
import AdminGuard from '@/components/admin/AdminGuard'
import AdminNav from '@/components/admin/AdminNav'
import { supabase, Order, OrderItem } from '@/lib/supabase'
import { formatPrice } from '@/lib/cart'
import Image from 'next/image'
import toast from 'react-hot-toast'
import { XMarkIcon } from '@heroicons/react/24/outline'

const STATUS_LABELS: Record<string, string> = {
  pending: 'En attente',
  confirmed: 'Confirmée',
  shipped: 'Expédiée',
  delivered: 'Livrée',
  cancelled: 'Annulée',
}

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  shipped: 'bg-violet-100 text-violet-700',
  delivered: 'bg-emerald-100 text-emerald-700',
  cancelled: 'bg-red-100 text-red-600',
}

export default function AdminCommandes() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('')
  const [selected, setSelected] = useState<Order | null>(null)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    const q = supabase.from('orders').select('*').order('created_at', { ascending: false })
    const { data } = await q
    setOrders(data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const filtered = filterStatus ? orders.filter(o => o.status === filterStatus) : orders

  const updateStatus = async (id: string, status: string) => {
    setUpdatingId(id)
    try {
      const { error } = await supabase.from('orders').update({ status }).eq('id', id)
      if (error) throw error
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o))
      if (selected?.id === id) setSelected(prev => prev ? { ...prev, status } : null)
      toast.success('Statut mis à jour')
    } catch {
      toast.error('Erreur mise à jour')
    } finally {
      setUpdatingId(null)
    }
  }

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('fr-DZ', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })

  return (
    <AdminGuard>
      <div className="flex min-h-screen bg-gray-50">
        <AdminNav />
        <main className="flex-1 p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Commandes</h1>
              <p className="text-gray-500 mt-1">{filtered.length} commande(s)</p>
            </div>
            <button onClick={load} className="text-sm text-rose-500 hover:text-rose-700 font-medium transition">
              ↻ Actualiser
            </button>
          </div>

          {/* Filtres statut */}
          <div className="flex gap-2 mb-4 flex-wrap">
            <button
              onClick={() => setFilterStatus('')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition ${!filterStatus ? 'bg-rose-500 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
            >
              Toutes ({orders.length})
            </button>
            {Object.entries(STATUS_LABELS).map(([val, label]) => {
              const count = orders.filter(o => o.status === val).length
              return (
                <button
                  key={val}
                  onClick={() => setFilterStatus(val)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition ${filterStatus === val ? 'bg-rose-500 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                >
                  {label} ({count})
                </button>
              )
            })}
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-4 border-rose-400 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <div className="text-5xl mb-3">📋</div>
              <p>Aucune commande{filterStatus ? ' avec ce statut' : ''}.</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3">N°</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3">Client</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3 hidden md:table-cell">Wilaya</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3">Total</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3">Statut</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3 hidden lg:table-cell">Date</th>
                    <th className="text-right text-xs font-semibold text-gray-500 uppercase px-4 py-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map(order => (
                    <tr
                      key={order.id}
                      className="hover:bg-gray-50/50 transition cursor-pointer"
                      onClick={() => setSelected(order)}
                    >
                      <td className="px-4 py-3 font-mono text-xs text-gray-500">
                        #{order.id.slice(0, 8).toUpperCase()}
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-800 text-sm">{order.full_name}</p>
                        <p className="text-xs text-gray-400">{order.phone}</p>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500 hidden md:table-cell">
                        {order.wilaya.split(' - ')[1] || order.wilaya}
                      </td>
                      <td className="px-4 py-3 font-semibold text-gray-800 text-sm">
                        {formatPrice(order.total_amount)}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-600'}`}>
                          {STATUS_LABELS[order.status] || order.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-400 hidden lg:table-cell">
                        {formatDate(order.created_at)}
                      </td>
                      <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                        <select
                          value={order.status}
                          onChange={e => updateStatus(order.id, e.target.value)}
                          disabled={updatingId === order.id}
                          className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-rose-300 bg-white"
                        >
                          {Object.entries(STATUS_LABELS).map(([v, l]) => (
                            <option key={v} value={v}>{l}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>

      {/* Modal détail commande */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg my-4 overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div>
                <h2 className="font-bold text-gray-900">Commande #{selected.id.slice(0, 8).toUpperCase()}</h2>
                <p className="text-xs text-gray-400">{formatDate(selected.created_at)}</p>
              </div>
              <button onClick={() => setSelected(null)} className="p-2 hover:bg-gray-100 rounded-xl">
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Statut */}
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600 font-medium">Statut :</span>
                <select
                  value={selected.status}
                  onChange={e => updateStatus(selected.id, e.target.value)}
                  className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
                >
                  {Object.entries(STATUS_LABELS).map(([v, l]) => (
                    <option key={v} value={v}>{l}</option>
                  ))}
                </select>
              </div>

              {/* Infos client */}
              <div className="bg-gray-50 rounded-2xl p-4 space-y-2 text-sm">
                <h3 className="font-semibold text-gray-700 mb-3">Client</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-gray-400 text-xs">Nom</p>
                    <p className="font-medium">{selected.full_name}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs">Téléphone</p>
                    <p className="font-medium">{selected.phone}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs">Wilaya</p>
                    <p className="font-medium">{selected.wilaya}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs">Commune</p>
                    <p className="font-medium">{selected.commune}</p>
                  </div>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Adresse</p>
                  <p className="font-medium">{selected.address}</p>
                </div>
                {selected.notes && (
                  <div>
                    <p className="text-gray-400 text-xs">Notes</p>
                    <p className="text-gray-600 italic">{selected.notes}</p>
                  </div>
                )}
              </div>

              {/* Articles */}
              <div>
                <h3 className="font-semibold text-gray-700 mb-3">Articles commandés</h3>
                <div className="space-y-2">
                  {(selected.items as OrderItem[]).map((item, i) => (
                    <div key={i} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-200 flex-shrink-0">
                        {item.image ? (
                          <Image src={item.image} alt="" width={48} height={48} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-lg">📦</div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 line-clamp-1">{item.title}</p>
                        <p className="text-xs text-gray-500">Qté: {item.quantity} × {formatPrice(item.price)}</p>
                      </div>
                      <p className="font-bold text-gray-800 text-sm">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between items-center bg-rose-50 rounded-2xl p-4">
                <span className="font-semibold text-gray-700">Total commande</span>
                <span className="text-xl font-bold text-gray-900">{formatPrice(selected.total_amount)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminGuard>
  )
}
