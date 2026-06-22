import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Galeri as IGaleri } from '../../data/initialData';
import SectionTitle from '../../components/common/SectionTitle';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import EmptyState from '../../components/common/EmptyState';
import Breadcrumb from '../../components/common/Breadcrumb';
import Modal from '../../components/common/Modal';
import Skeleton from '../../components/common/Skeleton';
import { useSEO } from '../../hooks/useSEO';
import { formatDate } from '../../utils/helpers';
import { Image as ImageIcon, Calendar, X } from 'lucide-react';

export const Galeri: React.FC = () => {
  useSEO({
    title: 'Galeri Foto Kegiatan Desa Telukambulu',
    description: 'Dokumentasi visual rangkaian kegiatan pelayanan Posyandu, gotong royong warga, perayaan hari besar, dan rapat pembangunan Musrenbang Desa Telukambulu.',
    keywords: 'Galeri Desa, Dokumentasi Kegiatan, Foto Telukambulu, Posyandu Karawang'
  });

  const [galeri, setGaleri] = useState<IGaleri[]>([]);
  const [filtered, setFiltered] = useState<IGaleri[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCat, setSelectedCat] = useState('');
  const [loading, setLoading] = useState(true);

  // Modal Preview State
  const [selectedItem, setSelectedItem] = useState<IGaleri | null>(null);

  useEffect(() => {
    api.getGaleri()
      .then((data) => {
        setGaleri(data);
        setFiltered(data);
        const cats = Array.from(new Set(data.map(item => item.kategori)));
        setCategories(cats);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (selectedCat) {
      setFiltered(galeri.filter(item => item.kategori === selectedCat));
    } else {
      setFiltered(galeri);
    }
  }, [selectedCat, galeri]);

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 font-sans">
      <Breadcrumb items={[{ label: 'Galeri Kegiatan' }]} />
      <SectionTitle title="Galeri Kegiatan Desa" subtitle="Dokumentasi foto kegiatan pemerintahan desa, pelayanan Posyandu, gotong-royong warga, dan pemberdayaan masyarakat." />

      {/* Category Pills Filter */}
      <div className="flex flex-wrap gap-2.5 justify-center mb-10 no-print">
        <button
          onClick={() => setSelectedCat('')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            selectedCat === ''
              ? 'bg-primary-600 text-white shadow-md'
              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          Semua Kegiatan
        </button>
        {categories.map((cat, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedCat(cat)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              selectedCat === cat
                ? 'bg-primary-600 text-white shadow-md'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Photo Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <Skeleton variant="news-card" count={4} />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState title="Foto kegiatan tidak ditemukan" icon={ImageIcon} />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.map((item) => (
            <Card
              key={item.id}
              hoverEffect
              noPadding
              className="flex flex-col h-full overflow-hidden cursor-pointer"
              onClick={() => setSelectedItem(item)}
            >
              <div className="relative h-44 sm:h-52 w-full overflow-hidden group">
                <img
                  src={item.foto}
                  alt={item.judul}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 bg-slate-100"
                />
                <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white text-xs font-bold bg-slate-900/60 backdrop-blur px-3 py-1.5 rounded-full">
                    Buka Detail
                  </span>
                </div>
              </div>
              <div className="p-4 flex-grow flex flex-col justify-between gap-2.5">
                <div>
                  <Badge type="info" variant="soft" className="mb-1">{item.kategori}</Badge>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-850 dark:text-white line-clamp-1 leading-snug">
                    {item.judul}
                  </h4>
                </div>
                <span className="text-[10px] text-slate-450 font-semibold flex items-center gap-1">
                  <Calendar size={12} />
                  {formatDate(item.tanggal)}
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Image Preview Modal */}
      <Modal isOpen={!!selectedItem} onClose={() => setSelectedItem(null)} title="Dokumentasi Kegiatan">
        {selectedItem && (
          <div className="flex flex-col gap-4 font-sans text-left">
            <img
              src={selectedItem.foto}
              alt={selectedItem.judul}
              className="w-full max-h-96 object-cover rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50"
            />
            <div>
              <div className="flex items-center gap-3.5 mb-2">
                <Badge type="info" variant="soft">{selectedItem.kategori}</Badge>
                <span className="text-xs text-slate-400 flex items-center gap-1 font-medium">
                  <Calendar size={14} />
                  {formatDate(selectedItem.tanggal)}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-2 leading-snug">
                {selectedItem.judul}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-455 leading-relaxed">
                {selectedItem.deskripsi}
              </p>
            </div>
            <div className="flex justify-end border-t border-slate-100 dark:border-slate-800 pt-4">
              <button
                onClick={() => setSelectedItem(null)}
                className="bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold px-4 py-2 text-xs rounded-xl transition-colors"
              >
                Tutup Preview
              </button>
            </div>
          </div>
        )}
      </Modal>

    </div>
  );
};
export default Galeri;
