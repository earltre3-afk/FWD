import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getSupabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, User, Sparkles } from 'lucide-react';

const REACTION_STYLES = [
  { id: 'expressive', name: 'Expressive', desc: 'Big reactions, lots of energy' },
  { id: 'chill', name: 'Chill', desc: 'Laid back, subtle reactions' },
  { id: 'chaotic', name: 'Chaotic', desc: 'Unpredictable and wild' },
  { id: 'wholesome', name: 'Wholesome', desc: 'Positive and uplifting' },
];

const CreateProfile: React.FC = () => {
  const { user, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const supabase = getSupabase();

  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [reactionStyle, setReactionStyle] = useState('expressive');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [checkingUsername, setCheckingUsername] = useState(false);

  const checkUsername = async (value: string) => {
    if (!supabase || value.length < 3) {
      setUsernameAvailable(null);
      return;
    }
    
    setCheckingUsername(true);
    const { data } = await supabase
      .from('fwd_profiles')
      .select('username')
      .eq('username', value.toLowerCase())
      .single();
    
    setUsernameAvailable(!data);
    setCheckingUsername(false);
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '');
    setUsername(value);
    if (value.length >= 3) {
      checkUsername(value);
    } else {
      setUsernameAvailable(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase || !user) return;
    
    setError(null);
    setLoading(true);

    if (!usernameAvailable) {
      setError('Username is not available');
      setLoading(false);
      return;
    }

    const { error: insertError } = await supabase
      .from('fwd_profiles')
      .insert({
        user_id: user.id,
        display_name: displayName,
        username: username.toLowerCase(),
        bio,
        reaction_style: reactionStyle,
        is_public: true,
      });

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
    } else {
      await refreshProfile();
      navigate('/');
    }
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-lg">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center mx-auto mb-4">
              <User className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Create Your Profile</h1>
            <p className="text-gray-400">Set up your FWD identity</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Display Name */}
            <div className="space-y-2">
              <Label htmlFor="displayName" className="text-gray-300">Display Name</Label>
              <Input
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your name"
                required
                maxLength={50}
                className="bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-cyan-500"
              />
            </div>

            {/* Username */}
            <div className="space-y-2">
              <Label htmlFor="username" className="text-gray-300">Username</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">@</span>
                <Input
                  id="username"
                  value={username}
                  onChange={handleUsernameChange}
                  placeholder="username"
                  required
                  minLength={3}
                  maxLength={20}
                  className="bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-cyan-500 pl-8"
                />
                {checkingUsername && (
                  <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 animate-spin" />
                )}
                {!checkingUsername && usernameAvailable === true && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-400 text-sm">Available</span>
                )}
                {!checkingUsername && usernameAvailable === false && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-red-400 text-sm">Taken</span>
                )}
              </div>
              <p className="text-xs text-gray-500">Lowercase letters, numbers, and underscores only</p>
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <Label htmlFor="bio" className="text-gray-300">Bio (optional)</Label>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us about yourself..."
                maxLength={160}
                rows={3}
                className="bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-cyan-500 resize-none"
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

            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading || !usernameAvailable}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-medium py-3"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating Profile...
                </>
              ) : (
                'Create Profile'
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateProfile;
