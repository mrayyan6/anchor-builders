/**
 * Convert a free-text value into a URL-safe slug.
 *   "PARC AZRI Lab" -> "parc-azri-lab"
 */
export function toSlug(value) {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}
