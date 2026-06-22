import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { Pengumuman as IPengumuman } from '../../data/initialData';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Breadcrumb from '../../components/common/Breadcrumb';
import { formatDate } from '../../utils/helpers';
import { ArrowLeft, Calendar, User, Megaphone } from 'lucide-react';

export const PengumumanDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [item, setItem] = useState<IPengumuman | null>(null);
  const [recents, setRecents] = useState<IPengumuman[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    
    setLoading(true);
    setError('');

    // Fetch detail & other announcements
    Promise.all([
      api.getPengumumanById(id),
      api.getPengumuman()
    ])
      .then(([detail, list]) => {
        setItem(detail);
        setRecents(list.filter(p => p.id !== detail.id && p.status === 'publish').slice(0, 4));
      })
      .catch((err) => {
        console.error(err);
        setError('Pengumuman tidak ditemukan atau terjadi kesalahan sistem.');
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-slate-500">
        Memuat detail pengumuman...
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="py-12 max-w-xl mx-auto px-4 text-center font-sans">
        <Card className="p-8">
          <div className="p-4 bg-rose-50 text-rose-500 rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-4">
            <Megaphone size={28} />
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">Terjadi Kesalahan</h3>
          <p className="text-sm text-slate-550 dark:text-slate-400 mb-6">{error || 'Data pengumuman gagal dimuat.'}</p>
          <button
            onClick={() => navigate('/informasi/pengumuman')}
            className="bg-primary-600 hover:bg-primary-700 text-white font-bold px-4 py-2 text-sm rounded-xl transition-all"
          >
            Kembali ke Pengumuman
          </button>
        </Card>
      </div>
    );
  }

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 font-sans">
      <Breadcrumb
        items={[
          { label: 'Informasi', path: '/informasi/pengumuman' },
          { label: 'Pengumuman', path: '/informasi/pengumuman' },
          { label: item.judul }
        ]}
      />

      <Link
        to="/informasi/pengumuman"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 mb-6 group no-print"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
        Kembali ke Daftar
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Detail Content */}
        <article className="lg:col-span-8">
          <Card className="print-card">
            {/* Meta attributes */}
            <div className="flex flex-wrap items-center gap-3.5 mb-4">
              <Badge type="info" variant="soft">
                {item.kategori}
              </Badge>
              {item.penting && (
                <Badge type="danger" variant="solid" className="text-[10px] px-2 py-0.5 animate-pulse">
                  PENTING
                </Badge>
              )}
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Calendar size={14} />
                {formatDate(item.tanggal)}
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <User size={14} />
                Pemerintah Desa
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 dark:text-white mb-6 leading-snug font-sans">
              {item.judul}
            </h1>

            <div className="prose dark:prose-invert max-w-none text-slate-655 dark:text-slate-300 text-sm sm:text-base leading-relaxed whitespace-pre-wrap border-t border-slate-100 dark:border-slate-800 pt-6">
              {item.isi}
            </div>
          </Card>
        </article>

        {/* Side Widget Recents */}
        <aside className="lg:col-span-4 no-print">
          <Card>
            <h3 className="text-sm font-bold text-slate-850 dark:text-white uppercase tracking-wider mb-4 border-l-4 border-primary-600 pl-3">
              Pengumuman Lainnya
            </h3>
            
            {recents.length === 0 ? (
              <p className="text-xs text-slate-400">Tidak ada pengumuman lain.</p>
            ) : (
              <div className="flex flex-col gap-4">
                {recents.map((recent) => (
                  <div key={recent.id} className="group border-b border-slate-100 dark:border-slate-800 pb-3 last:border-none last:pb-0">
                    <span className="block text-[10px] text-slate-400 mb-1">{formatDate(recent.tanggal)}</span>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2">
                      <Link to={`/informasi/pengumuman/${recent.id}`}>{recent.judul}</Link>
                    </h4>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </aside>

      </div>
    </div>
  );
};
export default PengumumanDetail;
