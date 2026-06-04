/**
 * Balanced 3-per-row grid on a 6-column track.
 *
 * Each normal card spans 2 of 6 columns (→ 3 per row). When the item count
 * isn't divisible by 3, the trailing row is centered instead of left-aligned:
 *   - remainder 1 → final card centered    ('g6-center'  → col 3, span 2)
 *   - remainder 2 → final two as halves     ('g6-half'    → span 3 each)
 * Returns '' for every other card (default span-2 via CSS).
 *
 * Works for any total, so it stays correct as projects/features are
 * added or removed.
 */
export function balancedSpanClass(index, total) {
  const remainder = total % 3;
  const isLast = index === total - 1;
  const isSecondLast = index === total - 2;
  if (remainder === 1 && isLast) return 'g6-center';
  if (remainder === 2 && (isSecondLast || isLast)) return 'g6-half';
  return '';
}
