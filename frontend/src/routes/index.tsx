import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Layouts
import PublicLayout from '../layouts/PublicLayout';
import AdminLayout from '../layouts/AdminLayout';

// Public Pages
import Beranda from '../pages/public/Beranda';
import ProfilDesa from '../pages/public/ProfilDesa';
import Pengumuman from '../pages/public/Pengumuman';
import PengumumanDetail from '../pages/public/PengumumanDetail';
import Berita from '../pages/public/Berita';
import BeritaDetail from '../pages/public/BeritaDetail';
import SDA from '../pages/public/SDA';
import SDADetail from '../pages/public/SDADetail';
import ProdukUnggulan from '../pages/public/ProdukUnggulan';
import ProdukDetail from '../pages/public/ProdukDetail';
import DestinasiWisata from '../pages/public/DestinasiWisata';
import WisataDetail from '../pages/public/WisataDetail';
import Pengaduan from '../pages/public/Pengaduan';
import CekPengaduan from '../pages/public/CekPengaduan';
import Galeri from '../pages/public/Galeri';
import Kontak from '../pages/public/Kontak';
import NotFound from '../pages/public/NotFound';

// Admin Pages
import Login from '../pages/admin/Login';
import Dashboard from '../pages/admin/Dashboard';
import AdminProfilDesa from '../pages/admin/AdminProfilDesa';
import AdminPengumuman from '../pages/admin/AdminPengumuman';
import AdminBerita from '../pages/admin/AdminBerita';
import AdminSDA from '../pages/admin/AdminSDA';
import AdminProduk from '../pages/admin/AdminProduk';
import AdminWisata from '../pages/admin/AdminWisata';
import AdminPengaduan from '../pages/admin/AdminPengaduan';
import AdminGaleri from '../pages/admin/AdminGaleri';
import AdminKontak from '../pages/admin/AdminKontak';
import AdminUsers from '../pages/admin/AdminUsers';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Pages Layout */}
      <Route path="/" element={<PublicLayout />}>
        <Route index element={<Beranda />} />
        <Route path="profil-desa" element={<ProfilDesa />} />
        
        {/* Informasi subroutes */}
        <Route path="informasi/pengumuman" element={<Pengumuman />} />
        <Route path="informasi/pengumuman/:id" element={<PengumumanDetail />} />
        <Route path="informasi/berita" element={<Berita />} />
        <Route path="informasi/berita/:id" element={<BeritaDetail />} />
        
        {/* Pesona desa subroutes */}
        <Route path="pesona-desa/sda" element={<SDA />} />
        <Route path="pesona-desa/sda/:id" element={<SDADetail />} />
        <Route path="pesona-desa/produk-unggulan" element={<ProdukUnggulan />} />
        <Route path="pesona-desa/produk-unggulan/:id" element={<ProdukDetail />} />
        <Route path="pesona-desa/destinasi-wisata" element={<DestinasiWisata />} />
        <Route path="pesona-desa/destinasi-wisata/:id" element={<WisataDetail />} />
        
        {/* Pengaduan */}
        <Route path="pengaduan" element={<Pengaduan />} />
        <Route path="cek-pengaduan" element={<CekPengaduan />} />
        
        {/* Galeri & Kontak */}
        <Route path="galeri" element={<Galeri />} />
        <Route path="kontak" element={<Kontak />} />

        {/* 404 Halaman tidak ditemukan */}
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Admin Login Route */}
      <Route path="/admin/login" element={<Login />} />

      {/* Protected Admin Dashboard Layout */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="profil-desa" element={<AdminProfilDesa />} />
        
        {/* CRUD Content */}
        <Route path="pengumuman" element={<AdminPengumuman />} />
        <Route path="berita" element={<AdminBerita />} />
        
        {/* CRUD SDA, UMKM, Wisata */}
        <Route path="pesona-desa/sda" element={<AdminSDA />} />
        <Route path="pesona-desa/produk-unggulan" element={<AdminProduk />} />
        <Route path="pesona-desa/destinasi-wisata" element={<AdminWisata />} />
        
        {/* Admin Complaints, Gallery, Contact, Users */}
        <Route path="pengaduan" element={<AdminPengaduan />} />
        <Route path="galeri" element={<AdminGaleri />} />
        <Route path="kontak" element={<AdminKontak />} />
        <Route path="users" element={<AdminUsers />} />
      </Route>
    </Routes>
  );
};
export default AppRoutes;
