import { createContext, useState, useContext, useEffect, type ReactNode } from 'react';
import { api } from '../services/api';
import type { UserAdmin } from '../data/initialData';

interface AuthContextType {
  user: UserAdmin | null;
  login: (username: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  loading: boolean;
  hasRole: (allowedRoles: string | string[]) => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserAdmin | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('desa_auth_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Failed to parse saved auth user:', e);
        localStorage.removeItem('desa_auth_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const res = await api.login(username, password);
      if (res.success && res.user) {
        setUser(res.user);
        localStorage.setItem('desa_auth_user', JSON.stringify(res.user));
        return { success: true };
      }
      return { success: false, message: res.message || 'Login gagal.' };
    } catch (error: any) {
      return { success: false, message: error.message || 'Terjadi kesalahan sistem.' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('desa_auth_user');
  };

  const hasRole = (allowedRoles: string | string[]): boolean => {
    if (!user) return false;
    if (user.role === 'Super Admin') return true; // Super Admin has access to all
    if (typeof allowedRoles === 'string') {
      return user.role === allowedRoles;
    }
    return allowedRoles.includes(user.role);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
export default AuthContext;
