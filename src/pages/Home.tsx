import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, TrendingUp, Sparkles, Smile, Film, Music, Tv, Trophy, Gamepad2, Upload, Camera, ChevronRight, User } from 'lucide-react';
import PageShell from '@/components/PageShell';
import FWDLogo from '@/components/FWDLogo';
import BottomNav from '@/components/BottomNav';
import GifCard from '@/components/GifCard';
import { CATEGORIES, MOODS } from '@/data/gifs';
import { useFWD } from '@/contexts/FWDContext';
import { useAuth } from '@/contexts/AuthContext';


const catIcons: Record<string, any> = {
  Trending: TrendingUp, New: Sparkles, Reactions: Smile, Clips: Film,
  Memes: Smile, Music: Music, 'TV & Movies': Tv, Sports: Trophy, Gaming: Gamepad2,
};

const Home: React.FC = () => {
  const nav = useNavigate();
  const { allGifs } = useFWD();
  const { user, profile } = useAuth();
  const [query, setQuery] = useState('');
  const [activeCat, setActiveCat] = useState('Trending');
  const [activeMood, setActiveMood] = useState<string | null>(null);

  const visible = useMemo(() => {
    let list = allGifs;
    if (activeMood) list = list.filter(g => g.mood === activeMood);
    else if (activeCat !== 'Trending' && activeCat !== 'New') list = list.filter(g => g.category === activeCat);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(g => g.title.toLowerCase().includes(q) || g.tags.some(t => t.toLowerCase().includes(q)));
    }
    return list;
  }, [allGifs, activeCat, activeMood, query]);


  return (
    <PageShell>
      <div className="px-4 pb-32 pt-6 lg:px-8 lg:pb-12 lg:pt-10">
        {/* Header */}
        <div className="flex items-center justify-between">
          <FWDLogo size="md" className="lg:hidden" />
          <h1 className="hidden text-2xl font-black lg:block">Discover</h1>
          <div className="flex items-center gap-3">
            <button
              className="relative grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-black/60 text-fuchsia-300 backdrop-blur"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-fuchsia-500 shadow-[0_0_8px_rgba(217,70,239,1)]" />
            </button>
            {user && profile ? (
              <button
                onClick={() => nav('/profile')}
                className="hidden h-10 w-10 overflow-hidden rounded-full border-2 border-fuchsia-500/50 lg:block"
              >
                {profile.avatar_url ? (
                  <img src={profile.avatar_url} alt={profile.display_name} className="h-full w-full object-cover" />
                ) : (
                  <div className="grid h-full w-full place-items-center bg-gradient-to-br from-fuchsia-600 to-purple-600 text-white">
                    <User className="h-5 w-5" />
                  </div>
                )}
              </button>
            ) : (
              <button
                onClick={() => nav('/login')}
                className="hidden rounded-full bg-gradient-to-r from-fuchsia-600 to-purple-600 px-4 py-2 text-sm font-bold lg:block"
              >
                Sign In
              </button>
            )}
          </div>
        </div>

        {/* Search */}
        <form
          onSubmit={(e) => { e.preventDefault(); nav(`/search?q=${encodeURIComponent(query)}`); }}
          className="mt-6"
        >
          <div className="flex items-center gap-3 rounded-2xl border border-fuchsia-500/40 bg-black/60 px-4 py-3 backdrop-blur-xl shadow-[0_0_24px_rgba(168,85,247,0.25)]">
            <Search className="h-5 w-5 text-white/60" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search GIFs, reactions, memes…"
              className="w-full bg-transparent text-sm outline-none placeholder:text-white/40"
            />
            <Sparkles className="h-4 w-4 text-cyan-300" />
          </div>
        </form>

        {/* Category chips */}
        <div className="mt-5 flex flex-wrap gap-2">
          {CATEGORIES.map(c => {
            const Icon = catIcons[c] || Sparkles;
            const active = activeCat === c;
            return (
              <button
                key={c}
                onClick={() => { setActiveCat(c); setActiveMood(null); }}
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                  active
                    ? 'border-fuchsia-400 bg-gradient-to-r from-fuchsia-600/40 to-purple-600/40 text-white shadow-[0_0_18px_rgba(217,70,239,0.5)]'
                    : 'border-white/10 bg-black/40 text-white/70 hover:border-fuchsia-500/50 hover:text-white'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {c}
              </button>
            );
          })}
        </div>

        {/* Trending grid */}
        <div className="mt-7 flex items-end justify-between">
          <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-white/60 lg:text-sm">Trending Now</h2>
          <button onClick={() => nav('/search')} className="inline-flex items-center text-xs font-semibold text-fuchsia-300 lg:text-sm">
            See All <ChevronRight className="h-3 w-3 lg:h-4 lg:w-4" />
          </button>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 lg:gap-4">
          {visible.slice(0, 12).map(g => (
            <GifCard key={g.id} gif={g} onClick={(gif) => nav(`/detail/${gif.id}`)} />
          ))}
        </div>
        {visible.length === 0 && (
          <div className="mt-6 rounded-2xl border border-white/10 bg-black/50 p-8 text-center backdrop-blur lg:p-12">
            <p className="text-sm text-white/70 lg:text-base">No reaction found yet.</p>
            <button onClick={() => nav('/create')} className="mt-3 rounded-full bg-fuchsia-600 px-5 py-2 text-xs font-bold lg:px-6 lg:py-3 lg:text-sm">Create one</button>
          </div>
        )}

        {/* Moods */}
        <h2 className="mt-9 text-xs font-bold uppercase tracking-[0.3em] text-white/60 lg:text-sm">How are you feeling?</h2>
        <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-8 lg:gap-3">
          {MOODS.map(m => {
            const active = activeMood === m.label;
            return (
              <button
                key={m.label}
                onClick={() => { setActiveMood(active ? null : m.label); setActiveCat('Trending'); }}
                className={`flex flex-col items-center gap-1 rounded-2xl border p-2 transition lg:p-3 ${
                  active ? 'border-fuchsia-400 bg-fuchsia-500/15 shadow-[0_0_18px_rgba(217,70,239,0.4)]' : 'border-white/10 bg-black/50 hover:border-fuchsia-500/50'
                }`}
              >
                <div className={`grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br ${m.color} text-lg shadow-[0_0_12px_rgba(255,255,255,0.15)] lg:h-12 lg:w-12 lg:text-xl`}>
                  <span>{m.emoji}</span>
                </div>
                <span className="text-[10px] font-semibold text-white/80 lg:text-xs">{m.label}</span>
              </button>
            );
          })}
        </div>

        {/* Quick actions */}
        <div className="mt-8 grid grid-cols-3 gap-3 lg:gap-4">
          {[
            { icon: Upload, label: 'UPLOAD', sub: 'From your gallery', color: 'from-fuchsia-500/60 to-purple-700/40', glow: 'rgba(217,70,239,0.55)', onClick: () => nav('/create?from=upload') },
            { icon: Camera, label: 'CAMERA', sub: 'Capture the moment', color: 'from-cyan-400/60 to-blue-700/40', glow: 'rgba(34,211,238,0.5)', onClick: () => nav('/camera') },
            { icon: null, label: 'CREATE', sub: 'Make it FWD', color: 'from-pink-500/60 to-fuchsia-700/40', glow: 'rgba(236,72,153,0.55)', onClick: () => nav('/create') },
          ].map((a, i) => (
            <button
              key={i}
              onClick={a.onClick}
              className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br ${a.color} p-4 text-left backdrop-blur-xl transition hover:-translate-y-1 lg:p-6`}
              style={{ boxShadow: `0 0 28px ${a.glow}` }}
            >
              <div className="mb-6 grid h-12 w-12 place-items-center rounded-2xl border border-white/20 bg-black/40 lg:h-14 lg:w-14">
                {a.icon ? <a.icon className="h-6 w-6 text-white lg:h-7 lg:w-7" /> : <FWDLogo size="sm" showText={false} />}
              </div>
              <p className="text-sm font-black tracking-wider text-white lg:text-base">{a.label}</p>
              <p className="text-[10px] text-white/70 lg:text-xs">{a.sub}</p>
            </button>
          ))}
        </div>
      </div>
      <BottomNav />
    </PageShell>
  );
};

export default Home;
