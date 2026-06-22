import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../../services/api';
import { Pengaduan } from '../../data/initialData';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import FormInput from '../../components/common/FormInput';
import Button from '../../components/common/Button';
import Breadcrumb from '../../components/common/Breadcrumb';
import SectionTitle from '../../components/common/SectionTitle';
import { useSEO } from '../../hooks/useSEO';
import useToast from '../../hooks/useToast';
import { formatDate } from '../../utils/helpers';
import { Search, Printer, Calendar, MapPin, MessageSquareWarning, ShieldAlert, ArrowLeft } from 'lucide-react';

export const CekPengaduan: React.FC = () => {
  useSEO({
    title: 'Lacak Status Pengaduan Anda - Desa Telukambulu',
    description: 'Masukkan kode tiket laporan pengaduan Anda untuk memeriksa kemajuan penanganan, tanggapan petugas desa, dan riwayat penyelesaian laporan.',
    keywords: 'Lacak Laporan, Cek Pengaduan, Progres Pengaduan, Tiket Laporan Telukambulu'
  });

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [ticketInput, setTicketInput] = useState('');
  const [complaint, setComplaint] = useState<Pengaduan | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const queryTicket = searchParams.get('ticket');

  useEffect(() => {
    if (queryTicket) {
      setTicketInput(queryTicket);
      handleSearch(queryTicket);
    } else {
      setComplaint(null);
      setSearched(false);
    }
  }, [queryTicket]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketInput.trim()) {
      showToast('Masukkan nomor tiket terlebih dahulu.', 'warning');
      return;
    }
    navigate(`/cek-pengaduan?ticket=${ticketInput.trim()}`);
  };

  const handleSearch = async (ticketCode: string) => {
    setLoading(true);
    setSearched(true);
    try {
      const data = await api.getPengaduanByTicket(ticketCode);
      setComplaint(data);
    } catch (err: any) {
      console.warn(err);
      setComplaint(null);
      showToast('Nomor tiket pengaduan tidak ditemukan.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Helper for status badge
  const getStatusType = (status: string) => {
    switch (status) {
      case 'Selesai': return 'success';
      case 'Diproses': return 'info';
      case 'Ditolak': return 'danger';
      default: return 'warning'; // Menunggu
    }
  };

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 font-sans">
      <Breadcrumb items={[{ label: 'Pengaduan Warga', path: '/pengaduan' }, { label: 'Cek Status' }]} />
      
      <div className="no-print">
        <SectionTitle title="Lacak Progres Laporan Anda" subtitle="Masukkan nomor tiket pengaduan (format: ADU-2026-XXXX) untuk melacak jawaban dan kemajuan penanganan oleh petugas desa." />
      </div>

      {/* Search form */}
      <div className="max-w-md mx-auto mb-10 no-print">
        <Card>
          <form onSubmit={handleSearchSubmit} className="flex flex-col gap-4">
            <FormInput
              label="Nomor Tiket Pengaduan"
              name="ticket"
              value={ticketInput}
              onChange={(e) => setTicketInput(e.target.value)}
              placeholder="Contoh: ADU-2026-0001"
              icon={Search}
              required
            />
            <Button type="submit" variant="primary" loading={loading} fullWidth>
              Lacak Pengaduan
            </Button>
          </form>
        </Card>
      </div>

      {/* Result Container */}
      {loading ? (
        <div className="text-center py-10 text-slate-500">Mencari data pengaduan...</div>
      ) : searched ? (
        complaint ? (
          /* Found */
          <div className="print-container">
            {/* Action Bar (Print & Back) */}
            <div className="flex items-center justify-between gap-4 mb-6 no-print max-w-3xl mx-auto">
              <Link to="/pengaduan" className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200">
                <ArrowLeft size={16} />
                Ajukan Pengaduan Baru
              </Link>
              <Button variant="outline" size="sm" onClick={handlePrint} icon={Printer}>
                Cetak Detail Laporan
              </Button>
            </div>

            <div className="max-w-3xl mx-auto flex flex-col gap-8">
              
              {/* Card 1: Details */}
              <Card className="print-card">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4 mb-5">
                  <div>
                    <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Nomor Tiket</span>
                    <span className="block text-lg font-black text-slate-850 dark:text-white font-mono">{complaint.tiket}</span>
                  </div>
                  <div className="text-right">
                    <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Status Laporan</span>
                    <Badge type={getStatusType(complaint.status)} variant="solid">
                      {complaint.status}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm mb-6 bg-slate-50 dark:bg-slate-900/30 p-4 rounded-xl">
                  <div>
                    <span className="block font-bold text-slate-400 uppercase tracking-widest text-[9px] mb-1">Pelapor</span>
                    <span className="text-slate-800 dark:text-white font-semibold">{complaint.nama}</span>
                  </div>
                  <div>
                    <span className="block font-bold text-slate-400 uppercase tracking-widest text-[9px] mb-1">Tanggal Kirim</span>
                    <span className="text-slate-850 dark:text-slate-300 font-medium">{formatDate(complaint.tanggal)}</span>
                  </div>
                  <div className="mt-2.5">
                    <span className="block font-bold text-slate-400 uppercase tracking-widest text-[9px] mb-1">Kategori Sektor</span>
                    <span className="text-slate-850 dark:text-slate-300 font-medium">{complaint.kategori}</span>
                  </div>
                  <div className="mt-2.5">
                    <span className="block font-bold text-slate-400 uppercase tracking-widest text-[9px] mb-1">Lokasi Kejadian</span>
                    <span className="text-slate-850 dark:text-slate-300 font-medium flex items-center gap-1">
                      <MapPin size={14} className="text-slate-400" />
                      {complaint.lokasi}
                    </span>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="text-sm font-bold text-slate-850 dark:text-white mb-2">{complaint.judul}</h4>
                  <p className="text-xs sm:text-sm text-slate-655 dark:text-slate-350 leading-relaxed whitespace-pre-wrap">{complaint.isi}</p>
                </div>

                {complaint.foto && (
                  <div className="no-print">
                    <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Lampiran Bukti</h5>
                    <img
                      src={complaint.foto}
                      alt="Foto Lampiran Pengaduan"
                      className="w-full max-h-80 object-cover rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50"
                    />
                  </div>
                )}
              </Card>

              {/* Card 2: Timeline & Admin Responses */}
              <Card className="print-card">
                <h3 className="text-sm font-bold text-slate-850 dark:text-white uppercase tracking-wider mb-6 border-l-4 border-primary-600 pl-3">
                  Progres Tindak Lanjut
                </h3>

                {complaint.catatanAdmin && (
                  <div className="mb-8 p-4 bg-primary-50/40 dark:bg-primary-950/20 border border-primary-100 dark:border-primary-900/30 rounded-xl">
                    <h4 className="text-xs font-bold text-primary-750 dark:text-primary-400 uppercase tracking-wider mb-1">Tanggapan Resmi Admin:</h4>
                    <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-semibold">{complaint.catatanAdmin}</p>
                  </div>
                )}

                {/* Vertical Timeline */}
                <div className="relative border-l-2 border-slate-200 dark:border-slate-800 ml-4 pl-6 flex flex-col gap-8">
                  {complaint.timeline.map((step, idx) => (
                    <div key={idx} className="relative">
                      {/* Timeline dot */}
                      <span className={`absolute -left-[33px] top-0.5 rounded-full w-4.5 h-4.5 border-4 border-white dark:border-slate-950 flex items-center justify-center ${
                        step.status === 'Selesai' ? 'bg-emerald-650' : step.status === 'Diproses' ? 'bg-sky-500' : step.status === 'Ditolak' ? 'bg-rose-500' : 'bg-amber-500'
                      }`}></span>
                      
                      <div>
                        <span className="inline-block text-[9px] font-bold uppercase text-slate-400 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-850 px-2 py-0.5 rounded-md mb-1">{formatDate(step.tanggal)}</span>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-850 dark:text-white mb-1">
                          Status: <span className={
                            step.status === 'Selesai' ? 'text-emerald-600' : step.status === 'Diproses' ? 'text-sky-500' : step.status === 'Ditolak' ? 'text-rose-500' : 'text-amber-500'
                          }>{step.status}</span>
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{step.keterangan}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

            </div>
          </div>
        ) : (
          /* Not Found */
          <div className="max-w-md mx-auto text-center py-10 font-sans">
            <Card>
              <div className="p-4 bg-rose-50 dark:bg-rose-950/20 text-rose-500 rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-4">
                <ShieldAlert size={28} />
              </div>
              <h4 className="text-base font-bold text-slate-800 dark:text-white mb-2">Tiket Tidak Ditemukan</h4>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Harap periksa kembali nomor tiket yang Anda masukkan. Pastikan format penulisan benar, contoh: <span className="font-semibold text-slate-800 dark:text-white">ADU-2026-0001</span>.
              </p>
            </Card>
          </div>
        )
      ) : (
        /* Prompt search instruction */
        <div className="max-w-md mx-auto text-center py-10 text-slate-400 text-sm">
          Masukkan nomor tiket pengaduan di atas untuk melacak progres penanganan.
        </div>
      )}
    </div>
  );
};
export default CekPengaduan;
