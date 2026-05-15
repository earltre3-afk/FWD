import React, { useEffect } from 'react';
import type { FwdGifPayload, FwdPickerEvent } from './fwdTypes';

type Props = {
  open: boolean;
  fwdAppUrl: string;
  context?: 'message' | 'comment' | 'feed_post' | 'group_chat' | 'watch_party' | 'creator_channel' | 'profile_reaction';
  userUid?: string;
  mode?: 'compact' | 'full';
  onClose: () => void;
  onSelect: (gif: FwdGifPayload) => void;
};

export function FwdPickerModal({ open, fwdAppUrl, context = 'message', userUid, mode = 'compact', onClose, onSelect }: Props) {
  useEffect(() => {
    const handle = (event: MessageEvent<FwdPickerEvent>) => {
      const data = event.data;
      if (!data || typeof data !== 'object') return;
      if (data.type === 'FWD_GIF_SELECTED') { onSelect(data.gif); onClose(); }
      if (data.type === 'FWD_PICKER_CLOSED') onClose();
    };
    window.addEventListener('message', handle);
    return () => window.removeEventListener('message', handle);
  }, [onClose, onSelect]);

  if (!open) return null;
  const src = `${fwdAppUrl.replace(/\/$/, '')}/embed/picker?source=host_app&context=${encodeURIComponent(context)}&mode=${mode}${userUid ? `&user_uid=${encodeURIComponent(userUid)}` : ''}&theme=dark`;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xl" onClick={onClose}>
      <div className="absolute inset-x-0 bottom-0 mx-auto h-[82vh] max-w-md overflow-hidden rounded-t-[32px] border border-fuchsia-500/30 bg-black shadow-[0_0_40px_rgba(217,70,239,.45)] md:inset-0 md:top-1/2 md:h-[720px] md:-translate-y-1/2 md:rounded-[32px]" onClick={(e) => e.stopPropagation()}>
        <iframe src={src} title="FWD GIF Picker" className="h-full w-full border-0 bg-transparent" allow="clipboard-write" />
      </div>
    </div>
  );
}
