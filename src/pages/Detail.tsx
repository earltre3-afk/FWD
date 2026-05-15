import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Bell, Heart, Link2, Share2, Flag, Pause, Play, Maximize, Flame } from 'lucide-react';
import PageShell from '@/components/PageShell';
import FWDLogo from '@/components/FWDLogo';
import BottomNav from '@/components/BottomNav';
import GifCard from '@/components/GifCard';
import { GIFS } from '@/data/gifs';
import { useFWD } from '@/contexts/FWDContext';

const Detail: React.FC = () => {
  const nav = useNavigate();
  const { id } = useParams();
  const gif = GIFS.find(g => g.id === id) || GIFS[0];
  const related = GIFS.filter(g => g.id !== gif.id).slice(0, 4);
  const { isFavorite, toggleFavorite } = useFWD();
  const fav = isFavorite(gif.id);
  const [playing, setPlaying] = useState(true);
  const [toast, setToast] = useState<string | null>(null);
  const [reportOpen, setReportOpen] = useState(false);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  };

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/detail/${gif.id}`);
      showToast('Link copied');
    } catch { showToast('Copy unavailable'); }
  };
  const onShare = async () => {
    const data = { title: `FWD · ${gif.title}`, text: 'Forward the feeling.', url: `${window.location.origin}/detail/${gif.id}` };
    if (navigator.share) { try { await navigator.share(data); return; } catch {} }
    onCopy();
  };

  return (
    <PageShell>
      <div className="px-4 pb-32 pt-6">
        <div className="flex items-center justify-between">
          <button onClick={() => nav(-1)} className="grid h-10 w-10 place-items-center rounded-2xl border border-white/10 bg-black/60 backdrop-blur">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <FWDLogo size="md" />
          <button className="grid h-10 w-10 place-items-center rounded-2xl border border-white/10 bg-black/60 text-fuchsia-300 backdrop-blur" aria-label="Notifications">
            <Bell className="h-5 w-5" />
          </button>
        </div>

        {/* Preview */}
        <div className="relative mt-6 overflow-hidden rounded-3xl border border-fuchsia-500/30 bg-black/60 shadow-[0_0_40px_rgba(217,70,239,0.35)]">
          <img src={gif.mediaUrl} alt={gif.altText} className={`block w-full ${playing ? 'animate-[pulse_2s_ease-in-out_infinite]' : ''}`} />
          <span className="absolute left-3 top-3 rounded-md border border-white/15 bg-black/70 px-2 py-0.5 text-[10px] font-bold tracking-widest">GIF</span>
          <button onClick={() => setPlaying(p => !p)} className="absolute bottom-3 left-3 grid h-10 w-10 place-items-center rounded-full bg-black/70 backdrop-blur">
            {playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" fill="currentColor" />}
          </button>
          <button className="absolute bottom-3 right-3 grid h-10 w-10 place-items-center rounded-full bg-black/70 backdrop-blur" aria-label="Fullscreen">
            <Maximize className="h-5 w-5" />
          </button>
        </div>

        {/* Title row */}
        <div className="mt-5 flex items-start justify-between gap-3">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tight">{gif.title}</h1>
            <p className="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-fuchsia-300">
              <Flame className="h-4 w-4" /> Trending in {gif.category}
            </p>
          </div>
          <button
            onClick={() => toggleFavorite(gif.id)}
            className={`grid h-11 w-11 place-items-center rounded-2xl border transition ${fav ? 'border-fuchsia-400 bg-fuchsia-500/20 text-fuchsia-300 shadow-[0_0_18px_rgba(217,70,239,0.5)]' : 'border-white/10 bg-black/60 text-white/80'}`}
            aria-label="Favorite"
          >
            <Heart className="h-5 w-5" fill={fav ? 'currentColor' : 'none'} />
          </button>
        </div>

        {/* Tags */}
        <div className="mt-4 flex flex-wrap gap-2">
          {gif.tags.map(t => (
            <span key={t} className="rounded-full border border-white/10 bg-black/50 px-3 py-1 text-xs text-white/80">#{t}</span>
          ))}
        </div>

        {/* Actions */}
        <div className="mt-5 grid grid-cols-4 gap-2 rounded-2xl border border-fuchsia-500/30 bg-black/60 p-2 backdrop-blur-xl">
          {[
            { icon: Heart, label: 'Favorite', onClick: () => toggleFavorite(gif.id), active: fav },
            { icon: Link2, label: 'Copy Link', onClick: onCopy },
            { icon: Share2, label: 'Share', onClick: onShare },
            { icon: Flag, label: 'Report', onClick: () => setReportOpen(true) },
          ].map((a, i) => (
            <button
              key={i}
              onClick={a.onClick}
              className={`flex flex-col items-center gap-1 rounded-xl py-3 text-xs font-semibold transition hover:bg-white/5 ${a.active ? 'text-fuchsia-300' : 'text-white/85'}`}
            >
              <a.icon className="h-5 w-5" fill={a.active ? 'currentColor' : 'none'} />
              {a.label}
            </button>
          ))}
        </div>

        {/* Related */}
        <div className="mt-7 flex items-end justify-between">
          <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-white/60">More like this</h3>
          <button onClick={() => nav('/search')} className="text-xs font-semibold text-fuchsia-300">See All ›</button>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {related.map(g => (
            <GifCard key={g.id} gif={g} onClick={(x) => nav(`/detail/${x.id}`)} />
          ))}
        </div>
      </div>

      {toast && (
        <div className="fixed bottom-24 left-1/2 z-50 -translate-x-1/2 rounded-full border border-fuchsia-500/40 bg-black/90 px-4 py-2 text-sm shadow-[0_0_24px_rgba(217,70,239,0.6)] backdrop-blur">
          {toast}
        </div>
      )}

      {reportOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/80 p-4 backdrop-blur" onClick={() => setReportOpen(false)}>
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-sm rounded-3xl border border-fuchsia-500/40 bg-black p-6 shadow-[0_0_30px_rgba(217,70,239,0.4)]">
            <h3 className="text-lg font-bold">Report this GIF</h3>
            <p className="mt-1 text-sm text-white/60">Help us keep FWD safe. Why are you reporting?</p>
            <div className="mt-4 space-y-2">
              {['Inappropriate content', 'Spam or misleading', 'Copyright concern', 'Other'].map(r => (
                <button key={r} onClick={() => { setReportOpen(false); showToast('Report submitted'); }} className="block w-full rounded-xl border border-white/10 bg-black/50 px-4 py-2.5 text-left text-sm hover:border-fuchsia-500/50">
                  {r}
                </button>
              ))}
            </div>
            <button onClick={() => setReportOpen(false)} className="mt-4 w-full rounded-xl border border-white/10 py-2 text-sm text-white/70">Cancel</button>
          </div>
        </div>
      )}

      <BottomNav />
    </PageShell>
  );
};

export default Detail;
