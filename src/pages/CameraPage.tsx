import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, RefreshCw, Check, RotateCcw, Camera as CameraIcon, Upload, Square } from 'lucide-react';
import FWDLogo from '@/components/FWDLogo';

type Facing = 'user' | 'environment';
type Stage = 'permission' | 'denied' | 'ready' | 'recording' | 'preview';

const MAX_SECONDS = 6;

const CameraPage: React.FC = () => {
  const nav = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const previewVideoRef = useRef<HTMLVideoElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const timerRef = useRef<number | null>(null);

  const [stage, setStage] = useState<Stage>('permission');
  const [facing, setFacing] = useState<Facing>('user');
  const [seconds, setSeconds] = useState(0);
  const [clipUrl, setClipUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const stopStream = () => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
  };

  const startCamera = async (next: Facing = facing) => {
    setError(null);
    try {
      stopStream();
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: next },
        audio: true,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => {});
      }
      setStage('ready');
    } catch (e: any) {
      console.warn(e);
      setStage('denied');
    }
  };

  useEffect(() => {
    startCamera('user');
    return () => {
      stopStream();
      if (timerRef.current) window.clearInterval(timerRef.current);
      if (clipUrl) URL.revokeObjectURL(clipUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const flipCamera = async () => {
    const next: Facing = facing === 'user' ? 'environment' : 'user';
    setFacing(next);
    await startCamera(next);
  };

  const startRecording = () => {
    if (!streamRef.current) return;
    chunksRef.current = [];
    try {
      const rec = new MediaRecorder(streamRef.current, { mimeType: 'video/webm' });
      rec.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      rec.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        setClipUrl(url);
        setStage('preview');
      };
      rec.start();
      recorderRef.current = rec;
      setSeconds(0);
      setStage('recording');
      timerRef.current = window.setInterval(() => {
        setSeconds(s => {
          const next = s + 1;
          if (next >= MAX_SECONDS) stopRecording();
          return next;
        });
      }, 1000);
    } catch (e) {
      setError('Recording not supported on this device.');
    }
  };

  const stopRecording = () => {
    if (timerRef.current) { window.clearInterval(timerRef.current); timerRef.current = null; }
    recorderRef.current?.state === 'recording' && recorderRef.current.stop();
  };

  const retake = () => {
    if (clipUrl) URL.revokeObjectURL(clipUrl);
    setClipUrl(null);
    setSeconds(0);
    setStage('ready');
  };

  const useClip = () => {
    nav('/create', { state: { clipUrl } });
  };

  const handleUploadFallback = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    nav('/create', { state: { clipUrl: url } });
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black text-white">
      {/* Camera live view */}
      <video
        ref={videoRef}
        playsInline
        muted
        className={`absolute inset-0 h-full w-full object-cover ${facing === 'user' ? 'scale-x-[-1]' : ''} ${stage === 'preview' ? 'hidden' : ''}`}
      />
      {stage === 'preview' && clipUrl && (
        <video
          ref={previewVideoRef}
          src={clipUrl}
          autoPlay
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}

      {/* Vignette + neon frame */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/70" />
      <div className="pointer-events-none absolute inset-4 rounded-3xl border border-fuchsia-500/30 shadow-[inset_0_0_40px_rgba(217,70,239,0.25)]" />

      {/* Top bar */}
      <div className="absolute left-0 right-0 top-0 z-10 flex items-center justify-between px-4 pt-6">
        <button onClick={() => nav(-1)} className="grid h-11 w-11 place-items-center rounded-2xl border border-white/10 bg-black/60 backdrop-blur">
          <X className="h-5 w-5" />
        </button>
        <FWDLogo size="sm" />
        <button onClick={flipCamera} className="flex flex-col items-center gap-0.5 rounded-2xl border border-white/10 bg-black/60 p-2 backdrop-blur" aria-label="Flip camera">
          <RefreshCw className="h-5 w-5" />
          <span className="text-[9px] font-semibold uppercase tracking-widest text-white/70">Flip</span>
        </button>
      </div>

      {/* Facing label */}
      <div className="absolute left-1/2 top-20 z-10 -translate-x-1/2 rounded-full border border-white/10 bg-black/60 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-white/80 backdrop-blur">
        {facing === 'user' ? 'Front camera' : 'Back camera'}
      </div>

      {/* Timer / max indicator */}
      {(stage === 'recording' || stage === 'ready') && (
        <div className="absolute left-1/2 top-32 z-10 -translate-x-1/2 flex flex-col items-center gap-1.5">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/70 px-3 py-1.5 backdrop-blur">
            <span className={`h-2 w-2 rounded-full ${stage === 'recording' ? 'bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,1)]' : 'bg-white/40'}`} />
            <span className="font-mono text-sm font-bold">{`00:0${seconds}`}</span>
            <span className="text-xs text-white/50">/ 00:0{MAX_SECONDS}</span>
          </div>
          <div className="h-1 w-40 overflow-hidden rounded-full bg-white/10">
            <div className="h-full bg-gradient-to-r from-fuchsia-500 to-cyan-400 transition-all" style={{ width: `${(seconds / MAX_SECONDS) * 100}%` }} />
          </div>
          <p className="text-[10px] text-white/50">Quick GIF: 1–6s</p>
        </div>
      )}

      {/* Center copy */}
      {stage === 'ready' && (
        <div className="absolute bottom-44 left-0 right-0 z-10 text-center">
          <p className="text-xl font-black">Record a reaction.</p>
          <p className="text-sm text-white/70">Capture the vibe.</p>
        </div>
      )}
      {stage === 'preview' && (
        <div className="absolute bottom-44 left-0 right-0 z-10 text-center">
          <p className="text-xl font-black">Turn this moment into a GIF.</p>
          <p className="text-sm text-white/70">Use this clip or retake.</p>
        </div>
      )}

      {/* Bottom controls */}
      {stage !== 'denied' && stage !== 'permission' && (
        <div className="absolute bottom-8 left-0 right-0 z-10 flex items-end justify-around px-6">
          <button
            onClick={retake}
            className="flex flex-col items-center gap-1 rounded-2xl border border-white/10 bg-black/60 p-3 backdrop-blur"
          >
            <RotateCcw className="h-6 w-6" />
            <span className="text-[10px] font-semibold uppercase tracking-widest text-white/80">Retake</span>
          </button>

          {stage !== 'preview' ? (
            <button
              onClick={stage === 'recording' ? stopRecording : startRecording}
              className="relative grid h-20 w-20 place-items-center rounded-full border-4 border-fuchsia-500/80 bg-black shadow-[0_0_30px_rgba(217,70,239,0.8)]"
              aria-label={stage === 'recording' ? 'Stop' : 'Record'}
            >
              <span className={`absolute inset-3 rounded-full ${stage === 'recording' ? 'bg-red-500' : 'bg-gradient-to-br from-fuchsia-500 to-pink-500'}`}>
                {stage === 'recording' && <Square className="absolute inset-0 m-auto h-6 w-6 text-white" fill="currentColor" />}
              </span>
            </button>
          ) : (
            <button
              onClick={() => { retake(); }}
              className="relative grid h-20 w-20 place-items-center rounded-full border-4 border-fuchsia-500/80 bg-black shadow-[0_0_30px_rgba(217,70,239,0.8)]"
              aria-label="Record again"
            >
              <CameraIcon className="h-8 w-8 text-fuchsia-300" />
            </button>
          )}

          <button
            onClick={stage === 'preview' ? useClip : () => {}}
            disabled={stage !== 'preview'}
            className={`flex flex-col items-center gap-1 rounded-2xl border p-3 backdrop-blur transition ${stage === 'preview' ? 'border-fuchsia-400 bg-fuchsia-500/15 text-fuchsia-200 shadow-[0_0_18px_rgba(217,70,239,0.5)]' : 'border-white/10 bg-black/60 text-white/40'}`}
          >
            <Check className="h-6 w-6" />
            <span className="text-[10px] font-semibold uppercase tracking-widest">Use Clip</span>
          </button>
        </div>
      )}

      {/* Permission denied */}
      {stage === 'denied' && (
        <div className="absolute inset-0 z-20 grid place-items-center bg-black/85 px-6 text-center backdrop-blur">
          <div className="max-w-sm rounded-3xl border border-fuchsia-500/40 bg-black p-6">
            <FWDLogo size="md" />
            <p className="mt-4 text-lg font-bold">Camera access is off.</p>
            <p className="mt-1 text-sm text-white/60">Enable it to record a quick GIF.</p>
            <div className="mt-5 flex flex-col gap-2">
              <button onClick={() => startCamera(facing)} className="rounded-xl bg-gradient-to-r from-fuchsia-600 to-pink-600 py-3 text-sm font-bold">Try again</button>
              <button onClick={() => fileRef.current?.click()} className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-black py-3 text-sm font-bold">
                <Upload className="h-4 w-4" /> Upload instead
              </button>
              <input ref={fileRef} type="file" accept="image/*,video/*" hidden onChange={handleUploadFallback} />
              <button onClick={() => nav(-1)} className="py-2 text-xs text-white/50">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {stage === 'permission' && (
        <div className="absolute inset-0 z-20 grid place-items-center bg-black/80 backdrop-blur">
          <div className="text-center">
            <FWDLogo size="md" />
            <p className="mt-3 text-sm text-white/70">Requesting camera access…</p>
          </div>
        </div>
      )}

      {error && (
        <div className="absolute bottom-4 left-1/2 z-30 -translate-x-1/2 rounded-full border border-red-500/50 bg-black/90 px-4 py-2 text-xs">
          {error}
        </div>
      )}
    </div>
  );
};

export default CameraPage;
