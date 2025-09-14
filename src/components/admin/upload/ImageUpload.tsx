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

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      // Check file size
      if (file.size > maxSize * 1024 * 1024) {
        toast.error(`Datei ist zu groß. Maximum: ${maxSize}MB`);
        return;
      }

      setIsUploading(true);
      const supabase = createClient();

      try {
        // Create unique filename
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
          .from(bucket)
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false,
          });

        if (error) throw error;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from(bucket)
          .getPublicUrl(data.path);

        setPreview(publicUrl);
        onChange(publicUrl);
        toast.success('Bild erfolgreich hochgeladen');
      } catch (error) {
        console.error('Upload error:', error);
        toast.error('Fehler beim Hochladen des Bildes');
      } finally {
        setIsUploading(false);
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
            />
          </div>
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            onClick={removeImage}
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