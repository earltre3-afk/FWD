import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Mail, Lock, Eye, EyeOff, Loader2, AlertTriangle } from 'lucide-react';
import PageShell from '@/components/PageShell';
import FWDLogo from '@/components/FWDLogo';
import { useAuth } from '@/contexts/AuthContext';

const Login: React.FC = () => {
  const nav = useNavigate();
  const { signIn, isSupabaseReady, loading: authLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    const { error } = await signIn(email, password);
    
    if (error) {
      setError(error.message || 'Failed to sign in');
      setLoading(false);
    } else {
      nav('/home');
    }
  };

  if (authLoading) {
    return (
      <PageShell hideSidebar>
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-fuchsia-400" />
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell hideSidebar>
      <div className="flex min-h-screen flex-col px-4 py-6 lg:flex-row lg:items-center lg:justify-center lg:gap-16 lg:px-8">
        {/* Left side - branding (desktop) */}
        <div className="hidden lg:flex lg:w-1/2 lg:max-w-lg lg:flex-col lg:items-start">
          <FWDLogo size="xl" />
          <h1 className="mt-8 bg-gradient-to-r from-fuchsia-300 via-pink-300 to-cyan-300 bg-clip-text text-5xl font-black tracking-tight text-transparent xl:text-6xl">
            Welcome back to the vibe.
          </h1>
          <p className="mt-4 max-w-md text-lg text-white/70">
            Sign in to access your reaction vault, created GIFs, and sync across all your devices.
          </p>
        </div>

        {/* Mobile header */}
        <div className="flex items-center justify-between lg:hidden">
          <button onClick={() => nav(-1)} className="grid h-10 w-10 place-items-center rounded-2xl border border-white/10 bg-black/60 backdrop-blur">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <FWDLogo size="md" />
          <div className="w-10" />
        </div>

        {/* Form card */}
        <div className="mt-8 flex-1 lg:mt-0 lg:max-w-md lg:flex-none">
          <div className="rounded-3xl border border-fuchsia-500/30 bg-black/60 p-6 backdrop-blur-xl shadow-[0_0_40px_rgba(217,70,239,0.25)] lg:p-8">
            <div className="text-center lg:text-left">
              <h2 className="text-2xl font-black lg:text-3xl">Sign In</h2>
              <p className="mt-1 text-sm text-white/60">Forward the feeling. Pick up where you left off.</p>
            </div>

            {!isSupabaseReady && (
              <div className="mt-4 flex items-start gap-2 rounded-2xl border border-amber-500/40 bg-amber-500/10 p-3 text-xs text-amber-200">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <p>Auth is not configured. Add Supabase environment variables to enable authentication.</p>
              </div>
            )}

            {error && (
              <div className="mt-4 flex items-start gap-2 rounded-2xl border border-red-500/40 bg-red-500/10 p-3 text-xs text-red-200">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/60">Email</label>
                <div className="mt-1 flex items-center gap-3 rounded-2xl border border-white/10 bg-black/50 px-4 py-3 focus-within:border-fuchsia-500/50">
                  <Mail className="h-5 w-5 text-white/40" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full bg-transparent text-sm outline-none placeholder:text-white/40"
                    disabled={!isSupabaseReady}
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/60">Password</label>
                <div className="mt-1 flex items-center gap-3 rounded-2xl border border-white/10 bg-black/50 px-4 py-3 focus-within:border-fuchsia-500/50">
                  <Lock className="h-5 w-5 text-white/40" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full bg-transparent text-sm outline-none placeholder:text-white/40"
                    disabled={!isSupabaseReady}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-white/40 hover:text-white/70"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !isSupabaseReady}
                className={`mt-6 flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-base font-bold transition ${
                  loading || !isSupabaseReady
                    ? 'bg-white/10 text-white/50 cursor-not-allowed'
                    : 'bg-gradient-to-r from-fuchsia-600 via-purple-600 to-pink-600 text-white shadow-[0_0_30px_rgba(217,70,239,0.5)] hover:shadow-[0_0_45px_rgba(217,70,239,0.7)]'
                }`}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-white/60">
              {"Don't have an account? "}
              <Link to="/signup" className="font-semibold text-fuchsia-300 hover:text-fuchsia-200">
                Sign up
              </Link>
            </div>

            <button
              onClick={() => nav('/home')}
              className="mt-4 w-full rounded-2xl border border-white/10 bg-black/40 py-3 text-sm font-semibold text-white/70 hover:border-fuchsia-500/30 hover:text-white"
            >
              Continue as guest
            </button>
          </div>
        </div>
      </div>
    </PageShell>
  );
};

export default Login;
