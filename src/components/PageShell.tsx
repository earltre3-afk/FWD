import React from 'react';
import DesktopSidebar from './DesktopSidebar';

type PageShellProps = {
  children: React.ReactNode;
  hideNav?: boolean;
  hideSidebar?: boolean;
  fullWidth?: boolean;
};

const PageShell: React.FC<PageShellProps> = ({ children, hideSidebar = false, fullWidth = false }) => {
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-black text-white">
      {/* Neon ambient backdrop */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-32 -left-24 h-96 w-96 rounded-full bg-fuchsia-600/30 blur-[140px]" />
        <div className="absolute top-1/3 -right-24 h-96 w-96 rounded-full bg-cyan-500/20 blur-[140px]" />
        <div className="absolute bottom-0 left-1/4 h-96 w-96 rounded-full bg-purple-700/30 blur-[160px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(168,85,247,0.18),transparent_60%),radial-gradient(ellipse_at_bottom,rgba(236,72,153,0.15),transparent_60%)]" />
      </div>

      {/* Desktop sidebar - hidden on mobile, visible on lg+ */}
      {!hideSidebar && <DesktopSidebar />}

      {/* Main content with sidebar offset on desktop */}
      <div className={`${!hideSidebar ? 'lg:ml-64 xl:ml-72' : ''}`}>
        <div className={`mx-auto w-full ${fullWidth ? 'max-w-none' : 'max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl'}`}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default PageShell;
