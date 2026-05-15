import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Mail, Lock, User, Eye, EyeOff, Loader2, AlertTriangle, CheckCircle2, AtSign } from 'lucide-react';
import PageShell from '@/components/PageShell';
import FWDLogo from '@/components/FWDLogo';
import { useAuth } from '@/contexts/AuthContext';

const SignUp: React.FC = () => {
  const nav = useNavigate();
  const { signUp, isSupabaseReady, loading: authLoading } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const passwordStrength = () => {
    if (password.length === 0) return { score: 0, label: '', color: '' };
    if (password.length < 6) return { score: 1, label: 'Too short', color: 'bg-red-500' };
    if (password.length < 8) return { score: 2, label: 'Weak', color: 'bg-orange-500' };
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    if (hasNumber && hasSpecial && hasUpper && password.length >= 10) return { score: 4, label: 'Strong', color: 'bg-green-500' };
    if ((hasNumber || hasSpecial) && password.length >= 8) return { score: 3, label: 'Good', color: 'bg-cyan-400' };
    return { score: 2, label: 'Fair', color: 'bg-yellow-500' };
  };

  const strength = passwordStrength();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!displayName || !username || !email || !password) {
      setError('Please fill in all fields');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (username.length < 3) {
      setError('Username must be at least 3 characters');
      return;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setError('Username can only contain letters, numbers, and underscores');
      return;
    }

    setLoading(true);

    const { error } = await signUp(email, password, displayName, username);

    if (error) {
      setError(error.message || 'Failed to create account');
      setLoading(false);
    } else {
      setSuccess(true);
      setTimeout(() => nav('/home'), 2000);
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

  if (success) {
    return (
      <PageShell hideSidebar>
        <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
          <div className="rounded-3xl border border-fuchsia-500/30 bg-black/60 p-8 backdrop-blur-xl shadow-[0_0_40px_rgba(217,70,239,0.25)]">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-fuchsia-500 to-cyan-400 shadow-[0_0_30px_rgba(217,70,239,0.6)]">
              <CheckCircle2 className="h-8 w-8 text-white" />
            </div>
            <h2 className="mt-6 text-2xl font-black">Welcome to FWD!</h2>
            <p className="mt-2 text-sm text-white/60">Your account has been created. Redirecting you to the app...</p>
            <Loader2 className="mx-auto mt-4 h-5 w-5 animate-spin text-fuchsia-400" />
          </div>
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
            Join the movement.
          </h1>
          <p className="mt-4 max-w-md text-lg text-white/70">
            Create your FWD account to save favorites, create GIFs, and sync your reaction vault across devices.
          </p>
          <div className="mt-8 flex gap-4">
            <div className="rounded-2xl border border-white/10 bg-black/40 p-4 backdrop-blur">
              <p className="text-2xl font-black text-fuchsia-300">1M+</p>
              <p className="text-xs text-white/60">GIFs Created</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/40 p-4 backdrop-blur">
              <p className="text-2xl font-black text-cyan-300">500K+</p>
              <p className="text-xs text-white/60">Active Users</p>
            </div>
          </div>
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
        <div className="mt-6 flex-1 lg:mt-0 lg:max-w-md lg:flex-none">
          <div className="rounded-3xl border border-fuchsia-500/30 bg-black/60 p-6 backdrop-blur-xl shadow-[0_0_40px_rgba(217,70,239,0.25)] lg:p-8">
            <div className="text-center lg:text-left">
              <h2 className="text-2xl font-black lg:text-3xl">Create Account</h2>
              <p className="mt-1 text-sm text-white/60">Start your FWD journey today.</p>
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
                      disabled={!isSupabaseReady}
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
                      disabled={!isSupabaseReady}
                    />
                  </div>
                </div>
              </div>

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
                    placeholder="Create a password"
                    className="w-full bg-transparent text-sm outline-none placeholder:text-white/40"
                    disabled={!isSupabaseReady}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-white/40 hover:text-white/70"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {password && (
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex flex-1 gap-1">
                      {[1, 2, 3, 4].map(i => (
                        <div key={i} className={`h-1 flex-1 rounded-full ${i <= strength.score ? strength.color : 'bg-white/10'}`} />
                      ))}
                    </div>
                    <span className="text-[10px] text-white/60">{strength.label}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/60">Confirm Password</label>
                <div className="mt-1 flex items-center gap-3 rounded-2xl border border-white/10 bg-black/50 px-4 py-3 focus-within:border-fuchsia-500/50">
                  <Lock className="h-5 w-5 text-white/40" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    className="w-full bg-transparent text-sm outline-none placeholder:text-white/40"
                    disabled={!isSupabaseReady}
                  />
                  {confirmPassword && password === confirmPassword && (
                    <CheckCircle2 className="h-5 w-5 text-green-400" />
                  )}
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
                    Creating account...
                  </>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-white/60">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-fuchsia-300 hover:text-fuchsia-200">
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
};

export default SignUp;
