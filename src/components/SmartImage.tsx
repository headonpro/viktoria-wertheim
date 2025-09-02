/**
 * SmartImage Component
 * 
 * Intelligently renders images based on source type:
 * - Base64 data URLs: Uses regular <img> tag
 * - HTTP(S) URLs: Uses Next.js Image component for optimization
 * - Placeholder URLs: Uses Next.js Image with fallback
 */

'use client'

import Image from 'next/image'
import { getImageProps } from '@/lib/image-utils'
import { useState } from 'react'

interface SmartImageProps {
  src: string
  alt: string
  className?: string
  fill?: boolean
  style?: React.CSSProperties
  onError?: () => void
}

export default function SmartImage({ 
  src, 
  alt, 
  className = '', 
  
  style,
  onError
}: SmartImageProps) {
  const [imageError, setImageError] = useState(false)
  
  // Handle image load errors
  const handleError = () => {
    setImageError(true)
    onError?.()
  }
  
  // Use fallback if image failed to load
  const imageSrc = imageError ? '/api/placeholder/400/300' : src
  const { useNextImage, props } = getImageProps(imageSrc, alt)
  
  if (useNextImage) {
    // Use Next.js Image component for HTTP URLs and optimization
    return (
      <Image
        {...props}
        alt={alt || ''}
        className={`${props.className || ''} ${className}`.trim()}
        style={style}
        onError={handleError}
        priority={false}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    )
  } else {
    // Use regular img tag for Base64 images
    return (
      <img
        src={props.src}
        alt={props.alt || ''}
        className={`w-full h-full ${className}`.trim()}
        style={{ objectFit: 'cover', ...style }}
        onError={handleError}
      />
    )
  }
}