/**
 * Compresses an image string (base64) by resizing it and reducing quality
 */
export const compressImage = (base64Str: string, maxWidth = 1200, quality = 0.7): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      // Calculate new dimensions
      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas context not available'));
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);
      
      // Convert to compressed JPEG
      const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
      resolve(compressedBase64);
    };
    img.onerror = (err) => reject(err);
  });
};
