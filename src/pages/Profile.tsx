import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, BadgeCheck, Play, Bookmark, Layers, ChevronDown, MoreHorizontal, Heart, User, LogIn } from 'lucide-react';
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
  const { user, profile, loading } = useAuth();
  const [tab, setTab] = useState<Tab>('Created');

  const savedGifs = allGifs.filter(g => favorites.includes(g.id));
  const shownCreated = createdGifs.length > 0 ? createdGifs : GIFS.slice(0, 6);

  const list = tab === 'Created' ? shownCreated : tab === 'Saved' ? savedGifs : [];

  // Guest profile view
  if (!user && !loading) {
    return (
      <PageShell>
        <div className="px-4 pb-32 pt-6 lg:px-8 lg:pb-12 lg:pt-10">
          <div className="flex items-center justify-between">
            <FWDLogo size="md" className="lg:hidden" />
            <h1 className="hidden text-2xl font-black lg:block">Profile</h1>
            <div />
          </div>

          <div className="mt-8 flex flex-col items-center justify-center rounded-3xl border border-fuchsia-500/30 bg-black/60 p-8 text-center backdrop-blur-xl shadow-[0_0_40px_rgba(217,70,239,0.25)] lg:mt-12 lg:p-12">
            <div className="grid h-20 w-20 place-items-center rounded-full border-2 border-fuchsia-500/50 bg-gradient-to-br from-fuchsia-600/50 to-purple-600/50 lg:h-24 lg:w-24">
              <User className="h-10 w-10 text-white/70 lg:h-12 lg:w-12" />
            </div>
            <h2 className="mt-6 text-2xl font-black lg:text-3xl">Join FWD</h2>
            <p className="mt-2 max-w-sm text-sm text-white/60 lg:text-base">
              Sign in to save your favorite GIFs, create your own reactions, and sync across devices.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => nav('/login')}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-fuchsia-600 via-purple-600 to-pink-600 px-8 py-4 text-base font-bold text-white shadow-[0_0_30px_rgba(217,70,239,0.55)] transition hover:shadow-[0_0_45px_rgba(217,70,239,0.95)]"
              >
                <LogIn className="h-5 w-5" />
                Sign In
              </button>
              <button
                onClick={() => nav('/signup')}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-fuchsia-500/50 bg-black/40 px-8 py-4 text-base font-bold text-white backdrop-blur-xl transition hover:border-fuchsia-400 hover:bg-fuchsia-500/10"
              >
                Create Account
              </button>
            </div>
          </div>
        </div>
        <BottomNav />
      </PageShell>
    );
  }

  const displayName = profile?.display_name || 'FWD User';
  const username = profile?.username || 'user';
  const avatarUrl = profile?.avatar_url || DEFAULT_AVATAR;
  const bio = profile?.bio || 'Creating vibes. One GIF at a time.';

  return (
    <PageShell>
      <div className="px-4 pb-32 pt-6 lg:px-8 lg:pb-12 lg:pt-10">
        <div className="flex items-center justify-between">
          <FWDLogo size="md" className="lg:hidden" />
          <h1 className="hidden text-2xl font-black lg:block">Profile</h1>
          <button onClick={() => nav('/settings')} className="grid h-10 w-10 place-items-center rounded-2xl border border-fuchsia-500/40 bg-black/60 text-fuchsia-300 backdrop-blur" aria-label="Settings">
            <Settings className="h-5 w-5" />
          </button>
        </div>

        {/* Profile card */}
        <div className="mt-6 rounded-3xl border border-fuchsia-500/30 bg-black/60 p-4 backdrop-blur-xl shadow-[0_0_30px_rgba(217,70,239,0.25)] lg:p-6">
          <div className="flex gap-4 lg:gap-6">
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full border-2 border-fuchsia-500/70 shadow-[0_0_22px_rgba(217,70,239,0.6)] lg:h-32 lg:w-32">
              <img src={avatarUrl} alt={displayName} className="h-full w-full object-cover" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <h2 className="truncate text-xl font-black lg:text-2xl">{displayName}</h2>
                {profile?.is_public && <BadgeCheck className="h-4 w-4 text-fuchsia-400 lg:h-5 lg:w-5" fill="currentColor" />}
              </div>
              <p className="text-xs text-white/50 lg:text-sm">@{username}</p>
              <p className="mt-1 text-xs text-white/70 lg:text-sm">{bio}</p>
              <div className="mt-3 flex gap-4 lg:mt-4 lg:gap-6">
                <div>
                  <p className="text-base font-black lg:text-lg">{shownCreated.length}</p>
                  <p className="text-[10px] uppercase tracking-widest text-white/50 lg:text-xs">Created</p>
                </div>
                <div>
                  <p className="text-base font-black lg:text-lg">{savedGifs.length}</p>
                  <p className="text-[10px] uppercase tracking-widest text-white/50 lg:text-xs">Saved</p>
                </div>
                <div>
                  <p className="text-base font-black lg:text-lg">6</p>
                  <p className="text-[10px] uppercase tracking-widest text-white/50 lg:text-xs">Collections</p>
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
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 lg:gap-4">
            {list.map(g => (
              <div key={g.id} className="group relative">
                <button onClick={() => nav(`/detail/${g.id}`)} className="relative block aspect-square w-full overflow-hidden rounded-2xl border border-white/10 bg-black/60">
                  <img src={g.thumbnailUrl} alt={g.altText} className="absolute inset-0 h-full w-full object-cover transition group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <span className="absolute left-2 top-2 rounded-md border border-white/15 bg-black/60 px-1.5 py-0.5 text-[9px] font-bold tracking-widest">GIF</span>
                  <span className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-black/60 text-white/80"><MoreHorizontal className="h-4 w-4" /></span>
                  <span className="absolute bottom-2 left-2 grid h-7 w-7 place-items-center rounded-full bg-black/60"><Play className="h-3.5 w-3.5 text-white" fill="currentColor" /></span>
                </button>
                <p className="mt-1.5 inline-flex items-center gap-1 px-1 text-xs text-white/70 lg:text-sm">
                  <Heart className="h-3.5 w-3.5 text-fuchsia-400" fill="currentColor" /> {g.title}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-3xl border border-white/10 bg-black/60 p-8 text-center backdrop-blur lg:p-12">
            <p className="text-sm text-white/60 lg:text-base">Nothing here yet.</p>
            <button onClick={() => nav('/create')} className="mt-3 rounded-full bg-gradient-to-r from-fuchsia-600 to-pink-600 px-5 py-2 text-xs font-bold lg:px-6 lg:py-3 lg:text-sm">Create your first FWD</button>
          </div>
        )}
      </div>
      <BottomNav />
    </PageShell>
  );
};

export default Profile;
