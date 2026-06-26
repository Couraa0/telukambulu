import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { Produk as IProduk } from '../../data/initialData';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Breadcrumb from '../../components/common/Breadcrumb';
import { ArrowLeft, MessageSquare, MapPin, Briefcase, ShoppingBag } from 'lucide-react';
import { formatWhatsAppLink } from '../../utils/helpers';
import { useSEO } from '../../hooks/useSEO';

export const ProdukDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [item, setItem] = useState<IProduk | null>(null);
  const [loading, setLoading] = useState(true);

  useSEO({
    title: item?.nama ? `${item.nama}` : 'Memuat Produk...',
    description: item?.deskripsi || 'Detail harga, stok, lokasi usaha, dan hubungi langsung penjual WhatsApp produk lokal Desa Telukambulu.',
    keywords: `Produk UMKM, ${item?.nama || ''}, Telukambulu, Karawang`
  });

  useEffect(() => {
    if (!id) return;
    api.getProdukById(id)
      .then(setItem)
      .catch((err) => {
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (!loading && !item) {
    return (
      <div className="py-12 max-w-xl mx-auto px-4 text-center font-sans">
        <Card className="p-8">
          <div className="p-4 bg-rose-50 text-rose-500 rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-4">
            <ShoppingBag size={28} />
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">Produk Tidak Ditemukan</h3>
          <p className="text-sm text-slate-500 mb-6">Produk lokal yang Anda cari tidak tersedia.</p>
          <button onClick={() => navigate('/pesona-desa/produk-unggulan')} className="bg-primary-600 hover:bg-primary-700 text-white font-bold px-4 py-2 text-sm rounded-xl">
            Kembali ke Produk
          </button>
        </Card>
      </div>
    );
  }

  const waMsg = item ? `Halo, saya melihat produk "${item.nama}" di website desa Telukambulu. Apakah produk ini tersedia?` : '';
  const waLink = item ? formatWhatsAppLink(item.kontak, waMsg) : '';

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 font-sans">
      <Breadcrumb
        items={[
          { label: 'Pesona Desa', path: '/pesona-desa/produk-unggulan' },
          { label: 'Produk Unggulan', path: '/pesona-desa/produk-unggulan' },
          { label: item?.nama || 'Memuat detail produk...' }
        ]}
      />

      <Link
        to="/pesona-desa/produk-unggulan"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 mb-6 group no-print"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
        Kembali ke Daftar
      </Link>

      <Card noPadding className="overflow-hidden print-card">
        <div className="grid grid-cols-1 md:grid-cols-12">
          {/* Cover photo */}
          <div className="md:col-span-5 h-64 md:h-auto min-h-[300px]">
            {loading ? (
              <div className="w-full h-full bg-slate-200 dark:bg-emerald-950/20 animate-pulse" />
            ) : item && (
              <img src={item.foto} alt={item.nama} className="w-full h-full object-cover bg-slate-100" />
            )}
          </div>

          {/* Details */}
          <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between gap-6">
            {loading ? (
              <div className="space-y-6">
                <div className="flex justify-between">
                  <div className="h-5 w-16 bg-slate-200 dark:bg-emerald-950/25 rounded animate-pulse" />
                  <div className="h-6 w-24 bg-slate-200 dark:bg-emerald-950/25 rounded animate-pulse" />
                </div>
                <div className="space-y-2">
                  <div className="h-7 w-2/3 bg-slate-200 dark:bg-emerald-950/25 rounded animate-pulse" />
                  <div className="h-4 w-1/3 bg-slate-200 dark:bg-emerald-950/25 rounded animate-pulse" />
                </div>
                <div className="border-t border-slate-100 dark:border-slate-800 pt-5 space-y-2">
                  <div className="h-4 w-1/4 bg-slate-200 dark:bg-emerald-950/25 rounded animate-pulse" />
                  <div className="h-4 w-full bg-slate-200 dark:bg-emerald-950/25 rounded animate-pulse" />
                </div>
              </div>
            ) : item && (
              <>
                <div>
                  <div className="flex justify-between items-start gap-4 mb-2">
                    <Badge type="success" variant="soft">{item.kategori}</Badge>
                    <span className="text-xl sm:text-2xl font-black text-primary-655 dark:text-primary-400">
                      {item.harga}
                    </span>
                  </div>
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 dark:text-white mb-2 leading-snug">
                    {item.nama}
                  </h1>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                    Pemilik Usaha: <span className="text-slate-600 dark:text-slate-300">{item.penjual}</span>
                  </p>
                </div>

                <div className="border-t border-slate-100 dark:border-slate-800/80 pt-5">
                  <h4 className="text-sm font-bold text-slate-850 dark:text-white mb-2">Deskripsi Produk</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-350 leading-relaxed">{item.deskripsi}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-100 dark:border-slate-800/80 pt-5 text-xs sm:text-sm">
                  <div className="flex flex-col gap-2">
                    <span className="font-bold text-slate-400 uppercase tracking-wider">Lokasi Usaha</span>
                    <span className="text-slate-707 dark:text-slate-300 flex items-center gap-1.5 font-medium">
                      <MapPin size={16} className="text-slate-400" />
                      {item.lokasi}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="font-bold text-slate-400 uppercase tracking-wider">Ketersediaan Stok</span>
                    <span className="text-slate-705 dark:text-slate-305 flex items-center gap-1.5 font-semibold">
                      <Briefcase size={16} className="text-slate-400" />
                      {item.stok}
                    </span>
                  </div>
                </div>

                <div className="border-t border-slate-100 dark:border-slate-800/80 pt-5 mt-auto">
                  <a
                    href={waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-3.5 rounded-xl text-sm shadow-lg shadow-emerald-600/20 active:scale-95 transition-all w-full sm:w-auto"
                  >
                    <MessageSquare size={18} />
                    Hubungi Penjual (WhatsApp)
                  </a>
                </div>
              </>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};
export default ProdukDetail;
