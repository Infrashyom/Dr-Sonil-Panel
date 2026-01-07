
/**
 * Compresses an image string (base64) by resizing it and reducing quality
 * Used for Client-side compression before upload
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

/**
 * Optimizes a Cloudinary URL for faster loading.
 * Adds auto-format (WebP/AVIF), auto-quality, and resizing.
 */
export const getOptimizedUrl = (url: string, width?: number): string => {
  if (!url) return '';
  if (!url.includes('cloudinary.com')) return url; // Return original if not cloudinary

  // Split the URL at the 'upload' segment
  const parts = url.split('/upload/');
  if (parts.length < 2) return url;

  // Construct transformation string
  // f_auto: Let Cloudinary choose best format (webp/avif)
  // q_auto: Intelligent quality compression
  // w_{width}: Resize to specific width if provided
  let transformation = 'f_auto,q_auto';
  
  if (width) {
    transformation += `,w_${width}`;
  }

  return `${parts[0]}/upload/${transformation}/${parts[1]}`;
};
