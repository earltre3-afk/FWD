import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Sparkles, Bookmark, Camera, Share2, ArrowRight, Zap } from 'lucide-react';
import FWDLogo from '@/components/FWDLogo';
import PageShell from '@/components/PageShell';
import { GIFS } from '@/data/gifs';

const features = [
  { icon: Search, title: 'Search', desc: 'Find the perfect reaction.', glow: 'from-fuchsia-500/40 to-purple-500/10' },
  { icon: Sparkles, title: 'Create', desc: 'Turn moments into movement.', glow: 'from-pink-500/40 to-fuchsia-500/10' },
  { icon: Bookmark, title: 'Save', desc: 'Your reaction vault.', glow: 'from-cyan-400/30 to-blue-500/10' },
  { icon: Camera, title: 'Camera', desc: 'Capture the vibe.', glow: 'from-purple-500/40 to-pink-500/10' },
  { icon: Share2, title: 'Share', desc: 'Send the vibe anywhere.', glow: 'from-blue-500/40 to-cyan-400/10' },
];

const Landing: React.FC = () => {
  const nav = useNavigate();

  return (
    <PageShell>
      <div className="px-5 pt-10 pb-24">
        {/* Hero */}
        <div className="flex flex-col items-center text-center">
          <FWDLogo size="xl" />
          <h1 className="mt-8 bg-gradient-to-r from-fuchsia-300 via-pink-300 to-cyan-300 bg-clip-text text-4xl font-black tracking-tight text-transparent sm:text-5xl md:text-6xl">
            Express. Connect. Forward.
          </h1>
          <p className="mt-4 max-w-md text-base text-white/70 sm:text-lg">
            The future of GIFs. Create it. Clip it. Forward it.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={() => nav('/home')}
              className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-fuchsia-600 via-purple-600 to-pink-600 px-7 py-4 text-base font-bold text-white shadow-[0_0_30px_rgba(217,70,239,0.55)] transition hover:shadow-[0_0_45px_rgba(217,70,239,0.85)]"
            >
              <Zap className="h-5 w-5" />
              Explore GIFs
              <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" />
            </button>
            <button
              onClick={() => nav('/create')}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-fuchsia-500/50 bg-black/40 px-7 py-4 text-base font-bold text-white backdrop-blur-xl transition hover:border-fuchsia-400 hover:bg-fuchsia-500/10"
            >
              <Sparkles className="h-5 w-5 text-fuchsia-300" />
              Create GIF
            </button>
          </div>

          <button
            onClick={() => nav('/demo')}
            className="mt-4 text-xs text-cyan-300/80 underline-offset-4 hover:underline"
          >
            See the embeddable picker demo →
          </button>
        </div>

        {/* Feature cards */}
        <div className="mt-14">
          <h2 className="mb-5 text-xs font-bold uppercase tracking-[0.3em] text-white/50">Everything FWD</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
            {features.map(f => (
              <div
                key={f.title}
                className={`relative overflow-hidden rounded-2xl border border-white/10 bg-black/60 p-4 backdrop-blur-xl transition hover:border-fuchsia-400/60 hover:-translate-y-1`}
              >
                <div className={`absolute -inset-px -z-10 bg-gradient-to-br ${f.glow} opacity-50`} />
                <div className="mb-3 grid h-10 w-10 place-items-center rounded-xl border border-fuchsia-500/40 bg-black/60 text-fuchsia-300 shadow-[0_0_18px_rgba(217,70,239,0.4)]">
                  <f.icon className="h-5 w-5" />
                </div>
                <p className="text-sm font-bold text-white">{f.title}</p>
                <p className="mt-1 text-xs text-white/60">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* GIF preview strip */}
        <div className="mt-14">
          <div className="mb-4 flex items-end justify-between">
            <h2 className="text-2xl font-black tracking-tight">Trending now</h2>
            <button onClick={() => nav('/home')} className="text-sm font-semibold text-fuchsia-300 hover:text-fuchsia-200">
              See all →
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {GIFS.slice(0, 8).map(g => (
              <button
                key={g.id}
                onClick={() => nav(`/detail/${g.id}`)}
                className="group relative aspect-square overflow-hidden rounded-2xl border border-white/10 bg-black/60"
              >
                <img src={g.thumbnailUrl} alt={g.altText} className="absolute inset-0 h-full w-full object-cover transition group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <span className="absolute bottom-2 left-2 text-xs font-bold text-white drop-shadow">{g.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* CTA banner */}
        <div className="relative mt-16 overflow-hidden rounded-3xl border border-fuchsia-500/30 bg-gradient-to-br from-fuchsia-900/40 via-purple-900/30 to-cyan-900/30 p-8 backdrop-blur-xl">
          <div className="absolute -right-12 -top-12 h-56 w-56 rounded-full bg-fuchsia-500/30 blur-3xl" />
          <div className="absolute -left-12 -bottom-12 h-56 w-56 rounded-full bg-cyan-400/20 blur-3xl" />
          <div className="relative flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-2xl font-black sm:text-3xl">Forward the feeling.</h3>
              <p className="mt-1 text-sm text-white/70">Turn moments into movement. Powered by FWD.</p>
            </div>
            <button
              onClick={() => nav('/home')}
              className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-black hover:bg-fuchsia-100"
            >
              Enter the app <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <footer className="mt-12 flex flex-col items-center gap-2 text-center text-xs text-white/40">
          <FWDLogo size="sm" />
          <p>© {new Date().getFullYear()} FWD. Forward the moment.</p>
        </footer>
      </div>
    </PageShell>
  );
};

export default Landing;
