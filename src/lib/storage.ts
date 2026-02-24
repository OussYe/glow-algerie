import { supabase } from './supabase'

const BUCKET = 'products'

export async function uploadFile(file: File, folder: 'images' | 'videos'): Promise<string> {
  const ext = file.name.split('.').pop()
  const filename = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(filename, file, { upsert: false })

  if (error) throw new Error(`Erreur upload: ${error.message}`)

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(filename)
  return data.publicUrl
}

export async function deleteFile(url: string): Promise<void> {
  const path = url.split(`/storage/v1/object/public/${BUCKET}/`)[1]
  if (!path) return
  await supabase.storage.from(BUCKET).remove([path])
}
