'use client'

import { useEffect, useState, useRef } from 'react'
import AdminGuard from '@/components/admin/AdminGuard'
import AdminNav from '@/components/admin/AdminNav'
import { supabase, Category, Product } from '@/lib/supabase'
import { uploadFile, deleteFile } from '@/lib/storage'
import { formatPrice, getDiscountedPrice } from '@/lib/cart'
import Image from 'next/image'
import toast from 'react-hot-toast'
import {
  PencilSquareIcon, TrashIcon, PlusIcon, XMarkIcon,
  PhotoIcon, VideoCameraIcon,
} from '@heroicons/react/24/outline'

type FormState = {
  category_id: string; title: string; description: string
  price: string; discount_percent: string; in_stock: boolean
  images: string[]; videos: string[]
}

const EMPTY: FormState = {
  category_id: '', title: '', description: '', price: '',
  discount_percent: '0', in_stock: true, images: [], videos: [],
}

export default function AdminProduits() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [filterCat, setFilterCat] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)
  const [form, setForm] = useState<FormState>(EMPTY)
  const [uploadingImg, setUploadingImg] = useState(false)
  const [uploadingVid, setUploadingVid] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const imgRef = useRef<HTMLInputElement>(null)
  const vidRef = useRef<HTMLInputElement>(null)

  const load = async () => {
    setLoading(true)
    const [{ data: prods }, { data: cats }] = await Promise.all([
      supabase.from('products').select('*').order('created_at', { ascending: false }),
      supabase.from('categories').select('*').order('name'),
    ])
    setProducts(prods || [])
    setCategories(cats || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const filtered = filterCat ? products.filter(p => p.category_id === filterCat) : products

  const openCreate = () => {
    setEditing(null)
    setForm({ ...EMPTY, category_id: categories[0]?.id || '' })
    setShowForm(true)
  }

  const openEdit = (p: Product) => {
    setEditing(p)
    setForm({
      category_id: p.category_id,
      title: p.title,
      description: p.description || '',
      price: String(p.price),
      discount_percent: String(p.discount_percent),
      in_stock: p.in_stock,
      images: p.images || [],
      videos: p.videos || [],
    })
    setShowForm(true)
  }

  const closeForm = () => { setShowForm(false); setEditing(null); setForm(EMPTY) }

  const handleImgUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    const remaining = 4 - form.images.length
    if (remaining <= 0) { toast.error('Maximum 4 images'); return }
    setUploadingImg(true)
    try {
      const urls = await Promise.all(files.slice(0, remaining).map(f => uploadFile(f, 'images')))
      setForm(f => ({ ...f, images: [...f.images, ...urls] }))
      toast.success(`${urls.length} image(s) ajoutée(s)`)
    } catch {
      toast.error('Erreur upload image')
    } finally {
      setUploadingImg(false)
      if (imgRef.current) imgRef.current.value = ''
    }
  }

  const handleVidUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    const remaining = 2 - form.videos.length
    if (remaining <= 0) { toast.error('Maximum 2 vidéos'); return }
    setUploadingVid(true)
    try {
      const urls = await Promise.all(files.slice(0, remaining).map(f => uploadFile(f, 'videos')))
      setForm(f => ({ ...f, videos: [...f.videos, ...urls] }))
      toast.success(`${urls.length} vidéo(s) ajoutée(s)`)
    } catch {
      toast.error('Erreur upload vidéo')
    } finally {
      setUploadingVid(false)
      if (vidRef.current) vidRef.current.value = ''
    }
  }

  const removeImage = async (url: string) => {
    await deleteFile(url).catch(() => {})
    setForm(f => ({ ...f, images: f.images.filter(i => i !== url) }))
  }

  const removeVideo = async (url: string) => {
    await deleteFile(url).catch(() => {})
    setForm(f => ({ ...f, videos: f.videos.filter(v => v !== url) }))
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title.trim()) { toast.error('Titre requis'); return }
    if (!form.price || isNaN(Number(form.price))) { toast.error('Prix invalide'); return }
    if (!form.category_id) { toast.error('Catégorie requise'); return }
    setSaving(true)
    try {
      const payload = {
        category_id: form.category_id,
        title: form.title.trim(),
        description: form.description.trim() || null,
        price: Number(form.price),
        discount_percent: Number(form.discount_percent) || 0,
        in_stock: form.in_stock,
        images: form.images,
        videos: form.videos,
      }
      if (editing) {
        const { error } = await supabase.from('products').update(payload).eq('id', editing.id)
        if (error) throw error
        toast.success('Produit modifié')
      } else {
        const { error } = await supabase.from('products').insert(payload)
        if (error) throw error
        toast.success('Produit créé')
      }
      closeForm(); load()
    } catch {
      toast.error('Erreur lors de la sauvegarde')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const prod = products.find(p => p.id === id)
      if (prod) {
        await Promise.all([
          ...(prod.images || []).map(u => deleteFile(u).catch(() => {})),
          ...(prod.videos || []).map(u => deleteFile(u).catch(() => {})),
        ])
      }
      await supabase.from('products').delete().eq('id', id)
      toast.success('Produit supprimé')
      setDeleteId(null); load()
    } catch {
      toast.error('Erreur suppression')
    }
  }

  const catName = (id: string) => categories.find(c => c.id === id)?.name || '—'

  return (
    <AdminGuard>
      <div className="flex min-h-screen bg-gray-50">
        <AdminNav />
        <main className="flex-1 p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Produits</h1>
              <p className="text-gray-500 mt-1">{filtered.length} produit(s)</p>
            </div>
            <button
              onClick={openCreate}
              className="flex items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white font-semibold px-5 py-2.5 rounded-xl transition"
            >
              <PlusIcon className="w-5 h-5" />Nouveau produit
            </button>
          </div>

          {/* Filtre catégorie */}
          <div className="flex gap-2 mb-4 flex-wrap">
            <button
              onClick={() => setFilterCat('')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition ${!filterCat ? 'bg-rose-500 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
            >
              Tous
            </button>
            {categories.map(c => (
              <button
                key={c.id}
                onClick={() => setFilterCat(c.id)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition ${filterCat === c.id ? 'bg-rose-500 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
              >
                {c.name}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-4 border-rose-400 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <div className="text-5xl mb-3">📦</div>
              <p>Aucun produit. Créez-en un !</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3">Produit</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3 hidden lg:table-cell">Catégorie</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3">Prix</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3 hidden md:table-cell">Stock</th>
                    <th className="text-right text-xs font-semibold text-gray-500 uppercase px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map(p => (
                    <tr key={p.id} className="hover:bg-gray-50/50 transition">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                            {p.images?.[0] ? (
                              <Image src={p.images[0]} alt="" width={48} height={48} className="w-full h-full object-cover" />
                            ) : <div className="w-full h-full flex items-center justify-center">📦</div>}
                          </div>
                          <div>
                            <p className="font-medium text-gray-800 text-sm line-clamp-1">{p.title}</p>
                            <p className="text-xs text-gray-400">{p.images?.length || 0} img · {p.videos?.length || 0} vid</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500 hidden lg:table-cell">{catName(p.category_id)}</td>
                      <td className="px-4 py-3">
                        <p className="font-semibold text-gray-800 text-sm">
                          {formatPrice(getDiscountedPrice(p.price, p.discount_percent))}
                        </p>
                        {p.discount_percent > 0 && (
                          <p className="text-xs text-gray-400 line-through">{formatPrice(p.price)}</p>
                        )}
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${p.in_stock ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'}`}>
                          {p.in_stock ? 'En stock' : 'Rupture'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 justify-end">
                          <button onClick={() => openEdit(p)} className="p-2 rounded-lg hover:bg-blue-50 text-blue-500 transition">
                            <PencilSquareIcon className="w-4 h-4" />
                          </button>
                          <button onClick={() => setDeleteId(p.id)} className="p-2 rounded-lg hover:bg-red-50 text-red-400 transition">
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>

      {/* Modal produit */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl my-4 p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-lg text-gray-900">{editing ? 'Modifier le produit' : 'Nouveau produit'}</h2>
              <button onClick={closeForm} className="p-2 hover:bg-gray-100 rounded-xl"><XMarkIcon className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              {/* Catégorie */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie *</label>
                <select
                  value={form.category_id}
                  onChange={e => setForm(f => ({ ...f, category_id: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
                >
                  <option value="">Sélectionner...</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              {/* Titre */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Titre *</label>
                <input
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
                  placeholder="Nom du produit"
                />
              </div>
              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  rows={3}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
                  placeholder="Description du produit..."
                />
              </div>
              {/* Prix + Réduction */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prix (DA) *</label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
                    placeholder="1500"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Réduction (%)</label>
                  <input
                    type="number"
                    value={form.discount_percent}
                    onChange={e => setForm(f => ({ ...f, discount_percent: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
                    placeholder="0"
                    min="0" max="99"
                  />
                </div>
              </div>
              {/* Stock */}
              <div className="flex items-center gap-3">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.in_stock}
                    onChange={e => setForm(f => ({ ...f, in_stock: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-checked:bg-emerald-500 rounded-full peer-focus:ring-2 peer-focus:ring-emerald-300 transition after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5" />
                </label>
                <span className="text-sm font-medium text-gray-700">En stock</span>
              </div>
              {/* Images */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Images ({form.images.length}/4)
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {form.images.map((img, i) => (
                    <div key={i} className="relative">
                      <Image src={img} alt="" width={72} height={72} className="w-18 h-18 rounded-xl object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(img)}
                        className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-0.5"
                      >
                        <XMarkIcon className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                  {form.images.length < 4 && (
                    <button
                      type="button"
                      onClick={() => imgRef.current?.click()}
                      disabled={uploadingImg}
                      className="w-[72px] h-[72px] border-2 border-dashed border-gray-300 hover:border-rose-400 rounded-xl flex flex-col items-center justify-center text-gray-400 hover:text-rose-500 transition text-xs gap-1"
                    >
                      <PhotoIcon className="w-5 h-5" />
                      {uploadingImg ? '...' : 'Ajouter'}
                    </button>
                  )}
                </div>
                <input ref={imgRef} type="file" accept="image/*" multiple className="hidden" onChange={handleImgUpload} />
              </div>
              {/* Vidéos */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vidéos ({form.videos.length}/2)
                </label>
                <div className="space-y-2">
                  {form.videos.map((vid, i) => (
                    <div key={i} className="flex items-center gap-2 bg-gray-50 rounded-xl p-2">
                      <VideoCameraIcon className="w-5 h-5 text-gray-400 flex-shrink-0" />
                      <span className="text-sm text-gray-500 flex-1 truncate">Vidéo {i + 1}</span>
                      <button type="button" onClick={() => removeVideo(vid)} className="text-red-400 hover:text-red-600">
                        <XMarkIcon className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {form.videos.length < 2 && (
                    <button
                      type="button"
                      onClick={() => vidRef.current?.click()}
                      disabled={uploadingVid}
                      className="flex items-center gap-2 border-2 border-dashed border-gray-300 hover:border-rose-400 rounded-xl px-4 py-2 text-sm text-gray-500 hover:text-rose-500 transition w-full justify-center"
                    >
                      <VideoCameraIcon className="w-5 h-5" />
                      {uploadingVid ? 'Téléchargement...' : 'Ajouter une vidéo'}
                    </button>
                  )}
                </div>
                <input ref={vidRef} type="file" accept="video/*" className="hidden" onChange={handleVidUpload} />
              </div>
              {/* Preview prix */}
              {form.price && Number(form.price) > 0 && (
                <div className="bg-rose-50 rounded-xl p-3 text-sm">
                  <span className="text-gray-600">Prix affiché : </span>
                  <span className="font-bold text-gray-900">
                    {formatPrice(getDiscountedPrice(Number(form.price), Number(form.discount_percent)))}
                  </span>
                  {Number(form.discount_percent) > 0 && (
                    <span className="ml-2 text-gray-400 line-through">{formatPrice(Number(form.price))}</span>
                  )}
                </div>
              )}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={closeForm} className="flex-1 border border-gray-200 text-gray-600 py-3 rounded-xl font-medium hover:bg-gray-50 transition">Annuler</button>
                <button type="submit" disabled={saving} className="flex-1 bg-rose-500 hover:bg-rose-600 disabled:opacity-50 text-white py-3 rounded-xl font-medium transition">
                  {saving ? 'Enregistrement...' : 'Enregistrer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="font-bold text-gray-900 mb-2">Confirmer la suppression</h3>
            <p className="text-gray-500 text-sm mb-5">Ce produit et ses médias seront supprimés définitivement.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 border border-gray-200 py-2.5 rounded-xl text-sm font-medium">Annuler</button>
              <button onClick={() => handleDelete(deleteId)} className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-xl text-sm font-medium">Supprimer</button>
            </div>
          </div>
        </div>
      )}
    </AdminGuard>
  )
}
