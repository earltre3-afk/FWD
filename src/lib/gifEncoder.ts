/**
 * Browser GIF encoder using gif.js (loaded dynamically from CDN).
 * Captures frames from a <video> or <img> source, applies CSS filter + speed
 * + trim range, and produces an animated GIF Blob.
 */

const GIFJS_CDN = 'https://cdn.jsdelivr.net/npm/gif.js@0.2.0/dist/gif.js';
const GIFJS_WORKER_CDN = 'https://cdn.jsdelivr.net/npm/gif.js@0.2.0/dist/gif.worker.js';

let gifJsLoading: Promise<void> | null = null;

function loadGifJs(): Promise<void> {
  if ((window as any).GIF) return Promise.resolve();
  if (gifJsLoading) return gifJsLoading;
  gifJsLoading = new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = GIFJS_CDN;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error('Failed to load gif.js'));
    document.head.appendChild(s);
  });
  return gifJsLoading;
}

export type EncodeOptions = {
  width?: number;          // output width
  height?: number;         // output height
  fps?: number;            // frames per second to sample
  quality?: number;        // 1 (best) – 30 (worst)
  filterCss?: string;      // CSS filter() string e.g. "saturate(1.4) hue-rotate(20deg)"
  speed?: number;          // 0.5, 1, 2 — playback speed multiplier
  onProgress?: (p: number) => void; // 0..1
};

export type EncodeSource =
  | { kind: 'video'; url: string; startSec: number; endSec: number }
  | { kind: 'image'; url: string };

/** Load an HTMLVideoElement and wait for metadata. */
function loadVideo(url: string): Promise<HTMLVideoElement> {
  return new Promise((resolve, reject) => {
    const v = document.createElement('video');
    v.src = url;
    v.crossOrigin = 'anonymous';
    v.muted = true;
    v.playsInline = true;
    v.preload = 'auto';
    v.onloadedmetadata = () => resolve(v);
    v.onerror = () => reject(new Error('Failed to load video for encoding.'));
  });
}

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load image for encoding.'));
    img.src = url;
  });
}

function seek(video: HTMLVideoElement, t: number): Promise<void> {
  return new Promise((resolve) => {
    const onSeeked = () => {
      video.removeEventListener('seeked', onSeeked);
      // give the browser one frame to paint
      requestAnimationFrame(() => resolve());
    };
    video.addEventListener('seeked', onSeeked);
    try {
      video.currentTime = Math.min(Math.max(t, 0), Math.max(0, video.duration - 0.01));
    } catch {
      resolve();
    }
  });
}

/**
 * Encode source to animated GIF Blob.
 */
export async function encodeToGif(
  source: EncodeSource,
  opts: EncodeOptions = {}
): Promise<{ blob: Blob; width: number; height: number; duration: number; thumbnailBlob: Blob | null }> {
  await loadGifJs();
  const GIF = (window as any).GIF;
  if (!GIF) throw new Error('gif.js failed to initialize.');

  const fps = Math.max(4, Math.min(20, opts.fps ?? 10));
  const speed = Math.max(0.25, Math.min(4, opts.speed ?? 1));

  // Determine size + frame schedule
  let width = opts.width ?? 360;
  let height = opts.height ?? 360;
  let frames: number[] = []; // times in source seconds to sample
  let duration = 0;

  let video: HTMLVideoElement | null = null;
  let image: HTMLImageElement | null = null;

  if (source.kind === 'video') {
    video = await loadVideo(source.url);
    const vw = video.videoWidth || 480;
    const vh = video.videoHeight || 480;
    // fit into a square (1:1) by cropping center later
    const target = Math.min(opts.width ?? 360, 480);
    width = target; height = target;

    const start = Math.max(0, Math.min(source.startSec, video.duration));
    const end = Math.max(start + 0.2, Math.min(source.endSec, video.duration));
    duration = (end - start) / speed;

    const numFrames = Math.max(2, Math.min(60, Math.round((end - start) * fps)));
    const step = (end - start) / numFrames;
    for (let i = 0; i < numFrames; i++) frames.push(start + i * step);
    // attach for capture
    (video as any).__vw = vw;
    (video as any).__vh = vh;
  } else {
    image = await loadImage(source.url);
    width = opts.width ?? Math.min(image.naturalWidth, 480);
    height = opts.height ?? Math.min(image.naturalHeight, 480);
    // Single still image rendered as a 1-frame GIF
    frames = [0];
    duration = 1 / speed;
  }

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context unavailable.');

  const drawCovered = (src: CanvasImageSource, sw: number, sh: number) => {
    // Apply filter
    (ctx as any).filter = opts.filterCss && opts.filterCss !== 'none' ? opts.filterCss : 'none';
    ctx.clearRect(0, 0, width, height);
    // cover-fit (crop to fill)
    const scale = Math.max(width / sw, height / sh);
    const dw = sw * scale, dh = sh * scale;
    const dx = (width - dw) / 2, dy = (height - dh) / 2;
    ctx.drawImage(src, dx, dy, dw, dh);
  };

  const gif = new GIF({
    workers: 2,
    quality: opts.quality ?? 10,
    width,
    height,
    workerScript: GIFJS_WORKER_CDN,
    transparent: null,
    repeat: 0,
  });

  const frameDelay = Math.round((1000 / fps) / speed);

  let thumbnailBlob: Blob | null = null;

  // Capture frames sequentially
  for (let i = 0; i < frames.length; i++) {
    if (video) {
      await seek(video, frames[i]);
      drawCovered(video, (video as any).__vw, (video as any).__vh);
    } else if (image) {
      drawCovered(image, image.naturalWidth, image.naturalHeight);
    }
    gif.addFrame(ctx, { copy: true, delay: frameDelay });
    if (i === 0) {
      thumbnailBlob = await new Promise<Blob | null>((res) =>
        canvas.toBlob((b) => res(b), 'image/jpeg', 0.85)
      );
    }
    opts.onProgress?.((i + 1) / (frames.length * 2)); // first half = capture
  }

  // Render
  const blob: Blob = await new Promise((resolve, reject) => {
    gif.on('progress', (p: number) => {
      // second half = rendering
      opts.onProgress?.(0.5 + p * 0.5);
    });
    gif.on('finished', (b: Blob) => resolve(b));
    gif.on('abort', () => reject(new Error('GIF rendering aborted.')));
    gif.render();
  });

  return { blob, width, height, duration, thumbnailBlob };
}
