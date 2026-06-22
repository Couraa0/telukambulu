import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import { api } from '../../services/api';
import { Kontak } from '../../data/initialData';

export const Footer: React.FC = () => {
  const [kontak, setKontak] = useState<Kontak | null>(null);

  useEffect(() => {
    api.getKontak().then(setKontak).catch(console.error);
  }, []);

  const year = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-400 pt-16 pb-8 border-t border-slate-850 no-print font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Column 1: Village Brand */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-primary-600/20">
                T
              </div>
              <div>
                <span className="block font-sans font-extrabold text-base leading-tight text-white">
                  Desa Telukambulu
                </span>
                <span className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                  Kabupaten Karawang
                </span>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
              Portal Informasi dan Layanan Mandiri Digital Desa Telukambulu, Kecamatan Batujaya. Menuju desa transparan, mandiri, dan sejahtera.
            </p>
            {/* Social Media Link */}
            <div className="flex items-center gap-3 mt-4">
              {kontak?.socialMedia.facebook && (
                <a
                  href={kontak.socialMedia.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-primary-600 transition-all"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
              )}
              {kontak?.socialMedia.instagram && (
                <a
                  href={kontak.socialMedia.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-primary-600 transition-all"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                </a>
              )}
              {kontak?.socialMedia.youtube && (
                <a
                  href={kontak.socialMedia.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-primary-600 transition-all"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.518 3.545 12 3.545 12 3.545s-7.518 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11C4.482 20.455 12 20.455 12 20.455s7.518 0 9.388-.508a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                </a>
              )}
              {kontak?.socialMedia.twitter && (
                <a
                  href={kontak.socialMedia.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-primary-600 transition-all"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
              )}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-4 border-primary-600 pl-3">
              Tautan Cepat
            </h4>
            <ul className="flex flex-col gap-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-primary-400 transition-colors">
                  Beranda
                </Link>
              </li>
              <li>
                <Link to="/profil-desa" className="hover:text-primary-400 transition-colors">
                  Profil Desa
                </Link>
              </li>
              <li>
                <Link to="/informasi/berita" className="hover:text-primary-400 transition-colors">
                  Berita Desa
                </Link>
              </li>
              <li>
                <Link to="/informasi/pengumuman" className="hover:text-primary-400 transition-colors">
                  Pengumuman Resmi
                </Link>
              </li>
              <li>
                <Link to="/pesona-desa/produk-unggulan" className="hover:text-primary-400 transition-colors">
                  UMKM & Produk Desa
                </Link>
              </li>
              <li>
                <Link to="/pengaduan" className="hover:text-primary-400 transition-colors">
                  Layanan Pengaduan
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-4 border-primary-600 pl-3">
              Hubungi Kami
            </h4>
            <ul className="flex flex-col gap-3.5 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-primary-500 mt-0.5 flex-shrink-0" />
                <span className="leading-relaxed">
                  {kontak?.alamat || 'Jl. Raya Batujaya No. 12, Desa Telukambulu, Karawang'}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-primary-500 flex-shrink-0" />
                <span>{kontak?.telepon || '(0267) 841234'}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-primary-500 flex-shrink-0" />
                <span className="truncate">{kontak?.email || 'info@telukambulu.desa.id'}</span>
              </li>
              <li className="flex items-start gap-3">
                <Clock size={16} className="text-primary-500 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="block text-xs font-semibold text-slate-350">Jam Pelayanan Kantor:</span>
                  <span className="block text-xs text-slate-400 mt-0.5">
                    {kontak?.jamPelayanan || 'Senin - Jumat, 08:00 - 15:30 WIB'}
                  </span>
                </div>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter or Admin Info */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-4 border-primary-600 pl-3">
              Layanan Informasi
            </h4>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-4">
              Dapatkan berita terbaru seputar pengumuman dan agenda pembangunan Desa Telukambulu.
            </p>
            <div className="relative">
              <input
                type="email"
                placeholder="Masukkan email Anda"
                className="w-full bg-slate-800 text-white placeholder-slate-500 text-xs sm:text-sm rounded-xl py-3 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-primary-500 border border-slate-750"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 px-3.5 flex items-center text-primary-500 hover:text-primary-400 transition-colors"
              >
                <Send size={16} />
              </button>
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="border-t border-slate-800 pt-8 mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500 text-center sm:text-left">
            © {year} Pemerintah Desa Telukambulu, Kecamatan Batujaya, Kabupaten Karawang. Hak Cipta Dilindungi.
          </p>
          <div className="flex gap-4 text-xs text-slate-500">
            <Link to="/admin/login" className="hover:underline">
              Portal Admin
            </Link>
            <span>•</span>
            <span className="text-slate-650">Sistem Informasi Desa Digital v1.0</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
export default Footer;
