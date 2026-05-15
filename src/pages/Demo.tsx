import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Send, X, Image as ImageIcon, Mic, Smile, ArrowLeft } from 'lucide-react';
import FWDLogo from '@/components/FWDLogo';

type Msg = { id: string; text?: string; gif?: any; from: 'me' | 'them'; time: string };

const Demo: React.FC = () => {
  const nav = useNavigate();
  const [text, setText] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [attached, setAttached] = useState<any | null>(null);
  const [messages, setMessages] = useState<Msg[]>([
    { id: 'm1', from: 'them', text: 'Meet you at the rooftop later?', time: '9:41 AM' },
    { id: 'm2', from: 'me', text: 'Yesss! Can\'t wait 💜', time: '9:41 AM' },
  ]);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const handler = (e: MessageEvent) => {
      const d = e.data;
      if (!d || typeof d !== 'object') return;
      if (d.type === 'FWD_GIF_SELECTED') {
        setAttached(d.gif);
        setPickerOpen(false);
      } else if (d.type === 'FWD_PICKER_CLOSED') {
        setPickerOpen(false);
      }
    };
    window.addEventListener('message', handler);
    const internal = (e: any) => handler({ data: e.detail } as MessageEvent);
    window.addEventListener('fwd:picker', internal as any);
    return () => {
      window.removeEventListener('message', handler);
      window.removeEventListener('fwd:picker', internal as any);
    };
  }, []);

  const send = () => {
    if (!text.trim() && !attached) return;
    setMessages(m => [...m, { id: `m-${Date.now()}`, from: 'me', text: text.trim() || undefined, gif: attached, time: 'Now' }]);
    setText('');
    setAttached(null);
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black text-white">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-32 -left-24 h-96 w-96 rounded-full bg-fuchsia-600/25 blur-[140px]" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-purple-700/30 blur-[160px]" />
      </div>

      <div className="mx-auto flex min-h-screen max-w-md flex-col">
        {/* Top bar */}
        <div className="flex items-center gap-3 px-4 pt-6 pb-4">
          <button onClick={() => nav(-1)} className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-black/60">
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div className="h-10 w-10 overflow-hidden rounded-full border-2 border-fuchsia-500/70">
            <img src="https://d64gsuwffb70l.cloudfront.net/6a066e9ff965bde632ec6ca8_1778806542275_025aa214.jpg" alt="Maya" className="h-full w-full object-cover" />
          </div>
          <div className="flex-1">
            <p className="text-base font-bold">Maya</p>
            <p className="text-xs text-fuchsia-300">Online</p>
          </div>
          <span className="text-[10px] text-white/40">Integration demo</span>
        </div>

        {/* Messages */}
        <div className="flex-1 space-y-3 overflow-y-auto px-4">
          <p className="text-center text-xs text-white/40">Today 9:41 AM</p>
          {messages.map(m => (
            <div key={m.id} className={`flex ${m.from === 'me' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[78%] rounded-2xl px-3 py-2 ${m.from === 'me' ? 'bg-gradient-to-br from-fuchsia-600 to-purple-700 text-white shadow-[0_0_18px_rgba(217,70,239,0.45)]' : 'bg-white/5 text-white/90'}`}>
                {m.gif && (
                  <div className="mb-1 overflow-hidden rounded-xl">
                    <img src={m.gif.thumbnailUrl} alt={m.gif.altText} className="block w-full" />
                    <p className="mt-1 text-[10px] text-white/70">Powered by FWD</p>
                  </div>
                )}
                {m.text && <p className="text-sm">{m.text}</p>}
                <p className="mt-0.5 text-right text-[10px] text-white/60">{m.time}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Attached preview */}
        {attached && (
          <div className="mx-4 mt-3 flex items-center gap-3 rounded-2xl border border-fuchsia-500/40 bg-black/60 p-2 backdrop-blur">
            <div className="h-14 w-14 overflow-hidden rounded-lg">
              <img src={attached.thumbnailUrl} alt={attached.altText} className="h-full w-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-semibold">{attached.title}</p>
              <p className="text-[10px] text-white/50">FWD GIF · ready to send</p>
            </div>
            <button onClick={() => setAttached(null)} className="grid h-8 w-8 place-items-center rounded-full bg-white/10 hover:bg-white/20" aria-label="Remove">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Composer */}
        <div className="relative z-10 px-3 py-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setDrawerOpen(o => !o)}
              className={`grid h-11 w-11 place-items-center rounded-full border transition ${drawerOpen ? 'border-fuchsia-400 bg-fuchsia-500/20 text-fuchsia-200 rotate-45' : 'border-white/10 bg-black/60 text-white/80'}`}
              aria-label="Add"
            >
              <Plus className="h-5 w-5" />
            </button>
            <div className="flex flex-1 items-center gap-2 rounded-full border border-white/10 bg-black/60 px-4 py-2.5 backdrop-blur">
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Message…"
                className="w-full bg-transparent text-sm outline-none placeholder:text-white/40"
                onKeyDown={(e) => { if (e.key === 'Enter') send(); }}
              />
            </div>
            <button
              onClick={send}
              className="grid h-11 w-11 place-items-center rounded-full border border-fuchsia-400 bg-black shadow-[0_0_18px_rgba(217,70,239,0.6)]"
              aria-label="Send"
            >
              <Send className="h-4 w-4 text-fuchsia-300" />
            </button>
          </div>

          {/* App drawer */}
          {drawerOpen && (
            <div className="mt-3 rounded-3xl border border-fuchsia-500/30 bg-black/80 p-4 backdrop-blur-xl shadow-[0_0_30px_rgba(217,70,239,0.35)]">
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.3em] text-white/60">Add to message</p>
              <div className="grid grid-cols-4 gap-3">
                <button
                  onClick={() => { setPickerOpen(true); setDrawerOpen(false); }}
                  className="flex flex-col items-center gap-1.5 rounded-2xl border border-fuchsia-500/40 bg-gradient-to-br from-fuchsia-600/30 to-purple-700/20 p-2 shadow-[0_0_18px_rgba(217,70,239,0.4)]"
                >
                  <div className="grid h-12 w-12 place-items-center rounded-2xl border border-fuchsia-500/50 bg-black/60">
                    <FWDLogo size="sm" showText={false} />
                  </div>
                  <span className="text-[10px] font-bold">FWD</span>
                </button>
                {[
                  { icon: ImageIcon, label: 'Photo' },
                  { icon: Mic, label: 'Voice' },
                  { icon: Smile, label: 'Sticker' },
                ].map(a => (
                  <button key={a.label} className="flex flex-col items-center gap-1.5 rounded-2xl border border-white/10 bg-black/50 p-2 hover:border-fuchsia-500/40">
                    <div className="grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-black/60 text-white/70">
                      <a.icon className="h-5 w-5" />
                    </div>
                    <span className="text-[10px] text-white/70">{a.label}</span>
                  </button>
                ))}
              </div>
              <p className="mt-3 text-center text-[10px] text-white/40">Tap FWD to forward a GIF.</p>
            </div>
          )}
        </div>
      </div>

      {/* Picker overlay (iframe to /embed/picker) */}
      {pickerOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur" onClick={() => setPickerOpen(false)}>
          <div className="absolute inset-0 mx-auto max-w-md" onClick={(e) => e.stopPropagation()}>
            <iframe
              ref={iframeRef}
              src="/embed/picker"
              title="FWD GIF Picker"
              className="h-full w-full border-0 bg-transparent"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Demo;
