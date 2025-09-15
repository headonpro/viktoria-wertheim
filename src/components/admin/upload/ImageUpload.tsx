'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { IconUpload, IconX, IconPhoto } from '@tabler/icons-react';
import Image from 'next/image';
import { toast } from 'sonner';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  bucket?: string;
  maxSize?: number; // in MB
}

export default function ImageUpload({
  value,
  onChange,
  bucket = 'news-images',
  maxSize = 5,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(value || null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      // Check file size
      if (file.size > maxSize * 1024 * 1024) {
        toast.error(`Datei ist zu groß. Maximum: ${maxSize}MB`);
        return;
      }

      // Check file type
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        toast.error('Ungültiger Dateityp. Erlaubt sind: JPG, PNG, GIF, WebP');
        return;
      }

      setIsUploading(true);
      setUploadProgress(0);
      const supabase = createClient();

      try {
        // Check auth status first
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
          throw new Error('Sie müssen angemeldet sein, um Bilder hochzuladen');
        }

        // Create unique filename
        const fileExt = file.name.split('.').pop()?.toLowerCase();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        
        console.log('Uploading to bucket:', bucket);
        console.log('File name:', fileName);
        console.log('File size:', file.size);

        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
          .from(bucket)
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false,
          });

        if (error) {
          console.error('Upload error details:', error);
          if (error.message?.includes('not found')) {
            throw new Error(`Storage bucket "${bucket}" existiert nicht`);
          } else if (error.message?.includes('policy')) {
            throw new Error('Keine Berechtigung zum Upload. Bitte melden Sie sich erneut an.');
          } else {
            throw error;
          }
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from(bucket)
          .getPublicUrl(data.path);

        console.log('Upload successful, public URL:', publicUrl);
        
        setPreview(publicUrl);
        onChange(publicUrl);
        setUploadProgress(100);
        toast.success('Bild erfolgreich hochgeladen');
      } catch (error) {
        console.error('Upload error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unbekannter Fehler beim Hochladen';
        toast.error(errorMessage);
      } finally {
        setIsUploading(false);
        setTimeout(() => setUploadProgress(0), 1000);
      }
    },
    [bucket, maxSize, onChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
    },
    maxFiles: 1,
    disabled: isUploading,
  });

  const removeImage = () => {
    setPreview(null);
    onChange('');
    toast.info('Bild entfernt');
  };

  return (
    <div className="space-y-4">
      {preview ? (
        <div className="relative">
          <div className="relative h-48 w-full overflow-hidden rounded-lg border">
            <Image
              src={preview}
              alt="Preview"
              fill
              className="object-cover"
              unoptimized // Wichtig für externe URLs
            />
          </div>
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            onClick={removeImage}
            disabled={isUploading}
          >
            <IconX className="w-4 h-4" />
          </Button>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`
            relative h-48 w-full rounded-lg border-2 border-dashed
            ${isDragActive ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-600'}
            ${isUploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-gray-400 dark:hover:border-gray-500'}
            transition-colors
          `}
        >
          <input {...getInputProps()} />
          <div className="flex h-full flex-col items-center justify-center">
            {isUploading ? (
              <>
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  Wird hochgeladen...
                </p>
              </>
            ) : (
              <>
                {isDragActive ? (
                  <IconPhoto className="w-10 h-10 text-blue-500" />
                ) : (
                  <IconUpload className="w-10 h-10 text-gray-400" />
                )}
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  {isDragActive
                    ? 'Bild hier ablegen'
                    : 'Klicken oder Bild hierher ziehen'}
                </p>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
                  PNG, JPG, GIF bis zu {maxSize}MB
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}