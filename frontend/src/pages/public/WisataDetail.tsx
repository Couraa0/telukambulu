import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { Wisata as IWisata } from '../../data/initialData';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Breadcrumb from '../../components/common/Breadcrumb';
import { ArrowLeft, MapPin, Clock, CircleDollarSign, Contact, Info } from 'lucide-react';

export const WisataDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [item, setItem] = useState<IWisata | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    api.getWisataById(id)
      .then(setItem)
      .catch((err) => {
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-[60vh] text-slate-500">Memuat detail wisata...</div>;
  }

  if (!item) {
    return (
      <div className="py-12 max-w-xl mx-auto px-4 text-center font-sans">
        <Card className="p-8">
          <div className="p-4 bg-rose-50 text-rose-500 rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-4">
            <Info size={28} />
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">Destinasi Tidak Ditemukan</h3>
          <p className="text-sm text-slate-550 dark:text-slate-450 mb-6">Destinasi wisata yang Anda cari tidak tersedia.</p>
          <button onClick={() => navigate('/pesona-desa/destinasi-wisata')} className="bg-primary-600 hover:bg-primary-700 text-white font-bold px-4 py-2 text-sm rounded-xl">
            Kembali ke Wisata
          </button>
        </Card>
      </div>
    );
  }

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 font-sans">
      <Breadcrumb
        items={[
          { label: 'Pesona Desa', path: '/pesona-desa/destinasi-wisata' },
          { label: 'Destinasi Wisata', path: '/pesona-desa/destinasi-wisata' },
          { label: item.nama }
        ]}
      />

      <Link
        to="/pesona-desa/destinasi-wisata"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 mb-6 group no-print"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
        Kembali ke Daftar
      </Link>

      <Card noPadding className="overflow-hidden print-card mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Cover Photo */}
          <div className="lg:col-span-5 h-64 lg:h-auto min-h-[300px]">
            <img src={item.foto} alt={item.nama} className="w-full h-full object-cover bg-slate-100" />
          </div>

          {/* Details */}
          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between gap-6">
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 dark:text-white mb-3">
                {item.nama}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <MapPin size={16} className="text-slate-400" />
                {item.lokasi}
              </p>
            </div>

            <div className="border-t border-slate-100 dark:border-slate-800/80 pt-5">
              <h4 className="text-sm font-bold text-slate-855 dark:text-white mb-2 font-sans">Deskripsi Wisata</h4>
              <p className="text-sm text-slate-600 dark:text-slate-350 leading-relaxed">{item.deskripsi}</p>
            </div>

            {/* Practical information grids */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 border-t border-slate-100 dark:border-slate-800/80 pt-5 text-xs sm:text-sm">
              <div className="flex flex-col gap-2">
                <span className="font-bold text-slate-450 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <Clock size={14} />
                  Jam Operasional
                </span>
                <span className="text-slate-700 dark:text-slate-300 font-semibold">{item.operasional}</span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="font-bold text-slate-450 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <CircleDollarSign size={14} />
                  Harga Tiket Masuk
                </span>
                <span className="text-primary-700 dark:text-primary-400 font-bold">{item.tiket}</span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="font-bold text-slate-450 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <Contact size={14} />
                  Kontak Pengelola
                </span>
                <span className="text-slate-705 dark:text-slate-305 font-medium">{item.kontak}</span>
              </div>
            </div>

            {/* Facilities */}
            {item.fasilitas && (
              <div className="border-t border-slate-100 dark:border-slate-800/80 pt-5 text-xs sm:text-sm">
                <span className="block font-bold text-slate-450 dark:text-slate-500 uppercase tracking-wider mb-2">Fasilitas</span>
                <span className="text-slate-655 dark:text-slate-355 leading-relaxed">{item.fasilitas}</span>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Sub-Gallery */}
      {item.galeri && item.galeri.length > 0 && (
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-850 dark:text-white uppercase tracking-wider mb-4 border-l-4 border-primary-600 pl-3">
            Galeri Foto Wisata
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {item.galeri.map((imgUrl, idx) => (
              <div key={idx} className="h-44 sm:h-52 rounded-2xl overflow-hidden shadow border border-slate-100 dark:border-slate-800">
                <img src={imgUrl} alt={`${item.nama} Gallery ${idx + 1}`} className="w-full h-full object-cover hover:scale-105 transition-all duration-300 bg-slate-100" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
export default WisataDetail;
