import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { supabaseAdmin, isSupabaseConfigured } from './supabase';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/svg+xml'];
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

export async function saveUploadedFile(file: File): Promise<{ success: boolean; url?: string; error?: string }> {
  // 1. Validation
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return { success: false, error: 'Invalid file format. Please upload JPG, PNG, WEBP, or AVIF.' };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return { success: false, error: 'File size exceeds maximum allowable limit of 10MB.' };
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const ext = path.extname(file.name) || '.jpg';
  const cleanName = `${Date.now()}-${crypto.randomUUID().slice(0, 8)}${ext}`;

  // 2. Upload to Supabase Storage if configured
  if (isSupabaseConfigured && supabaseAdmin) {
    try {
      const { data, error } = await supabaseAdmin.storage
        .from('efby-catalog')
        .upload(cleanName, buffer, {
          contentType: file.type,
          upsert: true,
        });

      if (error) {
        console.warn('Supabase storage upload failed, falling back to local persistent storage:', error.message);
      } else {
        const { data: publicData } = supabaseAdmin.storage
          .from('efby-catalog')
          .getPublicUrl(cleanName);
        return { success: true, url: publicData.publicUrl };
      }
    } catch (err: any) {
      console.warn('Supabase storage error, using local storage fallback:', err.message);
    }
  }

  // 3. Persistent Local Storage Fallback (/public/uploads)
  try {
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    const targetPath = path.join(uploadDir, cleanName);
    fs.writeFileSync(targetPath, buffer);
    return { success: true, url: `/uploads/${cleanName}` };
  } catch (err: any) {
    return { success: false, error: `Upload error: ${err.message}` };
  }
}
