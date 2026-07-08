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
  ShoppingBag
} from 'lucide-react';
import { api } from '../../services/api';
import { Profil, Statistik, Berita, Pengumuman, Produk, Wisata } from '../../data/initialData';
import StatCard from '../../components/common/StatCard';
import SectionTitle from '../../components/common/SectionTitle';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import { formatDate } from '../../utils/helpers';
import logoDesa from '../../assets/logo-desa.png';
import Skeleton from '../../components/common/Skeleton';
import { useSEO } from '../../hooks/useSEO';

export const Beranda: React.FC = () => {
  useSEO({
    title: 'Portal Resmi Desa Telukambulu - Batujaya Karawang',
    description: 'Selamat datang di website resmi Desa Telukambulu, Kecamatan Batujaya, Kabupaten Karawang. Temukan informasi pelayanan kependudukan, kabar desa, potensi UMKM, destinasi wisata, dan transparansi publik.',
    keywords: 'Telukambulu, Desa Telukambulu, Batujaya, Karawang, Portal Resmi Desa, UMKM, Wisata Candi Batujaya'
  });

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



  return (
    <div className="pb-16 font-sans">

      {/* 1. Hero Section */}
      <section className="relative bg-gradient-to-br from-emerald-50 via-slate-50 to-emerald-100/30 dark:from-primary-950 dark:via-slate-900 dark:to-[#052511] text-slate-800 dark:text-white overflow-hidden pt-8 pb-20 sm:pt-12 sm:pb-28 border-b border-slate-100 dark:border-slate-900">
        {/* Background Image Overlay */}
        {profil?.gambarSplash && (
          <div className="absolute inset-0 opacity-35 dark:opacity-15 transition-opacity duration-1000">
            <img
              src={profil.gambarSplash}
              alt="Desa Telukambulu"
              className="w-full h-full object-cover transform scale-105"
            />
          </div>
        )}

        {/* Gradient Scrim for Readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-50 via-slate-50/85 to-transparent dark:from-slate-900 dark:via-slate-900/80 dark:to-transparent pointer-events-none z-[1]"></div>

        {/* Decorative glowing shapes */}
        <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-primary-500/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-[450px] h-[450px] bg-emerald-600/10 rounded-full blur-3xl -ml-32 -mb-32"></div>
        <div className="absolute top-1/2 left-1/3 w-[300px] h-[300px] bg-emerald-500/5 rounded-full blur-3xl"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

            {/* Left Content */}
            <div className="lg:col-span-7 text-left">
              <div className="inline-flex items-center gap-2 mb-6 px-3.5 py-1.5 rounded-full bg-emerald-100/80 dark:bg-emerald-950/60 border border-emerald-250 dark:border-emerald-500/35 text-emerald-800 dark:text-emerald-300 text-[10px] font-extrabold uppercase tracking-widest shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                Portal Resmi Desa Digital
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 font-sans leading-tight text-slate-900 dark:text-white">
                Selamat Datang di <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-primary-600 dark:from-emerald-400 dark:to-green-400">Telukambulu</span>
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-slate-600 dark:text-slate-300 mb-8 leading-relaxed font-normal">
                Membangun keterbukaan informasi publik, pemberdayaan ekonomi UMKM tani, dan pelestarian sejarah situs percandian Batujaya Karawang. Menuju desa transparan, mandiri, dan sejahtera.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/profil-desa"
                  className="bg-gradient-to-r from-primary-600 to-emerald-500 hover:from-primary-700 hover:to-emerald-600 text-white font-bold px-6 py-4 rounded-xl shadow-lg shadow-emerald-600/20 hover:shadow-emerald-600/30 transition-all duration-300 text-sm sm:text-base hover:scale-105 active:scale-95"
                >
                  Lihat Profil Desa
                </Link>
                <Link
                  to="/pengaduan"
                  className="bg-emerald-50/80 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-300 font-bold px-6 py-4 rounded-xl shadow-sm hover:bg-emerald-100/80 dark:hover:bg-emerald-800/40 transition-all duration-300 text-sm sm:text-base hover:scale-105 active:scale-95 backdrop-blur-sm"
                >
                  Ajukan Pengaduan
                </Link>
                <Link
                  to="/pesona-desa/sda"
                  className="bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold px-6 py-4 rounded-xl hover:bg-slate-200/80 dark:hover:bg-slate-800 transition-all duration-300 text-sm sm:text-base hover:scale-105 active:scale-95"
                >
                  Lihat Potensi Desa
                </Link>
              </div>
            </div>

            {/* Right Logo Crest with Floating Badges */}
            <div className="lg:col-span-5 flex justify-center mt-12 lg:mt-0 relative">
              <div className="relative w-72 h-72 sm:w-85 sm:h-85 flex items-center justify-center">

                {/* Glowing backdrops */}
                <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500 via-primary-600 to-green-400 rounded-full blur-3xl opacity-20 transition-all duration-700 animate-pulse"></div>
                <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500/15 via-primary-500/5 to-emerald-400/15 rounded-full blur-2xl opacity-65 transition-all duration-700"></div>

                {/* Outer rotating dotted ring */}
                <div className="absolute inset-0 border-2 border-dashed border-emerald-500/20 dark:border-emerald-500/15 rounded-full animate-[spin_100s_linear_infinite] pointer-events-none"></div>

                {/* Circular glass card */}
                <div className="relative w-64 h-64 sm:w-72 sm:h-72 bg-white/70 dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 rounded-full p-8 flex items-center justify-center shadow-2xl transition-all duration-500 hover:scale-[1.02]">
                  <img
                    src={profil?.logo || logoDesa}
                    alt="Lambang Desa Telukambulu"
                    className="w-full h-full object-contain filter drop-shadow-[0_10px_20px_rgba(16,185,129,0.2)]"
                  />
                </div>

                {/* Floating Card 1: Tourism Highlight */}
                <div className="absolute -top-4 -left-6 sm:-left-10 bg-white/95 dark:bg-slate-950/80 backdrop-blur-xl border border-slate-150 dark:border-emerald-950/20 px-4 py-2.5 rounded-2xl shadow-lg flex items-center gap-2.5 hover:border-emerald-500/40 hover:-translate-y-1 transition-all duration-300 text-slate-800 dark:text-white">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/15 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 flex-shrink-0">
                    <Map size={16} />
                  </div>
                  <div className="text-left">
                    <span className="block text-[9px] uppercase font-bold tracking-wider text-emerald-600 dark:text-emerald-400">Wisata Budaya</span>
                    <span className="block text-xs font-bold text-slate-900 dark:text-white whitespace-nowrap">Situs Candi Batujaya</span>
                  </div>
                </div>

                {/* Floating Card 2: Economy Highlight */}
                <div className="absolute -bottom-4 -right-6 sm:-right-10 bg-white/95 dark:bg-slate-950/80 backdrop-blur-xl border border-slate-150 dark:border-emerald-950/20 px-4 py-2.5 rounded-2xl shadow-lg flex items-center gap-2.5 hover:border-emerald-500/40 hover:translate-y-1 transition-all duration-300 text-slate-800 dark:text-white">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/15 dark:bg-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400 flex-shrink-0">
                    <ShoppingBag size={16} />
                  </div>
                  <div className="text-left">
                    <span className="block text-[9px] uppercase font-bold tracking-wider text-amber-400">Ekonomi Desa</span>
                    <span className="block text-xs font-bold text-slate-900 dark:text-white whitespace-nowrap">UMKM Beras Organik</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Statistik Section */}
      <section className="relative -mt-12 z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <StatCard title="Penduduk" value={`${stats?.penduduk || 8450} Jiwa`} icon={Users} color="primary" className="shadow-lg border border-slate-100/50 dark:border-slate-800/50 hover:border-primary-500/20 hover:scale-105 duration-300" />
          <StatCard title="Dusun" value={`${stats?.dusun || 4}`} icon={Map} color="secondary" className="shadow-lg border border-slate-100/50 dark:border-slate-800/50 hover:border-secondary-500/20 hover:scale-105 duration-300" />
          <StatCard title="Luas Wilayah" value={`${stats?.luasWilayah || 642.5} Ha`} icon={Map} color="accent" className="shadow-lg border border-slate-100/50 dark:border-slate-800/50 hover:border-accent-500/20 hover:scale-105 duration-300" />
          <StatCard title="UMKM" value={`${stats?.umkm || 42} Mitra`} icon={Briefcase} color="amber" className="shadow-lg border border-slate-100/50 dark:border-slate-800/50 hover:border-amber-500/20 hover:scale-105 duration-300" />
          <StatCard title="Destinasi Wisata" value={`${stats?.wisata || 3} Lokasi`} icon={Palmtree} color="secondary" className="shadow-lg border border-slate-100/50 dark:border-slate-800/50 hover:border-secondary-500/20 hover:scale-105 duration-300" />
          <StatCard title="Laporan Selesai" value={`${stats?.pengaduanSelesai || 118} Tiket`} icon={ShieldCheck} color="rose" className="shadow-lg border border-slate-100/50 dark:border-slate-800/50 hover:border-rose-500/20 hover:scale-105 duration-300" />
        </div>
      </section>

      {/* 3. Sambutan Kepala Desa */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-4 flex justify-center">
            <div className="relative group">
              {/* Outer glowing border */}
              <div className="absolute inset-0 bg-primary-600 rounded-[2.5rem] blur-2xl opacity-15 group-hover:opacity-25 transition-opacity duration-300"></div>

              <div className="relative bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 p-4 rounded-[2.2rem] shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                <img
                  src={profil?.kepalaDesa?.foto || "/assets/images/kepala-desa.png"}
                  alt={profil?.kepalaDesa?.nama || "Kepala Desa"}
                  className="w-64 h-80 object-cover rounded-[1.6rem] shadow-inner bg-slate-100 ring-4 ring-primary-500/10 hover:ring-primary-500/25 transition-all duration-300"
                />
                <div className="mt-4 text-center">
                  <h4 className="text-sm font-bold text-slate-850 dark:text-white">{profil?.kepalaDesa?.nama || "H. Ahmad Saprudin, S.IP"}</h4>
                  <p className="text-[10px] uppercase font-bold text-primary-600 dark:text-primary-400 tracking-widest mt-1.5">
                    Kepala Desa Telukambulu
                  </p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 font-medium">Periode {profil?.kepalaDesa?.periode || "2020 - 2026"}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="lg:col-span-8 relative">
            {/* Background Big Quote Icon */}
            <div className="absolute -top-12 -left-6 text-[12rem] font-serif text-primary-500/10 select-none pointer-events-none font-bold">“</div>
            <div className="relative z-10">
              <SectionTitle title="Sambutan Kepala Desa" subtitle={profil?.kepalaDesa?.nama || "H. Ahmad Saprudin, S.IP"} />
              <p className="text-sm sm:text-base text-slate-700 dark:text-slate-350 leading-relaxed italic border-l-4 border-primary-500 pl-4 mb-6 font-medium">
                "{profil?.sambutan || "Kami berkomitmen menghadirkan transparansi pelayanan publik berbasis digital bagi seluruh warga."}"
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
                Desa Telukambulu terus bertransformasi menuju desa mandiri yang dinamis. Melalui inovasi keterbukaan informasi dan digitalisasi pelayanan, kami harap warga dapat memantau pembangunan desa dan mengeksplorasi potensi kerajinan bambu maupun beras organik lokal.
              </p>
              <Link
                to="/profil-desa"
                className="inline-flex items-center text-sm font-bold text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 gap-1 hover:underline"
              >
                Baca visi misi selengkapnya
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Layanan Pengaduan Cepat CTA */}
      <section className="relative overflow-hidden bg-gradient-to-r from-primary-950 via-emerald-800 to-primary-950 text-white py-16 shadow-2xl">
        {/* Grid Background Pattern */}
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]"></div>

        {/* Glowing orbs */}
        <div className="absolute -top-24 -left-24 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-secondary-500/20 rounded-full blur-3xl"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between gap-8 z-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-emerald-200 text-[10px] font-bold uppercase tracking-widest mb-4">
              Layanan Tanggap Warga
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-3">
              Ada Keluhan Mengenai Pelayanan atau Infrastruktur Desa?
            </h3>
            <p className="text-sm sm:text-base text-emerald-100/80 max-w-2xl leading-relaxed">
              Laporkan secara online! Sistem kami memberikan nomor tiket otomatis untuk memantau status tindak lanjut aduan Anda secara real-time.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 flex-shrink-0 w-full sm:w-auto">
            <Link
              to="/pengaduan"
              className="w-full sm:w-auto text-center bg-white text-emerald-950 font-bold px-6 py-3.5 rounded-xl text-sm shadow-xl shadow-emerald-950/20 hover:bg-emerald-50 hover:scale-105 active:scale-95 transition-all duration-300"
            >
              Ajukan Pengaduan
            </Link>
            <Link
              to="/cek-pengaduan"
              className="w-full sm:w-auto text-center bg-emerald-900/30 border border-white/20 hover:bg-white/10 text-white font-bold px-6 py-3.5 rounded-xl text-sm hover:scale-105 active:scale-95 transition-all duration-300"
            >
              Lacak Status Tiket
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Informasi Desa (Berita & Pengumuman) */}
      <section className="py-24 bg-slate-50/50 dark:bg-slate-900/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

            {/* News Column */}
            <div className="lg:col-span-8">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Berita Terbaru
                </h3>
                <Link
                  to="/informasi/berita"
                  className="text-xs sm:text-sm font-bold text-primary-600 hover:text-primary-700 dark:text-primary-400 flex items-center gap-1 hover:underline"
                >
                  Semua Berita
                  <ArrowRight size={14} />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                  <Skeleton variant="news-card" count={3} />
                ) : (
                  berita.map((item) => (
                    <Card key={item.id} hoverEffect noPadding className="group flex flex-col h-full overflow-hidden border border-slate-100 dark:border-slate-800/80 hover:shadow-lg transition-all duration-300">
                      <div className="h-48 w-full overflow-hidden relative">
                        <img
                          src={item.gambar}
                          alt={item.judul}
                          className="h-full w-full object-cover bg-slate-100 group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute top-3 left-3">
                          <Badge type="info" variant="solid" className="bg-primary-600/90 text-[10px]">
                            {item.kategori}
                          </Badge>
                        </div>
                      </div>
                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div>
                          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold mb-2 block">{formatDate(item.tanggal)}</span>
                          <h4 className="text-sm sm:text-base font-bold text-slate-850 dark:text-white line-clamp-2 leading-snug mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
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
                          <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </div>

            {/* Announcements Column */}
            <div className="lg:col-span-4">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Pengumuman
                </h3>
                <Link
                  to="/informasi/pengumuman"
                  className="text-xs sm:text-sm font-bold text-primary-600 hover:text-primary-700 dark:text-primary-400 flex items-center gap-1 hover:underline"
                >
                  Semua
                  <ArrowRight size={14} />
                </Link>
              </div>

              <div className="flex flex-col gap-4">
                {loading ? (
                  <Skeleton variant="announcement" count={3} />
                ) : (
                  pengumuman.map((item) => (
                    <Card key={item.id} hoverEffect className="group border-l-4 border-l-primary-500 dark:border-l-primary-500 p-5 relative overflow-hidden transition-all duration-300">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold">{formatDate(item.tanggal)}</span>
                          {item.penting && (
                            <Badge type="danger" variant="solid" className="text-[9px] px-1.5 py-0.5 animate-pulse">
                              PENTING
                            </Badge>
                          )}
                        </div>
                        <Megaphone size={14} className="text-slate-350 dark:text-slate-550 group-hover:text-primary-500 transition-colors" />
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors mb-2 line-clamp-2">
                        <Link to={`/informasi/pengumuman/${item.id}`}>{item.judul}</Link>
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {item.ringkasan}
                      </p>
                    </Card>
                  ))
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 6. Pesona Desa (Wisata & Produk UMKM) */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Wisata Section */}
          <div className="mb-20">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
              <div>
                <SectionTitle title="Destinasi Wisata Unggulan" className="mb-0" />
                <p className="text-xs sm:text-sm text-slate-400 mt-2">Kunjungi kekayaan sejarah purbakala dan taman ekowisata sawah kami.</p>
              </div>
              <Link
                to="/pesona-desa/destinasi-wisata"
                className="text-xs sm:text-sm font-bold text-primary-600 hover:text-primary-700 dark:text-primary-400 flex items-center gap-1 hover:underline flex-shrink-0"
              >
                Lihat Semua Wisata
                <ArrowRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {loading ? (
                <Skeleton variant="wisata-card" count={3} />
              ) : (
                wisata.map((item) => (
                  <div key={item.id} className="group relative h-80 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 cursor-pointer">
                    {/* Background Image */}
                    <img
                      src={item.foto}
                      alt={item.nama}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    {/* Black/Green Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent group-hover:via-emerald-950/25 transition-all duration-500"></div>

                    {/* Content Container */}
                    <div className="absolute inset-0 p-5 flex flex-col justify-end text-white">
                      <h4 className="text-base sm:text-lg font-extrabold tracking-tight mb-1 group-hover:text-emerald-300 transition-colors">
                        {item.nama}
                      </h4>
                      <p className="text-xs text-slate-200/90 line-clamp-2 mb-4 leading-relaxed font-medium">
                        {item.deskripsi}
                      </p>
                      <Link
                        to={`/pesona-desa/destinasi-wisata/${item.id}`}
                        className="inline-flex items-center text-xs font-bold text-emerald-400 hover:text-emerald-300 gap-1.5 w-fit"
                      >
                        Lihat Jam & Tiket
                        <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Produk UMKM Section */}
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
              <div>
                <SectionTitle title="Produk Unggulan UMKM" className="mb-0" />
                <p className="text-xs sm:text-sm text-slate-400 mt-2">Dukung perekonomian warga lokal dengan membeli produk anyaman bambu dan beras organik.</p>
              </div>
              <Link
                to="/pesona-desa/produk-unggulan"
                className="text-xs sm:text-sm font-bold text-primary-600 hover:text-primary-700 dark:text-primary-400 flex items-center gap-1 hover:underline flex-shrink-0"
              >
                Lihat Semua Produk
                <ArrowRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {loading ? (
                <Skeleton variant="product-card" count={3} />
              ) : (
                produk.map((item) => (
                  <Card key={item.id} hoverEffect noPadding className="group flex flex-col overflow-hidden border border-slate-100 dark:border-slate-800/80 hover:shadow-lg transition-all duration-300">
                    <div className="h-48 w-full overflow-hidden relative">
                      <img
                        src={item.foto}
                        alt={item.nama}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 bg-slate-100"
                      />
                      <div className="absolute top-3 left-3">
                        <Badge type="success" variant="solid" className="bg-emerald-600/90 text-[10px]">
                          {item.kategori}
                        </Badge>
                      </div>
                      <div className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-sm text-white px-2.5 py-1 rounded-lg text-xs font-bold border border-white/10">
                        {item.harga}
                      </div>
                    </div>
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="text-base font-bold text-slate-800 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                          {item.nama}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-455 line-clamp-3 leading-relaxed mb-4">
                          {item.deskripsi}
                        </p>
                      </div>
                      <Link
                        to={`/pesona-desa/produk-unggulan/${item.id}`}
                        className="inline-flex items-center text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline gap-1.5 mt-auto group-hover:text-emerald-700"
                      >
                        Beli / Hubungi Penjual
                        <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 7. Galeri Singkat */}
      <section className="py-24 bg-slate-50/50 dark:bg-slate-900/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <SectionTitle title="Galeri Kegiatan Desa" subtitle="Dokumentasi aktivitas pemerintahan, keagamaan, sosial budaya, dan gotong-royong warga." align="center" />

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {[
              {
                src: "https://images.unsplash.com/photo-1544531586-fde5298cdd40?auto=format&fit=crop&q=80&w=300",
                title: "Musrenbang Desa",
                desc: "Rapat Rencana Pembangunan Desa"
              },
              {
                src: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=300",
                title: "Posyandu Bulanan",
                desc: "Pemeriksaan Kesehatan Anak & Lansia"
              },
              {
                src: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&q=80&w=300",
                title: "Tradisi Sedekah Bumi",
                desc: "Pelestarian Budaya Lokal Warga"
              },
              {
                src: "https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&q=80&w=300",
                title: "Pelatihan Bambu",
                desc: "Pemberdayaan Pengrajin Anyaman Desa"
              }
            ].map((img, idx) => (
              <div key={idx} className="h-56 rounded-2xl overflow-hidden shadow-md relative group cursor-pointer">
                <img
                  src={img.src}
                  alt={img.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {/* Hover overlay mask */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-350 flex flex-col justify-end p-4 text-left">
                  <span className="text-xs font-bold text-emerald-400 mb-0.5">{img.title}</span>
                  <span className="text-[10px] text-slate-200 leading-tight">{img.desc}</span>
                </div>
              </div>
            ))}
          </div>

          <Link
            to="/galeri"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-600 to-emerald-500 hover:from-primary-700 hover:to-emerald-600 text-white font-bold px-6 py-3.5 rounded-xl text-sm shadow-md transition-all duration-300 hover:scale-105 active:scale-95"
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
