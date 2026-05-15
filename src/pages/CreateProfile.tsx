import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, User, AtSign, FileText, Globe, Lock, Loader2, AlertTriangle, CheckCircle2 } from 'lucide-react';
import PageShell from '@/components/PageShell';
import FWDLogo from '@/components/FWDLogo';
import { useAuth } from '@/contexts/AuthContext';

const REACTION_STYLES = [
  { id: 'default', label: 'Classic', desc: 'Standard reactions', emoji: '😊' },
  { id: 'expressive', label: 'Expressive', desc: 'Bold and animated', emoji: '🔥' },
  { id: 'chill', label: 'Chill', desc: 'Laid back vibes', emoji: '😎' },
  { id: 'chaotic', label: 'Chaotic', desc: 'Wild and unpredictable', emoji: '🤪' },
];

const CreateProfile: React.FC = () => {
  const nav = useNavigate();
  const { user, updateProfile, isSupabaseReady } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);

  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [reactionStyle, setReactionStyle] = useState('default');
  const [isPublic, setIsPublic] = useState(true);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatarPreview(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!displayName || !username) {
      setError('Display name and username are required');
      return;
    }
    if (username.length < 3) {
      setError('Username must be at least 3 characters');
      return;
    }

    setLoading(true);

    const { error } = await updateProfile({
      display_name: displayName,
      username: username.toLowerCase().replace(/\s+/g, ''),
      bio: bio || null,
      reaction_style: reactionStyle,
      is_public: isPublic,
      avatar_url: avatarPreview || null,
    });

    if (error) {
      setError(error.message || 'Failed to create profile');
      setLoading(false);
    } else {
      setSuccess(true);
      setTimeout(() => nav('/profile'), 1500);
    }
  };

  if (!user) {
    return (
      <PageShell hideSidebar>
        <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
          <div className="rounded-3xl border border-fuchsia-500/30 bg-black/60 p-8 backdrop-blur-xl">
            <AlertTriangle className="mx-auto h-12 w-12 text-amber-400" />
            <h2 className="mt-4 text-xl font-bold">Sign in required</h2>
            <p className="mt-2 text-sm text-white/60">You need to sign in to create a profile.</p>
            <button
              onClick={() => nav('/login')}
              className="mt-6 rounded-2xl bg-gradient-to-r from-fuchsia-600 to-purple-600 px-6 py-3 text-sm font-bold"
            >
              Sign In
            </button>
          </div>
        </div>
      </PageShell>
    );
  }

  if (success) {
    return (
      <PageShell hideSidebar>
        <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
          <div className="rounded-3xl border border-fuchsia-500/30 bg-black/60 p-8 backdrop-blur-xl shadow-[0_0_40px_rgba(217,70,239,0.25)]">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-fuchsia-500 to-cyan-400 shadow-[0_0_30px_rgba(217,70,239,0.6)]">
              <CheckCircle2 className="h-8 w-8 text-white" />
            </div>
            <h2 className="mt-6 text-2xl font-black">Profile Created!</h2>
            <p className="mt-2 text-sm text-white/60">Taking you to your new profile...</p>
            <Loader2 className="mx-auto mt-4 h-5 w-5 animate-spin text-fuchsia-400" />
          </div>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell hideSidebar>
      <div className="min-h-screen px-4 py-6 lg:flex lg:items-center lg:justify-center lg:px-8">
        <div className="mx-auto max-w-lg lg:max-w-2xl">
          {/* Header */}
          <div className="flex items-center justify-between lg:hidden">
            <button onClick={() => nav(-1)} className="grid h-10 w-10 place-items-center rounded-2xl border border-white/10 bg-black/60 backdrop-blur">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <FWDLogo size="md" />
            <div className="w-10" />
          </div>

          <div className="mt-6 rounded-3xl border border-fuchsia-500/30 bg-black/60 p-6 backdrop-blur-xl shadow-[0_0_40px_rgba(217,70,239,0.25)] lg:p-8">
            <div className="text-center">
              <h1 className="text-2xl font-black lg:text-3xl">Create Your Profile</h1>
              <p className="mt-1 text-sm text-white/60">Set up your FWD identity</p>
            </div>

            {error && (
              <div className="mt-4 flex items-start gap-2 rounded-2xl border border-red-500/40 bg-red-500/10 p-3 text-xs text-red-200">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-6">
              {/* Avatar */}
              <div className="flex flex-col items-center">
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="relative h-24 w-24 overflow-hidden rounded-full border-2 border-fuchsia-500/50 bg-black/60 transition hover:border-fuchsia-400"
                >
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Avatar preview" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center text-white/40">
                      <Camera className="h-8 w-8" />
                    </div>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition hover:opacity-100">
                    <Camera className="h-6 w-6" />
                  </div>
                </button>
                <input ref={fileRef} type="file" accept="image/*" hidden onChange={handleAvatarChange} />
                <p className="mt-2 text-xs text-white/50">Click to upload avatar</p>
              </div>

              {/* Name and Username */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/60">Display Name</label>
                  <div className="mt-1 flex items-center gap-3 rounded-2xl border border-white/10 bg-black/50 px-4 py-3 focus-within:border-fuchsia-500/50">
                    <User className="h-5 w-5 text-white/40" />
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Your name"
                      className="w-full bg-transparent text-sm outline-none placeholder:text-white/40"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/60">Username</label>
                  <div className="mt-1 flex items-center gap-3 rounded-2xl border border-white/10 bg-black/50 px-4 py-3 focus-within:border-fuchsia-500/50">
                    <AtSign className="h-5 w-5 text-white/40" />
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                      placeholder="username"
                      className="w-full bg-transparent text-sm outline-none placeholder:text-white/40"
                    />
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/60">Bio</label>
                <div className="mt-1 rounded-2xl border border-white/10 bg-black/50 px-4 py-3 focus-within:border-fuchsia-500/50">
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value.slice(0, 160))}
                    placeholder="Tell us about yourself..."
                    rows={3}
                    className="w-full resize-none bg-transparent text-sm outline-none placeholder:text-white/40"
                  />
                  <div className="text-right text-[10px] text-white/40">{bio.length}/160</div>
                </div>
              </div>

              {/* Reaction Style */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/60">Reaction Style</label>
                <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {REACTION_STYLES.map(style => (
                    <button
                      key={style.id}
                      type="button"
                      onClick={() => setReactionStyle(style.id)}
                      className={`flex flex-col items-center gap-1 rounded-2xl border p-3 transition ${
                        reactionStyle === style.id
                          ? 'border-fuchsia-400 bg-fuchsia-500/15 shadow-[0_0_18px_rgba(217,70,239,0.4)]'
                          : 'border-white/10 bg-black/50 hover:border-fuchsia-500/50'
                      }`}
                    >
                      <span className="text-2xl">{style.emoji}</span>
                      <span className="text-xs font-bold">{style.label}</span>
                      <span className="text-[10px] text-white/50">{style.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Public/Private */}
              <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/50 p-4">
                <div className="flex items-center gap-3">
                  {isPublic ? <Globe className="h-5 w-5 text-cyan-300" /> : <Lock className="h-5 w-5 text-fuchsia-300" />}
                  <div>
                    <p className="text-sm font-bold">{isPublic ? 'Public Profile' : 'Private Profile'}</p>
                    <p className="text-xs text-white/50">{isPublic ? 'Anyone can see your profile' : 'Only you can see your profile'}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPublic(p => !p)}
                  className={`relative h-7 w-12 rounded-full transition ${isPublic ? 'bg-gradient-to-r from-fuchsia-500 to-cyan-400' : 'bg-white/10'}`}
                >
                  <span className={`absolute top-0.5 h-6 w-6 rounded-full bg-white transition ${isPublic ? 'left-[22px]' : 'left-0.5'}`} />
                </button>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading || !isSupabaseReady}
                className={`flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-base font-bold transition ${
                  loading
                    ? 'bg-white/10 text-white/50 cursor-not-allowed'
                    : 'bg-gradient-to-r from-fuchsia-600 via-purple-600 to-pink-600 text-white shadow-[0_0_30px_rgba(217,70,239,0.5)] hover:shadow-[0_0_45px_rgba(217,70,239,0.7)]'
                }`}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Creating Profile...
                  </>
                ) : (
                  'Create Profile'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </PageShell>
  );
};

export default CreateProfile;
