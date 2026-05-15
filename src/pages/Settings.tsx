import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { 
  Loader2, 
  ArrowLeft, 
  User, 
  Link as LinkIcon, 
  Shield, 
  LogOut,
  Save,
  Sparkles,
  Tv
} from 'lucide-react';

const REACTION_STYLES = [
  { id: 'expressive', name: 'Expressive', desc: 'Big reactions, lots of energy' },
  { id: 'chill', name: 'Chill', desc: 'Laid back, subtle reactions' },
  { id: 'chaotic', name: 'Chaotic', desc: 'Unpredictable and wild' },
  { id: 'wholesome', name: 'Wholesome', desc: 'Positive and uplifting' },
];

const Settings: React.FC = () => {
  const { user, profile, updateProfile, signOut, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [reactionStyle, setReactionStyle] = useState('expressive');
  const [isPublic, setIsPublic] = useState(true);
  const [treyTvUid, setTreyTvUid] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'profile' | 'integrations' | 'privacy'>('profile');

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.display_name);
      setBio(profile.bio || '');
      setReactionStyle(profile.reaction_style || 'expressive');
      setIsPublic(profile.is_public);
      setTreyTvUid(profile.connected_trey_tv_uid || '');
    }
  }, [profile]);

  const handleSave = async () => {
    setError(null);
    setSaving(true);
    setSaved(false);

    const { error: updateError } = await updateProfile({
      display_name: displayName,
      bio,
      reaction_style: reactionStyle,
      is_public: isPublic,
      connected_trey_tv_uid: treyTvUid || null,
    });

    if (updateError) {
      setError(updateError.message);
    } else {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
    setSaving(false);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
      </div>
    );
  }

  if (!user) {
    navigate('/login');
    return null;
  }

  if (!profile) {
    navigate('/create-profile');
    return null;
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="border-b border-gray-800">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-gray-400 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-xl font-bold text-white">Settings</h1>
          </div>
          <Button
            onClick={handleSave}
            disabled={saving}
            size="sm"
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : saved ? (
              'Saved!'
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-gray-900/50 rounded-lg mb-6">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium transition-all ${
              activeTab === 'profile' 
                ? 'bg-gray-800 text-white' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <User className="w-4 h-4" />
            Profile
          </button>
          <button
            onClick={() => setActiveTab('integrations')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium transition-all ${
              activeTab === 'integrations' 
                ? 'bg-gray-800 text-white' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <LinkIcon className="w-4 h-4" />
            Integrations
          </button>
          <button
            onClick={() => setActiveTab('privacy')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium transition-all ${
              activeTab === 'privacy' 
                ? 'bg-gray-800 text-white' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Shield className="w-4 h-4" />
            Privacy
          </button>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            {/* Display Name */}
            <div className="space-y-2">
              <Label htmlFor="displayName" className="text-gray-300">Display Name</Label>
              <Input
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                maxLength={50}
                className="bg-gray-900/50 border-gray-700 text-white focus:border-cyan-500"
              />
            </div>

            {/* Username (read-only) */}
            <div className="space-y-2">
              <Label className="text-gray-300">Username</Label>
              <div className="flex items-center gap-2 px-3 py-2 bg-gray-900/30 border border-gray-800 rounded-md">
                <span className="text-gray-500">@</span>
                <span className="text-gray-400">{profile.username}</span>
              </div>
              <p className="text-xs text-gray-500">Username cannot be changed</p>
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <Label htmlFor="bio" className="text-gray-300">Bio</Label>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                maxLength={160}
                rows={3}
                className="bg-gray-900/50 border-gray-700 text-white focus:border-cyan-500 resize-none"
              />
              <p className="text-xs text-gray-500">{bio.length}/160</p>
            </div>

            {/* Reaction Style */}
            <div className="space-y-3">
              <Label className="text-gray-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                Reaction Style
              </Label>
              <div className="grid grid-cols-2 gap-3">
                {REACTION_STYLES.map((style) => (
                  <button
                    key={style.id}
                    type="button"
                    onClick={() => setReactionStyle(style.id)}
                    className={`p-3 rounded-lg border text-left transition-all ${
                      reactionStyle === style.id
                        ? 'border-cyan-500 bg-cyan-500/10'
                        : 'border-gray-700 bg-gray-900/30 hover:border-gray-600'
                    }`}
                  >
                    <div className="font-medium text-white text-sm">{style.name}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{style.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Integrations Tab */}
        {activeTab === 'integrations' && (
          <div className="space-y-6">
            {/* Trey TV Integration */}
            <div className="p-4 rounded-lg bg-gray-900/50 border border-gray-800">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                  <Tv className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white">Trey TV</h3>
                  <p className="text-sm text-gray-400 mt-1">
                    Connect your Trey TV account to sync your favorites and access exclusive reactions.
                  </p>
                  <div className="mt-4 space-y-2">
                    <Label htmlFor="treyTvUid" className="text-gray-300 text-sm">Trey TV User ID</Label>
                    <Input
                      id="treyTvUid"
                      value={treyTvUid}
                      onChange={(e) => setTreyTvUid(e.target.value)}
                      placeholder="Enter your Trey TV UID"
                      className="bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-cyan-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Embed Kit */}
            <div className="p-4 rounded-lg bg-gray-900/50 border border-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-white">Embed Integration Kit</h3>
                  <p className="text-sm text-gray-400 mt-1">
                    Add FWD reactions to any website or app.
                  </p>
                </div>
                <Link 
                  to="/embed/picker"
                  className="px-4 py-2 bg-cyan-500/10 text-cyan-400 rounded-lg text-sm font-medium hover:bg-cyan-500/20 transition-colors"
                >
                  Configure
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Privacy Tab */}
        {activeTab === 'privacy' && (
          <div className="space-y-6">
            {/* Public Profile */}
            <div className="p-4 rounded-lg bg-gray-900/50 border border-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-white">Public Profile</h3>
                  <p className="text-sm text-gray-400 mt-1">
                    Allow others to view your profile and favorites.
                  </p>
                </div>
                <Switch
                  checked={isPublic}
                  onCheckedChange={setIsPublic}
                />
              </div>
            </div>

            {/* Sign Out */}
            <div className="pt-6 border-t border-gray-800">
              <Button
                onClick={handleSignOut}
                variant="outline"
                className="w-full border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
