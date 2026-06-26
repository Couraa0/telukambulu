import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { Wisata as IWisata } from '../../data/initialData';
import SectionTitle from '../../components/common/SectionTitle';
import Card from '../../components/common/Card';
import SearchBar from '../../components/common/SearchBar';
import EmptyState from '../../components/common/EmptyState';
import Breadcrumb from '../../components/common/Breadcrumb';
import Skeleton from '../../components/common/Skeleton';
import { useSEO } from '../../hooks/useSEO';
import { Palmtree, MapPin, Clock } from 'lucide-react';

export const DestinasiWisata: React.FC = () => {
  useSEO({
    title: 'Destinasi Wisata Desa Telukambulu',
    description: 'Jelajahi agro-ekowisata persawahan hijau Karawang Utara dan situs cagar budaya percandian Batujaya tertua di Jawa Barat yang berlokasi di Desa Telukambulu.',
    keywords: 'Wisata Telukambulu, Candi Blandongan Batujaya, Ekowisata Persawahan, Wisata Karawang'
  });

  const [wisata, setWisata] = useState<IWisata[]>([]);
  const [filtered, setFiltered] = useState<IWisata[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getWisata()
      .then((data) => {
        setWisata(data);
        setFiltered(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let result = [...wisata];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(item =>
        item.nama.toLowerCase().includes(q) || item.deskripsi.toLowerCase().includes(q) || item.lokasi.toLowerCase().includes(q)
      );
    }
    setFiltered(result);
  }, [search, wisata]);

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 font-sans">
      <Breadcrumb items={[{ label: 'Pesona Desa' }, { label: 'Destinasi Wisata' }]} />
      <SectionTitle title="Destinasi Wisata Desa" subtitle="Jelajahi situs cagar budaya percandian tertua Jawa Barat dan taman agro-ekowisata persawahan Telukambulu." />

      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-8 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-2xl shadow-sm">
        <SearchBar value={search} onChange={setSearch} placeholder="Cari destinasi wisata..." />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Skeleton variant="wisata-card" count={3} />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState title="Destinasi wisata tidak ditemukan" icon={Palmtree} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <Card key={item.id} hoverEffect noPadding className="flex flex-col h-full overflow-hidden">
              <img src={item.foto} alt={item.nama} className="h-52 w-full object-cover bg-slate-100" />
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start gap-2 mb-3">
                    <span className="text-sm font-bold text-secondary-600 dark:text-secondary-400">
                      {item.tiket}
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
                      <Clock size={12} />
                      {item.operasional}
                    </span>
                  </div>
                  
                  <h3 className="text-base font-bold text-slate-850 dark:text-white leading-snug mb-2 hover:text-primary-600 transition-colors">
                    <Link to={`/pesona-desa/destinasi-wisata/${item.id}`}>{item.nama}</Link>
                  </h3>
                  
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed mb-6">
                    {item.deskripsi}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-4 mt-auto">
                  <span className="text-xs text-slate-450 flex items-center gap-1 font-medium truncate max-w-[180px]">
                    <MapPin size={14} className="text-slate-400" />
                    {item.lokasi}
                  </span>
                  <Link
                    to={`/pesona-desa/destinasi-wisata/${item.id}`}
                    className="text-xs font-bold text-primary-600 dark:text-primary-400 hover:underline flex-shrink-0"
                  >
                    Selengkapnya
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
export default DestinasiWisata;
