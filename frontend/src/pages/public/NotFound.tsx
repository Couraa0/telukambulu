import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/common/Card';
import { ShieldAlert } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4 font-sans text-center">
      <Card className="p-8 sm:p-12 max-w-md w-full">
        <div className="p-4 bg-rose-50 dark:bg-rose-950/20 text-rose-500 rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-6">
          <ShieldAlert size={28} />
        </div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2 leading-none">404</h1>
        <h2 className="text-base sm:text-lg font-bold text-slate-800 dark:text-white mb-3">Halaman Tidak Ditemukan</h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
          Maaf, halaman yang Anda cari tidak tersedia atau telah dipindahkan oleh administrator desa.
        </p>
        <Link
          to="/"
          className="bg-primary-600 hover:bg-primary-705 text-white font-bold py-2.5 px-6 rounded-xl text-xs shadow-md transition-all active:scale-95 inline-block"
        >
          Kembali ke Beranda
        </Link>
      </Card>
    </div>
  );
};
export default NotFound;
