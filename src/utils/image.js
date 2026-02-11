export const DEFAULT_IMAGE_THRESHOLD = 2 * 1024 * 1024

export function estimateDataUrlBytes(dataUrl) {
  if (!dataUrl || !dataUrl.includes(',')) return 0
  const base64 = dataUrl.split(',')[1] || ''
  return Math.ceil((base64.length * 3) / 4)
}

export function formatBytes(bytes) {
  if (!bytes) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB']
  let size = bytes
  let unitIndex = 0
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex += 1
  }
  return `${size.toFixed(size >= 10 || unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`
}

export function normalizeImageValue(value) {
  if (!value) return ''
  if (value.startsWith('data:image') || value.startsWith('http://') || value.startsWith('https://')) {
    return value
  }
  return ''
}
