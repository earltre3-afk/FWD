import React, { useMemo, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, Bell, TrendingUp, Sparkles, Smile, Film, Music, Tv, Trophy, Gamepad2, Upload, Camera, ChevronRight, LogIn, User } from 'lucide-react';
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
      <div className="px-4 pb-32 pt-6">
        {/* Header with Auth */}
        <div className="flex items-center justify-between animate-slide-up">
          <FWDLogo size="md" />
          <div className="flex items-center gap-2">
            {user ? (
              <>
                <button
                  onClick={() => nav('/profile')}
                  className="relative grid h-10 w-10 place-items-center rounded-2xl liquid-glass text-fuchsia-300 hover:neon-glow-sm transition-all duration-300 hover:scale-105"
                  aria-label="Notifications"
                >
                  <Bell className="h-5 w-5" />
                  <span className="absolute right-1.5 top-1.5 h-2.5 w-2.5 rounded-full bg-fuchsia-500 neon-glow-sm animate-pulse" />
                </button>
                <button
                  onClick={() => nav('/profile')}
                  className="h-10 w-10 rounded-2xl overflow-hidden border-2 border-fuchsia-500/50 neon-glow-sm hover:neon-glow transition-all duration-300 hover:scale-105"
                >
                  {profile?.avatar_url ? (
                    <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-fuchsia-600 to-purple-700 grid place-items-center">
                      <User className="h-5 w-5 text-white" />
                    </div>
                  )}
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="group flex items-center gap-2 px-4 py-2 rounded-2xl liquid-glass neon-border hover:neon-glow transition-all duration-300 hover:scale-105 btn-ripple"
              >
                <LogIn className="h-4 w-4 text-fuchsia-300 group-hover:text-fuchsia-200 transition-colors" />
                <span className="text-sm font-semibold text-fuchsia-300 group-hover:text-fuchsia-200 transition-colors">Sign In</span>
              </Link>
            )}
          </div>
        </div>

        {/* Search with premium styling */}
        <form
          onSubmit={(e) => { e.preventDefault(); nav(`/search?q=${encodeURIComponent(query)}`); }}
          className="mt-6 animate-slide-up stagger-1"
        >
          <div className="flex items-center gap-3 rounded-2xl liquid-glass-strong neon-border px-4 py-3.5 transition-all duration-300 focus-within:neon-glow">
            <Search className="h-5 w-5 text-white/60" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search GIFs, reactions, memes..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-white/40 text-white"
            />
            <Sparkles className="h-4 w-4 text-cyan-300 animate-pulse" />
          </div>
        </form>

        {/* Category chips with stagger animation */}
        <div className="mt-5 flex flex-wrap gap-2 animate-slide-up stagger-2">
          {CATEGORIES.map((c, idx) => {
            const Icon = catIcons[c] || Sparkles;
            const active = activeCat === c;
            return (
              <button
                key={c}
                onClick={() => { setActiveCat(c); setActiveMood(null); }}
                className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all duration-300 hover:scale-105 ${
                  active
                    ? 'bg-gradient-to-r from-fuchsia-600/60 to-purple-600/60 text-white neon-glow-sm border border-fuchsia-400/50'
                    : 'liquid-glass text-white/70 hover:text-white hover:neon-glow-sm'
                }`}
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                <Icon className={`h-3.5 w-3.5 transition-transform duration-300 ${active ? 'animate-pulse' : ''}`} />
                {c}
              </button>
            );
          })}
        </div>

        {/* Trending grid */}
        <div className="mt-8 flex items-end justify-between animate-slide-up stagger-3">
          <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-white/60">Trending Now</h2>
          <button onClick={() => nav('/search')} className="group inline-flex items-center gap-1 text-xs font-semibold text-fuchsia-300 hover:text-fuchsia-200 transition-colors">
            See All <ChevronRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {visible.slice(0, 8).map((g, idx) => (
            <div key={g.id} className="animate-scale-in" style={{ animationDelay: `${idx * 0.1}s` }}>
              <GifCard gif={g} onClick={(gif) => nav(`/detail/${gif.id}`)} />
            </div>
          ))}
        </div>
        {visible.length === 0 && (
          <div className="mt-6 rounded-3xl liquid-glass-strong p-8 text-center animate-scale-in">
            <p className="text-sm text-white/70">No reaction found yet.</p>
            <button onClick={() => nav('/create')} className="mt-4 rounded-full bg-gradient-to-r from-fuchsia-600 to-purple-600 px-6 py-2.5 text-xs font-bold neon-glow-sm hover:neon-glow transition-all duration-300 hover:scale-105">
              Create one
            </button>
          </div>
        )}

        {/* Moods with premium styling */}
        <h2 className="mt-10 text-xs font-bold uppercase tracking-[0.3em] text-white/60 animate-slide-up stagger-4">How are you feeling?</h2>
        <div className="mt-3 grid grid-cols-4 gap-2.5 sm:grid-cols-8">
          {MOODS.map((m, idx) => {
            const active = activeMood === m.label;
            return (
              <button
                key={m.label}
                onClick={() => { setActiveMood(active ? null : m.label); setActiveCat('Trending'); }}
                className={`flex flex-col items-center gap-1.5 rounded-2xl p-2.5 transition-all duration-300 hover:scale-105 animate-scale-in ${
                  active ? 'liquid-glass-strong neon-glow-sm' : 'liquid-glass hover:neon-glow-sm'
                }`}
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                <div className={`grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br ${m.color} text-lg transition-transform duration-300 group-hover:scale-110 ${active ? 'neon-glow-sm' : ''}`}>
                  <span className={active ? 'animate-bounce' : ''}>{m.emoji}</span>
                </div>
                <span className={`text-[10px] font-semibold transition-colors ${active ? 'text-fuchsia-300' : 'text-white/70'}`}>{m.label}</span>
              </button>
            );
          })}
        </div>

        {/* Quick actions with premium cards */}
        <div className="mt-10 grid grid-cols-3 gap-3">
          {[
            { icon: Upload, label: 'UPLOAD', sub: 'From your gallery', gradient: 'from-fuchsia-600/80 via-purple-600/60 to-fuchsia-700/40', glow: 'rgba(217,70,239,0.4)', onClick: () => nav('/create?from=upload') },
            { icon: Camera, label: 'CAMERA', sub: 'Capture the moment', gradient: 'from-cyan-500/80 via-blue-500/60 to-cyan-600/40', glow: 'rgba(34,211,238,0.4)', onClick: () => nav('/camera') },
            { icon: null, label: 'CREATE', sub: 'Make it FWD', gradient: 'from-pink-500/80 via-fuchsia-500/60 to-pink-600/40', glow: 'rgba(236,72,153,0.4)', onClick: () => nav('/create') },
          ].map((a, i) => (
            <button
              key={i}
              onClick={a.onClick}
              className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${a.gradient} p-4 text-left transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] animate-slide-up card-shine`}
              style={{ 
                boxShadow: `0 0 30px ${a.glow}`,
                animationDelay: `${0.5 + i * 0.1}s`
              }}
            >
              {/* Glass overlay */}
              <div className="absolute inset-0 liquid-glass opacity-50" />
              
              {/* Animated border */}
              <div className="absolute inset-0 rounded-2xl neon-border opacity-50 group-hover:opacity-100 transition-opacity" />
              
              {/* Content */}
              <div className="relative z-10">
                <div className="mb-5 grid h-12 w-12 place-items-center rounded-2xl liquid-glass group-hover:neon-glow-sm transition-all duration-300">
                  {a.icon ? <a.icon className="h-6 w-6 text-white group-hover:scale-110 transition-transform" /> : <FWDLogo size="sm" showText={false} />}
                </div>
                <p className="text-sm font-black tracking-wider text-white">{a.label}</p>
                <p className="text-[10px] text-white/70">{a.sub}</p>
              </div>
              
              {/* Hover glow effect */}
              <div className="absolute -bottom-4 -right-4 h-24 w-24 rounded-full bg-white/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </button>
          ))}
        </div>
      </div>
      <BottomNav />
    </PageShell>
  );
};

export default Home;
