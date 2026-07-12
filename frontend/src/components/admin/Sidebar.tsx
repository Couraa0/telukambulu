import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Megaphone,
  Trees,
  ShoppingBag,
  Palmtree,
  MessageSquareWarning,
  Image,
  Contact,
  Users,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (val: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed, setCollapsed }) => {
  const location = useLocation();
  const { user, logout, hasRole } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  // Menu Definition with allowed roles
  const menus = [
    {
      label: 'Dashboard',
      icon: LayoutDashboard,
      path: '/admin/dashboard',
      roles: ['Super Admin', 'Admin Konten', 'Admin Pengaduan', 'Admin Profil', 'Viewer']
    },
    {
      label: 'Profil Desa',
      icon: ShieldCheck,
      path: '/admin/profil-desa',
      roles: ['Super Admin', 'Admin Profil', 'Viewer']
    },
    {
      label: 'Pengumuman',
      icon: Megaphone,
      path: '/admin/pengumuman',
      roles: ['Super Admin', 'Admin Konten', 'Viewer']
    },
    {
      label: 'Berita',
      icon: FileText,
      path: '/admin/berita',
      roles: ['Super Admin', 'Admin Konten', 'Viewer']
    },
    {
      label: 'Sumber Daya Alam',
      icon: Trees,
      path: '/admin/pesona-desa/sda',
      roles: ['Super Admin', 'Admin Konten', 'Viewer']
    },
    {
      label: 'Produk Unggulan',
      icon: ShoppingBag,
      path: '/admin/pesona-desa/produk-unggulan',
      roles: ['Super Admin', 'Admin Konten', 'Viewer']
    },
    {
      label: 'Destinasi Wisata',
      icon: Palmtree,
      path: '/admin/pesona-desa/destinasi-wisata',
      roles: ['Super Admin', 'Admin Konten', 'Viewer']
    },
    {
      label: 'Pengaduan',
      icon: MessageSquareWarning,
      path: '/admin/pengaduan',
      roles: ['Super Admin', 'Admin Pengaduan', 'Viewer']
    },
    {
      label: 'Galeri Foto',
      icon: Image,
      path: '/admin/galeri',
      roles: ['Super Admin', 'Admin Konten', 'Viewer']
    },
    {
      label: 'Kontak & Layanan',
      icon: Contact,
      path: '/admin/kontak',
      roles: ['Super Admin', 'Admin Profil', 'Viewer']
    },
    {
      label: 'User Admin',
      icon: Users,
      path: '/admin/users',
      roles: ['Super Admin']
    }
  ];

  // Filter menu by user role
  const visibleMenus = menus.filter(menu => hasRole(menu.roles));

  return (
    <aside
      className={`fixed top-0 left-0 h-screen z-30 bg-slate-900 text-slate-400 border-r border-slate-800 transition-all duration-300 flex flex-col ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Sidebar Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800">
        {!collapsed && (
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-655 rounded-lg flex items-center justify-center text-white font-extrabold text-sm shadow-md shadow-primary-600/10">
              T
            </div>
            <div>
              <span className="block font-sans font-black text-xs leading-none text-white tracking-wider">
                TELUKAMBULU
              </span>
              <span className="block text-[8px] font-bold uppercase tracking-wider text-slate-500 mt-0.5">
                Dashboard Admin
              </span>
            </div>
          </Link>
        )}
        {collapsed && (
          <Link to="/" className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold text-sm mx-auto">
            T
          </Link>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800 transition-colors hidden sm:block"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Admin Quick Profile */}
      {!collapsed && user && (
        <div className="p-4 border-b border-slate-800 bg-slate-950/30 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-primary-500 font-extrabold text-sm">
            {user.nama.substring(0, 2).toUpperCase()}
          </div>
          <div className="overflow-hidden">
            <span className="block text-xs font-bold text-slate-200 truncate">{user.nama}</span>
            <span className="inline-block mt-0.5 bg-slate-800 text-slate-400 font-bold text-[9px] px-2 py-0.5 rounded-full border border-slate-750">
              {user.role}
            </span>
          </div>
        </div>
      )}

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-1 no-scrollbar">
        {visibleMenus.map((menu, idx) => {
          const Icon = menu.icon;
          return (
            <Link
              key={idx}
              to={menu.path}
              className={`flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                isActive(menu.path)
                  ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/10'
                  : 'hover:bg-slate-800/60 hover:text-slate-200'
              }`}
              title={collapsed ? menu.label : ''}
            >
              <Icon size={18} className="flex-shrink-0" />
              {!collapsed && <span>{menu.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Logout Action */}
      <div className="p-3 border-t border-slate-800">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-rose-400 hover:bg-rose-950/20 hover:text-rose-350 transition-colors"
          title={collapsed ? 'Keluar' : ''}
        >
          <LogOut size={18} className="flex-shrink-0" />
          {!collapsed && <span>Keluar</span>}
        </button>
      </div>
    </aside>
  );
};
export default Sidebar;
