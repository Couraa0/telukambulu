import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { Produk as IProduk } from '../../data/initialData';
import SectionTitle from '../../components/common/SectionTitle';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import SearchBar from '../../components/common/SearchBar';
import SelectInput from '../../components/common/SelectInput';
import EmptyState from '../../components/common/EmptyState';
import Breadcrumb from '../../components/common/Breadcrumb';
import { ShoppingBag, ArrowRight, MessageSquare, MapPin } from 'lucide-react';
import { formatWhatsAppLink } from '../../utils/helpers';

export const ProdukUnggulan: React.FC = () => {
  const [produk, setProduk] = useState<IProduk[]>([]);
  const [filtered, setFiltered] = useState<IProduk[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getProduk()
      .then((data) => {
        setProduk(data);
        setFiltered(data);
        const cats = Array.from(new Set(data.map(item => item.kategori)));
        setCategories(cats);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let result = [...produk];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(item =>
        item.nama.toLowerCase().includes(q) || item.deskripsi.toLowerCase().includes(q) || item.penjual.toLowerCase().includes(q)
      );
    }
    if (selectedCat) {
      result = result.filter(item => item.kategori === selectedCat);
    }
    setFiltered(result);
  }, [search, selectedCat, produk]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-[60vh] text-slate-500">Memuat produk UMKM...</div>;
  }

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 font-sans">
      <Breadcrumb items={[{ label: 'Pesona Desa' }, { label: 'Produk Unggulan' }]} />
      <SectionTitle title="Produk Unggulan UMKM" subtitle="Etalase produk kerajinan anyaman bambu, beras organik, dan makanan khas olahan warga Desa Telukambulu." />

      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-8 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-2xl shadow-sm">
        <SearchBar value={search} onChange={setSearch} placeholder="Cari nama produk atau usaha..." />
        <SelectInput
          options={['', ...categories]}
          value={selectedCat}
          onChange={(e) => setSelectedCat(e.target.value)}
          placeholder="Semua Kategori"
          className="w-full sm:w-48"
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="Produk tidak ditemukan" icon={ShoppingBag} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => {
            const waMsg = `Halo, saya melihat produk "${item.nama}" di website desa Telukambulu. Apakah produk ini tersedia?`;
            const waLink = formatWhatsAppLink(item.kontak, waMsg);

            return (
              <Card key={item.id} hoverEffect noPadding className="flex flex-col h-full overflow-hidden">
                <img src={item.foto} alt={item.nama} className="h-52 w-full object-cover bg-slate-100" />
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-2 mb-2.5">
                      <Badge type="success" variant="soft">{item.kategori}</Badge>
                      <span className="text-sm font-bold text-primary-655 dark:text-primary-400">
                        {item.harga}
                      </span>
                    </div>
                    
                    <h3 className="text-base font-bold text-slate-850 dark:text-white leading-snug mb-1 hover:text-primary-600 transition-colors line-clamp-1">
                      <Link to={`/pesona-desa/produk-unggulan/${item.id}`}>{item.nama}</Link>
                    </h3>
                    
                    <p className="text-[10px] text-slate-400 font-bold mb-3 flex items-center gap-1">
                      <MapPin size={12} className="text-slate-400" />
                      {item.penjual}
                    </p>

                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed mb-6">
                      {item.deskripsi}
                    </p>
                  </div>

                  <div className="flex items-center gap-2.5 border-t border-slate-100 dark:border-slate-800 pt-4 mt-auto">
                    <a
                      href={waLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow-md shadow-emerald-600/10"
                    >
                      <MessageSquare size={14} />
                      Hubungi Penjual
                    </a>
                    <Link
                      to={`/pesona-desa/produk-unggulan/${item.id}`}
                      className="border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-850 font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1 transition-all"
                    >
                      Detail
                      <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
export default ProdukUnggulan;
