import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { Berita as IBerita } from '../../data/initialData';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Breadcrumb from '../../components/common/Breadcrumb';
import { formatDate } from '../../utils/helpers';
import { ArrowLeft, Calendar, User, Eye, FileText } from 'lucide-react';

export const BeritaDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [item, setItem] = useState<IBerita | null>(null);
  const [recents, setRecents] = useState<IBerita[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    
    setLoading(true);
    setError('');

    // Fetch detail & other news
    Promise.all([
      api.getBeritaById(id),
      api.getBerita()
    ])
      .then(([detail, list]) => {
        setItem(detail);
        setRecents(
          list
            .filter(b => b.id !== detail.id && b.status === 'publish')
            .slice(0, 4)
        );
      })
      .catch((err) => {
        console.error(err);
        setError('Berita tidak ditemukan atau terjadi kesalahan sistem.');
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-slate-500">
        Memuat detail berita...
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="py-12 max-w-xl mx-auto px-4 text-center font-sans">
        <Card className="p-8">
          <div className="p-4 bg-rose-50 text-rose-500 rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-4">
            <FileText size={28} />
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">Terjadi Kesalahan</h3>
          <p className="text-sm text-slate-555 dark:text-slate-400 mb-6">{error || 'Data berita gagal dimuat.'}</p>
          <button
            onClick={() => navigate('/informasi/berita')}
            className="bg-primary-600 hover:bg-primary-700 text-white font-bold px-4 py-2 text-sm rounded-xl transition-all"
          >
            Kembali ke Berita
          </button>
        </Card>
      </div>
    );
  }

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 font-sans">
      <Breadcrumb
        items={[
          { label: 'Informasi', path: '/informasi/berita' },
          { label: 'Berita', path: '/informasi/berita' },
          { label: item.judul }
        ]}
      />

      <Link
        to="/informasi/berita"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 mb-6 group no-print"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
        Kembali ke Daftar
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Detail Content */}
        <article className="lg:col-span-8">
          <Card noPadding className="print-card overflow-hidden">
            {/* Banner Image */}
            <img
              src={item.gambar}
              alt={item.judul}
              className="w-full h-64 sm:h-96 object-cover bg-slate-100"
            />
            
            <div className="p-5 sm:p-8">
              {/* Meta attributes */}
              <div className="flex flex-wrap items-center gap-3.5 mb-4 border-b border-slate-100 dark:border-slate-800 pb-4">
                <Badge type="success" variant="soft">
                  {item.kategori}
                </Badge>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Calendar size={14} />
                  {formatDate(item.tanggal)}
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <User size={14} />
                  {item.penulis}
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Eye size={14} />
                  {item.views || 0} Kali Dibaca
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 dark:text-white mb-6 leading-snug font-sans">
                {item.judul}
              </h1>

              <div className="prose dark:prose-invert max-w-none text-slate-655 dark:text-slate-350 text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
                {item.isi}
              </div>
            </div>
          </Card>
        </article>

        {/* Side Widget Recents */}
        <aside className="lg:col-span-4 no-print">
          <Card>
            <h3 className="text-sm font-bold text-slate-850 dark:text-white uppercase tracking-wider mb-4 border-l-4 border-primary-600 pl-3">
              Berita Lainnya
            </h3>
            
            {recents.length === 0 ? (
              <p className="text-xs text-slate-400">Tidak ada berita lain.</p>
            ) : (
              <div className="flex flex-col gap-4">
                {recents.map((recent) => (
                  <div key={recent.id} className="group flex gap-3 border-b border-slate-100 dark:border-slate-800 pb-3 last:border-none last:pb-0">
                    <img
                      src={recent.gambar}
                      alt={recent.judul}
                      className="w-16 h-16 object-cover rounded-xl bg-slate-100 flex-shrink-0"
                    />
                    <div className="overflow-hidden">
                      <span className="block text-[9px] text-slate-400 mb-0.5">{formatDate(recent.tanggal)}</span>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2 leading-tight">
                        <Link to={`/informasi/berita/${recent.id}`}>{recent.judul}</Link>
                      </h4>
                    </div>
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
export default BeritaDetail;
