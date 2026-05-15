import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Lock, Sparkles, Folder } from 'lucide-react';
import PageShell from '@/components/PageShell';
import FWDLogo from '@/components/FWDLogo';
import BottomNav from '@/components/BottomNav';
import { COLLECTIONS, GIFS } from '@/data/gifs';

const Collections: React.FC = () => {
  const nav = useNavigate();
  const [collections, setCollections] = useState(COLLECTIONS);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState('');

  const addCollection = () => {
    if (!newName.trim()) return;
    setCollections([{ id: `c-${Date.now()}`, name: newName.trim(), count: 0, gifIds: [] }, ...collections]);
    setNewName('');
    setCreating(false);
  };

  return (
    <PageShell>
      <div className="px-4 pb-32 pt-6">
        <div className="flex items-center justify-between">
          <button onClick={() => nav(-1)} className="grid h-10 w-10 place-items-center rounded-2xl border border-white/10 bg-black/60 backdrop-blur">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <FWDLogo size="md" />
          <button onClick={() => setCreating(true)} className="grid h-10 w-10 place-items-center rounded-2xl border border-fuchsia-500/40 bg-black/60 text-fuchsia-300 backdrop-blur" aria-label="New collection">
            <Plus className="h-5 w-5" />
          </button>
        </div>

        <h1 className="mt-6 text-3xl font-black tracking-tight">Collections</h1>
        <p className="mt-1 text-sm text-white/60">Organize your favorite reactions.</p>

        {creating && (
          <div className="mt-5 rounded-2xl border border-fuchsia-500/40 bg-black/60 p-4 backdrop-blur">
            <p className="text-xs font-bold uppercase tracking-widest text-white/70">New collection</p>
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Name your vibe…"
              className="mt-2 w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-sm outline-none focus:border-fuchsia-400"
              autoFocus
            />
            <div className="mt-3 flex gap-2">
              <button onClick={addCollection} className="flex-1 rounded-xl bg-gradient-to-r from-fuchsia-600 to-pink-600 py-2 text-sm font-bold">Create</button>
              <button onClick={() => setCreating(false)} className="flex-1 rounded-xl border border-white/10 py-2 text-sm text-white/70">Cancel</button>
            </div>
          </div>
        )}

        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {collections.map(c => {
            const gifs = c.gifIds.map(id => GIFS.find(g => g.id === id)).filter(Boolean) as typeof GIFS;
            const isPrivate = c.name.toLowerCase().includes('private');
            return (
              <button
                key={c.id}
                onClick={() => nav('/favorites')}
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-black/60 p-3 text-left backdrop-blur-xl transition hover:border-fuchsia-400/60 hover:-translate-y-1"
              >
                <div className="grid grid-cols-2 gap-1.5">
                  {[0, 1, 2, 3].map(i => (
                    <div key={i} className="relative aspect-square overflow-hidden rounded-xl bg-black/60">
                      {gifs[i] ? (
                        <img src={gifs[i].thumbnailUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
                      ) : (
                        <div className="grid h-full place-items-center text-white/20"><Sparkles className="h-4 w-4" /></div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div>
                    <p className="inline-flex items-center gap-1.5 text-sm font-bold">
                      {isPrivate ? <Lock className="h-3.5 w-3.5 text-fuchsia-300" /> : <Folder className="h-3.5 w-3.5 text-fuchsia-300" />}
                      {c.name}
                    </p>
                    <p className="text-[10px] text-white/50">{c.count} GIFs</p>
                  </div>
                  <span className="rounded-full border border-fuchsia-500/30 bg-black/60 px-2.5 py-1 text-[10px] font-semibold text-fuchsia-200">Open</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
      <BottomNav />
    </PageShell>
  );
};

export default Collections;
