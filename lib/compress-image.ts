// Browser-side photo compression before Supabase upload. Phone camera photos
// arrive as 2-8 MB originals; listings only ever display them at card/detail
// sizes, so we cap the longest edge and re-encode as JPEG.
const MAX_EDGE_PX = 1600
const JPEG_QUALITY = 0.8
// Files already smaller than this are uploaded untouched (re-encoding tiny
// files can make them bigger).
const SKIP_BELOW_BYTES = 300 * 1024

export async function compressImage(file: File): Promise<File> {
  if (!file.type.startsWith('image/') || file.size < SKIP_BELOW_BYTES) return file

  let bitmap: ImageBitmap
  try {
    bitmap = await createImageBitmap(file)
  } catch {
    // Unsupported format (e.g. HEIC in some browsers) — upload the original.
    return file
  }

  const scale = Math.min(1, MAX_EDGE_PX / Math.max(bitmap.width, bitmap.height))
  const width = Math.round(bitmap.width * scale)
  const height = Math.round(bitmap.height * scale)

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    bitmap.close()
    return file
  }
  ctx.drawImage(bitmap, 0, 0, width, height)
  bitmap.close()

  const blob = await new Promise<Blob | null>(resolve =>
    canvas.toBlob(resolve, 'image/jpeg', JPEG_QUALITY)
  )
  if (!blob || blob.size >= file.size) return file

  const baseName = file.name.replace(/\.[^.]+$/, '')
  return new File([blob], baseName + '.jpg', { type: 'image/jpeg' })
}
