import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { Statistik, Berita, Pengaduan } from '../../data/initialData';
import StatCard from '../../components/common/StatCard';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import {
  FileText,
  Megaphone,
  MessageSquareWarning,
  ShieldCheck,
  ShoppingBag,
  Plus,
  ArrowRight,
  Eye,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { formatDate } from '../../utils/helpers';

export const Dashboard: React.FC = () => {
  const { user, hasRole } = useAuth();
  
  const [stats, setStats] = useState<Statistik | null>(null);
  const [recentNews, setRecentNews] = useState<Berita[]>([]);
  const [recentAdu, setRecentAdu] = useState<Pengaduan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const [sData, bData, aData] = await Promise.all([
          api.getStatistik(),
          api.getBerita(),
          api.getPengaduan(),
        ]);
        
        // Dynamically compute statistical counts from arrays if online
        const dynamicStats: Statistik = {
          ...sData,
          berita: bData.length,
          pengumuman: sData.pengumuman || 3, // fallback or dynamic count
          umkm: sData.umkm || 3,
          wisata: sData.wisata || 3,
          pengaduanSelesai: aData.filter(a => a.status === 'Selesai').length,
          pengaduanMasuk: aData.length
        };

        setStats(dynamicStats);
        
        // Latest 5 news
        setRecentNews(bData.sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime()).slice(0, 5));
        
        // Latest 5 complaints
        setRecentAdu(aData.sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime()).slice(0, 5));
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardStats();
  }, []);

  if (loading) {
    return <div className="text-center py-12 text-slate-500">Memuat halaman dashboard...</div>;
  }

  // Get color by complaint status
  const getStatusType = (status: string) => {
    switch (status) {
      case 'Selesai': return 'success';
      case 'Diproses': return 'info';
      case 'Ditolak': return 'danger';
      default: return 'warning';
    }
  };

  return (
    <div className="font-sans flex flex-col gap-8">
      
      {/* Welcome Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-lg">
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary-655/15 rounded-full blur-2xl -mr-16 -mt-16"></div>
        <div className="relative z-10">
          <span className="bg-primary-600 font-bold text-[9px] sm:text-xs uppercase tracking-widest px-3 py-1 rounded-full border border-primary-500/20">
            Sistem Informasi Desa Digital (SIDESDI)
          </span>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-black mt-4">
            Halo, {user?.nama}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Selamat datang kembali di panel administrasi Desa Telukambulu. Anda masuk sebagai <span className="font-bold text-primary-400">{user?.role}</span>. Kelola data dan konten publik dengan bijak.
          </p>
        </div>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Berita Desa" value={stats?.berita || 0} icon={FileText} color="primary" />
        <StatCard title="Total Pengaduan" value={stats?.pengaduanMasuk || 0} icon={MessageSquareWarning} color="rose" />
        <StatCard title="Pengaduan Selesai" value={stats?.pengaduanSelesai || 0} icon={ShieldCheck} color="accent" />
        <StatCard title="Potensi UMKM" value={stats?.umkm || 0} icon={ShoppingBag} color="accent" />
      </div>

      {/* Quick Actions Panel */}
      <Card>
        <h3 className="text-sm font-bold text-slate-850 dark:text-white uppercase tracking-wider mb-5 border-l-4 border-primary-600 pl-3">
          Tindakan Cepat
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          
          {hasRole(['Super Admin', 'Admin Konten']) && (
            <>
              <Link
                to="/admin/berita"
                className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:border-primary-500 hover:bg-primary-50/10 transition-all text-center group"
              >
                <div className="p-3 bg-primary-50 dark:bg-primary-950/20 text-primary-600 rounded-xl mb-3 group-hover:scale-105 transition-transform">
                  <Plus size={20} />
                </div>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Tulis Berita Baru</span>
              </Link>

              <Link
                to="/admin/pengumuman"
                className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:border-primary-500 hover:bg-primary-50/10 transition-all text-center group"
              >
                <div className="p-3 bg-primary-50 dark:bg-primary-950/20 text-primary-600 rounded-xl mb-3 group-hover:scale-105 transition-transform">
                  <Megaphone size={20} />
                </div>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Buat Pengumuman</span>
              </Link>
            </>
          )}

          {hasRole(['Super Admin', 'Admin Pengaduan']) && (
            <Link
              to="/admin/pengaduan"
              className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:border-rose-500 hover:bg-rose-50/10 transition-all text-center group col-span-1"
            >
              <div className="p-3 bg-rose-50 dark:bg-rose-950/20 text-rose-600 rounded-xl mb-3 group-hover:scale-105 transition-transform">
                <MessageSquareWarning size={20} />
              </div>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Tinjau Pengaduan</span>
            </Link>
          )}

          {hasRole(['Super Admin', 'Admin Profil']) && (
            <Link
              to="/admin/profil-desa"
              className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:border-secondary-500 hover:bg-secondary-50/10 transition-all text-center group"
            >
              <div className="p-3 bg-secondary-50 dark:bg-secondary-950/20 text-secondary-600 rounded-xl mb-3 group-hover:scale-105 transition-transform">
                <ShieldCheck size={20} />
              </div>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Edit Profil Desa</span>
            </Link>
          )}

        </div>
      </Card>

      {/* Main Lists tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Recent Complaints */}
        {hasRole(['Super Admin', 'Admin Pengaduan']) && (
          <Card>
            <div className="flex justify-between items-center mb-5 pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-855 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <AlertCircle size={18} className="text-rose-500" />
                Pengaduan Terbaru
              </h3>
              <Link to="/admin/pengaduan" className="text-xs font-bold text-primary-600 hover:underline flex items-center gap-0.5">
                Semua
                <ArrowRight size={14} />
              </Link>
            </div>

            {recentAdu.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">Belum ada pengaduan warga.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-100 dark:divide-slate-800 text-left text-xs sm:text-sm">
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {recentAdu.map((adu) => (
                      <tr key={adu.id} className="hover:bg-slate-50/40 dark:hover:bg-slate-850/40 transition-colors">
                        <td className="py-3 px-1 font-mono font-bold text-slate-850 dark:text-white">{adu.tiket}</td>
                        <td className="py-3 px-2">
                          <span className="block font-semibold text-slate-700 dark:text-slate-300">{adu.nama}</span>
                          <span className="block text-[10px] text-slate-400">{adu.kategori}</span>
                        </td>
                        <td className="py-3 px-2">
                          <Badge type={getStatusType(adu.status)} variant="soft">
                            {adu.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-1 text-right">
                          <Link
                            to={`/admin/pengaduan?ticket=${adu.tiket}`}
                            className="bg-slate-105 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-[10px] font-bold py-1.5 px-3 rounded-lg transition-colors inline-block text-slate-700 dark:text-slate-250"
                          >
                            Tindak Lanjut
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        )}

        {/* Recent News */}
        {hasRole(['Super Admin', 'Admin Konten']) && (
          <Card>
            <div className="flex justify-between items-center mb-5 pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-855 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <FileText size={18} className="text-primary-600" />
                Berita & Artikel Terbaru
              </h3>
              <Link to="/admin/berita" className="text-xs font-bold text-primary-600 hover:underline flex items-center gap-0.5">
                Semua
                <ArrowRight size={14} />
              </Link>
            </div>

            {recentNews.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">Belum ada berita terbit.</p>
            ) : (
              <div className="flex flex-col gap-3.5">
                {recentNews.map((news) => (
                  <div key={news.id} className="flex items-center justify-between gap-4 border-b border-slate-50 dark:border-slate-850 pb-3 last:border-none last:pb-0">
                    <div className="overflow-hidden">
                      <h4 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 truncate leading-tight mb-1">
                        {news.judul}
                      </h4>
                      <div className="flex items-center gap-3 text-[10px] text-slate-400 font-semibold">
                        <span className="flex items-center gap-1">
                          <Calendar size={11} />
                          {formatDate(news.tanggal)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye size={11} />
                          {news.views || 0} Pembaca
                        </span>
                        <Badge type={news.status === 'publish' ? 'success' : 'neutral'} variant="soft" className="text-[8px] px-1 py-0.1 uppercase">
                          {news.status}
                        </Badge>
                      </div>
                    </div>
                    <Link
                      to="/admin/berita"
                      className="text-xs font-bold text-secondary-600 hover:underline flex-shrink-0"
                    >
                      Edit
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}

      </div>
    </div>
  );
};
export default Dashboard;
