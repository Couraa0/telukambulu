import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { Pengumuman as IPengumuman } from '../../data/initialData';
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
import { Megaphone, Calendar } from 'lucide-react';

export const Pengumuman: React.FC = () => {
  useSEO({
    title: 'Pengumuman Resmi Desa Telukambulu',
    description: 'Dapatkan pengumuman kependudukan, jadwal penyaluran bantuan sosial, jadwal gotong royong, dan surat edaran resmi Pemerintah Desa Telukambulu.',
    keywords: 'Pengumuman Desa, Bantuan Sosial, Edaran Resmi, Batujaya Karawang'
  });

  const [pengumuman, setPengumuman] = useState<IPengumuman[]>([]);
  const [filtered, setFiltered] = useState<IPengumuman[]>([]);
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
    api.getPengumuman()
      .then((data) => {
        // Only show published ones
        const published = data.filter(p => p.status === 'publish');
        setPengumuman(published);
        setFiltered(published);
        
        // Extract unique categories
        const cats = Array.from(new Set(published.map(p => p.kategori)));
        setCategories(cats);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Filter & Search Handler
  useEffect(() => {
    let result = [...pengumuman];

    // Search filter
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        p => p.judul.toLowerCase().includes(q) || p.isi.toLowerCase().includes(q) || p.ringkasan.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (selectedCat) {
      result = result.filter(p => p.kategori === selectedCat);
    }

    // Sorting
    if (selectedSort === 'newest') {
      result.sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime());
    } else {
      result.sort((a, b) => new Date(a.tanggal).getTime() - new Date(b.tanggal).getTime());
    }

    setFiltered(result);
    setCurrentPage(1); // Reset page on filter
  }, [search, selectedCat, selectedSort, pengumuman]);

  // Pagination Logic
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedItems = filtered.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 font-sans">
      <Breadcrumb items={[{ label: 'Informasi' }, { label: 'Pengumuman' }]} />
      <SectionTitle title="Pengumuman Resmi Desa" subtitle="Informasi, jadwal bantuan sosial, gotong-royong, dan kegiatan pelayanan resmi Desa Telukambulu." />

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-8 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 p-4 rounded-2xl shadow-sm w-full">
        <SearchBar value={search} onChange={setSearch} placeholder="Cari pengumuman..." />
        
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
              { value: 'oldest', label: 'Terlama' },
            ]}
            value={selectedSort}
            onChange={(e) => setSelectedSort(e.target.value)}
            className="w-full sm:w-36"
          />
        </div>
      </div>

      {/* Grid List */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Skeleton variant="announcement" count={6} />
        </div>
      ) : paginatedItems.length === 0 ? (
        <EmptyState title="Pengumuman tidak ditemukan" description="Coba ubah kata kunci pencarian atau bersihkan filter untuk melihat semua pengumuman." icon={Megaphone} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedItems.map((item) => (
            <Card key={item.id} hoverEffect className="flex flex-col justify-between h-full border-l-4 border-l-primary-500">
              <div>
                <div className="flex items-center justify-between mb-3.5">
                  <Badge type="info" variant="soft">
                    {item.kategori}
                  </Badge>
                  {item.penting && (
                    <Badge type="danger" variant="solid" className="text-[10px] px-2 py-0.5">
                      PENTING
                    </Badge>
                  )}
                </div>
                
                <h3 className="text-base sm:text-lg font-bold text-slate-850 dark:text-white leading-snug mb-2 hover:text-primary-600 transition-colors">
                  <Link to={`/informasi/pengumuman/${item.id}`}>{item.judul}</Link>
                </h3>
                
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-6 line-clamp-3">
                  {item.ringkasan}
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-4 mt-auto">
                <span className="text-[10px] text-slate-450 flex items-center gap-1.5 font-medium">
                  <Calendar size={13} />
                  {formatDate(item.tanggal)}
                </span>
                <Link
                  to={`/informasi/pengumuman/${item.id}`}
                  className="text-xs font-bold text-primary-600 dark:text-primary-400 hover:underline"
                >
                  Selengkapnya
                </Link>
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
export default Pengumuman;
