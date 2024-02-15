/**
 * Format mXE amount for display.
 * See `formatXe()` for further documentation.
 */
export function formatMxe(mxe: string | number, format: string | boolean): string {
  const s = mxe.toString()
  const fraction = s.substring(s.length - 6).padStart(6, '0')
  let whole = s.substring(0, s.length - 6) || '0'
  if (format) whole = parseInt(whole).toLocaleString(typeof format === 'string' ? format : 'en-US')
  return `${whole}.${fraction}`
}

/**
 * Format XE amount for display.
 *
 * The `format` argument may be a locale string or a Boolean.
 * If it is `true` the amount is formatted using the `en-US` locale.
 * If it is `false` the amount is not formatted.
 *
 * Note that formatting only applies to the 'whole' XE amount.
 * mXE is always displayed with six decimal places.
 */
export function format(xe: string | number, format: string | boolean): string {
  return formatMxe(toMxe(xe), format)
}

/** Convert XE to mXE. */
export function toMxe(xe: string | number): number {
  if (typeof xe === 'string') xe = parseFloat(xe)
  return Math.floor(xe * 1e6)
}

/** Convert mXE to XE. */
export function toXe(mxe: string | number): number {
  if (typeof mxe === 'string') mxe = parseInt(mxe)
  return Math.floor(mxe) / 1e6
}
