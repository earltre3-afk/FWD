import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { GifItem } from '@/data/gifs';

// Read env (Vite) — support both VITE_ prefixed and non-prefixed env vars
const SUPABASE_URL = ((import.meta as any).env?.VITE_SUPABASE_URL || (import.meta as any).env?.SUPABASE_URL) as string | undefined;
const SUPABASE_ANON = ((import.meta as any).env?.VITE_SUPABASE_ANON_KEY || (import.meta as any).env?.SUPABASE_ANON_KEY) as string | undefined;

export const isSupabaseEnabled = Boolean(SUPABASE_URL && SUPABASE_ANON);

let _client: SupabaseClient | null = null;
export function getSupabase(): SupabaseClient | null {
  if (!isSupabaseEnabled) return null;
  if (!_client) {
    _client = createClient(SUPABASE_URL!, SUPABASE_ANON!, {
      auth: { persistSession: true, autoRefreshToken: true },
    });
  }
  return _client;
}

const BUCKET = 'gifs';

export type DbGifRow = {
  id: string;
  title: string;
  tags: string[];
  category: string;
  duration: number;
  is_public: boolean;
  media_url: string;
  thumbnail_url: string | null;
  width: number;
  height: number;
  format: string;
  alt_text: string | null;
  created_at?: string;
  mood?: string | null;
};

export function rowToGif(row: DbGifRow): GifItem {
  return {
    id: row.id,
    title: row.title,
    mediaUrl: row.media_url,
    previewUrl: row.media_url,
    thumbnailUrl: row.thumbnail_url || row.media_url,
    width: row.width,
    height: row.height,
    duration: row.duration,
    format: (row.format as any) || 'gif',
    altText: row.alt_text || row.title,
    tags: row.tags || [],
    category: row.category || 'Reactions',
    mood: row.mood || undefined,
  };
}

/**
 * Upload a Blob to Supabase Storage and return its public URL.
 */
export async function uploadGifBlob(
  blob: Blob,
  filename: string,
  contentType = 'image/gif'
): Promise<string> {
  const sb = getSupabase();
  if (!sb) {
    // Local fallback — return blob URL (won't persist across sessions/devices)
    return URL.createObjectURL(blob);
  }
  const path = `${Date.now()}-${filename}`.replace(/[^\w.\-/]/g, '_');
  const { error } = await sb.storage.from(BUCKET).upload(path, blob, {
    contentType,
    upsert: false,
    cacheControl: '31536000',
  });
  if (error) {
    // Some hosting envs require the bucket to be created; surface a clearer message
    throw new Error(
      `Storage upload failed: ${error.message}. Make sure a public bucket named "${BUCKET}" exists.`
    );
  }
  const { data } = sb.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export type InsertGifInput = {
  title: string;
  tags: string[];
  category: string;
  duration: number;
  is_public: boolean;
  media_url: string;
  thumbnail_url?: string | null;
  width: number;
  height: number;
  format?: string;
  alt_text?: string | null;
  mood?: string | null;
};

export async function insertGifRow(input: InsertGifInput): Promise<DbGifRow | null> {
  const sb = getSupabase();
  if (!sb) return null;
  const { data, error } = await sb
    .from('gifs')
    .insert({
      title: input.title,
      tags: input.tags,
      category: input.category,
      duration: input.duration,
      is_public: input.is_public,
      media_url: input.media_url,
      thumbnail_url: input.thumbnail_url ?? input.media_url,
      width: input.width,
      height: input.height,
      format: input.format ?? 'gif',
      alt_text: input.alt_text ?? input.title,
      mood: input.mood ?? null,
    })
    .select('*')
    .single();
  if (error) throw new Error(`Database insert failed: ${error.message}`);
  return data as DbGifRow;
}

export async function fetchPublicGifs(limit = 60): Promise<GifItem[]> {
  const sb = getSupabase();
  if (!sb) return [];
  const { data, error } = await sb
    .from('gifs')
    .select('*')
    .eq('is_public', true)
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) {
    console.warn('[FWD] fetchPublicGifs failed:', error.message);
    return [];
  }
  return (data as DbGifRow[]).map(rowToGif);
}

/**
 * Optional Supabase setup lives in docs/fwd_supabase_schema.sql.
 * The app works without Supabase in local/demo mode by using browser Blob URLs
 * and localStorage. Configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
 * only when you are ready for persistent uploads.
 */
