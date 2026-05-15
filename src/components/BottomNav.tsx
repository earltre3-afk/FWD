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
    <nav className="fixed bottom-0 left-0 right-0 z-40 px-3 pb-3 pt-2 lg:hidden">
      <div className="mx-auto flex max-w-md items-center justify-around rounded-3xl border border-white/10 bg-black/70 px-2 py-2 backdrop-blur-2xl shadow-[0_0_30px_rgba(168,85,247,0.25)]">
        {items.map(item => {
          const active = pathname === item.path;
          if (item.isCenter) {
            return (
              <button
                key={item.path}
                onClick={() => nav(item.path)}
                className="-mt-6 grid h-14 w-14 place-items-center rounded-full border-2 border-fuchsia-500/80 bg-black shadow-[0_0_24px_rgba(217,70,239,0.7)] hover:shadow-[0_0_32px_rgba(217,70,239,0.95)] transition"
                aria-label="Create"
              >
                <FWDLogo size="sm" showText={false} />
              </button>
            );
          }
          const Icon = item.icon!;
          return (
            <button
              key={item.path}
              onClick={() => nav(item.path)}
              className={`flex min-w-[56px] flex-col items-center gap-1 py-1 transition ${active ? 'text-fuchsia-400' : 'text-white/60 hover:text-white'}`}
            >
              <Icon className="h-5 w-5" fill={active ? 'currentColor' : 'none'} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
