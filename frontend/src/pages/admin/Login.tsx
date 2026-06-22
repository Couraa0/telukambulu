import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/common/Card';
import FormInput from '../../components/common/FormInput';
import Button from '../../components/common/Button';
import useToast from '../../hooks/useToast';
import { LogIn, Key, User, ShieldCheck } from 'lucide-react';

export const Login: React.FC = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect path
  const from = (location.state as any)?.from?.pathname || '/admin/dashboard';

  // If already logged in, redirect
  React.useEffect(() => {
    if (user) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [user, navigate]);

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

  // Helper autofill credentials
  const handleAutofill = (u: string, p: string) => {
    setUsername(u);
    setPassword(p);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4 py-12 relative overflow-hidden font-sans">
      {/* Decorative backgrounds */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary-600/10 rounded-full blur-3xl -ml-20 -mb-20"></div>

      <div className="max-w-md w-full z-10 flex flex-col gap-6">
        
        {/* Portal Branding */}
        <div className="text-center text-white">
          <div className="w-12 h-12 bg-primary-600 rounded-2xl flex items-center justify-center text-white font-extrabold text-xl shadow-lg shadow-primary-600/20 mx-auto mb-4">
            T
          </div>
          <h2 className="text-2xl font-black tracking-wide uppercase font-sans">Telukambulu</h2>
          <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">
            Sistem Informasi Desa Digital
          </p>
        </div>

        <Card className="p-6 sm:p-8 bg-slate-950/40 border-slate-800 shadow-2xl backdrop-blur-md text-slate-100">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2 border-b border-slate-800 pb-3 font-sans">
            <LogIn size={20} className="text-primary-500" />
            Login Administrator
          </h3>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <FormInput
              label="Username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Masukkan username"
              icon={User}
              className="text-slate-850 dark:text-slate-200"
              required
            />
            <FormInput
              label="Password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan password"
              icon={Key}
              className="text-slate-850 dark:text-slate-200"
              required
            />

            <Button type="submit" variant="primary" loading={loading} fullWidth className="mt-2 py-3 text-sm font-bold shadow-lg shadow-primary-600/20">
              Masuk ke Dashboard
            </Button>
          </form>

          {/* Quick Credential Fill */}
          <div className="mt-8 border-t border-slate-800 pt-6">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5 justify-center">
              <ShieldCheck size={14} className="text-primary-555" />
              Akun Uji Coba (Autofill):
            </h4>
            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <button
                type="button"
                onClick={() => handleAutofill('superadmin', 'admin123')}
                className="bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-primary-500 py-2 px-2.5 rounded-xl transition-all font-semibold"
              >
                Super Admin
              </button>
              <button
                type="button"
                onClick={() => handleAutofill('konten', 'konten123')}
                className="bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-primary-500 py-2 px-2.5 rounded-xl transition-all font-semibold"
              >
                Admin Konten
              </button>
              <button
                type="button"
                onClick={() => handleAutofill('pengaduan', 'adu123')}
                className="bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-primary-500 py-2 px-2.5 rounded-xl transition-all font-semibold"
              >
                Admin Pengaduan
              </button>
              <button
                type="button"
                onClick={() => handleAutofill('profil', 'profil123')}
                className="bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-primary-500 py-2 px-2.5 rounded-xl transition-all font-semibold"
              >
                Admin Profil
              </button>
            </div>
          </div>
        </Card>

        {/* Link back to public */}
        <Link
          to="/"
          className="text-center text-xs text-slate-500 hover:text-slate-350 transition-colors uppercase tracking-wider font-semibold"
        >
          ← Kembali ke Website Publik
        </Link>

      </div>
    </div>
  );
};
export default Login;
