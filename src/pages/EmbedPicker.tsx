import React, { useEffect, useMemo, useState } from 'react';
import { X, Search as SearchIcon, Sparkles, TrendingUp, Smile, Music, Tv, Film } from 'lucide-react';
import FWDLogo from '@/components/FWDLogo';
import { GIFS, CATEGORIES, GifItem } from '@/data/gifs';

type Mode = 'compact' | 'full';

const readUsage = () => {
  const sp = new URLSearchParams(window.location.search);
  return {
    source: sp.get('source') || 'fwd_embed',
    context: sp.get('context') || 'message',
    userUid: sp.get('user_uid') || undefined,
    mode: sp.get('mode') || undefined,
  };
};

const targetOrigin = () => {
  try { return document.referrer ? new URL(document.referrer).origin : '*'; } catch { return '*'; }
};

const sendToHost = (payload: any) => {
  const origin = targetOrigin();
  try { window.parent?.postMessage(payload, origin); } catch {}
  try { window.opener?.postMessage(payload, origin); } catch {}
  window.dispatchEvent(new CustomEvent('fwd:picker', { detail: payload }));
};

const postSelected = (gif: GifItem) => {
  const payload = {
    type: 'FWD_GIF_SELECTED',
    provider: 'fwd',
    gif: {
      id: gif.id,
      title: gif.title,
      mediaUrl: gif.mediaUrl,
      previewUrl: gif.previewUrl,
      thumbnailUrl: gif.thumbnailUrl,
      width: gif.width,
      height: gif.height,
      duration: gif.duration,
      format: gif.format,
      altText: gif.altText,
      tags: gif.tags,
    },
    usage: readUsage(),
  };
  sendToHost(payload);
};

const postClosed = () => {
  sendToHost({ type: 'FWD_PICKER_CLOSED' });
};

const EmbedPicker: React.FC = () => {
  const [mode, setMode] = useState<Mode>('full');
  const [query, setQuery] = useState('');
  const [cat, setCat] = useState('Trending');
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    if (sp.get('mode') === 'compact') setMode('compact');
    if (sp.get('mode') === 'full') setMode('full');
  }, []);

  const list = useMemo(() => {
    let l = GIFS;
    if (cat !== 'Trending' && cat !== 'New') l = l.filter(g => g.category === cat);
    if (query.trim()) {
      const q = query.toLowerCase();
      l = l.filter(g => g.title.toLowerCase().includes(q) || g.tags.some(t => t.toLowerCase().includes(q)));
    }
    return l;
  }, [cat, query]);

  const handleSelect = (g: GifItem) => {
    setSelected(g.id);
    setTimeout(() => postSelected(g), 220);
  };

  const handleClose = () => {
    postClosed();
    if (window.history.length > 1) window.history.back();
  };

  return (
    <div className="relative min-h-screen w-full bg-transparent text-white">
      {/* Glass picker */}
      <div className="fixed inset-x-0 bottom-0 top-0 mx-auto flex max-w-md flex-col bg-gradient-to-b from-black/80 via-black/90 to-black/95 backdrop-blur-2xl sm:inset-x-4 sm:top-8 sm:bottom-8 sm:rounded-[32px] sm:border sm:border-fuchsia-500/30 sm:shadow-[0_0_50px_rgba(217,70,239,0.45)]">
        {/* Header */}
        <div className="flex items-center justify-between px-4 pt-5">
          <FWDLogo size="sm" />
          <button onClick={handleClose} className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-black/60 hover:bg-white/10" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Mode toggle */}
        <div className="mt-3 flex gap-2 px-4">
          <button
            onClick={() => setMode('compact')}
            className={`flex-1 rounded-full border px-3 py-1.5 text-xs font-semibold ${mode === 'compact' ? 'border-fuchsia-400 bg-fuchsia-500/15 text-fuchsia-200' : 'border-white/10 text-white/60'}`}
          >Compact</button>
          <button
            onClick={() => setMode('full')}
            className={`flex-1 rounded-full border px-3 py-1.5 text-xs font-semibold ${mode === 'full' ? 'border-fuchsia-400 bg-fuchsia-500/15 text-fuchsia-200' : 'border-white/10 text-white/60'}`}
          >Full</button>
        </div>

        {/* Search */}
        <div className="mx-4 mt-3 flex items-center gap-2 rounded-full border border-fuchsia-500/30 bg-black/70 px-4 py-2.5 backdrop-blur">
          <SearchIcon className="h-4 w-4 text-white/60" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search FWD GIFs…"
            className="w-full bg-transparent text-sm outline-none placeholder:text-white/40"
          />
          <Sparkles className="h-4 w-4 text-cyan-300" />
        </div>

        {/* Chips */}
        <div className="mt-3 flex gap-2 overflow-x-auto px-4 pb-2 no-scrollbar">
          {CATEGORIES.map(c => {
            const Icon = c === 'Trending' ? TrendingUp : c === 'Music' ? Music : c === 'TV & Movies' ? Tv : c === 'Clips' ? Film : Smile;
            const active = cat === c;
            return (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`shrink-0 inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-semibold ${active ? 'border-fuchsia-400 bg-fuchsia-500/15 text-fuchsia-200' : 'border-white/10 bg-black/40 text-white/70'}`}
              >
                <Icon className="h-3 w-3" />
                {c}
              </button>
            );
          })}
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto px-4 pb-6">
          <div className={`grid gap-2 ${mode === 'compact' ? 'grid-cols-3' : 'grid-cols-2'}`}>
            {list.map(g => (
              <button
                key={g.id}
                onClick={() => handleSelect(g)}
                className={`group relative aspect-square overflow-hidden rounded-xl border bg-black/60 transition ${selected === g.id ? 'border-fuchsia-400 shadow-[0_0_24px_rgba(217,70,239,0.7)] scale-95' : 'border-white/10 hover:border-fuchsia-400/60'}`}
              >
                <img src={g.thumbnailUrl} alt={g.altText} className="absolute inset-0 h-full w-full object-cover transition group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <span className="absolute left-1.5 top-1.5 rounded bg-black/70 px-1.5 py-0.5 text-[9px] font-bold tracking-widest">GIF</span>
              </button>
            ))}
          </div>
          {list.length === 0 && (
            <div className="mt-8 rounded-2xl border border-white/10 bg-black/50 p-6 text-center">
              <p className="text-sm font-bold">No reaction found yet.</p>
              <p className="mt-1 text-xs text-white/50">Try a different search.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-white/5 px-4 py-2 text-center text-[10px] text-white/40">
          Powered by FWD · Tap a GIF to forward it.
        </div>
      </div>
    </div>
  );
};

export default EmbedPicker;
