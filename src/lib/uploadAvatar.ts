import { supabase } from '@/lib/supabase'

const BUCKET = import.meta.env.VITE_SUPABASE_BUCKET || 'avatars'

const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
const maxSize = 2 * 1024 * 1024 // 2MB

export const uploadAvatar = async (file: File, userId?: number | string) => {
  if (!file) {
    throw new Error('Image file is required')
  }

  if (!allowedTypes.includes(file.type)) {
    throw new Error('Only JPG, PNG and WEBP images are allowed')
  }

  if (file.size > maxSize) {
    throw new Error('Image size must be less than 2MB')
  }

  const fileExt = file.name.split('.').pop()
  const fileName = `${Date.now()}-${crypto.randomUUID()}.${fileExt}`
  const filePath = userId ? `${userId}/${fileName}` : `public/${fileName}`

  const { error } = await supabase.storage.from(BUCKET).upload(filePath, file, {
    cacheControl: '3600',
    upsert: false,
    contentType: file.type,
  })

  if (error) {
    throw new Error(error.message)
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(filePath)

  return data.publicUrl
}
