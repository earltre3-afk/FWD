import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Bell, Scissors, Crop, Type, Smile, Gauge, SlidersHorizontal, Upload, Camera, Play, Pause, X, Globe, Lock, ChevronRight, AlertTriangle, Loader2, Database } from 'lucide-react';
import PageShell from '@/components/PageShell';
import FWDLogo from '@/components/FWDLogo';
import { CATEGORIES, GIFS } from '@/data/gifs';
import { useFWD } from '@/contexts/FWDContext';
import { encodeToGif } from '@/lib/gifEncoder';
import { uploadGifBlob, insertGifRow, isSupabaseEnabled } from '@/lib/supabase';

const tools = [
  { key: 'trim', label: 'Trim', icon: Scissors },
  { key: 'crop', label: 'Crop', icon: Crop },
  { key: 'text', label: 'Text', icon: Type },
  { key: 'stickers', label: 'Stickers', icon: Smile },
  { key: 'speed', label: 'Speed', icon: Gauge },
  { key: 'filters', label: 'Filters', icon: SlidersHorizontal },
];

const filters = ['None', 'Neon', 'Cyber', 'Glitch', 'Vapor', 'Noir'];
const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];

const Create: React.FC = () => {
  const nav = useNavigate();
  const loc = useLocation();
  const { addCreatedGif, refreshDbGifs } = useFWD();
  const fileRef = useRef<HTMLInputElement>(null);
  const videoProbeRef = useRef<HTMLVideoElement | null>(null);

  const incomingClip = (loc.state as any)?.clipUrl as string | undefined;
  const [mediaUrl, setMediaUrl] = useState<string>(incomingClip || GIFS[0].mediaUrl);
  const [isVideoSource, setIsVideoSource] = useState<boolean>(Boolean(incomingClip));
  const [sourceDuration, setSourceDuration] = useState<number>(5);
  const [tool, setTool] = useState('trim');
  const [trimStart, setTrimStart] = useState(0.15);
  const [trimEnd, setTrimEnd] = useState(0.85);
  const [filter, setFilter] = useState('Neon');
  const [speed, setSpeed] = useState(1);
  const [title, setTitle] = useState('Vibes Only');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(['vibes', 'neon', 'night', 'city', 'cool']);
  const [category, setCategory] = useState('Reactions');
  const [isPublic, setIsPublic] = useState(true);
  const [playing, setPlaying] = useState(true);
  const [created, setCreated] = useState(false);
  const [encoding, setEncoding] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressStage, setProgressStage] = useState<'idle' | 'encoding' | 'uploading' | 'saving' | 'done'>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if ((loc.state as any)?.clipUrl) {
      setMediaUrl((loc.state as any).clipUrl);
      setIsVideoSource(true);
    }
  }, [loc.state]);

  // Probe video duration whenever a video source is loaded
  useEffect(() => {
    if (!isVideoSource) { setSourceDuration(5); return; }
    const v = document.createElement('video');
    v.src = mediaUrl;
    v.muted = true;
    v.preload = 'metadata';
    v.onloadedmetadata = () => {
      if (Number.isFinite(v.duration) && v.duration > 0) setSourceDuration(v.duration);
    };
    videoProbeRef.current = v;
  }, [mediaUrl, isVideoSource]);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    setMediaUrl(url);
    setIsVideoSource(f.type.startsWith('video/'));
  };

  const filterStyle = (() => {
    switch (filter) {
      case 'Neon': return 'saturate(1.4) contrast(1.1) hue-rotate(-10deg)';
      case 'Cyber': return 'saturate(1.5) contrast(1.2) hue-rotate(30deg)';
      case 'Glitch': return 'saturate(1.2) contrast(1.4)';
      case 'Vapor': return 'saturate(1.6) hue-rotate(290deg)';
      case 'Noir': return 'grayscale(1) contrast(1.2)';
      default: return 'none';
    }
  })();

  const addTag = (t: string) => {
    const v = t.trim().toLowerCase().replace(/^#/, '');
    if (!v || tags.includes(v)) return;
    setTags([...tags, v]);
  };

  const handleCreate = async () => {
    if (encoding) return;
    setErrorMsg(null);
    setEncoding(true);
    setProgressStage('encoding');
    setProgress(0);
    try {
      // 1) Encode to animated GIF in the browser
      const source = isVideoSource
        ? { kind: 'video' as const, url: mediaUrl, startSec: trimStart * sourceDuration, endSec: trimEnd * sourceDuration }
        : { kind: 'image' as const, url: mediaUrl };

      const { blob, width, height, duration, thumbnailBlob } = await encodeToGif(source, {
        width: 360,
        height: 360,
        fps: 10,
        quality: 10,
        filterCss: filterStyle,
        speed,
        onProgress: (p) => setProgress(p),
      });

      // 2) Upload to storage (Supabase if configured, else local blob URL fallback)
      setProgressStage('uploading');
      const safeTitle = (title || 'fwd').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '');
      const mediaPublicUrl = await uploadGifBlob(blob, `${safeTitle}.gif`, 'image/gif');
      let thumbPublicUrl: string | null = null;
      if (thumbnailBlob) {
        try {
          thumbPublicUrl = await uploadGifBlob(thumbnailBlob, `${safeTitle}-thumb.jpg`, 'image/jpeg');
        } catch { /* non-fatal */ }
      }

      // 3) Persist metadata in DB (no-op if Supabase not configured)
      setProgressStage('saving');
      let dbRowId: string | null = null;
      if (isSupabaseEnabled) {
        try {
          const row = await insertGifRow({
            title: title || 'Untitled FWD',
            tags,
            category,
            duration,
            is_public: isPublic,
            media_url: mediaPublicUrl,
            thumbnail_url: thumbPublicUrl || mediaPublicUrl,
            width, height,
            format: 'gif',
            alt_text: title,
          });
          dbRowId = row?.id || null;
        } catch (e: any) {
          // Surface but don't block — gif still saved locally
          console.warn('[FWD] insertGifRow failed:', e?.message);
          setErrorMsg(e?.message || 'Saved locally — database insert failed.');
        }
      }

      // 4) Add to local feed
      addCreatedGif({
        id: dbRowId || `created-${Date.now()}`,
        title: title || 'Untitled FWD',
        mediaUrl: mediaPublicUrl,
        previewUrl: mediaPublicUrl,
        thumbnailUrl: thumbPublicUrl || mediaPublicUrl,
        width, height, duration,
        format: 'gif',
        altText: title,
        tags,
        category,
      });

      // 5) Refresh public feed for trending
      if (isPublic) refreshDbGifs();

      setProgressStage('done');
      setProgress(1);
      setCreated(true);
      setTimeout(() => nav('/profile'), 1400);
    } catch (e: any) {
      console.error('[FWD] create failed:', e);
      setErrorMsg(e?.message || 'Something went wrong while creating your GIF.');
    } finally {
      setEncoding(false);
    }
  };


  return (
    <PageShell>
      <div className="px-4 pb-12 pt-6 lg:px-8 lg:pb-16 lg:pt-10">
        <div className="flex items-center justify-between">
          <button onClick={() => nav(-1)} className="grid h-10 w-10 place-items-center rounded-2xl border border-white/10 bg-black/60 backdrop-blur lg:h-12 lg:w-12">
            <ArrowLeft className="h-5 w-5 lg:h-6 lg:w-6" />
          </button>
          <FWDLogo size="md" className="lg:hidden" />
          <h1 className="hidden text-2xl font-black lg:block">Create GIF</h1>
          <button className="grid h-10 w-10 place-items-center rounded-2xl border border-white/10 bg-black/60 text-fuchsia-300 backdrop-blur lg:h-12 lg:w-12" aria-label="Notifications">
            <Bell className="h-5 w-5 lg:h-6 lg:w-6" />
          </button>
        </div>

        <div className="mt-4 text-center lg:hidden">
          <p className="text-xs font-bold uppercase tracking-[0.45em] text-white/60">Create GIF</p>
          <p className="mt-1 text-sm text-white/50">Turn your moment into a loop.</p>
        </div>

        {/* Desktop layout grid */}
        <div className="lg:mt-8 lg:grid lg:grid-cols-2 lg:gap-8 xl:gap-12">

        {/* Upload row */}
        <div className="mt-5 grid grid-cols-2 gap-3">
          <button onClick={() => fileRef.current?.click()} className="flex items-center justify-center gap-2 rounded-2xl border border-fuchsia-500/30 bg-black/60 py-3 text-sm font-semibold hover:border-fuchsia-400">
            <Upload className="h-4 w-4 text-fuchsia-300" /> Upload media
          </button>
          <button onClick={() => nav('/camera')} className="flex items-center justify-center gap-2 rounded-2xl border border-cyan-500/30 bg-black/60 py-3 text-sm font-semibold hover:border-cyan-400">
            <Camera className="h-4 w-4 text-cyan-300" /> Open camera
          </button>
          <input ref={fileRef} type="file" accept="image/*,video/*" hidden onChange={handleFile} />
        </div>

        {/* Preview */}
        <div className="relative mt-4 overflow-hidden rounded-3xl border border-fuchsia-500/30 bg-black shadow-[0_0_30px_rgba(217,70,239,0.35)]">
          <div className="relative aspect-square">
            {mediaUrl.endsWith('.mp4') || mediaUrl.startsWith('blob:') ? (
              <video src={mediaUrl} className="absolute inset-0 h-full w-full object-cover" autoPlay={playing} loop muted playsInline style={{ filter: filterStyle }} />
            ) : (
              <img src={mediaUrl} alt="preview" className="absolute inset-0 h-full w-full object-cover" style={{ filter: filterStyle }} />
            )}
            <span className="absolute left-3 top-3 rounded-md border border-white/15 bg-black/60 px-2 py-0.5 text-[10px] font-bold">1:1</span>
            <button onClick={() => setPlaying(p => !p)} className="absolute bottom-3 left-3 grid h-10 w-10 place-items-center rounded-full bg-black/70 backdrop-blur">
              {playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" fill="currentColor" />}
            </button>
            <span className="absolute bottom-3 right-3 rounded-md bg-black/70 px-2 py-1 text-xs font-mono">00:0{Math.round(trimStart * 5)} / 00:05</span>
          </div>
        </div>

        {/* Timeline */}
        <div className="mt-4 rounded-2xl border border-white/10 bg-black/50 p-3 backdrop-blur">
          <div className="relative h-14 overflow-hidden rounded-xl bg-black">
            <div className="absolute inset-0 flex">
              {Array.from({ length: 10 }).map((_, i) => (
                <img key={i} src={mediaUrl} className="h-full w-[10%] object-cover opacity-50" alt="" />
              ))}
            </div>
            <div
              className="absolute top-0 bottom-0 border-2 border-cyan-400 bg-cyan-400/10 shadow-[0_0_18px_rgba(34,211,238,0.7)]"
              style={{ left: `${trimStart * 100}%`, right: `${(1 - trimEnd) * 100}%` }}
            >
              <span className="absolute -left-2 top-1/2 -translate-y-1/2 h-8 w-3 rounded-md bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,1)]" />
              <span className="absolute -right-2 top-1/2 -translate-y-1/2 h-8 w-3 rounded-md bg-fuchsia-500 shadow-[0_0_12px_rgba(217,70,239,1)]" />
            </div>
          </div>
          <div className="mt-2 flex gap-3">
            <label className="flex-1 text-xs">
              <span className="text-white/60">Start</span>
              <input type="range" min={0} max={0.6} step={0.01} value={trimStart} onChange={(e) => setTrimStart(parseFloat(e.target.value))} className="w-full accent-fuchsia-500" />
            </label>
            <label className="flex-1 text-xs">
              <span className="text-white/60">End</span>
              <input type="range" min={0.4} max={1} step={0.01} value={trimEnd} onChange={(e) => setTrimEnd(parseFloat(e.target.value))} className="w-full accent-fuchsia-500" />
            </label>
          </div>
          <div className="mt-1 flex justify-between text-[10px] font-mono text-white/50">
            <span>00:00</span><span>00:02</span><span>00:05</span>
          </div>
        </div>

        {/* Tools */}
        <div className="mt-4 grid grid-cols-6 gap-2">
          {tools.map(t => {
            const active = tool === t.key;
            return (
              <button
                key={t.key}
                onClick={() => setTool(t.key)}
                className={`flex flex-col items-center gap-1 rounded-2xl border py-3 transition ${active ? 'border-fuchsia-400 bg-fuchsia-500/15 text-fuchsia-300 shadow-[0_0_18px_rgba(217,70,239,0.45)]' : 'border-white/10 bg-black/50 text-white/80 hover:border-fuchsia-500/40'}`}
              >
                <t.icon className="h-5 w-5" />
                <span className="text-[10px] font-semibold">{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tool panel */}
        <div className="mt-3 rounded-2xl border border-white/10 bg-black/50 p-4 backdrop-blur">
          {tool === 'filters' && (
            <div className="flex flex-wrap gap-2">
              {filters.map(f => (
                <button key={f} onClick={() => setFilter(f)} className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${filter === f ? 'border-fuchsia-400 bg-fuchsia-500/15 text-fuchsia-200' : 'border-white/10 text-white/70'}`}>{f}</button>
              ))}
            </div>
          )}
          {tool === 'speed' && (
            <div className="flex flex-wrap gap-2">
              {speeds.map(s => (
                <button key={s} onClick={() => setSpeed(s)} className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${speed === s ? 'border-fuchsia-400 bg-fuchsia-500/15 text-fuchsia-200' : 'border-white/10 text-white/70'}`}>{s}x</button>
              ))}
            </div>
          )}
          {tool === 'text' && (
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Add caption text…" className="w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-sm outline-none focus:border-fuchsia-400" />
          )}
          {tool === 'stickers' && (
            <div className="flex flex-wrap gap-2 text-2xl">{['🔥','💯','😎','🚀','👀','💜','⚡','🌟'].map(s => <button key={s} className="rounded-xl border border-white/10 bg-black/60 p-2 hover:border-fuchsia-500/50">{s}</button>)}</div>
          )}
          {tool === 'crop' && (
            <div className="flex gap-2">{['1:1','4:5','16:9','9:16'].map(c => <button key={c} className="rounded-full border border-white/10 bg-black/60 px-3 py-1.5 text-xs font-semibold hover:border-fuchsia-500/50">{c}</button>)}</div>
          )}
          {tool === 'trim' && (
            <p className="text-xs text-white/60">Drag the neon handles above to trim your clip.</p>
          )}
        </div>

        {/* Title */}
        <div className="mt-5 rounded-2xl border border-white/10 bg-black/50 p-4 backdrop-blur">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/60">Title</p>
          <div className="mt-1 flex items-center justify-between">
            <input value={title} onChange={(e) => setTitle(e.target.value.slice(0, 60))} className="w-full bg-transparent text-base font-semibold outline-none" placeholder="Name your GIF" />
            <span className="text-xs text-white/40">{title.length}/60</span>
          </div>
        </div>

        {/* Tags */}
        <div className="mt-3 rounded-2xl border border-white/10 bg-black/50 p-4 backdrop-blur">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/60">Tags</p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            {tags.map(t => (
              <span key={t} className="inline-flex items-center gap-1 rounded-full border border-fuchsia-500/30 bg-black/60 px-3 py-1 text-xs">
                {t}
                <button onClick={() => setTags(tags.filter(x => x !== t))} aria-label={`Remove ${t}`}><X className="h-3 w-3" /></button>
              </span>
            ))}
            <input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTag(tagInput); setTagInput(''); } }}
              placeholder="Add tag…"
              className="flex-1 min-w-[80px] bg-transparent text-sm outline-none placeholder:text-white/40"
            />
          </div>
        </div>

        {/* Category */}
        <div className="mt-3 rounded-2xl border border-white/10 bg-black/50 p-4 backdrop-blur">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/60">Category</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {CATEGORIES.map(c => (
              <button key={c} onClick={() => setCategory(c)} className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${category === c ? 'border-fuchsia-400 bg-fuchsia-500/15 text-fuchsia-200' : 'border-white/10 text-white/70'}`}>{c}</button>
            ))}
          </div>
        </div>

        {/* Public/Private */}
        <div className="mt-3 flex items-center justify-between rounded-2xl border border-white/10 bg-black/50 p-4 backdrop-blur">
          <div className="flex items-center gap-3">
            {isPublic ? <Globe className="h-5 w-5 text-cyan-300" /> : <Lock className="h-5 w-5 text-fuchsia-300" />}
            <div>
              <p className="text-sm font-bold">{isPublic ? 'Public' : 'Private'}</p>
              <p className="text-xs text-white/50">{isPublic ? 'Anyone can find it.' : 'Only you can see it.'}</p>
            </div>
          </div>
          <button
            onClick={() => setIsPublic(p => !p)}
            className={`relative h-7 w-12 rounded-full transition ${isPublic ? 'bg-gradient-to-r from-fuchsia-500 to-cyan-400' : 'bg-white/10'}`}
            aria-label="Toggle visibility"
          >
            <span className={`absolute top-0.5 h-6 w-6 rounded-full bg-white transition ${isPublic ? 'left-[22px]' : 'left-0.5'}`} />
          </button>
        </div>

        {/* DB status banner */}
        <div className="mt-5 flex items-start gap-2 rounded-2xl border border-white/10 bg-black/50 p-3 text-xs text-white/70 backdrop-blur">
          <Database className={`h-4 w-4 shrink-0 ${isSupabaseEnabled ? 'text-cyan-300' : 'text-amber-300'}`} />
          {isSupabaseEnabled ? (
            <p>Connected to cloud storage. Public GIFs appear in trending across devices.</p>
          ) : (
            <p>
              Cloud storage not configured — GIFs are still encoded and saved locally on this device.
              Add <code className="rounded bg-white/10 px-1">VITE_SUPABASE_URL</code> and
              <code className="ml-1 rounded bg-white/10 px-1">VITE_SUPABASE_ANON_KEY</code> to enable cross-device sync.
            </p>
          )}
        </div>

        {errorMsg && (
          <div className="mt-3 flex items-start gap-2 rounded-2xl border border-red-500/40 bg-red-500/10 p-3 text-xs text-red-200">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <p>{errorMsg}</p>
          </div>
        )}

        {/* Create CTA */}
        <button
          onClick={handleCreate}
          disabled={encoding}
          className={`mt-4 flex w-full items-center justify-center gap-3 rounded-2xl py-4 text-base font-black tracking-widest text-white transition ${
            encoding
              ? 'bg-white/10 cursor-not-allowed'
              : 'bg-gradient-to-r from-fuchsia-600 via-purple-600 to-pink-600 shadow-[0_0_30px_rgba(217,70,239,0.7)] hover:shadow-[0_0_45px_rgba(217,70,239,0.95)]'
          }`}
        >
          {encoding ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              {progressStage === 'encoding' && `ENCODING ${Math.round(progress * 100)}%`}
              {progressStage === 'uploading' && 'UPLOADING…'}
              {progressStage === 'saving' && 'SAVING TO DATABASE…'}
              {progressStage === 'done' && 'DONE'}
            </>
          ) : (
            <>
              CREATE GIF
              <FWDLogo size="sm" showText={false} />
              <ChevronRight className="h-5 w-5" />
            </>
          )}
        </button>

        {encoding && (
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
            <div className="h-full bg-gradient-to-r from-fuchsia-500 via-purple-500 to-cyan-400 transition-all" style={{ width: `${Math.round(progress * 100)}%` }} />
          </div>
        )}
      </div>

      {created && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/85 backdrop-blur">
          <div className="rounded-3xl border border-fuchsia-500/40 bg-black p-8 text-center shadow-[0_0_40px_rgba(217,70,239,0.6)]">
            <FWDLogo size="lg" />
            <p className="mt-4 text-xl font-black">FWD created.</p>
            <p className="mt-1 text-sm text-white/60">
              {isSupabaseEnabled ? 'Uploaded to the cloud. Forwarding to your profile…' : 'Saved locally. Forwarding to your profile…'}
            </p>
          </div>
        </div>
      )}
    </PageShell>
  );
};

export default Create;
