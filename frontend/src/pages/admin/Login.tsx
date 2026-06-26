import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import useToast from '../../hooks/useToast';
import { 
  LogIn, 
  User, 
  Lock, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  ArrowLeft, 
  Globe, 
  Server,
  Sun,
  Moon
} from 'lucide-react';
import logoDesa from '../../assets/logo-desa.png';

export const Login: React.FC = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Redirect path
  const from = (location.state as any)?.from?.pathname || '/admin/dashboard';

  // If already logged in, redirect
  useEffect(() => {
    if (user) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [user, navigate]);

  // Load and apply theme from localStorage or preferred scheme
  useEffect(() => {
    const isDark = localStorage.getItem('theme') === 'dark' ||
      (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setIsDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newDark = !isDarkMode;
    setIsDarkMode(newDark);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      showToast('Harap isi username dan password.', 'warning');
      return;
    }

    setLoading(true);
    const res = await login(username, password);
    setLoading(false);

    if (res.success) {
      showToast('Login berhasil! Selamat datang di Dashboard.', 'success');
      navigate(from, { replace: true });
    } else {
      showToast(res.message || 'Login gagal.', 'error');
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-12 bg-slate-50 dark:bg-slate-950 font-sans selection:bg-emerald-500/30 selection:text-emerald-300 transition-colors duration-300">
      
      {/* LEFT VISUAL PANEL (Desktop Only) */}
      <div className="hidden md:flex md:col-span-5 lg:col-span-5 h-full relative overflow-hidden flex-col justify-between p-10 lg:p-12 select-none">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center scale-105"
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&q=80&w=1200')" 
          }}
        />
        {/* Overlays — light mode: hijau-teal lembut; dark mode: hitam pekat */}
        <div className="absolute inset-0 bg-emerald-800/60 dark:bg-slate-950/45 z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 via-teal-900/50 to-emerald-700/20 dark:from-slate-950 dark:via-slate-950/60 dark:to-emerald-950/40 z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-emerald-900/50 dark:to-slate-950/80 z-10" />

        {/* Panel Content (Guaranteed above overlays) */}
        <div className="z-20 flex flex-col justify-between h-full">
          {/* Logo & Regency/Sub-district Branding */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/15 backdrop-blur-md rounded-2xl border border-white/25 shadow-lg">
              <img src={logoDesa} alt="Logo Desa" className="w-12 h-12 object-contain" />
            </div>
            <div>
              <p className="text-[10px] tracking-widest text-emerald-200 dark:text-emerald-400 font-bold uppercase">Pemerintah Kab. Karawang</p>
              <h1 className="text-sm font-extrabold text-white uppercase tracking-wider leading-none">Desa Telukambulu</h1>
              <p className="text-[9px] text-emerald-100/70 dark:text-slate-400 tracking-wider">Kecamatan Batujaya</p>
            </div>
          </div>

          {/* Inspirational Title */}
          <div className="space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/15 dark:bg-emerald-500/20 text-white dark:text-emerald-300 border border-white/25 dark:border-emerald-500/30 rounded-full text-[10px] font-bold tracking-wider uppercase">
              <Globe size={12} className="animate-spin-slow" />
              Sistem Desa Digital v2.0
            </span>
            <h2 className="text-3xl lg:text-4xl font-black text-white leading-tight">
              Tata Kelola Desa <br />
              <span className="bg-gradient-to-r from-emerald-200 via-teal-100 to-cyan-200 dark:from-emerald-400 dark:via-teal-300 dark:to-cyan-300 bg-clip-text text-transparent">
                Lebih Modern &amp; Praktis
              </span>
            </h2>
            <p className="text-xs lg:text-sm text-emerald-50/90 dark:text-slate-300 font-light leading-relaxed max-w-sm">
              Kelola berita kependudukan, transparansi sumber daya alam, publikasi produk UMKM, dan respon pengaduan warga secara real-time.
            </p>
          </div>

          {/* Infrastructure status */}
          <div className="pt-6 border-t border-white/15 flex items-center justify-between text-[11px] text-emerald-100/80 dark:text-slate-400 font-semibold uppercase tracking-wider">
            <div className="flex items-center gap-1.5 text-emerald-200 dark:text-emerald-400">
              <ShieldCheck size={14} />
              <span>SSL Enkripsi Aman</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Server size={14} />
              <span>Server Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT LOGIN FORM PANEL (Mobile & Desktop) */}
      <div className="col-span-12 md:col-span-7 lg:col-span-7 flex flex-col justify-center items-center p-6 sm:p-12 relative overflow-hidden min-h-screen transition-colors duration-300">
        
        {/* Glow ambient effects */}
        <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-emerald-500/[0.04] dark:bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-teal-500/[0.04] dark:bg-teal-500/10 rounded-full blur-[120px] pointer-events-none" />

        {/* Top bar controls */}
        <div className="absolute top-6 left-6 right-6 flex justify-between items-center z-20">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors uppercase tracking-wider group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
            Kembali ke Web Publik
          </Link>
          
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80 shadow-sm transition-all duration-200"
            title={isDarkMode ? "Aktifkan Mode Terang" : "Aktifkan Mode Gelap"}
          >
            {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>

        {/* Card Form */}
        <div className="w-full max-w-md z-10 space-y-6">
          
          {/* Logo header for mobile (hidden on desktop) */}
          <div className="flex md:hidden flex-col items-center text-center space-y-3 mb-4">
            <div className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-md">
              <img src={logoDesa} alt="Logo Desa" className="w-14 h-14 object-contain" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-wider">Desa Telukambulu</h2>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-widest mt-0.5">Sistem Informasi Desa Digital</p>
            </div>
          </div>

          <div className="bg-white/80 dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200 dark:border-slate-800/80 shadow-xl dark:shadow-[0_0_50px_rgba(0,0,0,0.4)] rounded-3xl p-8 sm:p-10 text-slate-800 dark:text-slate-100 relative transition-all duration-300">
            {/* Corner highlight */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-emerald-500/10 to-transparent blur-xl pointer-events-none" />
            
            <div className="space-y-2 mb-8">
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                <LogIn size={20} className="text-emerald-600 dark:text-emerald-500" />
                Akses Administrator
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Silakan masuk menggunakan kredensial Anda untuk mengelola portal.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Username Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-450 uppercase tracking-wider">
                  Username
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500 group-focus-within:text-emerald-600 dark:group-focus-within:text-emerald-500 transition-colors">
                    <User size={18} />
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Masukkan username"
                    className="w-full text-sm rounded-xl border border-slate-300 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/60 py-3.5 pl-11 pr-4 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all duration-200"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-450 uppercase tracking-wider">
                    Password
                  </label>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500 group-focus-within:text-emerald-600 dark:group-focus-within:text-emerald-500 transition-colors">
                    <Lock size={18} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan password"
                    className="w-full text-sm rounded-xl border border-slate-300 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/60 py-3.5 pl-11 pr-12 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all duration-200"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 dark:text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-emerald-700/10 dark:shadow-emerald-950/50 hover:shadow-emerald-500/20 active:scale-98 transition-all duration-200 text-sm mt-3"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Memproses...</span>
                  </>
                ) : (
                  <>
                    <LogIn size={18} />
                    <span>Masuk ke Dashboard</span>
                  </>
                )}
              </button>
            </form>

          </div>

          <div className="text-center pt-2">
            <p className="text-[10px] text-slate-400 dark:text-slate-500">
              Sistem Informasi Desa Digital &copy; 2026 Desa Telukambulu. <br />
              All rights reserved.
            </p>
          </div>

        </div>
      </div>
      
    </div>
  );
};

export default Login;
