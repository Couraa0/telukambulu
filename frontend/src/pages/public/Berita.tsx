import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { Berita as IBerita } from '../../data/initialData';
import SectionTitle from '../../components/common/SectionTitle';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import SearchBar from '../../components/common/SearchBar';
import SelectInput from '../../components/common/SelectInput';
import Pagination from '../../components/common/Pagination';
import EmptyState from '../../components/common/EmptyState';
import Breadcrumb from '../../components/common/Breadcrumb';
import Skeleton from '../../components/common/Skeleton';
import { useSEO } from '../../hooks/useSEO';
import { formatDate } from '../../utils/helpers';
import { FileText, Calendar, Eye } from 'lucide-react';

export const Berita: React.FC = () => {
  useSEO({
    title: 'Kabar & Berita Terkini - Desa Telukambulu',
    description: 'Ikuti perkembangan berita terbaru, liputan kegiatan warga, proyek pembangunan infrastruktur tani, dan acara sosial kemasyarakatan di Desa Telukambulu.',
    keywords: 'Berita Desa, Kegiatan Telukambulu, Pembangunan Karawang, Kabar Batujaya'
  });

  const [berita, setBerita] = useState<IBerita[]>([]);
  const [filtered, setFiltered] = useState<IBerita[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  
  // Search & Filter state
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('');
  const [selectedSort, setSelectedSort] = useState('newest');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getBerita()
      .then((data) => {
        const published = data.filter(b => b.status === 'publish');
        setBerita(published);
        setFiltered(published);
        
        // Extract unique categories
        const cats = Array.from(new Set(published.map(b => b.kategori)));
        setCategories(cats);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Filter & Search Handler
  useEffect(() => {
    let result = [...berita];

    // Search filter
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        b => b.judul.toLowerCase().includes(q) || b.isi.toLowerCase().includes(q) || b.ringkasan.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (selectedCat) {
      result = result.filter(b => b.kategori === selectedCat);
    }

    // Sorting
    if (selectedSort === 'newest') {
      result.sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime());
    } else if (selectedSort === 'popular') {
      result.sort((a, b) => (b.views || 0) - (a.views || 0));
    } else {
      result.sort((a, b) => new Date(a.tanggal).getTime() - new Date(b.tanggal).getTime());
    }

    setFiltered(result);
    setCurrentPage(1); // Reset page on filter
  }, [search, selectedCat, selectedSort, berita]);

  // Pagination Logic
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedItems = filtered.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 font-sans">
      <Breadcrumb items={[{ label: 'Informasi' }, { label: 'Berita' }]} />
      <SectionTitle title="Kabar & Berita Desa" subtitle="Liputan kegiatan, pembangunan infrastruktur, pertanian, serta acara sosial budaya di Desa Telukambulu." />

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-8 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 p-4 rounded-2xl shadow-sm w-full">
        <SearchBar value={search} onChange={setSearch} placeholder="Cari berita..." />
        
        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          <SelectInput
            options={['', ...categories]}
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
            placeholder="Semua Kategori"
            className="w-full sm:w-44"
          />
          <SelectInput
            options={[
              { value: 'newest', label: 'Terbaru' },
              { value: 'popular', label: 'Populer (Sering Dibaca)' },
              { value: 'oldest', label: 'Terlama' },
            ]}
            value={selectedSort}
            onChange={(e) => setSelectedSort(e.target.value)}
            className="w-full sm:w-48"
          />
        </div>
      </div>

      {/* Grid List */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Skeleton variant="news-card" count={6} />
        </div>
      ) : paginatedItems.length === 0 ? (
        <EmptyState title="Berita tidak ditemukan" description="Coba ubah kata kunci pencarian atau bersihkan filter untuk melihat semua berita." icon={FileText} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedItems.map((item) => (
            <Card key={item.id} hoverEffect noPadding className="flex flex-col h-full overflow-hidden">
              <img
                src={item.gambar}
                alt={item.judul}
                className="h-48 w-full object-cover bg-slate-100"
              />
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2.5">
                    <Badge type="success" variant="soft">
                      {item.kategori}
                    </Badge>
                    <span className="text-[10px] text-slate-400 font-semibold">{formatDate(item.tanggal)}</span>
                  </div>
                  
                  <h3 className="text-base font-bold text-slate-850 dark:text-white leading-snug mb-2 hover:text-primary-600 transition-colors line-clamp-2">
                    <Link to={`/informasi/berita/${item.id}`}>{item.judul}</Link>
                  </h3>
                  
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-6 line-clamp-3">
                    {item.ringkasan}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-4 mt-auto">
                  <span className="text-[10px] text-slate-450 flex items-center gap-1.5 font-medium">
                    <Eye size={13} />
                    {item.views || 0} Kali Dibaca
                  </span>
                  <Link
                    to={`/informasi/berita/${item.id}`}
                    className="text-xs font-bold text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    Selengkapnya
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />}
    </div>
  );
};
export default Berita;
