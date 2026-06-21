import { SITE_DATA } from '../src/data';

/**
 * Client name matching helpers.
 *
 * The Supabase `projects.client` column is free text, so to reliably link a
 * project to a curated client we compare a *canonical key* rather than the raw
 * string. Normalisation strips accents/apostrophes, lowercases, and collapses
 * punctuation to spaces — but it keeps words intact, so distinct clients such
 * as "PMDC" ("pmdc") and "PMDC (Medical)" ("pmdc medical") never collapse
 * together. Known variants (full names, "Allied Bank Limited", etc.) are mapped
 * to the curated short name via an alias table built from SITE_DATA.CLIENTS.
 */

function norm(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // strip accents (é -> e)
    .toLowerCase()
    .replace(/['’`]/g, '') // drop apostrophes (Jee's -> jees)
    .replace(/[^a-z0-9]+/g, ' ') // any other punctuation -> space (keeps words)
    .trim();
}

// normalized variant -> canonical token (the normalized curated short name)
const ALIASES = (() => {
  const map = new Map();
  for (const c of SITE_DATA.CLIENTS) {
    const canon = norm(c.name);
    if (!canon) continue;
    map.set(norm(c.name), canon);
    if (c.fullName) map.set(norm(c.fullName), canon);
  }
  // A few common short-form variants that aren't the full name.
  const manual = {
    'fourth wall': 'Fourth Wall Studios',
    'fourth wall studio': 'Fourth Wall Studios',
    'wah nobel group': 'Wah Nobel',
    'allied bank limited': 'Allied Bank',
  };
  for (const [variant, canonName] of Object.entries(manual)) {
    map.set(norm(variant), norm(canonName));
  }
  return map;
})();

/**
 * Canonical key for a client string. Two values that refer to the same client
 * (e.g. "PARC" and "Pakistan Agricultural Research Council") return the same
 * key; distinct clients return distinct keys. Empty input -> ''.
 */
export function canonicalClientKey(value) {
  const n = norm(value);
  if (!n) return '';
  return ALIASES.get(n) || n;
}

/**
 * Dropdown options for the admin client picker, derived from the curated
 * roster. Shape: { name (stored value / short name), fullName (description) }.
 */
export function getCuratedClientOptions() {
  return SITE_DATA.CLIENTS.map((c) => ({
    name: c.name,
    fullName: c.fullName || c.name,
  }));
}
