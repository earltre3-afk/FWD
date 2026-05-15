import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, ArrowLeft, Mail, Lock, Sparkles } from 'lucide-react';
import FWDLogo from '@/components/FWDLogo';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await signIn(email, password);
    
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setTimeout(() => {
        navigate('/');
      }, 500);
    }
  };

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
          <div className="text-center mb-10 animate-slide-up stagger-1">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-fuchsia-500 via-purple-500 to-cyan-500 blur-2xl opacity-50 animate-pulse-glow" />
                <div className="relative p-4 rounded-2xl liquid-glass-strong neon-border">
                  <FWDLogo size="lg" showText={false} />
                </div>
              </div>
            </div>
            <h1 className="text-3xl font-black text-gradient-primary animate-text-glow">
              Welcome Back
            </h1>
            <p className="text-white/50 mt-2 text-sm">Sign in to continue your journey</p>
          </div>

          {/* Form Card */}
          <div className="liquid-glass-strong rounded-3xl p-6 neon-border animate-scale-in stagger-2">
            <form onSubmit={handleSubmit} className="space-y-5">
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
                  placeholder="Enter your password"
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
                className="w-full py-4 rounded-xl bg-gradient-to-r from-fuchsia-600 via-purple-600 to-fuchsia-600 text-white font-bold text-sm neon-glow hover:neon-glow-lg transition-all duration-300 hover:scale-[1.02] hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed btn-ripple flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Sign In</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Sign up link */}
          <p className="mt-8 text-center text-white/50 animate-slide-up stagger-3">
            {"Don't have an account? "}
            <Link to="/signup" className="text-fuchsia-400 hover:text-fuchsia-300 transition-colors font-semibold hover:underline underline-offset-4">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
