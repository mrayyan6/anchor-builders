'use client';

/**
 * Try to convert an image File to a WebP Blob using the Canvas API.
 * Returns the original File if anything fails — never throws.
 */
export async function convertToWebp(file, quality = 0.85) {
  if (!file || !file.type?.startsWith('image/')) return file;
  if (file.type === 'image/webp') return file;
  try {
    const bitmap = await createImageBitmap(file);
    const canvas = document.createElement('canvas');
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0);
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
