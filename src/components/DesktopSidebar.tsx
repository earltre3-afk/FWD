import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Search, Heart, User, Plus, Settings, LogOut, Tv } from 'lucide-react';
import FWDLogo from './FWDLogo';
import { useAuth } from '@/contexts/AuthContext';

const mainItems = [
  { path: '/home', label: 'Home', icon: Home },
  { path: '/search', label: 'Search', icon: Search },
  { path: '/create', label: 'Create', icon: Plus },
  { path: '/favorites', label: 'Favorites', icon: Heart },
  { path: '/profile', label: 'Profile', icon: User },
];

const DesktopSidebar: React.FC = () => {
  const nav = useNavigate();
  const { pathname } = useLocation();
  const { user, profile, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    nav('/');
  };

  return (
    <aside className="fixed left-0 top-0 bottom-0 z-50 hidden w-64 flex-col border-r border-white/10 bg-black/80 backdrop-blur-xl lg:flex xl:w-72">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-6">
        <button onClick={() => nav('/')} className="flex items-center gap-3">
          <FWDLogo size="md" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4">
        <ul className="space-y-1">
          {mainItems.map(item => {
            const active = pathname === item.path;
            const Icon = item.icon;
            return (
              <li key={item.path}>
                <button
                  onClick={() => nav(item.path)}
                  className={`group flex w-full items-center gap-4 rounded-2xl px-4 py-3 text-left transition ${
                    active
                      ? 'bg-gradient-to-r from-fuchsia-600/20 to-purple-600/20 text-white shadow-[0_0_20px_rgba(217,70,239,0.3)]'
                      : 'text-white/70 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <div className={`grid h-10 w-10 place-items-center rounded-xl transition ${
                    active
                      ? 'bg-gradient-to-br from-fuchsia-500 to-purple-600 shadow-[0_0_16px_rgba(217,70,239,0.6)]'
                      : 'bg-white/5 group-hover:bg-white/10'
                  }`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-semibold">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>

        {/* Trey TV Link */}
        <div className="mt-6 px-1">
          <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">Integrations</p>
          <button
            onClick={() => nav('/embed/picker')}
            className="group flex w-full items-center gap-4 rounded-2xl px-4 py-3 text-left text-white/70 transition hover:bg-white/5 hover:text-white"
          >
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-cyan-500/10 text-cyan-400">
              <Tv className="h-5 w-5" />
            </div>
            <div>
              <span className="text-sm font-semibold">Trey TV Kit</span>
              <p className="text-[10px] text-white/50">Embed GIF Picker</p>
            </div>
          </button>
        </div>
      </nav>

      {/* User section */}
      <div className="border-t border-white/10 p-4">
        {user && profile ? (
          <div className="flex items-center gap-3">
            <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full border-2 border-fuchsia-500/50">
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt={profile.display_name} className="h-full w-full object-cover" />
              ) : (
                <div className="grid h-full w-full place-items-center bg-gradient-to-br from-fuchsia-600 to-purple-600 text-white font-bold">
                  {profile.display_name?.charAt(0).toUpperCase() || 'U'}
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold">{profile.display_name}</p>
              <p className="truncate text-xs text-white/50">@{profile.username}</p>
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => nav('/settings')}
                className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-black/60 text-white/70 hover:bg-white/10 hover:text-white"
                aria-label="Settings"
              >
                <Settings className="h-4 w-4" />
              </button>
              <button
                onClick={handleSignOut}
                className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-black/60 text-white/70 hover:bg-red-500/20 hover:text-red-400"
                aria-label="Sign out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => nav('/login')}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-fuchsia-600 to-purple-600 py-3 text-sm font-bold text-white shadow-[0_0_20px_rgba(217,70,239,0.5)] transition hover:shadow-[0_0_30px_rgba(217,70,239,0.7)]"
          >
            <User className="h-4 w-4" />
            Sign In
          </button>
        )}
      </div>
    </aside>
  );
};

export default DesktopSidebar;
