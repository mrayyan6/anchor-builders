'use client';

/**
 * Try to convert an image File to a WebP Blob using the Canvas API, downscaling
 * so the longest edge is at most `maxDimension`. Keeping the stored source near
 * display size (the project gallery shows it ≤ ~880px → ~1760px at 2×) means
 * next/image has far less to fetch and resize, so the large main image appears
 * much faster on its first request. Returns the original File if anything fails
 * — never throws. Existing already-uploaded images are unaffected.
 */
export async function convertToWebp(file, quality = 0.85, maxDimension = 2400) {
  if (!file || !file.type?.startsWith('image/')) return file;
  try {
    const bitmap = await createImageBitmap(file);
    const longest = Math.max(bitmap.width, bitmap.height);
    const scale = longest > maxDimension ? maxDimension / longest : 1;
    // Already a WebP that's already within bounds → nothing to do.
    if (file.type === 'image/webp' && scale === 1) {
      bitmap.close?.();
      return file;
    }
    const w = Math.round(bitmap.width * scale);
    const h = Math.round(bitmap.height * scale);
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      bitmap.close?.();
      return file;
    }
    ctx.drawImage(bitmap, 0, 0, w, h);
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/webp', quality));
    bitmap.close?.();
    return blob || file;
  } catch {
    return file;
  }
}

export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

export function isImageFile(file) {
  return Boolean(file && file.type && file.type.startsWith('image/'));
}
