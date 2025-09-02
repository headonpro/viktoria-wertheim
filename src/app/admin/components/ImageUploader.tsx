'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'

interface ImageUploaderProps {
  currentImageUrl?: string | null
  onImageUploaded: (url: string) => void
}

export default function ImageUploader({ currentImageUrl, onImageUploaded }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState(currentImageUrl || '')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file
    if (!file.type.startsWith('image/')) {
      alert('Bitte nur Bilddateien auswählen')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Datei ist zu groß (max. 5MB)')
      return
    }

    setUploading(true)

    try {
      // Create unique filename
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      const filePath = `news/${fileName}`

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) {
        console.error('Supabase Storage Upload Error:', uploadError)
        console.error('Error details:', uploadError.message)
        
        // Fallback: Use base64 data URL
        const reader = new FileReader()
        reader.onloadend = () => {
          const base64 = reader.result as string
          setPreviewUrl(base64)
          onImageUploaded(base64)
        }
        reader.readAsDataURL(file)
        return
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath)

      setPreviewUrl(publicUrl)
      onImageUploaded(publicUrl)
    } catch (error) {
      console.error('Upload-Fehler:', error)
      alert('Fehler beim Hochladen des Bildes')
    } finally {
      setUploading(false)
    }
  }

  const handleUrlInput = (url: string) => {
    setPreviewUrl(url)
    onImageUploaded(url)
  }

  return (
    <div className="admin-image-uploader">
      <div className="admin-form-group">
        <label>Bild</label>
        
        {/* Preview */}
        {previewUrl && (
          <div className="admin-image-preview">
            <img src={previewUrl} alt="Vorschau" style={{ maxWidth: '300px', maxHeight: '200px', objectFit: 'cover' }} />
            <button 
              type="button"
              onClick={() => {
                setPreviewUrl('')
                onImageUploaded('')
              }}
              className="admin-btn admin-btn-danger"
              style={{ marginTop: '10px' }}
            >
              Bild entfernen
            </button>
          </div>
        )}

        {/* Upload Options */}
        <div className="admin-upload-options" style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
          
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="admin-btn admin-btn-primary"
          >
            {uploading ? 'Lädt...' : 'Bild hochladen'}
          </button>

          <span style={{ alignSelf: 'center' }}>oder</span>

          <input
            type="url"
            placeholder="Bild-URL eingeben"
            value={previewUrl}
            onChange={(e) => handleUrlInput(e.target.value)}
            style={{ flex: 1 }}
          />
        </div>

        <small style={{ color: '#a0a0a0', marginTop: '5px', display: 'block' }}>
          Max. 5MB, JPG/PNG/WebP
        </small>
      </div>
    </div>
  )
}