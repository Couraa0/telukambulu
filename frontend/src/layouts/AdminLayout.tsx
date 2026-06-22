import React, { useState } from 'react';
import { Outlet, Navigate, useLocation, Link } from 'react-router-dom';
import Sidebar from '../components/admin/Sidebar';
import Header from '../components/admin/Header';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, Home } from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, loading, hasRole } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-500">
        Memuat...
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // Helper to map paths to required roles
  const checkRoutePermission = (): boolean => {
    const path = location.pathname;
    if (path === '/admin/dashboard') return true; // Available to all roles
    
    if (path.startsWith('/admin/profil-desa') || path.startsWith('/admin/kontak')) {
      return hasRole(['Super Admin', 'Admin Profil']);
    }
    
    if (
      path.startsWith('/admin/berita') ||
      path.startsWith('/admin/pengumuman') ||
      path.startsWith('/admin/galeri') ||
      path.startsWith('/admin/pesona-desa')
    ) {
      return hasRole(['Super Admin', 'Admin Konten']);
    }
    
    if (path.startsWith('/admin/pengaduan')) {
      return hasRole(['Super Admin', 'Admin Pengaduan']);
    }
    
    if (path.startsWith('/admin/users')) {
      return hasRole('Super Admin');
    }

    return true; // Catch-all for undefined subpaths
  };

  const isAllowed = checkRoutePermission();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 flex">
      {/* Sidebar (Desktop) */}
      <div className={`hidden lg:block transition-all duration-300 flex-shrink-0 ${collapsed ? 'w-20' : 'w-64'}`}>
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      </div>

      {/* Sidebar Drawer (Mobile) */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden flex">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          ></div>
          
          <div className="relative w-64 bg-slate-900 flex flex-col h-full z-50 animate-slide-in">
            <Sidebar collapsed={false} setCollapsed={() => {}} />
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />
        
        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl w-full mx-auto">
          {isAllowed ? (
            <Outlet />
          ) : (
            /* Styled Access Denied Page */
            <div className="flex flex-col items-center justify-center text-center py-20 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 sm:p-10 shadow-sm max-w-xl mx-auto mt-10">
              <div className="p-4 bg-rose-50 dark:bg-rose-950/20 rounded-full text-rose-500 mb-6">
                <ShieldAlert size={48} />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white mb-2 font-sans">
                Akses Ditolak
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 max-w-md">
                Akun Anda ({user.nama} - <span className="font-semibold text-primary-600">{user.role}</span>) tidak memiliki izin untuk mengakses halaman ini. Hubungi Super Admin jika ini adalah kesalahan.
              </p>
              <div className="flex items-center gap-3">
                <Link
                  to="/admin/dashboard"
                  className="bg-primary-600 hover:bg-primary-700 text-white font-semibold px-4 py-2 text-sm rounded-xl transition-all shadow-md shadow-primary-600/10"
                >
                  Kembali ke Dashboard
                </Link>
                <Link
                  to="/"
                  className="border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-850 font-semibold px-4 py-2 text-sm rounded-xl transition-all"
                >
                  Lihat Web Publik
                </Link>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
export default AdminLayout;
