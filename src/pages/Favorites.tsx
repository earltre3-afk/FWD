import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Search as SearchIcon, Filter, Heart, ChevronRight, Smile, Music, LayoutGrid, X } from 'lucide-react';
import PageShell from '@/components/PageShell';
import FWDLogo from '@/components/FWDLogo';
import BottomNav from '@/components/BottomNav';
import GifCard from '@/components/GifCard';
import { useFWD } from '@/contexts/FWDContext';

const filters = [
  { label: 'All', icon: LayoutGrid },
  { label: 'Reactions', icon: Smile },
  { label: 'Memes', icon: Smile },
  { label: 'Music', icon: Music },
];

const Favorites: React.FC = () => {
  const nav = useNavigate();
  const { favorites, allGifs } = useFWD();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('All');
  const [filterOpen, setFilterOpen] = useState(false);

  const favGifs = useMemo(() => allGifs.filter(g => favorites.includes(g.id)), [favorites, allGifs]);

  const filtered = useMemo(() => {
    let list = favGifs;
    if (filter !== 'All') list = list.filter(g => g.category === filter);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(g => g.title.toLowerCase().includes(q) || g.tags.some(t => t.includes(q)));
    }
    return list;
  }, [favGifs, filter, query]);

  return (
    <PageShell>
      <div className="px-4 pb-32 pt-6 lg:px-8 lg:pb-12 lg:pt-10">
        <div className="flex items-center justify-between">
          <FWDLogo size="md" className="lg:hidden" />
          <h1 className="hidden text-2xl font-black lg:block">Favorites</h1>
          <button className="relative grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-black/60 text-fuchsia-300 backdrop-blur">
            <Bell className="h-5 w-5" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-fuchsia-500 shadow-[0_0_8px_rgba(217,70,239,1)]" />
          </button>
        </div>

        <h1 className="mt-6 text-4xl font-black tracking-tight lg:hidden">Your reaction vault</h1>
        <p className="mt-1 text-sm text-white/60 lg:mt-6 lg:text-base">All your favorite GIFs in one place.</p>

        {/* Search */}
        <div className="mt-5 flex items-center gap-3 rounded-full border border-fuchsia-500/40 bg-black/60 px-5 py-3 backdrop-blur-xl">
          <SearchIcon className="h-5 w-5 text-white/60" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search your favorites…" className="w-full bg-transparent text-sm outline-none placeholder:text-white/40" />
          {query && <button onClick={() => setQuery('')}><X className="h-4 w-4 text-white/60" /></button>}
        </div>

        {/* Filters */}
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('All')}
            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${filter === 'All' ? 'border-fuchsia-400 bg-fuchsia-500/15 text-white shadow-[0_0_18px_rgba(217,70,239,0.45)]' : 'border-white/10 bg-black/40 text-white/70'}`}
          >
            <LayoutGrid className="h-3.5 w-3.5" /> All ({favGifs.length})
          </button>
          {filters.slice(1).map(f => (
            <button
              key={f.label}
              onClick={() => setFilter(f.label)}
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${filter === f.label ? 'border-fuchsia-400 bg-fuchsia-500/15 text-white' : 'border-white/10 bg-black/40 text-white/70'}`}
            >
              <f.icon className="h-3.5 w-3.5" /> {f.label}
            </button>
          ))}
          <button onClick={() => setFilterOpen(o => !o)} className="grid h-7 w-7 place-items-center rounded-full border border-white/10 bg-black/40 text-white/70">
            <Filter className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="mt-5 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 lg:gap-4">
            {filtered.map(g => (
              <GifCard key={g.id} gif={g} onClick={(x) => nav(`/detail/${x.id}`)} />
            ))}
          </div>
        ) : (
          <div className="mt-10 rounded-3xl border border-white/10 bg-black/60 p-10 text-center backdrop-blur-xl lg:p-14">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl border border-fuchsia-500/40 bg-black/60 lg:h-16 lg:w-16">
              <Heart className="h-6 w-6 text-fuchsia-300 lg:h-7 lg:w-7" />
            </div>
            <p className="mt-3 text-base font-bold lg:text-lg">Your reaction vault is empty.</p>
            <p className="mt-1 text-xs text-white/50 lg:text-sm">Save GIFs to build your collection.</p>
            <button onClick={() => nav('/home')} className="mt-5 rounded-full bg-gradient-to-r from-fuchsia-600 to-pink-600 px-6 py-2.5 text-sm font-bold lg:px-8 lg:py-3 lg:text-base">Discover GIFs</button>
          </div>
        )}

        {favGifs.length > 0 && (
          <button onClick={() => nav('/collections')} className="mt-5 flex w-full items-center justify-between rounded-2xl border border-fuchsia-500/30 bg-black/50 px-4 py-3 backdrop-blur hover:border-fuchsia-400">
            <span className="inline-flex items-center gap-2 text-sm font-semibold"><Heart className="h-4 w-4 text-fuchsia-300" /> View all favorites</span>
            <ChevronRight className="h-4 w-4 text-white/60" />
          </button>
        )}
      </div>
      <BottomNav />
    </PageShell>
  );
};

export default Favorites;
