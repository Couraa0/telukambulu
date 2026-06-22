import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/public/Navbar';
import Footer from '../components/public/Footer';
import { ArrowUp, MessageSquare } from 'lucide-react';
import { formatWhatsAppLink } from '../utils/helpers';
import { api } from '../services/api';
import { Kontak } from '../data/initialData';

export const PublicLayout: React.FC = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [kontak, setKontak] = useState<Kontak | null>(null);
  const location = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  // Show scroll to top button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch Kontak details
  useEffect(() => {
    api.getKontak().then(setKontak).catch(console.error);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const whatsappMessage = "Halo Kantor Desa Telukambulu, saya warga ingin menanyakan layanan administrasi desa...";
  const waLink = formatWhatsAppLink(kontak?.whatsapp || '6281234567890', whatsappMessage);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <Navbar />
      
      {/* Main Content Area */}
      <main className="flex-grow">
        <Outlet />
      </main>

      <Footer />

      {/* Floating Buttons Group */}
      <div className="fixed bottom-6 right-6 z-30 flex flex-col gap-3.5 no-print">
        {/* Scroll to Top */}
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="p-3 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-white rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 hover:scale-105 active:scale-95 transition-all"
            title="Kembali ke atas"
          >
            <ArrowUp size={20} />
          </button>
        )}

        {/* WhatsApp Floating Link */}
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="p-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-xl hover:scale-105 active:scale-95 flex items-center justify-center transition-all group"
          title="Hubungi Admin Desa via WhatsApp"
        >
          <MessageSquare size={22} className="group-hover:rotate-12 transition-transform" />
          <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs group-hover:ml-2 text-xs font-bold transition-all duration-300">
            Hubungi Desa
          </span>
        </a>
      </div>
    </div>
  );
};
export default PublicLayout;
