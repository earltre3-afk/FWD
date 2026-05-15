import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Settings, BadgeCheck, Play, Bookmark, Layers, ChevronDown, MoreHorizontal, Heart, LogIn, Sparkles } from 'lucide-react';
import PageShell from '@/components/PageShell';
import FWDLogo from '@/components/FWDLogo';
import BottomNav from '@/components/BottomNav';
import { useFWD } from '@/contexts/FWDContext';
import { useAuth } from '@/contexts/AuthContext';
import { GIFS } from '@/data/gifs';

const DEFAULT_AVATAR = 'https://d64gsuwffb70l.cloudfront.net/6a066e9ff965bde632ec6ca8_1778806627123_e45f14cb.jpg';

type Tab = 'Created' | 'Saved' | 'Collections';

const Profile: React.FC = () => {
  const nav = useNavigate();
  const { createdGifs, favorites, allGifs } = useFWD();
  const { user, profile, loading: authLoading } = useAuth();
  const [tab, setTab] = useState<Tab>('Created');

  const savedGifs = allGifs.filter(g => favorites.includes(g.id));
  const shownCreated = createdGifs.length > 0 ? createdGifs : GIFS.slice(0, 6);

  // Show login prompt if not authenticated
  if (!authLoading && !user) {
    return (
      <PageShell>
        <div className="px-4 pb-32 pt-6">
          <div className="flex items-center justify-between animate-slide-up">
            <FWDLogo size="md" />
          </div>
          <div className="mt-16 flex flex-col items-center justify-center text-center animate-scale-in stagger-1">
            {/* Animated icon container */}
            <div className="relative mb-8">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-fuchsia-500 via-purple-500 to-cyan-500 blur-2xl opacity-50 animate-pulse-glow" />
              <div className="relative w-28 h-28 rounded-full bg-gradient-to-br from-fuchsia-600 via-purple-600 to-fuchsia-700 flex items-center justify-center neon-glow-lg animate-liquid">
                <LogIn className="w-12 h-12 text-white" />
              </div>
              {/* Orbiting sparkles */}
              <div className="absolute inset-0 animate-spin" style={{ animationDuration: '10s' }}>
                <Sparkles className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 text-cyan-400" />
              </div>
              <div className="absolute inset-0 animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }}>
                <Sparkles className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 text-fuchsia-400" />
              </div>
            </div>
            
            <h2 className="text-3xl font-black text-white mb-3 animate-text-glow">Sign in to FWD</h2>
            <p className="text-white/50 mb-8 max-w-xs text-sm leading-relaxed">Create and save your favorite GIFs, build collections, and express yourself.</p>
            
            <div className="flex gap-3">
              <Link 
                to="/login" 
                className="group px-8 py-3.5 bg-gradient-to-r from-fuchsia-600 via-purple-600 to-fuchsia-600 rounded-2xl font-bold text-white neon-glow hover:neon-glow-lg transition-all duration-300 hover:scale-105 hover:-translate-y-1 btn-ripple flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 group-hover:animate-pulse" />
                Sign In
              </Link>
              <Link 
                to="/signup" 
                className="px-8 py-3.5 liquid-glass neon-border rounded-2xl font-bold text-fuchsia-300 hover:text-white hover:neon-glow-sm transition-all duration-300 hover:scale-105"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
        <BottomNav />
      </PageShell>
    );
  }

  const displayName = profile?.display_name || 'FWD User';
  const username = profile?.username || 'user';
  const bio = profile?.bio || 'Creating vibes. One GIF at a time.';
  const avatarUrl = profile?.avatar_url || DEFAULT_AVATAR;

  const list = tab === 'Created' ? shownCreated : tab === 'Saved' ? savedGifs : [];

  return (
    <PageShell>
      <div className="px-4 pb-32 pt-6">
        <div className="flex items-center justify-between animate-slide-up">
          <FWDLogo size="md" />
          <Link 
            to="/settings" 
            className="grid h-11 w-11 place-items-center rounded-2xl liquid-glass text-fuchsia-300 hover:neon-glow-sm transition-all duration-300 hover:scale-105" 
            aria-label="Settings"
          >
            <Settings className="h-5 w-5" />
          </Link>
        </div>

        {/* Profile card with premium glass effect */}
        <div className="mt-6 rounded-3xl liquid-glass-strong neon-border p-5 animate-scale-in stagger-1">
          <div className="flex gap-5">
            {/* Avatar with glow */}
            <div className="relative shrink-0">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-fuchsia-500 to-cyan-500 blur-xl opacity-50 animate-pulse-glow" />
              <div className="relative h-24 w-24 overflow-hidden rounded-full border-2 border-fuchsia-400/70 neon-glow">
                <img src={avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
              </div>
              {profile && (
                <div className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-gradient-to-r from-fuchsia-600 to-purple-600 neon-glow-sm">
                  <BadgeCheck className="h-4 w-4 text-white" />
                </div>
              )}
            </div>
            
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h2 className="truncate text-xl font-black text-white">{displayName}</h2>
              </div>
              <p className="text-xs text-fuchsia-400/80 font-medium">@{username}</p>
              <p className="mt-2 text-xs text-white/60 leading-relaxed">{bio}</p>
              
              {/* Stats with animation */}
              <div className="mt-4 flex gap-5">
                {[
                  { value: shownCreated.length, label: 'Created' },
                  { value: savedGifs.length, label: 'Saved' },
                  { value: 6, label: 'Collections' },
                ].map((stat, idx) => (
                  <div key={stat.label} className="animate-slide-up" style={{ animationDelay: `${0.2 + idx * 0.1}s` }}>
                    <p className="text-lg font-black text-white">{stat.value}</p>
                    <p className="text-[10px] uppercase tracking-widest text-white/40">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs with premium styling */}
        <div className="mt-5 grid grid-cols-3 gap-2 rounded-2xl liquid-glass p-1.5 animate-slide-up stagger-2">
          {(['Created', 'Saved', 'Collections'] as Tab[]).map(t => {
            const active = tab === t;
            const Icon = t === 'Created' ? Play : t === 'Saved' ? Bookmark : Layers;
            return (
              <button
                key={t}
                onClick={() => t === 'Collections' ? nav('/collections') : setTab(t)}
                className={`inline-flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition-all duration-300 ${
                  active 
                    ? 'bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white neon-glow-sm' 
                    : 'text-white/50 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className={`h-4 w-4 ${active ? 'animate-pulse' : ''}`} /> {t}
              </button>
            );
          })}
        </div>

        {/* Section header */}
        <div className="mt-7 flex items-center justify-between animate-slide-up stagger-3">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-white/50">
            {tab === 'Saved' ? 'Your saved GIFs' : 'Your GIFs'}
          </p>
          <button className="group inline-flex items-center gap-1.5 text-xs font-semibold text-fuchsia-300 hover:text-fuchsia-200 transition-colors">
            Newest <ChevronDown className="h-3 w-3 group-hover:translate-y-0.5 transition-transform" />
          </button>
        </div>

        {/* Grid with staggered animation */}
        {list.length > 0 ? (
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {list.map((g, idx) => (
              <div 
                key={g.id} 
                className="group relative animate-scale-in"
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                <button 
                  onClick={() => nav(`/detail/${g.id}`)} 
                  className="relative block aspect-square w-full overflow-hidden rounded-2xl liquid-glass transition-all duration-500 hover:neon-glow hover:-translate-y-1 hover:scale-[1.02]"
                >
                  <img src={g.thumbnailUrl} alt={g.altText} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40" />
                  <span className="absolute left-2 top-2 rounded-lg border border-white/20 bg-black/60 backdrop-blur-md px-2 py-0.5 text-[9px] font-bold tracking-widest transition-all group-hover:border-fuchsia-500/40 group-hover:bg-fuchsia-500/20">GIF</span>
                  <span className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-xl bg-black/60 text-white/80 backdrop-blur-md transition-all group-hover:bg-fuchsia-500/30">
                    <MoreHorizontal className="h-4 w-4" />
                  </span>
                  <span className="absolute bottom-2 left-2 grid h-8 w-8 place-items-center rounded-xl bg-black/60 backdrop-blur-md transition-all group-hover:bg-fuchsia-500/30">
                    <Play className="h-4 w-4 text-white" fill="currentColor" />
                  </span>
                </button>
                <p className="mt-2 inline-flex items-center gap-1.5 px-1 text-xs text-white/60">
                  <Heart className="h-3.5 w-3.5 text-fuchsia-400" fill="currentColor" /> {g.title}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-3xl liquid-glass-strong p-10 text-center animate-scale-in">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-fuchsia-600/30 to-purple-600/30 grid place-items-center">
              <Sparkles className="w-8 h-8 text-fuchsia-400" />
            </div>
            <p className="text-sm text-white/50 mb-4">Nothing here yet</p>
            <button 
              onClick={() => nav('/create')} 
              className="rounded-full bg-gradient-to-r from-fuchsia-600 to-purple-600 px-6 py-3 text-sm font-bold neon-glow-sm hover:neon-glow transition-all duration-300 hover:scale-105"
            >
              Create your first FWD
            </button>
          </div>
        )}
      </div>
      <BottomNav />
    </PageShell>
  );
};

export default Profile;
