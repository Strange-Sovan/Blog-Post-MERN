const acceptedImageTypes = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

export const getThumbnailFileError = (file: File): string | undefined => {
  if (!acceptedImageTypes.has(file.type)) {
    return 'Choose a JPEG, PNG, WebP, or GIF image.';
  }
  if (file.size > 5 * 1024 * 1024) {
    return 'Thumbnail images must be 5 MB or smaller.';
  }
  return undefined;
};
