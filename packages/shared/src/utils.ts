/**
 * Format capacity in kg to human readable format
 * @param capacity - Capacity in kg
 * @returns Formatted string (e.g., "2,000 kg" or "1.5 t")
 */
export function formatCapacity(capacity: number): string {
  if (capacity >= 1000) {
    const tons = capacity / 1000
    if (Number.isInteger(tons)) {
      return `${tons} t`
    }
    return `${tons.toFixed(1)} t`
  }
  return `${capacity.toLocaleString()} kg`
}

/**
 * Format date string to Japanese format
 * @param dateString - ISO date string (YYYY-MM-DD)
 * @returns Formatted string (e.g., "2024年12月1日")
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

/**
 * Format datetime to Japanese format
 * @param date - Date object or ISO string
 * @returns Formatted string (e.g., "2024年12月1日 14:30")
 */
export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * Generate a simple ID (for client-side only)
 * @returns Random ID string
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 15)
}

/**
 * Truncate text with ellipsis
 * @param text - Text to truncate
 * @param maxLength - Maximum length
 * @returns Truncated text
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength - 3) + '...'
}
