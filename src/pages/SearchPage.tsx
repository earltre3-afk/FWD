import React, { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search as SearchIcon, X, Sparkles, TrendingUp, Clock, Smile, Tv, User, LayoutGrid } from 'lucide-react';
import PageShell from '@/components/PageShell';
import FWDLogo from '@/components/FWDLogo';
import BottomNav from '@/components/BottomNav';
import GifCard from '@/components/GifCard';
import { GIFS, RECENT_SEARCHES, TRENDING_SEARCHES } from '@/data/gifs';

const filters = [
  { label: 'All', icon: LayoutGrid },
  { label: 'Reactions', icon: Smile },
  { label: 'Memes', icon: Smile },
  { label: 'TV & Movies', icon: Tv },
  { label: 'People', icon: User },
];

const SearchPage: React.FC = () => {
  const nav = useNavigate();
  const [params] = useSearchParams();
  const [query, setQuery] = useState(params.get('q') || '');
  const [filter, setFilter] = useState('All');
  const [recents, setRecents] = useState(RECENT_SEARCHES);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = GIFS;
    if (filter === 'Reactions') list = list.filter(g => g.category === 'Reactions');
    else if (filter === 'Memes') list = list.filter(g => g.category === 'Memes');
    else if (filter === 'TV & Movies') list = list.filter(g => g.category === 'TV & Movies');
    if (q) list = list.filter(g => g.title.toLowerCase().includes(q) || g.tags.some(t => t.toLowerCase().includes(q)) || (g.mood && g.mood.toLowerCase().includes(q)));
    return list;
  }, [query, filter]);

  return (
    <PageShell>
      <div className="px-4 pb-32 pt-6 lg:px-8 lg:pb-12 lg:pt-10">
        <div className="flex items-center justify-center lg:justify-start">
          <FWDLogo size="md" className="lg:hidden" />
          <h1 className="hidden text-2xl font-black lg:block">Search</h1>
        </div>

        <div className="mt-6 flex items-center gap-3 rounded-full border border-fuchsia-500/40 bg-black/60 px-5 py-3 backdrop-blur-xl shadow-[0_0_30px_rgba(168,85,247,0.3)]">
          <SearchIcon className="h-5 w-5 text-white/60" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search GIFs, reactions…"
            className="w-full bg-transparent text-base font-semibold outline-none placeholder:text-white/40"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="grid h-7 w-7 place-items-center rounded-full bg-white/10 text-white/80 hover:bg-white/20"
              aria-label="Clear"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <Sparkles className="h-5 w-5 text-cyan-300" />
        </div>

        {/* Recents */}
        <div className="mt-6 flex items-center justify-between">
          <h3 className="text-sm font-bold text-white">Recent searches</h3>
          <button onClick={() => setRecents([])} className="text-xs font-semibold text-fuchsia-300 hover:text-fuchsia-200">Clear all</button>
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {recents.length === 0 && <span className="text-xs text-white/40">No recent searches</span>}
          {recents.map(r => (
            <button
              key={r}
              onClick={() => setQuery(r)}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/50 px-3 py-1.5 text-xs text-white/80 hover:border-fuchsia-500/60"
            >
              <Clock className="h-3 w-3 text-fuchsia-300" />
              {r}
            </button>
          ))}
        </div>

        {/* Trending */}
        <h3 className="mt-6 text-sm font-bold text-white">Trending searches</h3>
        <div className="mt-2 flex flex-wrap gap-2">
          {TRENDING_SEARCHES.map(r => (
            <button
              key={r}
              onClick={() => setQuery(r)}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/50 px-3 py-1.5 text-xs text-white/80 hover:border-fuchsia-500/60"
            >
              <TrendingUp className="h-3 w-3 text-fuchsia-300" />
              {r}
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="mt-6 flex flex-wrap gap-2">
          {filters.map(f => {
            const active = filter === f.label;
            return (
              <button
                key={f.label}
                onClick={() => setFilter(f.label)}
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                  active ? 'border-fuchsia-400 bg-gradient-to-r from-fuchsia-600/40 to-purple-600/40 text-white shadow-[0_0_18px_rgba(217,70,239,0.45)]' : 'border-white/10 bg-black/40 text-white/70 hover:border-fuchsia-500/50'
                }`}
              >
                <f.icon className="h-3.5 w-3.5" />
                {f.label}
              </button>
            );
          })}
        </div>

        {/* Results */}
        <div className="mt-6 flex items-end justify-between">
          <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-white/60 lg:text-sm">Search results</h3>
          <span className="text-xs font-semibold text-fuchsia-300 lg:text-sm">{results.length} Results</span>
        </div>

        {results.length > 0 ? (
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 lg:gap-4">
            {results.map(g => (
              <GifCard key={g.id} gif={g} onClick={(gif) => nav(`/detail/${gif.id}`)} showShare aspect="tall" />
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-3xl border border-white/10 bg-black/60 p-10 text-center backdrop-blur-xl lg:p-14">
            <div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-2xl border border-fuchsia-500/40 bg-black/60 lg:h-16 lg:w-16">
              <SearchIcon className="h-6 w-6 text-fuchsia-300 lg:h-7 lg:w-7" />
            </div>
            <p className="text-base font-bold lg:text-lg">No reaction found yet.</p>
            <p className="mt-1 text-xs text-white/50 lg:text-sm">Try another keyword, or make your own.</p>
            <button onClick={() => nav('/create')} className="mt-5 rounded-full bg-gradient-to-r from-fuchsia-600 to-pink-600 px-6 py-2.5 text-sm font-bold shadow-[0_0_24px_rgba(217,70,239,0.55)] lg:px-8 lg:py-3 lg:text-base">
              Create one
            </button>
          </div>
        )}
      </div>
      <BottomNav />
    </PageShell>
  );
};

export default SearchPage;
