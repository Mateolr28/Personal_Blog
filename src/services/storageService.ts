import { supabase, isSupabaseConfigured } from '../lib/supabase';

export type StorageBucket = 'profile' | 'projects' | 'travel' | 'aviation' | 'general' | 'portfolio-media' | string;

export const storageService = {
  /**
   * Uploads an image to the specified Supabase storage bucket.
   * If in local preview mode without credentials, converts to an object URL / base64 preview for immediate testing.
   */
  async uploadImage(file: File, bucket: StorageBucket = 'portfolio-media', folder: string = ''): Promise<string> {
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      throw new Error('Tipo de archivo no válido. Solo se permiten imágenes (JPEG, PNG, WebP, AVIF, GIF).');
    }

    // Validate size (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new Error('La imagen excede el tamaño máximo permitido de 10MB.');
    }

    if (isSupabaseConfigured()) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
      const filePath = folder ? `${folder}/${fileName}` : `${fileName}`;

      const bucketName = bucket || 'portfolio-media';
      const { data, error } = await supabase.storage.from(bucketName).upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

      if (error) {
        console.error('Error al subir imagen a Supabase Storage:', error);
        throw new Error(error.message);
      }

      const { data: publicData } = supabase.storage.from(bucketName).getPublicUrl(data.path);
      return publicData.publicUrl;
    } else {
      // In local preview/fallback mode, simulate upload and return object URL / data URL
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result as string);
        };
        reader.readAsDataURL(file);
      });
    }
  },

  /**
   * Deletes an image from Supabase Storage
   */
  async deleteImage(filePath: string, bucket: StorageBucket = 'general'): Promise<boolean> {
    if (!isSupabaseConfigured()) return true;

    try {
      // Extract file name from URL if full public URL passed
      const parts = filePath.split('/');
      const fileName = parts[parts.length - 1];
      const { error } = await supabase.storage.from(bucket).remove([fileName]);
      if (error) {
        console.warn('Error deleting image from storage:', error);
        return false;
      }
      return true;
    } catch (e) {
      console.warn('Storage deletion error:', e);
      return false;
    }
  },
};
