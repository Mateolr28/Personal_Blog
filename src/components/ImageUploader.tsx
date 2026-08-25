import React, { useState, useRef } from 'react';
import { Upload, X, Loader2, Image as ImageIcon, CheckCircle, AlertCircle } from 'lucide-react';
import { storageService, StorageBucket } from '../services/storageService';

interface ImageUploaderProps {
  bucket?: StorageBucket;
  folder?: string;
  multiple?: boolean;
  value?: string | string[];
  onChange: (urlOrUrls: any) => void;
  label?: string;
  helperText?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  bucket = 'portfolio-media',
  folder = '',
  multiple = false,
  value,
  onChange,
  label = 'Subir fotografía',
  helperText = 'Formatos: JPG, PNG, WebP (Máx. 10MB)',
}) => {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const images: string[] = multiple
    ? Array.isArray(value)
      ? value
      : value
      ? [value]
      : []
    : typeof value === 'string' && value
    ? [value]
    : [];

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setError(null);
    setUploading(true);

    try {
      if (multiple) {
        const uploadPromises = Array.from(files).map((file) =>
          storageService.uploadImage(file, bucket, folder)
        );
        const uploadedUrls = await Promise.all(uploadPromises);
        onChange([...images, ...uploadedUrls]);
      } else {
        const file = files[0];
        const uploadedUrl = await storageService.uploadImage(file, bucket, folder);
        onChange(uploadedUrl);
      }
    } catch (err: any) {
      console.error('Error uploading file:', err);
      setError(err.message || 'Error al subir la imagen');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleRemove = (indexToRemove: number) => {
    if (multiple) {
      const updated = images.filter((_, idx) => idx !== indexToRemove);
      onChange(updated);
    } else {
      onChange('');
    }
  };

  return (
    <div className="w-full space-y-3">
      {label && (
        <label className="block text-sm font-medium text-neutral-800 dark:text-neutral-200">
          {label}
        </label>
      )}

      {/* Drag and drop zone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 ${
          dragActive
            ? 'border-sky-500 bg-sky-500/10'
            : 'border-neutral-300 dark:border-neutral-700 hover:border-sky-400 dark:hover:border-sky-500 bg-neutral-50/50 dark:bg-neutral-900/50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
          multiple={multiple}
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />

        {uploading ? (
          <div className="flex flex-col items-center gap-2 text-sky-500">
            <Loader2 className="w-8 h-8 animate-spin" />
            <span className="text-xs font-medium">Subiendo fotografía a Supabase Storage...</span>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center gap-1.5">
            <div className="p-3 rounded-full bg-sky-100 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400">
              <Upload className="w-5 h-5" />
            </div>
            <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
              Arrastra y suelta aquí o <span className="text-sky-500 underline">haz clic para examinar</span>
            </p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">{helperText}</p>
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 rounded-lg">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Uploaded Previews */}
      {images.length > 0 && (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
              {multiple ? `Fotografías subidas (${images.length})` : 'Fotografía seleccionada'}
            </span>
          </div>

          <div
            className={`grid gap-3 ${
              multiple
                ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4'
                : 'grid-cols-1 max-w-sm'
            }`}
          >
            {images.map((url, idx) => (
              <div
                key={`${url}-${idx}`}
                className="group relative aspect-video rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900"
              >
                <img
                  src={url}
                  alt={`Preview ${idx + 1}`}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />

                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove(idx);
                    }}
                    className="p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-full transition-transform active:scale-95"
                    title="Eliminar imagen"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {idx === 0 && multiple && (
                  <span className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-sky-600/90 text-[10px] font-semibold text-white rounded">
                    Principal
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
