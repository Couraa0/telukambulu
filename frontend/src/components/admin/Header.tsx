import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, Globe, User, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (val: boolean) => void;
  collapsed: boolean;
  setCollapsed: (val: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  sidebarOpen,
  setSidebarOpen,
}) => {
  const { user, logout } = useAuth();
  
  const today = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <header className="sticky top-0 z-20 h-16 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between px-4 sm:px-6 shadow-sm no-print">
      
      {/* Mobile Toggle Button & Date */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 -ml-2 rounded-xl text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 lg:hidden"
        >
          <Menu size={20} />
        </button>
        <span className="hidden sm:inline-block text-xs font-semibold text-slate-400 dark:text-slate-500">
          {today}
        </span>
      </div>

      {/* Action group */}
      <div className="flex items-center gap-3">
        
        {/* View Public Portal */}
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-850 transition-colors"
          target="_blank"
        >
          <Globe size={14} />
          <span>Lihat Website</span>
        </Link>

        {/* User profile dropdown info */}
        {user && (
          <div className="flex items-center gap-2 border-l border-slate-100 dark:border-slate-800 pl-3">
            <div className="hidden md:block text-right">
              <span className="block text-xs font-bold text-slate-800 dark:text-slate-200">{user.nama}</span>
              <span className="block text-[9px] font-semibold text-slate-400 dark:text-slate-500">{user.role}</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-850 flex items-center justify-center text-slate-500 dark:text-slate-400">
              <User size={16} />
            </div>
          </div>
        )}

      </div>
    </header>
  );
};
export default Header;
