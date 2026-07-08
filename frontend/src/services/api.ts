import {
  initialData,
  Profil,
  Statistik,
  Perangkat,
  Demografi,
  Pengumuman,
  Berita,
  SDA,
  Produk,
  Wisata,
  Pengaduan,
  Galeri,
  Kontak,
  UserAdmin
} from '../data/initialData';

let API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000/api';
API_BASE = API_BASE.replace(/\/+$/, '');
if (!API_BASE.endsWith('/api')) {
  API_BASE = API_BASE + '/api';
}

// Initialize LocalStorage with fallback data if empty
const initLocalStorage = (): void => {
  Object.keys(initialData).forEach(key => {
    if (!localStorage.getItem(`desa_${key}`)) {
      localStorage.setItem(`desa_${key}`, JSON.stringify(initialData[key as keyof typeof initialData]));
    }
  });
};

initLocalStorage();

// Get local data helpers
const getLocal = <T>(key: string): T => {
  return JSON.parse(localStorage.getItem(`desa_${key}`) || '[]');
};

const setLocal = <T>(key: string, data: T): void => {
  localStorage.setItem(`desa_${key}`, JSON.stringify(data));
};

// Caching system configuration
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes TTL in milliseconds
const memoryCache: Record<string, CacheEntry<any>> = {};

// Helper to retrieve data from cache if valid
const getCachedData = <T>(key: string): T | null => {
  const cached = memoryCache[key];
  if (cached && (Date.now() - cached.timestamp < CACHE_TTL)) {
    console.log(`[Cache Hit] Serving cached data for key: ${key}`);
    return cached.data;
  }
  return null;
};

// Helper to store data in cache
const setCachedData = <T>(key: string, data: T): void => {
  memoryCache[key] = {
    data,
    timestamp: Date.now()
  };
};

// Helper to invalidate cache keys (supports exact match or wildcards)
export const invalidateCache = (key: string | string[]): void => {
  const keys = Array.isArray(key) ? key : [key];
  keys.forEach(k => {
    Object.keys(memoryCache).forEach(cacheKey => {
      // Invalidate if exact match or if cacheKey starts with the base path plus prefix (e.g. /berita and /berita/5)
      if (cacheKey === k || cacheKey.startsWith(`${k}/`) || cacheKey.startsWith(`${k}?`)) {
        console.log(`[Cache Invalidation] Clearing cache key: ${cacheKey}`);
        delete memoryCache[cacheKey];
      }
    });
  });
};

// Helper to clear all cache on login/logout
export const clearAllCache = (): void => {
  console.log(`[Cache Clear] Clearing all cache entries`);
  Object.keys(memoryCache).forEach(key => {
    delete memoryCache[key];
  });
};

// Network request with automatic caching & fallback
const apiRequest = async <T>(endpoint: string, method = 'GET', body: any = null): Promise<T> => {
  // Use the full endpoint path as the cache key
  const cacheKey = endpoint;

  // Serve from cache if it's a GET request
  if (method === 'GET') {
    const cached = getCachedData<T>(cacheKey);
    if (cached !== null) {
      return cached;
    }
  }

  try {
    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };
    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(`${API_BASE}${endpoint}`, options);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Request failed');
    }
    const data = await response.json();

    // Cache the data if it's a GET request
    if (method === 'GET') {
      setCachedData(cacheKey, data);
    }

    // Invalidate caches if it's a mutating request (POST, PUT, DELETE)
    if (method !== 'GET') {
      // e.g. /berita/5 -> base path /berita
      const basePath = '/' + endpoint.split('/')[1];
      invalidateCache(basePath);

      // If mutating endpoints that alter dashboard stats, invalidate statistik
      const statsAlteringPaths = ['/berita', '/pengumuman', '/produk', '/wisata', '/pengaduan', '/demografi'];
      if (statsAlteringPaths.includes(basePath)) {
        invalidateCache('/statistik');
      }
    }

    return data as T;
  } catch (error: any) {
    console.warn(`API: ${method} ${endpoint} failed. Falling back to LocalStorage.`, error.message);
    throw error;
  }
};

