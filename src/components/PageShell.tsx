import React from 'react';

const PageShell: React.FC<{ children: React.ReactNode; hideNav?: boolean; }> = ({ children }) => {
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-black text-white">
      {/* Premium Aurora Backdrop */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        {/* Primary glow orbs with liquid animation */}
        <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-fuchsia-600/40 via-purple-600/30 to-pink-600/20 blur-[120px] animate-pulse-glow animate-liquid" />
        <div className="absolute top-1/4 -right-32 h-[400px] w-[400px] rounded-full bg-gradient-to-bl from-cyan-500/30 via-blue-500/20 to-teal-500/10 blur-[100px] animate-pulse-glow animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-0 left-1/3 h-[450px] w-[450px] rounded-full bg-gradient-to-tr from-purple-700/35 via-fuchsia-600/25 to-pink-500/15 blur-[130px] animate-pulse-glow" style={{ animationDelay: '4s' }} />
        
        {/* Secondary subtle orbs */}
        <div className="absolute top-1/2 left-1/4 h-[200px] w-[200px] rounded-full bg-cyan-400/15 blur-[80px] animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-1/4 right-1/4 h-[250px] w-[250px] rounded-full bg-fuchsia-500/20 blur-[90px] animate-float" style={{ animationDelay: '3s' }} />
        
        {/* Aurora gradient overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(168,85,247,0.25),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_80%_50%,rgba(34,211,238,0.12),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_20%_80%,rgba(236,72,153,0.15),transparent_50%)]" />
        
        {/* Noise texture overlay for depth */}
        <div className="absolute inset-0 opacity-[0.015] mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")' }} />
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '50px 50px' }} />
      </div>
      
      <div className="mx-auto w-full max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-4xl animate-fade-in">
        {children}
      </div>
    </div>
  );
};

export default PageShell;
