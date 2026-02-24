'use client'

import { useEffect, useState, useRef } from 'react'
import AdminGuard from '@/components/admin/AdminGuard'
import AdminNav from '@/components/admin/AdminNav'
import { supabase, Category } from '@/lib/supabase'
import { uploadFile, deleteFile } from '@/lib/storage'
import Image from 'next/image'
import toast from 'react-hot-toast'
import {
  PencilSquareIcon,
  TrashIcon,
  PlusIcon,
  XMarkIcon,
  PhotoIcon,
} from '@heroicons/react/24/outline'

type FormState = { name: string; description: string; image_url: string }
const EMPTY: FormState = { name: '', description: '', image_url: '' }

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Category | null>(null)
  const [form, setForm] = useState<FormState>(EMPTY)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const load = async () => {
    setLoading(true)
    const { data } = await supabase.from('categories').select('*').order('created_at', { ascending: true })
    setCategories(data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const openCreate = () => { setEditing(null); setForm(EMPTY); setShowForm(true) }
  const openEdit = (cat: Category) => { setEditing(cat); setForm({ name: cat.name, description: cat.description || '', image_url: cat.image_url || '' }); setShowForm(true) }
  const closeForm = () => { setShowForm(false); setEditing(null); setForm(EMPTY) }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const url = await uploadFile(file, 'images')
      setForm(f => ({ ...f, image_url: url }))
      toast.success('Image téléchargée')
    } catch {
      toast.error('Erreur upload image')
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) { toast.error('Nom requis'); return }
    setSaving(true)
    try {
      if (editing) {
        const { error } = await supabase.from('categories').update({
          name: form.name.trim(),
          description: form.description.trim() || null,
          image_url: form.image_url || null,
        }).eq('id', editing.id)
        if (error) throw error
        toast.success('Catégorie modifiée')
      } else {
        const { error } = await supabase.from('categories').insert({
          name: form.name.trim(),
          description: form.description.trim() || null,
          image_url: form.image_url || null,
        })
        if (error) throw error
        toast.success('Catégorie créée')
      }
      closeForm()
      load()
    } catch {
      toast.error('Erreur lors de la sauvegarde')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const cat = categories.find(c => c.id === id)
      if (cat?.image_url) await deleteFile(cat.image_url).catch(() => {})
      const { error } = await supabase.from('categories').delete().eq('id', id)
      if (error) throw error
      toast.success('Catégorie supprimée')
      setDeleteId(null)
      load()
    } catch {
      toast.error('Erreur lors de la suppression')
    }
  }

  return (
    <AdminGuard>
      <div className="flex min-h-screen bg-gray-50">
        <AdminNav />
        <main className="flex-1 p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Catégories</h1>
              <p className="text-gray-500 mt-1">{categories.length} catégorie(s)</p>
            </div>
            <button
              onClick={openCreate}
              className="flex items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white font-semibold px-5 py-2.5 rounded-xl transition"
            >
              <PlusIcon className="w-5 h-5" />
              Nouvelle catégorie
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-4 border-rose-400 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <div className="text-5xl mb-3">🏷️</div>
              <p>Aucune catégorie. Créez-en une !</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-4">Image</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-4">Nom</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-4 hidden md:table-cell">Description</th>
                    <th className="text-right text-xs font-semibold text-gray-500 uppercase px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {categories.map(cat => (
                    <tr key={cat.id} className="hover:bg-gray-50/50 transition">
                      <td className="px-6 py-4">
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100">
                          {cat.image_url ? (
                            <Image src={cat.image_url} alt="" width={48} height={48} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xl">🏷️</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-800">{cat.name}</td>
                      <td className="px-6 py-4 text-gray-500 text-sm hidden md:table-cell">
                        {cat.description || '—'}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 justify-end">
                          <button
                            onClick={() => openEdit(cat)}
                            className="p-2 rounded-lg hover:bg-blue-50 text-blue-500 transition"
                          >
                            <PencilSquareIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteId(cat.id)}
                            className="p-2 rounded-lg hover:bg-red-50 text-red-400 transition"
                          >
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

      {/* Modal formulaire */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-lg text-gray-900">
                {editing ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
              </h2>
              <button onClick={closeForm} className="p-2 hover:bg-gray-100 rounded-xl">
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
                <input
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
                  placeholder="Nom de la catégorie"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  rows={2}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
                  placeholder="Description optionnelle"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                {form.image_url ? (
                  <div className="relative inline-block">
                    <Image src={form.image_url} alt="" width={120} height={120} className="w-28 h-28 object-cover rounded-xl" />
                    <button
                      type="button"
                      onClick={() => setForm(f => ({ ...f, image_url: '' }))}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5"
                    >
                      <XMarkIcon className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    disabled={uploading}
                    className="flex items-center gap-2 border-2 border-dashed border-gray-300 hover:border-rose-400 rounded-xl px-4 py-3 text-sm text-gray-500 hover:text-rose-500 transition w-full justify-center"
                  >
                    <PhotoIcon className="w-5 h-5" />
                    {uploading ? 'Téléchargement...' : 'Ajouter une image'}
                  </button>
                )}
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={closeForm} className="flex-1 border border-gray-200 text-gray-600 py-3 rounded-xl font-medium hover:bg-gray-50 transition">
                  Annuler
                </button>
                <button type="submit" disabled={saving} className="flex-1 bg-rose-500 hover:bg-rose-600 disabled:opacity-50 text-white py-3 rounded-xl font-medium transition">
                  {saving ? 'Enregistrement...' : 'Enregistrer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal confirmation suppression */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="font-bold text-gray-900 mb-2">Confirmer la suppression</h3>
            <p className="text-gray-500 text-sm mb-5">Cette catégorie et tous ses produits seront supprimés définitivement.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 border border-gray-200 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50">Annuler</button>
              <button onClick={() => handleDelete(deleteId)} className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-xl text-sm font-medium">Supprimer</button>
            </div>
          </div>
        </div>
      )}
    </AdminGuard>
  )
}
