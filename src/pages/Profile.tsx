import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Settings, BadgeCheck, Play, Bookmark, Layers, ChevronDown, MoreHorizontal, Heart, LogIn } from 'lucide-react';
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
          <div className="flex items-center justify-between">
            <FWDLogo size="md" />
          </div>
          <div className="mt-20 flex flex-col items-center justify-center text-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-fuchsia-500 to-purple-600 flex items-center justify-center mb-6">
              <LogIn className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Sign in to FWD</h2>
            <p className="text-gray-400 mb-6 max-w-xs">Create and save your favorite GIFs, build collections, and more.</p>
            <div className="flex gap-3">
              <Link to="/login" className="px-6 py-3 bg-gradient-to-r from-fuchsia-600 to-purple-600 rounded-full font-semibold text-white">
                Sign In
              </Link>
              <Link to="/signup" className="px-6 py-3 border border-fuchsia-500/40 rounded-full font-semibold text-fuchsia-300">
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
        <div className="flex items-center justify-between">
          <FWDLogo size="md" />
          <Link to="/settings" className="grid h-10 w-10 place-items-center rounded-2xl border border-fuchsia-500/40 bg-black/60 text-fuchsia-300 backdrop-blur" aria-label="Settings">
            <Settings className="h-5 w-5" />
          </Link>
        </div>

        {/* Profile card */}
        <div className="mt-6 rounded-3xl border border-fuchsia-500/30 bg-black/60 p-4 backdrop-blur-xl shadow-[0_0_30px_rgba(217,70,239,0.25)]">
          <div className="flex gap-4">
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full border-2 border-fuchsia-500/70 shadow-[0_0_22px_rgba(217,70,239,0.6)]">
              <img src={avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <h2 className="truncate text-xl font-black">{displayName}</h2>
                {profile && <BadgeCheck className="h-4 w-4 text-fuchsia-400" fill="currentColor" />}
              </div>
              <p className="text-xs text-white/50">@{username}</p>
              <p className="mt-1 text-xs text-white/70">{bio}</p>
              <div className="mt-3 flex gap-4">
                <div>
                  <p className="text-base font-black">{shownCreated.length}</p>
                  <p className="text-[10px] uppercase tracking-widest text-white/50">Created</p>
                </div>
                <div>
                  <p className="text-base font-black">{savedGifs.length}</p>
                  <p className="text-[10px] uppercase tracking-widest text-white/50">Saved</p>
                </div>
                <div>
                  <p className="text-base font-black">6</p>
                  <p className="text-[10px] uppercase tracking-widest text-white/50">Collections</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-5 grid grid-cols-3 gap-2 rounded-2xl border border-white/10 bg-black/50 p-1 backdrop-blur">
          {(['Created', 'Saved', 'Collections'] as Tab[]).map(t => {
            const active = tab === t;
            const Icon = t === 'Created' ? Play : t === 'Saved' ? Bookmark : Layers;
            return (
              <button
                key={t}
                onClick={() => t === 'Collections' ? nav('/collections') : setTab(t)}
                className={`inline-flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition ${active ? 'bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white shadow-[0_0_18px_rgba(217,70,239,0.5)]' : 'text-white/70 hover:text-white'}`}
              >
                <Icon className="h-4 w-4" /> {t}
              </button>
            );
          })}
        </div>

        {/* Section header */}
        <div className="mt-6 flex items-center justify-between">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-white/60">
            {tab === 'Saved' ? 'Your saved GIFs' : 'Your GIFs'}
          </p>
          <button className="inline-flex items-center gap-1 text-xs font-semibold text-fuchsia-300">
            Newest <ChevronDown className="h-3 w-3" />
          </button>
        </div>

        {/* Grid */}
        {list.length > 0 ? (
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {list.map(g => (
              <div key={g.id} className="group relative">
                <button onClick={() => nav(`/detail/${g.id}`)} className="relative block aspect-square w-full overflow-hidden rounded-2xl border border-white/10 bg-black/60">
                  <img src={g.thumbnailUrl} alt={g.altText} className="absolute inset-0 h-full w-full object-cover transition group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <span className="absolute left-2 top-2 rounded-md border border-white/15 bg-black/60 px-1.5 py-0.5 text-[9px] font-bold tracking-widest">GIF</span>
                  <span className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-black/60 text-white/80"><MoreHorizontal className="h-4 w-4" /></span>
                  <span className="absolute bottom-2 left-2 grid h-7 w-7 place-items-center rounded-full bg-black/60"><Play className="h-3.5 w-3.5 text-white" fill="currentColor" /></span>
                </button>
                <p className="mt-1.5 inline-flex items-center gap-1 px-1 text-xs text-white/70">
                  <Heart className="h-3.5 w-3.5 text-fuchsia-400" fill="currentColor" /> {g.title}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-3xl border border-white/10 bg-black/60 p-8 text-center backdrop-blur">
            <p className="text-sm text-white/60">Nothing here yet.</p>
            <button onClick={() => nav('/create')} className="mt-3 rounded-full bg-gradient-to-r from-fuchsia-600 to-pink-600 px-5 py-2 text-xs font-bold">Create your first FWD</button>
          </div>
        )}
      </div>
      <BottomNav />
    </PageShell>
  );
};

export default Profile;
