import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { SDA as ISDA } from '../../data/initialData';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Breadcrumb from '../../components/common/Breadcrumb';
import { ArrowLeft, MapPin, Sparkles, HandHelping, Info } from 'lucide-react';

export const SDADetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [item, setItem] = useState<ISDA | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    api.getSDAById(id)
      .then(setItem)
      .catch((err) => {
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-[60vh] text-slate-500">Memuat detail potensi...</div>;
  }

  if (!item) {
    return (
      <div className="py-12 max-w-xl mx-auto px-4 text-center font-sans">
        <Card className="p-8">
          <div className="p-4 bg-rose-50 text-rose-500 rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-4">
            <Info size={28} />
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">Data Tidak Ditemukan</h3>
          <p className="text-sm text-slate-500 mb-6">Potensi alam yang Anda cari tidak tersedia.</p>
          <button onClick={() => navigate('/pesona-desa/sda')} className="bg-primary-600 hover:bg-primary-700 text-white font-bold px-4 py-2 text-sm rounded-xl">
            Kembali ke SDA
          </button>
        </Card>
      </div>
    );
  }

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 font-sans">
      <Breadcrumb
        items={[
          { label: 'Pesona Desa', path: '/pesona-desa/sda' },
          { label: 'Sumber Daya Alam', path: '/pesona-desa/sda' },
          { label: item.nama }
        ]}
      />

      <Link
        to="/pesona-desa/sda"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 mb-6 group no-print"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
        Kembali ke Daftar
      </Link>

      <Card noPadding className="overflow-hidden print-card">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Image */}
          <div className="lg:col-span-5 h-64 lg:h-auto min-h-[300px]">
            <img src={item.foto} alt={item.nama} className="w-full h-full object-cover bg-slate-100" />
          </div>
          
          {/* Details */}
          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col gap-6">
            <div>
              <Badge type="success" variant="soft" className="mb-2">{item.kategori}</Badge>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 dark:text-white mb-3">
                {item.nama}
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <MapPin size={16} className="text-slate-400" />
                {item.lokasi}
              </p>
            </div>

            <div className="border-t border-slate-100 dark:border-slate-800/80 pt-5">
              <h4 className="text-sm font-bold text-slate-850 dark:text-white mb-2">Deskripsi Alam</h4>
              <p className="text-sm text-slate-600 dark:text-slate-350 leading-relaxed">{item.deskripsi}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-t border-slate-100 dark:border-slate-800/80 pt-5">
              <div>
                <h4 className="text-sm font-bold text-slate-850 dark:text-white mb-2 flex items-center gap-2">
                  <HandHelping size={16} className="text-primary-655" />
                  Manfaat & Kegunaan
                </h4>
                <p className="text-xs sm:text-sm text-slate-550 dark:text-slate-400 leading-relaxed">{item.manfaat}</p>
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-850 dark:text-white mb-2 flex items-center gap-2">
                  <Sparkles size={16} className="text-accent-600" />
                  Potensi Pengembangan
                </h4>
                <p className="text-xs sm:text-sm text-slate-550 dark:text-slate-400 leading-relaxed">{item.potensi}</p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
export default SDADetail;
