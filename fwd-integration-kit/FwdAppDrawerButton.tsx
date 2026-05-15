import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { FwdPickerModal } from './FwdPickerModal';
import type { FwdGifPayload } from './fwdTypes';

type Props = {
  fwdAppUrl: string;
  userUid?: string;
  context?: 'message' | 'comment' | 'feed_post' | 'group_chat' | 'watch_party' | 'creator_channel' | 'profile_reaction';
  onSelectGif: (gif: FwdGifPayload) => void;
};

export function FwdAppDrawerButton({ fwdAppUrl, userUid, context = 'message', onSelectGif }: Props) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);

  return (
    <>
      <div className="relative">
        <button
          type="button"
          onClick={() => setDrawerOpen((v) => !v)}
          className="grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-black/70 text-white shadow-[0_0_18px_rgba(217,70,239,.3)]"
          aria-label="Open app drawer"
        >
          {drawerOpen ? <X size={18} /> : <Plus size={20} />}
        </button>

        {drawerOpen && (
          <div className="absolute bottom-14 left-0 z-40 w-64 rounded-3xl border border-fuchsia-500/30 bg-black/90 p-3 text-white shadow-[0_0_34px_rgba(217,70,239,.35)] backdrop-blur-xl">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[.28em] text-white/50">Add to message</p>
            <button
              type="button"
              onClick={() => { setPickerOpen(true); setDrawerOpen(false); }}
              className="flex w-full items-center gap-3 rounded-2xl border border-fuchsia-500/35 bg-fuchsia-500/10 p-3 text-left hover:bg-fuchsia-500/20"
            >
              <span className="grid h-12 w-12 place-items-center rounded-2xl border border-fuchsia-400/40 bg-black text-fuchsia-200 shadow-[0_0_18px_rgba(217,70,239,.45)]">≫</span>
              <span>
                <span className="block text-sm font-black">FWD</span>
                <span className="block text-xs text-white/55">GIFs & reactions</span>
              </span>
            </button>
          </div>
        )}
      </div>

      <FwdPickerModal
        open={pickerOpen}
        fwdAppUrl={fwdAppUrl}
        userUid={userUid}
        context={context}
        mode="compact"
        onClose={() => setPickerOpen(false)}
        onSelect={onSelectGif}
      />
    </>
  );
}
