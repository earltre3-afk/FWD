import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, ArrowLeft, Check, Mail, Lock, Sparkles, Shield } from 'lucide-react';
import FWDLogo from '@/components/FWDLogo';

const Signup: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    const { error } = await signUp(email, password);
    
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setTimeout(() => {
        navigate('/create-profile');
      }, 1500);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4 relative overflow-hidden">
        {/* Background */}
        <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-fuchsia-600/40 via-purple-600/30 to-pink-600/20 blur-[120px] animate-pulse-glow" />
          <div className="absolute top-1/4 -right-32 h-[400px] w-[400px] rounded-full bg-gradient-to-bl from-cyan-500/30 via-blue-500/20 to-teal-500/10 blur-[100px] animate-pulse-glow" style={{ animationDelay: '2s' }} />
        </div>
        
        <div className="text-center animate-scale-in">
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-fuchsia-500 to-cyan-500 blur-2xl opacity-60 animate-pulse-glow" />
            <div className="relative w-20 h-20 rounded-full bg-gradient-to-r from-fuchsia-600 to-cyan-500 flex items-center justify-center neon-glow-lg">
              <Check className="w-10 h-10 text-white animate-bounce" />
            </div>
          </div>
          <h2 className="text-3xl font-black text-white mb-3 animate-text-glow">Account Created!</h2>
          <p className="text-white/50">Redirecting to create your profile...</p>
          <div className="mt-6 flex justify-center gap-1">
            {[0, 1, 2].map(i => (
              <div key={i} className="w-2 h-2 rounded-full bg-fuchsia-500 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex flex-col overflow-hidden relative">
      {/* Premium Aurora Backdrop */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-fuchsia-600/40 via-purple-600/30 to-pink-600/20 blur-[120px] animate-pulse-glow animate-liquid" />
        <div className="absolute top-1/4 -right-32 h-[400px] w-[400px] rounded-full bg-gradient-to-bl from-cyan-500/30 via-blue-500/20 to-teal-500/10 blur-[100px] animate-pulse-glow animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-0 left-1/3 h-[450px] w-[450px] rounded-full bg-gradient-to-tr from-purple-700/35 via-fuchsia-600/25 to-pink-500/15 blur-[130px] animate-pulse-glow" style={{ animationDelay: '4s' }} />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(168,85,247,0.25),transparent_50%)]" />
      </div>

      {/* Header */}
      <div className="p-4 animate-slide-up">
        <Link to="/" className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-all duration-300 group">
          <div className="p-2 rounded-xl liquid-glass group-hover:neon-glow-sm transition-all">
            <ArrowLeft className="w-4 h-4" />
          </div>
          <span className="text-sm font-medium">Back</span>
        </Link>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 pb-8">
        <div className="w-full max-w-md">
          {/* Logo with animation */}
          <div className="text-center mb-8 animate-slide-up stagger-1">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-fuchsia-500 via-purple-500 to-cyan-500 blur-2xl opacity-50 animate-pulse-glow" />
                <div className="relative p-4 rounded-2xl liquid-glass-strong neon-border">
                  <FWDLogo size="lg" showText={false} />
                </div>
              </div>
            </div>
            <h1 className="text-3xl font-black text-gradient-primary animate-text-glow">
              Join FWD
            </h1>
            <p className="text-white/50 mt-2 text-sm">Create your account and start vibing</p>
          </div>

          {/* Form Card */}
          <div className="liquid-glass-strong rounded-3xl p-6 neon-border animate-scale-in stagger-2">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-white/70 flex items-center gap-2">
                  <Mail className="h-4 w-4 text-fuchsia-400" />
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full px-4 py-3.5 rounded-xl input-premium text-white placeholder:text-white/30 outline-none transition-all duration-300"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-white/70 flex items-center gap-2">
                  <Lock className="h-4 w-4 text-fuchsia-400" />
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                  required
                  className="w-full px-4 py-3.5 rounded-xl input-premium text-white placeholder:text-white/30 outline-none transition-all duration-300"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium text-white/70 flex items-center gap-2">
                  <Shield className="h-4 w-4 text-fuchsia-400" />
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  required
                  className="w-full px-4 py-3.5 rounded-xl input-premium text-white placeholder:text-white/30 outline-none transition-all duration-300"
                />
              </div>

              {error && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm animate-scale-in flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-fuchsia-600 via-purple-600 to-fuchsia-600 text-white font-bold text-sm neon-glow hover:neon-glow-lg transition-all duration-300 hover:scale-[1.02] hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed btn-ripple flex items-center justify-center gap-2 mt-6"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Creating account...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Create Account</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Sign in link */}
          <p className="mt-8 text-center text-white/50 animate-slide-up stagger-3">
            Already have an account?{' '}
            <Link to="/login" className="text-fuchsia-400 hover:text-fuchsia-300 transition-colors font-semibold hover:underline underline-offset-4">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
