import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { SDA as ISDA } from '../../data/initialData';
import SectionTitle from '../../components/common/SectionTitle';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import SearchBar from '../../components/common/SearchBar';
import SelectInput from '../../components/common/SelectInput';
import EmptyState from '../../components/common/EmptyState';
import Breadcrumb from '../../components/common/Breadcrumb';
import Skeleton from '../../components/common/Skeleton';
import { useSEO } from '../../hooks/useSEO';
import { Trees, ArrowRight, MapPin } from 'lucide-react';

export const SDA: React.FC = () => {
  useSEO({
    title: 'Sumber Daya Alam & Potensi Desa Telukambulu',
    description: 'Katalog potensi alam pendukung roda perekonomian Desa Telukambulu seperti sektor persawahan, irigasi air, pengrajin bambu, dan peternakan lokal.',
    keywords: 'Sumber Daya Alam, Potensi Desa, Pertanian Telukambulu, Irigasi Karawang'
  });

  const [sda, setSda] = useState<ISDA[]>([]);
  const [filtered, setFiltered] = useState<ISDA[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getSDA()
      .then((data) => {
        setSda(data);
        setFiltered(data);
        const cats = Array.from(new Set(data.map(item => item.kategori)));
        setCategories(cats);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let result = [...sda];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(item =>
        item.nama.toLowerCase().includes(q) || item.deskripsi.toLowerCase().includes(q) || item.lokasi.toLowerCase().includes(q)
      );
    }
    if (selectedCat) {
      result = result.filter(item => item.kategori === selectedCat);
    }
    setFiltered(result);
  }, [search, selectedCat, sda]);

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 font-sans">
      <Breadcrumb items={[{ label: 'Pesona Desa' }, { label: 'Sumber Daya Alam' }]} />
      <SectionTitle title="Sumber Daya Alam Desa" subtitle="Katalog kekayaan dan potensi sumber daya alam pendukung produktivitas ekonomi Desa Telukambulu." />

      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-8 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-2xl shadow-sm">
        <SearchBar value={search} onChange={setSearch} placeholder="Cari potensi alam..." />
        <SelectInput
          options={['', ...categories]}
          value={selectedCat}
          onChange={(e) => setSelectedCat(e.target.value)}
          placeholder="Semua Kategori"
          className="w-full sm:w-48"
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Skeleton variant="news-card" count={3} />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState title="Potensi alam tidak ditemukan" icon={Trees} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <Card key={item.id} hoverEffect noPadding className="flex flex-col h-full overflow-hidden">
              <img src={item.foto} alt={item.nama} className="h-48 w-full object-cover bg-slate-100" />
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Badge type="success" variant="soft">{item.kategori}</Badge>
                    <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
                      <MapPin size={12} />
                      Batujaya
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-850 dark:text-white leading-snug mb-2 hover:text-primary-600 transition-colors">
                    <Link to={`/pesona-desa/sda/${item.id}`}>{item.nama}</Link>
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed mb-4">
                    {item.deskripsi}
                  </p>
                </div>
                <Link
                  to={`/pesona-desa/sda/${item.id}`}
                  className="inline-flex items-center text-xs font-bold text-primary-600 dark:text-primary-400 hover:underline gap-1 mt-auto"
                >
                  Lihat Manfaat & Potensi
                  <ArrowRight size={12} />
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
export default SDA;
