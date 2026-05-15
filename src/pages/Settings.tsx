import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, User, AtSign, FileText, Globe, Lock, Loader2, AlertTriangle, CheckCircle2, Tv, Link2, Trash2, LogOut, Shield, Bell, Palette } from 'lucide-react';
import PageShell from '@/components/PageShell';
import FWDLogo from '@/components/FWDLogo';
import BottomNav from '@/components/BottomNav';
import { useAuth } from '@/contexts/AuthContext';

const REACTION_STYLES = [
  { id: 'default', label: 'Classic', emoji: '😊' },
  { id: 'expressive', label: 'Expressive', emoji: '🔥' },
  { id: 'chill', label: 'Chill', emoji: '😎' },
  { id: 'chaotic', label: 'Chaotic', emoji: '🤪' },
];

const Settings: React.FC = () => {
  const nav = useNavigate();
  const { user, profile, updateProfile, signOut, isSupabaseReady, refreshProfile } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);

  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [reactionStyle, setReactionStyle] = useState('default');
  const [isPublic, setIsPublic] = useState(true);
  const [treyTvUid, setTreyTvUid] = useState('');
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'profile' | 'integrations' | 'account'>('profile');

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.display_name || '');
      setUsername(profile.username || '');
      setBio(profile.bio || '');
      setReactionStyle(profile.reaction_style || 'default');
      setIsPublic(profile.is_public);
      setTreyTvUid(profile.connected_trey_tv_uid || '');
      setAvatarPreview(profile.avatar_url);
    }
  }, [profile]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatarPreview(url);
    }
  };

  const handleSave = async () => {
    setError(null);
    setSaved(false);
    
    if (!displayName || !username) {
      setError('Display name and username are required');
      return;
    }

    setLoading(true);

    const { error } = await updateProfile({
      display_name: displayName,
      username: username.toLowerCase().replace(/\s+/g, ''),
      bio: bio || null,
      reaction_style: reactionStyle,
      is_public: isPublic,
      connected_trey_tv_uid: treyTvUid || null,
      avatar_url: avatarPreview,
    });

    if (error) {
      setError(error.message || 'Failed to save changes');
    } else {
      setSaved(true);
      await refreshProfile();
      setTimeout(() => setSaved(false), 2000);
    }
    setLoading(false);
  };

  const handleSignOut = async () => {
    await signOut();
    nav('/');
  };

  if (!user) {
    return (
      <PageShell>
        <div className="flex min-h-screen flex-col items-center justify-center px-4 pb-32 text-center">
          <div className="rounded-3xl border border-fuchsia-500/30 bg-black/60 p-8 backdrop-blur-xl">
            <AlertTriangle className="mx-auto h-12 w-12 text-amber-400" />
            <h2 className="mt-4 text-xl font-bold">Sign in required</h2>
            <p className="mt-2 text-sm text-white/60">You need to sign in to access settings.</p>
            <button
              onClick={() => nav('/login')}
              className="mt-6 rounded-2xl bg-gradient-to-r from-fuchsia-600 to-purple-600 px-6 py-3 text-sm font-bold"
            >
              Sign In
            </button>
          </div>
        </div>
        <BottomNav />
      </PageShell>
    );
  }

  return (
    <PageShell>
      <div className="px-4 pb-32 pt-6 lg:px-8 lg:py-10">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button onClick={() => nav(-1)} className="grid h-10 w-10 place-items-center rounded-2xl border border-white/10 bg-black/60 backdrop-blur lg:hidden">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <FWDLogo size="md" className="lg:hidden" />
          <div className="w-10 lg:hidden" />
          <h1 className="hidden text-2xl font-black lg:block">Settings</h1>
          <div className="hidden lg:block" />
        </div>

        <h1 className="mt-6 text-2xl font-black lg:hidden">Settings</h1>

        {/* Tabs */}
        <div className="mt-6 flex gap-2 rounded-2xl border border-white/10 bg-black/50 p-1 backdrop-blur lg:max-w-md">
          {[
            { id: 'profile', label: 'Profile', icon: User },
            { id: 'integrations', label: 'Integrations', icon: Link2 },
            { id: 'account', label: 'Account', icon: Shield },
          ].map(tab => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition ${
                  active
                    ? 'bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white shadow-[0_0_18px_rgba(217,70,239,0.5)]'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {error && (
          <div className="mt-4 flex items-start gap-2 rounded-2xl border border-red-500/40 bg-red-500/10 p-3 text-xs text-red-200">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {saved && (
          <div className="mt-4 flex items-start gap-2 rounded-2xl border border-green-500/40 bg-green-500/10 p-3 text-xs text-green-200">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <p>Changes saved successfully!</p>
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="mt-6 space-y-6 lg:max-w-lg">
            {/* Avatar */}
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border-2 border-fuchsia-500/50 bg-black/60 transition hover:border-fuchsia-400"
              >
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Avatar" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-white/40">
                    <Camera className="h-8 w-8" />
                  </div>
                )}
              </button>
              <input ref={fileRef} type="file" accept="image/*" hidden onChange={handleAvatarChange} />
              <div>
                <p className="font-bold">{displayName || 'Your Name'}</p>
                <p className="text-sm text-white/50">@{username || 'username'}</p>
                <button
                  onClick={() => fileRef.current?.click()}
                  className="mt-1 text-xs font-semibold text-fuchsia-300 hover:text-fuchsia-200"
                >
                  Change avatar
                </button>
              </div>
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
              <div className="mt-2 grid grid-cols-4 gap-2">
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
                    <span className="text-xl">{style.emoji}</span>
                    <span className="text-[10px] font-bold">{style.label}</span>
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

            {/* Save Button */}
            <button
              onClick={handleSave}
              disabled={loading}
              className={`flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-base font-bold transition ${
                loading
                  ? 'bg-white/10 text-white/50 cursor-not-allowed'
                  : 'bg-gradient-to-r from-fuchsia-600 via-purple-600 to-pink-600 text-white shadow-[0_0_30px_rgba(217,70,239,0.5)] hover:shadow-[0_0_45px_rgba(217,70,239,0.7)]'
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        )}

        {/* Integrations Tab */}
        {activeTab === 'integrations' && (
          <div className="mt-6 space-y-6 lg:max-w-lg">
            {/* Trey TV Integration */}
            <div className="rounded-3xl border border-cyan-500/30 bg-black/60 p-6 backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-cyan-500/20 text-cyan-400">
                  <Tv className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold">Trey TV Integration</h3>
                  <p className="text-xs text-white/50">Connect your Trey TV account for tracking</p>
                </div>
              </div>

              <div className="mt-4">
                <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/60">Trey TV User ID</label>
                <div className="mt-1 flex items-center gap-3 rounded-2xl border border-white/10 bg-black/50 px-4 py-3 focus-within:border-cyan-500/50">
                  <input
                    type="text"
                    value={treyTvUid}
                    onChange={(e) => setTreyTvUid(e.target.value)}
                    placeholder="Enter your Trey TV user ID"
                    className="w-full bg-transparent text-sm outline-none placeholder:text-white/40"
                  />
                </div>
                <p className="mt-1 text-[10px] text-white/40">This links your FWD GIF usage to your Trey TV account</p>
              </div>

              <button
                onClick={handleSave}
                disabled={loading}
                className="mt-4 w-full rounded-xl bg-cyan-500/20 py-3 text-sm font-bold text-cyan-300 hover:bg-cyan-500/30"
              >
                {treyTvUid ? 'Update Connection' : 'Connect Trey TV'}
              </button>
            </div>

            {/* Embed Picker */}
            <div className="rounded-3xl border border-fuchsia-500/30 bg-black/60 p-6 backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-fuchsia-500/20 text-fuchsia-400">
                  <Link2 className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold">FWD Embed Picker</h3>
                  <p className="text-xs text-white/50">Embed the GIF picker in your app</p>
                </div>
              </div>

              <div className="mt-4 rounded-xl border border-white/10 bg-black/60 p-3">
                <code className="text-xs text-fuchsia-300 break-all">
                  {`<iframe src="${window.location.origin}/embed/picker?user_uid=${treyTvUid || 'YOUR_UID'}" />`}
                </code>
              </div>

              <button
                onClick={() => nav('/embed/picker')}
                className="mt-4 w-full rounded-xl border border-fuchsia-500/30 bg-black/40 py-3 text-sm font-bold text-fuchsia-300 hover:bg-fuchsia-500/10"
              >
                Preview Picker
              </button>
            </div>
          </div>
        )}

        {/* Account Tab */}
        {activeTab === 'account' && (
          <div className="mt-6 space-y-4 lg:max-w-lg">
            <div className="rounded-2xl border border-white/10 bg-black/50 p-4 backdrop-blur">
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/60">Email</p>
              <p className="mt-1 text-sm">{user.email}</p>
            </div>

            <button
              onClick={handleSignOut}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-black/50 py-4 text-sm font-bold text-white/70 hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400"
            >
              <LogOut className="h-5 w-5" />
              Sign Out
            </button>

            <button
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-red-500/30 bg-red-500/10 py-4 text-sm font-bold text-red-400 hover:bg-red-500/20"
            >
              <Trash2 className="h-5 w-5" />
              Delete Account
            </button>
          </div>
        )}
      </div>
      <BottomNav />
    </PageShell>
  );
};

export default Settings;