export const api = {
  // Clear frontend in-memory cache
  clearAllCache: (): void => {
    clearAllCache();
  },

  // Authentication
  login: async (username: string, password: string): Promise<{ success: boolean; user?: UserAdmin; message?: string }> => {
    const res = await apiRequest<{ success: boolean; user: UserAdmin; message?: string }>('/auth/login', 'POST', { username, password });
    return res;
  },

  // Profil Desa
  getProfil: async (): Promise<Profil> => {
    try {
      const data = await apiRequest<Profil>('/profil');
      setLocal('profil', data);
      return data;
    } catch {
      return getLocal<Profil>('profil');
    }
  },
  updateProfil: async (profilData: Profil): Promise<Profil> => {
    try {
      const res = await apiRequest<{ success: boolean; data: Profil }>('/profil', 'PUT', profilData);
      setLocal('profil', res.data);
      return res.data;
    } catch {
      setLocal('profil', profilData);
      return profilData;
    }
  },

  // Statistik Desa
  getStatistik: async (): Promise<Statistik> => {
    try {
      const data = await apiRequest<Statistik>('/statistik');
      setLocal('statistik', data);
      return data;
    } catch {
      return getLocal<Statistik>('statistik');
    }
  },

  // Perangkat Desa
  getPerangkat: async (): Promise<Perangkat[]> => {
    try {
      const data = await apiRequest<Perangkat[]>('/perangkat');
      setLocal('perangkat', data);
      return data;
    } catch {
      return getLocal<Perangkat[]>('perangkat');
    }
  },
  createPerangkat: async (perangkatData: Omit<Perangkat, 'id'>): Promise<Perangkat> => {
    try {
      const res = await apiRequest<{ success: boolean; data: Perangkat }>('/perangkat', 'POST', perangkatData);
      const current = getLocal<Perangkat[]>('perangkat');
      current.push(res.data);
      setLocal('perangkat', current);
      return res.data;
    } catch {
      const current = getLocal<Perangkat[]>('perangkat');
      const newItem: Perangkat = {
        id: current.length > 0 ? Math.max(...current.map(i => i.id)) + 1 : 1,
        ...perangkatData
      };
      current.push(newItem);
      setLocal('perangkat', current);
      return newItem;
    }
  },
  updatePerangkat: async (id: number, perangkatData: Partial<Perangkat>): Promise<Perangkat> => {
    try {
      const res = await apiRequest<{ success: boolean; data: Perangkat }>(`/perangkat/${id}`, 'PUT', perangkatData);
      const current = getLocal<Perangkat[]>('perangkat');
      const idx = current.findIndex(i => i.id === id);
      if (idx !== -1) current[idx] = res.data;
      setLocal('perangkat', current);
      return res.data;
    } catch {
      const current = getLocal<Perangkat[]>('perangkat');
      const idx = current.findIndex(i => i.id === id);
      if (idx !== -1) {
        current[idx] = { ...current[idx], ...perangkatData };
      }
      setLocal('perangkat', current);
      return current[idx];
    }
  },
  deletePerangkat: async (id: number): Promise<void> => {
    try {
      await apiRequest(`/perangkat/${id}`, 'DELETE');
      const current = getLocal<Perangkat[]>('perangkat');
      const filtered = current.filter(i => i.id !== id);
      setLocal('perangkat', filtered);
    } catch {
      const current = getLocal<Perangkat[]>('perangkat');
      const filtered = current.filter(i => i.id !== id);
      setLocal('perangkat', filtered);
    }
  },

  // Demografi
  getDemografi: async (): Promise<Demografi> => {
    try {
      const data = await apiRequest<Demografi>('/demografi');
      setLocal('demografi', data);
      return data;
    } catch {
      return getLocal<Demografi>('demografi');
    }
  },
  updateDemografi: async (demoData: Demografi): Promise<Demografi> => {
    try {
      const res = await apiRequest<{ success: boolean; data: Demografi }>('/demografi', 'PUT', demoData);
      setLocal('demografi', res.data);
      return res.data;
    } catch {
      setLocal('demografi', demoData);
      return demoData;
    }
  },

  // Pengumuman
  getPengumuman: async (): Promise<Pengumuman[]> => {
    try {
      const data = await apiRequest<Pengumuman[]>('/pengumuman');
      setLocal('pengumuman', data);
      return data;
    } catch {
      return getLocal<Pengumuman[]>('pengumuman');
    }
  },
  getPengumumanById: async (id: string | number): Promise<Pengumuman> => {
    try {
      const data = await apiRequest<Pengumuman>(`/pengumuman/${id}`);
      return data;
    } catch {
      const item = getLocal<Pengumuman[]>('pengumuman').find(p => p.id === parseInt(String(id)));
      if (!item) throw new Error('Pengumuman tidak ditemukan.');
      return item;
    }
  },
  createPengumuman: async (pengData: Omit<Pengumuman, 'id' | 'views'>): Promise<Pengumuman> => {
    try {
      const res = await apiRequest<{ success: boolean; data: Pengumuman }>('/pengumuman', 'POST', pengData);
      const current = getLocal<Pengumuman[]>('pengumuman');
      current.push(res.data);
      setLocal('pengumuman', current);
      
      const stats = getLocal<Statistik>('statistik');
      stats.pengumuman = current.length;
      setLocal('statistik', stats);
      
      return res.data;
    } catch {
      const current = getLocal<Pengumuman[]>('pengumuman');
      const newItem: Pengumuman = {
        id: current.length > 0 ? Math.max(...current.map(i => i.id)) + 1 : 1,
        views: 0,
        ...pengData
      } as Pengumuman;
      current.push(newItem);
      setLocal('pengumuman', current);
      
      const stats = getLocal<Statistik>('statistik');
      stats.pengumuman = current.length;
      setLocal('statistik', stats);
      
      return newItem;
    }
  },
  updatePengumuman: async (id: number, pengData: Partial<Pengumuman>): Promise<Pengumuman> => {
    try {
      const res = await apiRequest<{ success: boolean; data: Pengumuman }>(`/pengumuman/${id}`, 'PUT', pengData);
      const current = getLocal<Pengumuman[]>('pengumuman');
      const idx = current.findIndex(i => i.id === id);
      if (idx !== -1) current[idx] = res.data;
      setLocal('pengumuman', current);
      return res.data;
    } catch {
      const current = getLocal<Pengumuman[]>('pengumuman');
      const idx = current.findIndex(i => i.id === id);
      if (idx !== -1) {
        current[idx] = { ...current[idx], ...pengData } as Pengumuman;
      }
      setLocal('pengumuman', current);
      return current[idx];
    }
  },
  deletePengumuman: async (id: number): Promise<void> => {
    try {
      await apiRequest(`/pengumuman/${id}`, 'DELETE');
      const current = getLocal<Pengumuman[]>('pengumuman');
      const filtered = current.filter(i => i.id !== id);
      setLocal('pengumuman', filtered);
      
      const stats = getLocal<Statistik>('statistik');
      stats.pengumuman = filtered.length;
      setLocal('statistik', stats);
    } catch {
      const current = getLocal<Pengumuman[]>('pengumuman');
      const filtered = current.filter(i => i.id !== id);
      setLocal('pengumuman', filtered);
      
      const stats = getLocal<Statistik>('statistik');
      stats.pengumuman = filtered.length;
      setLocal('statistik', stats);
    }
  },

  // Berita
  getBerita: async (): Promise<Berita[]> => {
    try {
      const data = await apiRequest<Berita[]>('/berita');
      setLocal('berita', data);
      return data;
    } catch {
      return getLocal<Berita[]>('berita');
    }
  },
  getBeritaById: async (id: string | number): Promise<Berita> => {
    try {
      const data = await apiRequest<Berita>(`/berita/${id}`);
      return data;
    } catch {
      const current = getLocal<Berita[]>('berita');
      const idx = current.findIndex(b => b.id === parseInt(String(id)));
      if (idx === -1) throw new Error('Berita tidak ditemukan.');
      
      current[idx].views = (current[idx].views || 0) + 1;
      setLocal('berita', current);
      return current[idx];
    }
  },
  createBerita: async (beritaData: Omit<Berita, 'id' | 'views'>): Promise<Berita> => {
    try {
      const res = await apiRequest<{ success: boolean; data: Berita }>('/berita', 'POST', beritaData);
      const current = getLocal<Berita[]>('berita');
      current.push(res.data);
      setLocal('berita', current);
      
      const stats = getLocal<Statistik>('statistik');
      stats.berita = current.length;
      setLocal('statistik', stats);
      
      return res.data;
    } catch {
      const current = getLocal<Berita[]>('berita');
      const newItem: Berita = {
        id: current.length > 0 ? Math.max(...current.map(i => i.id)) + 1 : 1,
        views: 0,
        ...beritaData
      } as Berita;
      current.push(newItem);
      setLocal('berita', current);
      
      const stats = getLocal<Statistik>('statistik');
      stats.berita = current.length;
      setLocal('statistik', stats);
      
      return newItem;
    }
  },
  updateBerita: async (id: number, beritaData: Partial<Berita>): Promise<Berita> => {
    try {
      const res = await apiRequest<{ success: boolean; data: Berita }>(`/berita/${id}`, 'PUT', beritaData);
      const current = getLocal<Berita[]>('berita');
      const idx = current.findIndex(i => i.id === id);
      if (idx !== -1) current[idx] = res.data;
      setLocal('berita', current);
      return res.data;
    } catch {
      const current = getLocal<Berita[]>('berita');
      const idx = current.findIndex(i => i.id === id);
      if (idx !== -1) {
        current[idx] = { ...current[idx], ...beritaData } as Berita;
      }
      setLocal('berita', current);
      return current[idx];
    }
  },
  deleteBerita: async (id: number): Promise<void> => {
    try {
      await apiRequest(`/berita/${id}`, 'DELETE');
      const current = getLocal<Berita[]>('berita');
      const filtered = current.filter(i => i.id !== id);
      setLocal('berita', filtered);
      
      const stats = getLocal<Statistik>('statistik');
      stats.berita = filtered.length;
      setLocal('statistik', stats);
    } catch {
      const current = getLocal<Berita[]>('berita');
      const filtered = current.filter(i => i.id !== id);
      setLocal('berita', filtered);
      
      const stats = getLocal<Statistik>('statistik');
      stats.berita = filtered.length;
      setLocal('statistik', stats);
    }
  },

  // SDA
  getSDA: async (): Promise<SDA[]> => {
    try {
      const data = await apiRequest<SDA[]>('/sda');
      setLocal('sda', data);
      return data;
    } catch {
      return getLocal<SDA[]>('sda');
    }
  },
  getSDAById: async (id: string | number): Promise<SDA> => {
    try {
      const data = await apiRequest<SDA>(`/sda/${id}`);
      return data;
    } catch {
      const item = getLocal<SDA[]>('sda').find(s => s.id === parseInt(String(id)));
      if (!item) throw new Error('Data SDA tidak ditemukan.');
      return item;
    }
  },
  createSDA: async (sdaData: Omit<SDA, 'id'>): Promise<SDA> => {
    try {
      const res = await apiRequest<{ success: boolean; data: SDA }>('/sda', 'POST', sdaData);
      const current = getLocal<SDA[]>('sda');
      current.push(res.data);
      setLocal('sda', current);
      return res.data;
    } catch {
      const current = getLocal<SDA[]>('sda');
      const newItem: SDA = {
        id: current.length > 0 ? Math.max(...current.map(i => i.id)) + 1 : 1,
        ...sdaData
      };
      current.push(newItem);
      setLocal('sda', current);
      return newItem;
    }
  },
  updateSDA: async (id: number, sdaData: Partial<SDA>): Promise<SDA> => {
    try {
      const res = await apiRequest<{ success: boolean; data: SDA }>(`/sda/${id}`, 'PUT', sdaData);
      const current = getLocal<SDA[]>('sda');
      const idx = current.findIndex(i => i.id === id);
      if (idx !== -1) current[idx] = res.data;
      setLocal('sda', current);
      return res.data;
    } catch {
      const current = getLocal<SDA[]>('sda');
      const idx = current.findIndex(i => i.id === id);
      if (idx !== -1) {
        current[idx] = { ...current[idx], ...sdaData } as SDA;
      }
      setLocal('sda', current);
      return current[idx];
    }
  },
  deleteSDA: async (id: number): Promise<void> => {
    try {
      await apiRequest(`/sda/${id}`, 'DELETE');
      const current = getLocal<SDA[]>('sda');
      const filtered = current.filter(i => i.id !== id);
      setLocal('sda', filtered);
    } catch {
      const current = getLocal<SDA[]>('sda');
      const filtered = current.filter(i => i.id !== id);
      setLocal('sda', filtered);
    }
  },

  // Produk UMKM
  getProduk: async (): Promise<Produk[]> => {
    try {
      const data = await apiRequest<Produk[]>('/produk');
      setLocal('produk', data);
      return data;
    } catch {
      return getLocal<Produk[]>('produk');
    }
  },
  getProdukById: async (id: string | number): Promise<Produk> => {
    try {
      const data = await apiRequest<Produk>(`/produk/${id}`);
      return data;
    } catch {
      const item = getLocal<Produk[]>('produk').find(p => p.id === parseInt(String(id)));
      if (!item) throw new Error('Produk tidak ditemukan.');
      return item;
    }
  },
  createProduk: async (produkData: Omit<Produk, 'id'>): Promise<Produk> => {
    try {
      const res = await apiRequest<{ success: boolean; data: Produk }>('/produk', 'POST', produkData);
      const current = getLocal<Produk[]>('produk');
      current.push(res.data);
      setLocal('produk', current);
      
      const stats = getLocal<Statistik>('statistik');
      stats.umkm = current.length;
      setLocal('statistik', stats);
      
      return res.data;
    } catch {
      const current = getLocal<Produk[]>('produk');
      const newItem: Produk = {
        id: current.length > 0 ? Math.max(...current.map(i => i.id)) + 1 : 1,
        ...produkData
      };
      current.push(newItem);
      setLocal('produk', current);
      
      const stats = getLocal<Statistik>('statistik');
      stats.umkm = current.length;
      setLocal('statistik', stats);
      
      return newItem;
    }
  },
  updateProduk: async (id: number, produkData: Partial<Produk>): Promise<Produk> => {
    try {
      const res = await apiRequest<{ success: boolean; data: Produk }>(`/produk/${id}`, 'PUT', produkData);
      const current = getLocal<Produk[]>('produk');
      const idx = current.findIndex(i => i.id === id);
      if (idx !== -1) current[idx] = res.data;
      setLocal('produk', current);
      return res.data;
    } catch {
      const current = getLocal<Produk[]>('produk');
      const idx = current.findIndex(i => i.id === id);
      if (idx !== -1) {
        current[idx] = { ...current[idx], ...produkData } as Produk;
      }
      setLocal('produk', current);
      return current[idx];
    }
  },
  deleteProduk: async (id: number): Promise<void> => {
    try {
      await apiRequest(`/produk/${id}`, 'DELETE');
      const current = getLocal<Produk[]>('produk');
      const filtered = current.filter(i => i.id !== id);
      setLocal('produk', filtered);
      
      const stats = getLocal<Statistik>('statistik');
      stats.umkm = filtered.length;
      setLocal('statistik', stats);
    } catch {
      const current = getLocal<Produk[]>('produk');
      const filtered = current.filter(i => i.id !== id);
      setLocal('produk', filtered);
      
      const stats = getLocal<Statistik>('statistik');
      stats.umkm = filtered.length;
      setLocal('statistik', stats);
    }
  },

  // Wisata
  getWisata: async (): Promise<Wisata[]> => {
    try {
      const data = await apiRequest<Wisata[]>('/wisata');
      setLocal('wisata', data);
      return data;
    } catch {
      return getLocal<Wisata[]>('wisata');
    }
  },
  getWisataById: async (id: string | number): Promise<Wisata> => {
    try {
      const data = await apiRequest<Wisata>(`/wisata/${id}`);
      return data;
    } catch {
      const item = getLocal<Wisata[]>('wisata').find(w => w.id === parseInt(String(id)));
      if (!item) throw new Error('Wisata tidak ditemukan.');
      return item;
    }
  },
  createWisata: async (wisataData: Omit<Wisata, 'id' | 'galeri'> & { galeri?: string[] }): Promise<Wisata> => {
    try {
      const res = await apiRequest<{ success: boolean; data: Wisata }>('/wisata', 'POST', wisataData);
      const current = getLocal<Wisata[]>('wisata');
      current.push(res.data);
      setLocal('wisata', current);
      return res.data;
    } catch {
      const current = getLocal<Wisata[]>('wisata');
      const newItem: Wisata = {
        id: current.length > 0 ? Math.max(...current.map(i => i.id)) + 1 : 1,
        galeri: wisataData.galeri || [wisataData.foto],
        ...wisataData
      } as Wisata;
      current.push(newItem);
      setLocal('wisata', current);
      return newItem;
    }
  },
  updateWisata: async (id: number, wisataData: Partial<Wisata>): Promise<Wisata> => {
    try {
      const res = await apiRequest<{ success: boolean; data: Wisata }>(`/wisata/${id}`, 'PUT', wisataData);
      const current = getLocal<Wisata[]>('wisata');
      const idx = current.findIndex(i => i.id === id);
      if (idx !== -1) current[idx] = res.data;
      setLocal('wisata', current);
      return res.data;
    } catch {
      const current = getLocal<Wisata[]>('wisata');
      const idx = current.findIndex(i => i.id === id);
      if (idx !== -1) {
        current[idx] = { ...current[idx], ...wisataData } as Wisata;
      }
      setLocal('wisata', current);
      return current[idx];
    }
  },
  deleteWisata: async (id: number): Promise<void> => {
    try {
      await apiRequest(`/wisata/${id}`, 'DELETE');
      const current = getLocal<Wisata[]>('wisata');
      const filtered = current.filter(i => i.id !== id);
      setLocal('wisata', filtered);
    } catch {
      const current = getLocal<Wisata[]>('wisata');
      const filtered = current.filter(i => i.id !== id);
      setLocal('wisata', filtered);
    }
  },

  // Pengaduan
  getPengaduan: async (): Promise<Pengaduan[]> => {
    try {
      const data = await apiRequest<Pengaduan[]>('/pengaduan');
      setLocal('pengaduan', data);
      return data;
    } catch {
      return getLocal<Pengaduan[]>('pengaduan');
    }
  },
  getPengaduanByTicket: async (ticket: string): Promise<Pengaduan> => {
    try {
      const data = await apiRequest<Pengaduan>(`/pengaduan/status/${ticket}`);
      return data;
    } catch {
      const adu = getLocal<Pengaduan[]>('pengaduan').find(a => a.tiket.toLowerCase() === ticket.toLowerCase());
      if (!adu) throw new Error('Tiket tidak ditemukan.');
      return adu;
    }
  },
  createPengaduan: async (aduData: Omit<Pengaduan, 'id' | 'tiket' | 'status' | 'tanggal' | 'catatanAdmin' | 'timeline'>): Promise<{ success: boolean; tiket: string; data: Pengaduan; message?: string }> => {
    try {
      const res = await apiRequest<{ success: boolean; tiket: string; data: Pengaduan; message?: string }>('/pengaduan', 'POST', aduData);
      const current = getLocal<Pengaduan[]>('pengaduan');
      current.push(res.data);
      setLocal('pengaduan', current);
      return res;
    } catch {
      const current = getLocal<Pengaduan[]>('pengaduan');
      
      const year = new Date().getFullYear();
      let nextNum = 1;
      if (current.length > 0) {
        const nums = current.map(c => {
          const parts = c.tiket ? c.tiket.split('-') : [];
          return parts.length === 3 ? parseInt(parts[2]) : 0;
        }).filter(n => !isNaN(n));
        if (nums.length > 0) nextNum = Math.max(0, ...nums) + 1;
      }
      const ticketCode = `ADU-${year}-${String(nextNum).padStart(4, '0')}`;

      const newItem: Pengaduan = {
        id: current.length > 0 ? Math.max(...current.map(i => i.id)) + 1 : 1,
        tiket: ticketCode,
        status: 'Menunggu',
        tanggal: new Date().toISOString().split('T')[0],
        catatanAdmin: '',
        timeline: [
          {
            tanggal: new Date().toISOString().split('T')[0],
            status: 'Menunggu',
            keterangan: 'Aduan berhasil diajukan secara lokal dan menunggu verifikasi.'
          }
        ],
        ...aduData
      };
      current.push(newItem);
      setLocal('pengaduan', current);
      return { success: true, tiket: ticketCode, data: newItem };
    }
  },
  updatePengaduan: async (id: number, updateBody: { status?: string; catatanAdmin?: string; keteranganTimeline?: string }): Promise<Pengaduan> => {
    try {
      const res = await apiRequest<{ success: boolean; data: Pengaduan }>(`/pengaduan/${id}`, 'PUT', updateBody);
      const current = getLocal<Pengaduan[]>('pengaduan');
      const idx = current.findIndex(i => i.id === id);
      if (idx !== -1) current[idx] = res.data;
      setLocal('pengaduan', current);
      return res.data;
    } catch {
      const current = getLocal<Pengaduan[]>('pengaduan');
      const idx = current.findIndex(i => i.id === id);
      if (idx !== -1) {
        const oldStatus = current[idx].status;
        const newStatus = (updateBody.status as any) || oldStatus;
        current[idx].status = newStatus;
        current[idx].catatanAdmin = updateBody.catatanAdmin !== undefined ? updateBody.catatanAdmin : current[idx].catatanAdmin;
        
        if (newStatus !== oldStatus || updateBody.keteranganTimeline) {
          current[idx].timeline.push({
            tanggal: new Date().toISOString().split('T')[0],
            status: newStatus,
            keterangan: updateBody.keteranganTimeline || `Status pengaduan diperbarui menjadi ${newStatus}.`
          });
        }
      }
      setLocal('pengaduan', current);
      return current[idx];
    }
  },
  deletePengaduan: async (id: number): Promise<void> => {
    try {
      await apiRequest(`/pengaduan/${id}`, 'DELETE');
      const current = getLocal<Pengaduan[]>('pengaduan');
      const filtered = current.filter(i => i.id !== id);
      setLocal('pengaduan', filtered);
    } catch {
      const current = getLocal<Pengaduan[]>('pengaduan');
      const filtered = current.filter(i => i.id !== id);
      setLocal('pengaduan', filtered);
    }
  },

  // Galeri
  getGaleri: async (): Promise<Galeri[]> => {
    try {
      const data = await apiRequest<Galeri[]>('/galeri');
      setLocal('galeri', data);
      return data;
    } catch {
      return getLocal<Galeri[]>('galeri');
    }
  },
  createGaleri: async (galeriData: Omit<Galeri, 'id'>): Promise<Galeri> => {
    try {
      const res = await apiRequest<{ success: boolean; data: Galeri }>('/galeri', 'POST', galeriData);
      const current = getLocal<Galeri[]>('galeri');
      current.push(res.data);
      setLocal('galeri', current);
      return res.data;
    } catch {
      const current = getLocal<Galeri[]>('galeri');
      const newItem: Galeri = {
        id: current.length > 0 ? Math.max(...current.map(i => i.id)) + 1 : 1,
        ...galeriData
      };
      current.push(newItem);
      setLocal('galeri', current);
      return newItem;
    }
  },
  updateGaleri: async (id: number, galeriData: Partial<Galeri>): Promise<Galeri> => {
    try {
      const res = await apiRequest<{ success: boolean; data: Galeri }>(`/galeri/${id}`, 'PUT', galeriData);
      const current = getLocal<Galeri[]>('galeri');
      const idx = current.findIndex(i => i.id === id);
      if (idx !== -1) current[idx] = res.data;
      setLocal('galeri', current);
      return res.data;
    } catch {
      const current = getLocal<Galeri[]>('galeri');
      const idx = current.findIndex(i => i.id === id);
      if (idx !== -1) {
        current[idx] = { ...current[idx], ...galeriData } as Galeri;
      }
      setLocal('galeri', current);
      return current[idx];
    }
  },
  deleteGaleri: async (id: number): Promise<void> => {
    try {
      await apiRequest(`/galeri/${id}`, 'DELETE');
      const current = getLocal<Galeri[]>('galeri');
      const filtered = current.filter(i => i.id !== id);
      setLocal('galeri', filtered);
    } catch {
      const current = getLocal<Galeri[]>('galeri');
      const filtered = current.filter(i => i.id !== id);
      setLocal('galeri', filtered);
    }
  },

  // Kontak
  getKontak: async (): Promise<Kontak> => {
    try {
      const data = await apiRequest<Kontak>('/kontak');
      setLocal('kontak', data);
      return data;
    } catch {
      return getLocal<Kontak>('kontak');
    }
  },
  updateKontak: async (kontakData: Kontak): Promise<Kontak> => {
    try {
      const res = await apiRequest<{ success: boolean; data: Kontak }>('/kontak', 'PUT', kontakData);
      setLocal('kontak', res.data);
      return res.data;
    } catch {
      setLocal('kontak', kontakData);
      return kontakData;
    }
  },

  // Users Admin
  getUsers: async (): Promise<UserAdmin[]> => {
    const data = await apiRequest<UserAdmin[]>('/users');
    return data;
  },
  getUserById: async (id: number): Promise<UserAdmin> => {
    const data = await apiRequest<UserAdmin>(`/users/${id}`);
    return data;
  },
  createUser: async (userData: Omit<UserAdmin, 'id' | 'aktif'>): Promise<UserAdmin> => {
    const res = await apiRequest<{ success: boolean; data: UserAdmin }>('/users', 'POST', userData);
    return res.data;
  },
  updateUser: async (id: number, userData: Partial<UserAdmin>): Promise<UserAdmin> => {
    const res = await apiRequest<{ success: boolean; data: UserAdmin }>(`/users/${id}`, 'PUT', userData);
    return res.data;
  },
  deleteUser: async (id: number): Promise<void> => {
    await apiRequest(`/users/${id}`, 'DELETE');
  },
  uploadImage: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Gagal mengunggah gambar.');
    }

    const data = await response.json();
    return data.url;
  }
};

