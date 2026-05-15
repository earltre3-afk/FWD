import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { GIFS, GifItem } from '@/data/gifs';
import { fetchPublicGifs, isSupabaseEnabled } from '@/lib/supabase';

type FWDContextType = {
  favorites: string[];
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  createdGifs: GifItem[];
  addCreatedGif: (gif: GifItem) => void;
  dbGifs: GifItem[];
  refreshDbGifs: () => Promise<void>;
  allGifs: GifItem[];
  supabaseReady: boolean;
};

const FWDContext = createContext<FWDContextType | undefined>(undefined);

export const FWDProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem('fwd_favs');
      return raw ? JSON.parse(raw) : ['vibes-only', 'cool-dog', 'hundred', 'lit-vibes', 'hyped', 'panda-cool', 'good-vibes', 'neon-cat', 'rocket'];
    } catch { return []; }
  });
  const [createdGifs, setCreatedGifs] = useState<GifItem[]>(() => {
    try {
      const raw = localStorage.getItem('fwd_created');
      return raw ? JSON.parse(raw) : [];
    } catch { return []; }
  });
  const [dbGifs, setDbGifs] = useState<GifItem[]>([]);

  useEffect(() => {
    try { localStorage.setItem('fwd_favs', JSON.stringify(favorites)); } catch {}
  }, [favorites]);

  useEffect(() => {
    // Only persist non-blob created gifs (blob URLs don't survive a refresh)
    const persistable = createdGifs.filter(g => !g.mediaUrl.startsWith('blob:'));
    try { localStorage.setItem('fwd_created', JSON.stringify(persistable)); } catch {}
  }, [createdGifs]);

  const refreshDbGifs = useCallback(async () => {
    if (!isSupabaseEnabled) return;
    try {
      const list = await fetchPublicGifs(60);
      setDbGifs(list);
    } catch (e) {
      console.warn('[FWD] refreshDbGifs error:', e);
    }
  }, []);

  useEffect(() => { refreshDbGifs(); }, [refreshDbGifs]);

  const toggleFavorite = useCallback((id: string) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  }, []);
  const isFavorite = useCallback((id: string) => favorites.includes(id), [favorites]);
  const addCreatedGif = useCallback((gif: GifItem) => setCreatedGifs(prev => [gif, ...prev]), []);

  // Merge: newest created first, then DB, then defaults (de-duped by id)
  const allGifs = React.useMemo(() => {
    const seen = new Set<string>();
    const merged: GifItem[] = [];
    for (const g of [...createdGifs, ...dbGifs, ...GIFS]) {
      if (seen.has(g.id)) continue;
      seen.add(g.id);
      merged.push(g);
    }
    return merged;
  }, [createdGifs, dbGifs]);

  return (
    <FWDContext.Provider value={{
      favorites, toggleFavorite, isFavorite,
      createdGifs, addCreatedGif,
      dbGifs, refreshDbGifs,
      allGifs,
      supabaseReady: isSupabaseEnabled,
    }}>
      {children}
    </FWDContext.Provider>
  );
};

export const useFWD = () => {
  const ctx = useContext(FWDContext);
  if (!ctx) throw new Error('useFWD must be used inside FWDProvider');
  return ctx;
};
