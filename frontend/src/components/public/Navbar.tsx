import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, Sun, Moon, LogIn, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import logoDesa from '../../assets/logo-desa.png';
import { api } from '../../services/api';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [logo, setLogo] = useState<string | null>(null);

  const location = useLocation();
  const { user } = useAuth();

  // Initialize Dark Mode & load logo
  useEffect(() => {
    const isDark = localStorage.getItem('theme') === 'dark' ||
      (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }

    const loadLogo = async () => {
      try {
        const profil = await api.getProfil();
        if (profil?.logo) {
          setLogo(profil.logo);
        }
      } catch (err) {
        console.error('Failed to load logo in navbar:', err);
      }
    };
    loadLogo();
  }, []);

  const toggleDarkMode = () => {
    const newDark = !darkMode;
    setDarkMode(newDark);
    if (newDark) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
    setActiveDropdown(null);
  }, [location.pathname]);

  // Handle click outside to close dropdowns on desktop
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (window.innerWidth >= 1024) {
        if (!target.closest('.desktop-dropdown')) {
          setActiveDropdown(null);
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const isActive = (path: string) => location.pathname === path;
  const isSubActive = (paths: string[]) => paths.includes(location.pathname);

  const toggleDropdown = (name: string) => {
    if (activeDropdown === name) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(name);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full glass shadow-sm no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">

          {/* Logo & Branding */}
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src={logo || logoDesa}
              alt="Logo Desa Telukambulu"
              className="w-10 h-10 sm:w-12 sm:h-12 object-contain group-hover:scale-105 transition-all duration-300"
            />
            <div>
              <span className="block font-sans font-extrabold text-base sm:text-lg leading-tight text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                Telukambulu
              </span>
              <span className="block text-[8px] sm:text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Kabupaten Karawang
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            <Link
              to="/"
              className={`px-3 py-2 text-sm font-semibold rounded-xl transition-all ${isActive('/')
                ? 'text-primary-600 bg-primary-50 dark:text-primary-400 dark:bg-primary-950/20'
                : 'text-slate-600 hover:text-primary-600 dark:text-slate-350 dark:hover:text-primary-400 hover:bg-slate-50 dark:hover:bg-slate-900/50'
                }`}
            >
              Beranda
            </Link>

            <Link
              to="/profil-desa"
              className={`px-3 py-2 text-sm font-semibold rounded-xl transition-all ${isActive('/profil-desa')
                ? 'text-primary-600 bg-primary-50 dark:text-primary-400 dark:bg-primary-950/20'
                : 'text-slate-600 hover:text-primary-600 dark:text-slate-350 dark:hover:text-primary-400 hover:bg-slate-50 dark:hover:bg-slate-900/50'
                }`}
            >
              Profil Desa
            </Link>

            {/* Dropdown Informasi */}
            <div className="relative desktop-dropdown">
              <button
                onClick={() => toggleDropdown('informasi')}
                className={`px-3 py-2 text-sm font-semibold rounded-xl transition-all flex items-center gap-1 ${isSubActive(['/informasi/berita', '/informasi/pengumuman'])
                  ? 'text-primary-600 bg-primary-50 dark:text-primary-400 dark:bg-primary-950/20'
                  : 'text-slate-600 hover:text-primary-600 dark:text-slate-350 dark:hover:text-primary-400 hover:bg-slate-50 dark:hover:bg-slate-900/50'
                  }`}
              >
                Informasi Desa
                <ChevronDown size={14} className={`transition-transform duration-200 ${activeDropdown === 'informasi' ? 'rotate-180' : ''}`} />
              </button>
              <div className={`absolute left-0 mt-1.5 w-48 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl shadow-xl py-1 transition-all duration-150 transform origin-top ${activeDropdown === 'informasi' ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'}`}>
                <Link
                  to="/informasi/berita"
                  onClick={() => setActiveDropdown(null)}
                  className="block px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-850 hover:text-primary-600 dark:hover:text-primary-400"
                >
                  Berita Desa
                </Link>
                <Link
                  to="/informasi/pengumuman"
                  onClick={() => setActiveDropdown(null)}
                  className="block px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-850 hover:text-primary-600 dark:hover:text-primary-400"
                >
                  Pengumuman
                </Link>
              </div>
            </div>

            {/* Dropdown Pesona Desa */}
            <div className="relative desktop-dropdown">
              <button
                onClick={() => toggleDropdown('pesona')}
                className={`px-3 py-2 text-sm font-semibold rounded-xl transition-all flex items-center gap-1 ${isSubActive(['/pesona-desa/sda', '/pesona-desa/produk-unggulan', '/pesona-desa/destinasi-wisata'])
                  ? 'text-primary-600 bg-primary-50 dark:text-primary-400 dark:bg-primary-950/20'
                  : 'text-slate-600 hover:text-primary-600 dark:text-slate-350 dark:hover:text-primary-400 hover:bg-slate-50 dark:hover:bg-slate-900/50'
                  }`}
              >
                Pesona Desa
                <ChevronDown size={14} className={`transition-transform duration-200 ${activeDropdown === 'pesona' ? 'rotate-180' : ''}`} />
              </button>
              <div className={`absolute left-0 mt-1.5 w-52 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl shadow-xl py-1 transition-all duration-150 transform origin-top ${activeDropdown === 'pesona' ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'}`}>
                <Link
                  to="/pesona-desa/sda"
                  onClick={() => setActiveDropdown(null)}
                  className="block px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-850 hover:text-primary-600 dark:hover:text-primary-400"
                >
                  Sumber Daya Alam
                </Link>
                <Link
                  to="/pesona-desa/produk-unggulan"
                  onClick={() => setActiveDropdown(null)}
                  className="block px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-850 hover:text-primary-600 dark:hover:text-primary-400"
                >
                  Produk Unggulan UMKM
                </Link>
                <Link
                  to="/pesona-desa/destinasi-wisata"
                  onClick={() => setActiveDropdown(null)}
                  className="block px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-850 hover:text-primary-600 dark:hover:text-primary-400"
                >
                  Destinasi Wisata
                </Link>
              </div>
            </div>

            {/* Dropdown Pengaduan */}
            <div className="relative desktop-dropdown">
              <button
                onClick={() => toggleDropdown('pengaduan')}
                className={`px-3 py-2 text-sm font-semibold rounded-xl transition-all flex items-center gap-1 ${isSubActive(['/pengaduan', '/cek-pengaduan'])
                  ? 'text-primary-600 bg-primary-50 dark:text-primary-400 dark:bg-primary-950/20'
                  : 'text-slate-600 hover:text-primary-600 dark:text-slate-350 dark:hover:text-primary-400 hover:bg-slate-50 dark:hover:bg-slate-900/50'
                  }`}
              >
                Pengaduan
                <ChevronDown size={14} className={`transition-transform duration-200 ${activeDropdown === 'pengaduan' ? 'rotate-180' : ''}`} />
              </button>
              <div className={`absolute left-0 mt-1.5 w-48 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl shadow-xl py-1 transition-all duration-150 transform origin-top ${activeDropdown === 'pengaduan' ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'}`}>
                <Link
                  to="/pengaduan"
                  onClick={() => setActiveDropdown(null)}
                  className="block px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-850 hover:text-primary-600 dark:hover:text-primary-400"
                >
                  Ajukan Pengaduan
                </Link>
                <Link
                  to="/cek-pengaduan"
                  onClick={() => setActiveDropdown(null)}
                  className="block px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-850 hover:text-primary-600 dark:hover:text-primary-400"
                >
                  Cek Tiket Status
                </Link>
              </div>
            </div>

            <Link
              to="/galeri"
              className={`px-3 py-2 text-sm font-semibold rounded-xl transition-all ${isActive('/galeri')
                ? 'text-primary-600 bg-primary-50 dark:text-primary-400 dark:bg-primary-950/20'
                : 'text-slate-600 hover:text-primary-600 dark:text-slate-350 dark:hover:text-primary-400 hover:bg-slate-50 dark:hover:bg-slate-900/50'
                }`}
            >
              Galeri
            </Link>

            <Link
              to="/kontak"
              className={`px-3 py-2 text-sm font-semibold rounded-xl transition-all ${isActive('/kontak')
                ? 'text-primary-600 bg-primary-50 dark:text-primary-400 dark:bg-primary-950/20'
                : 'text-slate-600 hover:text-primary-600 dark:text-slate-350 dark:hover:text-primary-400 hover:bg-slate-50 dark:hover:bg-slate-900/50'
                }`}
            >
              Kontak
            </Link>
          </nav>

          {/* Right actions */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Dark Mode toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
              title="Ganti Mode Gelap/Terang"
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Admin button */}
            {user ? (
              <Link
                to="/admin/dashboard"
                className="inline-flex items-center gap-2 bg-secondary-600 hover:bg-secondary-700 text-white font-semibold px-4 py-2.5 rounded-xl shadow-md transition-all text-sm"
              >

                <LayoutDashboard size={16} />
                Dashboard Admin
              </Link>
            ) : (
              <Link
                to="/admin/login"
                className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-705 text-white font-semibold px-4 py-2.5 rounded-xl shadow-md transition-all text-sm"
              >
                <LogIn size={16} />
                Portal Admin
              </Link>
            )}
          </div>

          {/* Mobile menu trigger */}
          <div className="flex items-center gap-3 lg:hidden">
            {/* Dark Mode toggle for mobile */}
            <button
              onClick={toggleDarkMode}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div className="lg:hidden border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 p-4 max-h-[calc(100vh-80px)] overflow-y-auto shadow-2xl">
          <nav className="flex flex-col gap-2.5">
            <Link
              to="/"
              className={`block px-4 py-3 rounded-xl text-sm font-bold ${isActive('/') ? 'text-primary-600 bg-primary-50 dark:text-primary-400 dark:bg-primary-950/20' : 'text-slate-700 dark:text-slate-300'
                }`}
            >
              Beranda
            </Link>

            <Link
              to="/profil-desa"
              className={`block px-4 py-3 rounded-xl text-sm font-bold ${isActive('/profil-desa') ? 'text-primary-600 bg-primary-50 dark:text-primary-400 dark:bg-primary-950/20' : 'text-slate-700 dark:text-slate-300'
                }`}
            >
              Profil Desa
            </Link>

            {/* Dropdown Menu Informasi Mobile */}
            <div>
              <button
                onClick={() => toggleDropdown('informasi')}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-300"
              >
                Informasi Desa
                <ChevronDown size={16} className={`transform transition-transform ${activeDropdown === 'informasi' ? 'rotate-180' : ''}`} />
              </button>
              {activeDropdown === 'informasi' && (
                <div className="pl-4 mt-1 flex flex-col gap-1 border-l-2 border-slate-100 dark:border-slate-800 ml-4">
                  <Link
                    to="/informasi/berita"
                    className="block px-4 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-primary-600"
                  >
                    Berita Desa
                  </Link>
                  <Link
                    to="/informasi/pengumuman"
                    className="block px-4 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-primary-600"
                  >
                    Pengumuman
                  </Link>
                </div>
              )}
            </div>

            {/* Dropdown Menu Pesona Desa Mobile */}
            <div>
              <button
                onClick={() => toggleDropdown('pesona')}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-300"
              >
                Pesona Desa
                <ChevronDown size={16} className={`transform transition-transform ${activeDropdown === 'pesona' ? 'rotate-180' : ''}`} />
              </button>
              {activeDropdown === 'pesona' && (
                <div className="pl-4 mt-1 flex flex-col gap-1 border-l-2 border-slate-100 dark:border-slate-800 ml-4">
                  <Link
                    to="/pesona-desa/sda"
                    className="block px-4 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-primary-600"
                  >
                    Sumber Daya Alam
                  </Link>
                  <Link
                    to="/pesona-desa/produk-unggulan"
                    className="block px-4 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-primary-600"
                  >
                    Produk Unggulan UMKM
                  </Link>
                  <Link
                    to="/pesona-desa/destinasi-wisata"
                    className="block px-4 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-primary-600"
                  >
                    Destinasi Wisata
                  </Link>
                </div>
              )}
            </div>

            {/* Dropdown Menu Pengaduan Mobile */}
            <div>
              <button
                onClick={() => toggleDropdown('pengaduan')}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-300"
              >
                Pengaduan
                <ChevronDown size={16} className={`transform transition-transform ${activeDropdown === 'pengaduan' ? 'rotate-180' : ''}`} />
              </button>
              {activeDropdown === 'pengaduan' && (
                <div className="pl-4 mt-1 flex flex-col gap-1 border-l-2 border-slate-100 dark:border-slate-800 ml-4">
                  <Link
                    to="/pengaduan"
                    className="block px-4 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-primary-600"
                  >
                    Ajukan Pengaduan
                  </Link>
                  <Link
                    to="/cek-pengaduan"
                    className="block px-4 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-primary-600"
                  >
                    Cek Tiket Status
                  </Link>
                </div>
              )}
            </div>

            <Link
              to="/galeri"
              className={`block px-4 py-3 rounded-xl text-sm font-bold ${isActive('/galeri') ? 'text-primary-600 bg-primary-50 dark:text-primary-400 dark:bg-primary-950/20' : 'text-slate-700 dark:text-slate-300'
                }`}
            >
              Galeri
            </Link>

            <Link
              to="/kontak"
              className={`block px-4 py-3 rounded-xl text-sm font-bold ${isActive('/kontak') ? 'text-primary-600 bg-primary-50 dark:text-primary-400 dark:bg-primary-950/20' : 'text-slate-700 dark:text-slate-300'
                }`}
            >
              Kontak
            </Link>

            <div className="border-t border-slate-100 dark:border-slate-900 pt-4 mt-2 flex flex-col gap-2">
              {user ? (
                <Link
                  to="/admin/dashboard"
                  className="w-full text-center bg-secondary-600 text-white font-bold py-3 rounded-xl text-sm flex items-center justify-center gap-2"
                >
                  <LayoutDashboard size={16} />
                  Dashboard Admin
                </Link>
              ) : (
                <Link
                  to="/admin/login"
                  className="w-full text-center bg-primary-600 text-white font-bold py-3 rounded-xl text-sm flex items-center justify-center gap-2"
                >
                  <LogIn size={16} />
                  Portal Admin
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
export default Navbar;
