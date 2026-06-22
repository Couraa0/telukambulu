import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Map,
  ShieldCheck,
  Briefcase,
  Palmtree,
  ArrowRight,
  Megaphone,
  FileText,
  ShoppingBag,
  HeartHandshake
} from 'lucide-react';
import { api } from '../../services/api';
import { Profil, Statistik, Berita, Pengumuman, Produk, Wisata } from '../../data/initialData';
import StatCard from '../../components/common/StatCard';
import SectionTitle from '../../components/common/SectionTitle';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import { formatDate } from '../../utils/helpers';

export const Beranda: React.FC = () => {
  const [profil, setProfil] = useState<Profil | null>(null);
  const [stats, setStats] = useState<Statistik | null>(null);
  const [berita, setBerita] = useState<Berita[]>([]);
  const [pengumuman, setPengumuman] = useState<Pengumuman[]>([]);
  const [produk, setProduk] = useState<Produk[]>([]);
  const [wisata, setWisata] = useState<Wisata[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pData, sData, bData, pengData, prodData, wData] = await Promise.all([
          api.getProfil(),
          api.getStatistik(),
          api.getBerita(),
          api.getPengumuman(),
          api.getProduk(),
          api.getWisata(),
        ]);
        
        setProfil(pData);
        setStats(sData);
        // Only get published content and limit size
        setBerita(bData.filter(b => b.status === 'publish').slice(0, 3));
        setPengumuman(pengData.filter(p => p.status === 'publish').slice(0, 3));
        setProduk(prodData.slice(0, 3));
        setWisata(wData.slice(0, 3));
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-slate-500">
        Memuat halaman beranda...
      </div>
    );
  }

  return (
    <div className="pb-16 font-sans">
      
      {/* 1. Hero Section */}
      <section className="relative bg-slate-900 text-white overflow-hidden py-24 sm:py-32">
        {/* Background Image Overlay */}
        <div className="absolute inset-0 opacity-25">
          <img
            src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=1200"
            alt="Desa Telukambulu"
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Decorative shapes */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary-600/10 rounded-full blur-3xl -ml-20 -mb-20"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <Badge type="info" variant="solid" className="mb-4 bg-primary-600 hover:bg-primary-600 uppercase tracking-wider text-[10px]">
              Portal Resmi Desa Digital
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4 font-sans leading-tight">
              Selamat Datang di <span className="text-primary-400">Telukambulu</span>
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-slate-300 mb-8 leading-relaxed">
              Membangun keterbukaan informasi publik, pemberdayaan ekonomi UMKM tani, dan pelestarian sejarah situs percandian Batujaya Karawang.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Link
                to="/profil-desa"
                className="bg-primary-600 hover:bg-primary-700 text-white font-bold px-6 py-3.5 rounded-xl shadow-lg shadow-primary-600/25 transition-all text-sm sm:text-base active:scale-95"
              >
                Lihat Profil Desa
              </Link>
              <Link
                to="/pengaduan"
                className="bg-secondary-600 hover:bg-secondary-705 text-white font-bold px-6 py-3.5 rounded-xl shadow-lg shadow-secondary-600/25 transition-all text-sm sm:text-base active:scale-95"
              >
                Ajukan Pengaduan
              </Link>
              <Link
                to="/pesona-desa/sda"
                className="bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold px-6 py-3.5 rounded-xl transition-all text-sm sm:text-base active:scale-95"
              >
                Lihat Potensi Desa
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Statistik Section */}
      <section className="relative -mt-10 z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <StatCard title="Penduduk" value={`${stats?.penduduk || 8450} Jiwa`} icon={Users} color="primary" />
          <StatCard title="Dusun" value={`${stats?.dusun || 4}`} icon={Map} color="secondary" />
          <StatCard title="Luas Wilayah" value={`${stats?.luasWilayah || 642.5} Ha`} icon={Map} color="accent" />
          <StatCard title="UMKM" value={`${stats?.umkm || 42} Mitra`} icon={Briefcase} color="amber" />
          <StatCard title="Destinasi Wisata" value={`${stats?.wisata || 3} Lokasi`} icon={Palmtree} color="secondary" />
          <StatCard title="Laporan Selesai" value={`${stats?.pengaduanSelesai || 118} Tiket`} icon={ShieldCheck} color="rose" />
        </div>
      </section>

      {/* 3. Sambutan Kepala Desa */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-4 flex justify-center">
            <div className="relative group">
              {/* Outer glowing border */}
              <div className="absolute inset-0 bg-primary-600 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
              
              <div className="relative bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-3.5 rounded-3xl shadow-lg">
                <img
                  src={profil?.kepalaDesa.foto || "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=300"}
                  alt={profil?.kepalaDesa.nama}
                  className="w-64 h-80 object-cover rounded-2xl shadow-inner bg-slate-100"
                />
                <div className="mt-4 text-center">
                  <h4 className="text-sm font-bold text-slate-850 dark:text-white">{profil?.kepalaDesa.nama}</h4>
                  <p className="text-[10px] uppercase font-bold text-primary-600 dark:text-primary-400 tracking-widest mt-1">
                    Kepala Desa Telukambulu
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Periode {profil?.kepalaDesa.periode}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="lg:col-span-8">
            <SectionTitle title="Sambutan Kepala Desa" subtitle="H. Ahmad Saprudin, S.IP" />
            <p className="text-sm sm:text-base text-slate-655 dark:text-slate-350 leading-relaxed italic border-l-4 border-primary-500 pl-4 mb-6">
              "{profil?.sambutan || "Kami berkomitmen menghadirkan transparansi pelayanan publik berbasis digital bagi seluruh warga."}"
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
              Desa Telukambulu terus bertransformasi menuju desa mandiri yang dinamis. Melalui inovasi keterbukaan informasi dan digitalisasi pelayanan, kami harap warga dapat memantau pembangunan desa dan mengeksplorasi potensi kerajinan bambu maupun beras organik lokal.
            </p>
            <Link
              to="/profil-desa"
              className="inline-flex items-center text-sm font-bold text-primary-655 hover:text-primary-750 dark:text-primary-400 dark:hover:text-primary-300 gap-1 hover:underline"
            >
              Baca visi misi selengkapnya
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Layanan Pengaduan Cepat CTA */}
      <section className="bg-gradient-to-r from-primary-600 to-secondary-700 text-white py-14 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <Badge type="neutral" variant="soft" className="bg-white/20 text-white border-transparent uppercase text-[10px] mb-3">
              Layanan Tanggap Warga
            </Badge>
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight mb-2">
              Ada Keluhan Mengenai Pelayanan atau Infrastruktur Desa?
            </h3>
            <p className="text-sm text-slate-100 max-w-xl">
              Laporkan secara online! Sistem kami memberikan nomor tiket otomatis untuk memantau status tindak lanjut aduan Anda secara real-time.
            </p>
          </div>
          <div className="flex gap-4 flex-shrink-0">
            <Link
              to="/pengaduan"
              className="bg-white text-primary-700 font-bold px-5 py-3 rounded-xl text-sm shadow-md hover:bg-slate-50 transition-all active:scale-95"
            >
              Ajukan Pengaduan
            </Link>
            <Link
              to="/cek-pengaduan"
              className="bg-transparent border border-white hover:bg-white/10 text-white font-bold px-5 py-3 rounded-xl text-sm transition-all active:scale-95"
            >
              Lacak Status Tiket
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Informasi Desa (Berita & Pengumuman) */}
      <section className="py-20 bg-slate-50/50 dark:bg-slate-900/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* News Column */}
            <div className="lg:col-span-8">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                  Berita Terbaru
                </h3>
                <Link
                  to="/informasi/berita"
                  className="text-xs sm:text-sm font-bold text-primary-655 hover:text-primary-750 dark:text-primary-400 flex items-center gap-1 hover:underline"
                >
                  Semua Berita
                  <ArrowRight size={14} />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {berita.map((item) => (
                  <Card key={item.id} hoverEffect noPadding className="flex flex-col h-full overflow-hidden">
                    <img
                      src={item.gambar}
                      alt={item.judul}
                      className="h-44 w-full object-cover bg-slate-100"
                    />
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge type="info" variant="soft">
                            {item.kategori}
                          </Badge>
                          <span className="text-[10px] text-slate-400 font-semibold">{formatDate(item.tanggal)}</span>
                        </div>
                        <h4 className="text-sm sm:text-base font-bold text-slate-800 dark:text-white line-clamp-2 leading-snug mb-2 hover:text-primary-600 transition-colors">
                          <Link to={`/informasi/berita/${item.id}`}>{item.judul}</Link>
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed mb-4">
                          {item.ringkasan}
                        </p>
                      </div>
                      <Link
                        to={`/informasi/berita/${item.id}`}
                        className="inline-flex items-center text-xs font-bold text-primary-600 dark:text-primary-400 hover:underline gap-1 mt-auto"
                      >
                        Selengkapnya
                        <ArrowRight size={12} />
                      </Link>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Announcements Column */}
            <div className="lg:col-span-4">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                  Pengumuman
                </h3>
                <Link
                  to="/informasi/pengumuman"
                  className="text-xs sm:text-sm font-bold text-primary-655 hover:text-primary-750 dark:text-primary-400 flex items-center gap-1 hover:underline"
                >
                  Semua
                  <ArrowRight size={14} />
                </Link>
              </div>

              <div className="flex flex-col gap-4">
                {pengumuman.map((item) => (
                  <Card key={item.id} hoverEffect className="border-l-4 border-l-primary-500 dark:border-l-primary-500 p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] text-slate-400 font-semibold">{formatDate(item.tanggal)}</span>
                      {item.penting && (
                        <Badge type="danger" variant="solid" className="text-[9px] px-1.5 py-0.2">
                          PENTING
                        </Badge>
                      )}
                    </div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-white hover:text-primary-600 transition-colors mb-2">
                      <Link to={`/informasi/pengumuman/${item.id}`}>{item.judul}</Link>
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                      {item.ringkasan}
                    </p>
                  </Card>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 6. Pesona Desa (Produk Unggulan & Wisata) */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Wisata Section */}
          <div className="mb-16">
            <div className="flex justify-between items-end mb-8">
              <div>
                <SectionTitle title="Destinasi Wisata Unggulan" className="mb-0" />
                <p className="text-xs sm:text-sm text-slate-400 mt-1.5">Kunjungi kekayaan sejarah purbakala dan taman ekowisata sawah kami.</p>
              </div>
              <Link
                to="/pesona-desa/destinasi-wisata"
                className="text-xs sm:text-sm font-bold text-primary-655 hover:text-primary-750 dark:text-primary-400 flex items-center gap-1 hover:underline"
              >
                Lihat Wisata
                <ArrowRight size={14} />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {wisata.map((item) => (
                <Card key={item.id} hoverEffect noPadding className="flex flex-col overflow-hidden">
                  <img src={item.foto} alt={item.nama} className="h-48 w-full object-cover bg-slate-100" />
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-sm sm:text-base font-bold text-slate-800 dark:text-white mb-2">{item.nama}</h4>
                      <p className="text-xs text-slate-550 dark:text-slate-400 line-clamp-3 leading-relaxed mb-4">
                        {item.deskripsi}
                      </p>
                    </div>
                    <Link
                      to={`/pesona-desa/destinasi-wisata/${item.id}`}
                      className="inline-flex items-center text-xs font-bold text-secondary-600 dark:text-secondary-400 hover:underline gap-1"
                    >
                      Lihat Jam & Tiket
                      <ArrowRight size={12} />
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Produk UMKM Section */}
          <div>
            <div className="flex justify-between items-end mb-8">
              <div>
                <SectionTitle title="Produk Unggulan UMKM" className="mb-0" />
                <p className="text-xs sm:text-sm text-slate-400 mt-1.5">Dukung perekonomian warga lokal dengan membeli produk anyaman bambu dan beras organik.</p>
              </div>
              <Link
                to="/pesona-desa/produk-unggulan"
                className="text-xs sm:text-sm font-bold text-primary-655 hover:text-primary-750 dark:text-primary-400 flex items-center gap-1 hover:underline"
              >
                Lihat Produk
                <ArrowRight size={14} />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {produk.map((item) => (
                <Card key={item.id} hoverEffect noPadding className="flex flex-col overflow-hidden">
                  <img src={item.foto} alt={item.nama} className="h-48 w-full object-cover bg-slate-100" />
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2 mb-2">
                        <Badge type="success" variant="soft">
                          {item.kategori}
                        </Badge>
                        <span className="text-sm font-bold text-primary-600 dark:text-primary-400">
                          {item.harga}
                        </span>
                      </div>
                      <h4 className="text-sm sm:text-base font-bold text-slate-800 dark:text-white mb-2">{item.nama}</h4>
                      <p className="text-xs text-slate-550 dark:text-slate-400 line-clamp-3 leading-relaxed mb-4">
                        {item.deskripsi}
                      </p>
                    </div>
                    <Link
                      to={`/pesona-desa/produk-unggulan/${item.id}`}
                      className="inline-flex items-center text-xs font-bold text-primary-655 dark:text-primary-400 hover:underline gap-1"
                    >
                      Beli / Hubungi Penjual
                      <ArrowRight size={12} />
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* 7. Galeri Singkat */}
      <section className="py-20 bg-slate-50/50 dark:bg-slate-900/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <SectionTitle title="Galeri Kegiatan Desa" subtitle="Dokumentasi aktivitas pemerintahan, keagamaan, sosial budaya, dan gotong-royong warga." align="center" />
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            <div className="h-48 rounded-2xl overflow-hidden shadow group">
              <img
                src="https://images.unsplash.com/photo-1544531586-fde5298cdd40?auto=format&fit=crop&q=80&w=300"
                alt="Musrenbang"
                className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
              />
            </div>
            <div className="h-48 rounded-2xl overflow-hidden shadow group">
              <img
                src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=300"
                alt="Posyandu"
                className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
              />
            </div>
            <div className="h-48 rounded-2xl overflow-hidden shadow group">
              <img
                src="https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&q=80&w=300"
                alt="Sedekah Bumi"
                className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
              />
            </div>
            <div className="h-48 rounded-2xl overflow-hidden shadow group">
              <img
                src="https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&q=80&w=300"
                alt="Pelatihan Bambu"
                className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
              />
            </div>
          </div>
          
          <Link
            to="/galeri"
            className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-bold px-5 py-3 rounded-xl text-sm shadow-md transition-all active:scale-95"
          >
            Lihat Seluruh Galeri
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

    </div>
  );
};
export default Beranda;
