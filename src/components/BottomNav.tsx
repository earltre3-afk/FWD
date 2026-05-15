import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Search, Heart, User } from 'lucide-react';
import FWDLogo from './FWDLogo';

const items = [
  { path: '/home', label: 'Home', icon: Home },
  { path: '/search', label: 'Search', icon: Search },
  { path: '/create', label: 'Create', icon: null, isCenter: true },
  { path: '/favorites', label: 'Favorites', icon: Heart },
  { path: '/profile', label: 'Profile', icon: User },
];

const BottomNav: React.FC = () => {
  const nav = useNavigate();
  const { pathname } = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 px-3 pb-4 pt-2">
      <div className="mx-auto flex max-w-md items-center justify-around rounded-[28px] liquid-glass-strong neon-border px-2 py-2.5">
        {items.map((item, idx) => {
          const active = pathname === item.path;
          if (item.isCenter) {
            return (
              <button
                key={item.path}
                onClick={() => nav(item.path)}
                className="group -mt-8 relative"
                aria-label="Create"
              >
                {/* Outer glow ring */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-fuchsia-500 via-purple-500 to-cyan-500 blur-lg opacity-60 group-hover:opacity-90 transition-opacity animate-border-flow" style={{ backgroundSize: '200% 200%' }} />
                
                {/* Main button */}
                <div className="relative grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-fuchsia-600 via-purple-600 to-fuchsia-700 border-2 border-fuchsia-400/50 neon-glow-lg hover:neon-glow transition-all duration-300 hover:scale-110 hover:-translate-y-1">
                  <FWDLogo size="sm" showText={false} />
                </div>
                
                {/* Pulse ring animation */}
                <div className="absolute inset-0 rounded-full border-2 border-fuchsia-500/50 animate-ping" style={{ animationDuration: '2s' }} />
              </button>
            );
          }
          const Icon = item.icon!;
          return (
            <button
              key={item.path}
              onClick={() => nav(item.path)}
              className={`group flex min-w-[60px] flex-col items-center gap-1.5 py-2 transition-all duration-300 ${active ? 'text-fuchsia-400' : 'text-white/50 hover:text-white/90'}`}
              style={{ animationDelay: `${idx * 0.05}s` }}
            >
              <div className={`relative p-2 rounded-xl transition-all duration-300 ${active ? 'bg-fuchsia-500/20 neon-glow-sm' : 'group-hover:bg-white/5'}`}>
                <Icon className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" fill={active ? 'currentColor' : 'none'} />
                {active && (
                  <div className="absolute inset-0 rounded-xl bg-fuchsia-500/10 animate-pulse" />
                )}
              </div>
              <span className={`text-[10px] font-semibold tracking-wide transition-all duration-300 ${active ? 'text-fuchsia-300' : ''}`}>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
