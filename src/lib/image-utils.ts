/**
 * Image utilities for handling different image source types
 */

/**
 * Checks if a string is a Base64 encoded image
 */
export function isBase64Image(str: string): boolean {
  if (!str || typeof str !== 'string') return false
  
  // Check for data URL format: data:image/[format];base64,[data]
  const base64Pattern = /^data:image\/(jpeg|jpg|png|gif|webp|svg\+xml);base64,/i
  return base64Pattern.test(str)
}

/**
 * Checks if a string is an HTTP(S) URL
 */
export function isHttpUrl(str: string): boolean {
  if (!str || typeof str !== 'string') return false
  
  try {
    const url = new URL(str)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

/**
 * Checks if an image source is suitable for Next.js Image component
 * Next.js Image requires HTTP(S) URLs, not Base64
 */
export function canUseNextImage(imageSrc: string): boolean {
  return isHttpUrl(imageSrc) && !isBase64Image(imageSrc)
}

/**
 * Gets appropriate image component props based on source type
 */
export function getImageProps(imageSrc: string, alt: string = '') {
  if (isBase64Image(imageSrc)) {
    return {
      useNextImage: false,
      props: {
        src: imageSrc,
        alt,
        style: { objectFit: 'cover' as const }
      }
    }
  }
  
  if (isHttpUrl(imageSrc)) {
    return {
      useNextImage: true,
      props: {
        src: imageSrc,
        alt,
        fill: true,
        className: "object-cover"
      }
    }
  }
  
  // Fallback for relative URLs - no placeholder needed
  return {
    useNextImage: false,
    props: {
      src: imageSrc || '',
      alt,
      style: { objectFit: 'cover' as const }
    }
  }
}