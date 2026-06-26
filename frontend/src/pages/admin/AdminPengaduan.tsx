import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../../services/api';
import { Pengaduan } from '../../data/initialData';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import FormInput from '../../components/common/FormInput';
import SelectInput from '../../components/common/SelectInput';
import TextArea from '../../components/common/TextArea';
import Table from '../../components/common/Table';
import Modal from '../../components/common/Modal';
import Badge from '../../components/common/Badge';
import SearchBar from '../../components/common/SearchBar';
import Pagination from '../../components/common/Pagination';
import useToast from '../../hooks/useToast';
import { formatDate, exportToCSV } from '../../utils/helpers';
import { Eye, RefreshCw, Download, Printer, MapPin, Calendar } from 'lucide-react';

export const AdminPengaduan: React.FC = () => {
  const { showToast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [pengaduan, setPengaduan] = useState<Pengaduan[]>([]);
  const [filtered, setFiltered] = useState<Pengaduan[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedCat, setSelectedCat] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Detail & Action Modal State
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Pengaduan | null>(null);

  // Status modification form state
  const [statusForm, setStatusForm] = useState({
    status: '',
    catatanAdmin: '',
    keteranganTimeline: ''
  });
  const [saveLoading, setSaveLoading] = useState(false);

  const categories = [
    'Infrastruktur',
    'Pelayanan Publik',
    'Lingkungan',
    'Keamanan',
    'Sosial',
    'Administrasi',
    'Kesehatan',
    'Pendidikan',
    'Lainnya',
  ];

  useEffect(() => {
    loadPengaduan();
  }, []);

  const loadPengaduan = async () => {
    setLoading(true);
    try {
      const data = await api.getPengaduan();
      setPengaduan(data);
      setFiltered(data);
    } catch (err) {
      console.error(err);
      showToast('Gagal memuat pengaduan warga.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Search, filter & query routing
  useEffect(() => {
    let result = [...pengaduan];
    
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(item =>
        item.tiket.toLowerCase().includes(q) ||
        item.nama.toLowerCase().includes(q) ||
        item.judul.toLowerCase().includes(q)
      );
    }

    if (selectedStatus) {
      result = result.filter(item => item.status === selectedStatus);
    }

    if (selectedCat) {
      result = result.filter(item => item.kategori === selectedCat);
    }

    // Sort by newest
    result.sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime());

    setFiltered(result);
    setCurrentPage(1);

    // Auto open modal if ?ticket=ADU-XXXX is present in URL
    const queryTicket = searchParams.get('ticket');
    if (queryTicket && pengaduan.length > 0) {
      const item = pengaduan.find(p => p.tiket.toLowerCase() === queryTicket.toLowerCase());
      if (item) {
        openDetail(item);
      }
    }
  }, [search, selectedStatus, selectedCat, pengaduan, searchParams]);

  const openDetail = (item: Pengaduan) => {
    setSelectedItem(item);
    setStatusForm({
      status: item.status,
      catatanAdmin: item.catatanAdmin || '',
      keteranganTimeline: ''
    });
    setDetailModalOpen(true);
  };

  const handleCloseDetail = () => {
    setDetailModalOpen(false);
    setSelectedItem(null);
    
    // Clear ticket param if present
    if (searchParams.get('ticket')) {
      setSearchParams({});
    }
  };

  const handleStatusFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setStatusForm(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;

    setSaveLoading(true);
    try {
      const res = await api.updatePengaduan(selectedItem.id, statusForm);
      
      // Update local state
      setPengaduan(prev => prev.map(item => item.id === selectedItem.id ? res : item));
      setSelectedItem(res);
      
      showToast('Status pengaduan berhasil diperbarui.', 'success');
      setStatusForm(prev => ({ ...prev, keteranganTimeline: '' })); // clear timeline log input
    } catch (err: any) {
      showToast(err.message || 'Gagal memperbarui status.', 'error');
    } finally {
      setSaveLoading(false);
    }
  };

  // Export to CSV
  const handleExport = () => {
    const headers = ['Nomor Tiket', 'Pelapor', 'NIK', 'WhatsApp', 'Email', 'Kategori', 'Judul', 'Lokasi', 'Tanggal', 'Status', 'Catatan Admin'];
    const rows = filtered.map(a => [
      a.tiket,
      a.nama,
      a.nik || '-',
      a.kontak,
      a.email || '-',
      a.kategori,
      a.judul,
      a.lokasi,
      a.tanggal,
      a.status,
      a.catatanAdmin || '-'
    ]);
    exportToCSV(headers, rows, `pengaduan-desa-${new Date().toISOString().split('T')[0]}.csv`);
    showToast('Ekspor data CSV berhasil.', 'success');
  };

  const handlePrint = () => {
    window.print();
  };

  // Helper colors
  const getStatusType = (status: string) => {
    switch (status) {
      case 'Selesai': return 'success';
      case 'Diproses': return 'info';
      case 'Ditolak': return 'danger';
      default: return 'warning';
    }
  };

  // Pagination Logic
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedItems = filtered.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="font-sans flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Daftar Pengaduan Masyarakat</h1>
          <p className="text-xs text-slate-400 mt-1">Review laporan warga, perbarui status penanganan, dan catat kronologis tindak lanjut.</p>
        </div>
        <Button size="sm" variant="outline" onClick={handleExport} icon={Download}>
          Ekspor CSV
        </Button>
      </div>

      {/* Filter panel */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-center bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-2xl shadow-sm w-full">
        <SearchBar value={search} onChange={setSearch} placeholder="Cari tiket, nama pelapor, atau judul..." />
        
        <div className="flex flex-wrap gap-3 w-full lg:w-auto">
          <SelectInput
            options={[
              { value: 'Menunggu', label: 'Menunggu' },
              { value: 'Diproses', label: 'Diproses' },
              { value: 'Selesai', label: 'Selesai' },
              { value: 'Ditolak', label: 'Ditolak' }
            ]}
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            placeholder="Semua Status"
            className="w-full sm:w-36"
          />
          <SelectInput
            options={['', ...categories]}
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
            placeholder="Semua Kategori"
            className="w-full sm:w-44"
          />
        </div>
      </div>

      {/* Table listing */}
      <Card noPadding>
        <Table headers={['No. Tiket', 'Nama Pelapor', 'Kategori', 'Judul Laporan', 'Tanggal', 'Status', 'Aksi']} empty={paginatedItems.length === 0} loading={loading}>
          {paginatedItems.map((item) => (
            <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-850/50 transition-colors">
              <td className="px-6 py-4 font-mono font-bold text-slate-805 dark:text-white">{item.tiket}</td>
              <td className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300">{item.nama}</td>
              <td className="px-6 py-4 text-slate-550 dark:text-slate-450">{item.kategori}</td>
              <td className="px-6 py-4 font-bold text-slate-750 dark:text-slate-200 truncate max-w-[200px]" title={item.judul}>
                {item.judul}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-slate-500 dark:text-slate-405 font-medium flex items-center gap-1.5 mt-2.5 border-none">
                <Calendar size={14} />
                {formatDate(item.tanggal)}
              </td>
              <td className="px-6 py-4">
                <Badge type={getStatusType(item.status)} variant="solid">
                  {item.status}
                </Badge>
              </td>
              <td className="px-6 py-4">
                <button
                  onClick={() => openDetail(item)}
                  className="p-2 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-950/20 rounded-xl"
                  title="Lihat Detail & Tindak Lanjut"
                >
                  <Eye size={18} />
                </button>
              </td>
            </tr>
          ))}
        </Table>
      </Card>

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

      {/* Detail / Action Modal */}
      <Modal isOpen={detailModalOpen} onClose={handleCloseDetail} size="xl" title="Tindak Lanjut Laporan Pengaduan">
        {selectedItem && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-left font-sans print-container">
            
            {/* Left: Complaint information */}
            <div className="lg:col-span-7 flex flex-col gap-5 print-card">
              <div className="flex justify-between items-center gap-3 border-b border-slate-105 pb-3">
                <div>
                  <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Tiket</span>
                  <span className="block text-lg font-black text-slate-850 dark:text-white font-mono">{selectedItem.tiket}</span>
                </div>
                <div className="text-right">
                  <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Status Aktif</span>
                  <Badge type={getStatusType(selectedItem.status)} variant="solid">{selectedItem.status}</Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl">
                <div>
                  <span className="block text-slate-400 font-bold uppercase text-[9px] mb-0.5">Nama Pelapor</span>
                  <span className="text-slate-800 dark:text-white font-bold">{selectedItem.nama}</span>
                </div>
                <div>
                  <span className="block text-slate-400 font-bold uppercase text-[9px] mb-0.5">NIK Kependudukan</span>
                  <span className="text-slate-800 dark:text-white font-medium">{selectedItem.nik || '-'}</span>
                </div>
                <div className="mt-2">
                  <span className="block text-slate-400 font-bold uppercase text-[9px] mb-0.5">Kontak WhatsApp</span>
                  <span className="text-slate-800 dark:text-white font-semibold">{selectedItem.kontak}</span>
                </div>
                <div className="mt-2">
                  <span className="block text-slate-400 font-bold uppercase text-[9px] mb-0.5">Email</span>
                  <span className="text-slate-800 dark:text-white font-medium">{selectedItem.email || '-'}</span>
                </div>
                <div className="mt-2 col-span-2 border-t border-slate-150 pt-2">
                  <span className="block text-slate-400 font-bold uppercase text-[9px] mb-0.5">Lokasi Kejadian</span>
                  <span className="text-slate-805 dark:text-slate-300 font-semibold flex items-center gap-1">
                    <MapPin size={13} className="text-slate-400" />
                    {selectedItem.lokasi}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-850 dark:text-white mb-1.5">{selectedItem.judul}</h4>
                <p className="text-xs sm:text-sm text-slate-655 dark:text-slate-350 leading-relaxed whitespace-pre-wrap">{selectedItem.isi}</p>
              </div>

              {selectedItem.foto && (
                <div>
                  <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">Lampiran Foto Bukti</span>
                  <img
                    src={selectedItem.foto}
                    alt="Bukti Laporan"
                    className="w-full max-h-60 object-cover rounded-xl border border-slate-100 dark:border-slate-800"
                  />
                </div>
              )}
            </div>

            {/* Right: Actions / Status updates */}
            <div className="lg:col-span-5 flex flex-col gap-6 no-print">
              <Card className="bg-slate-50/50 dark:bg-slate-900/50">
                <h3 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider mb-4 border-l-4 border-secondary-500 pl-2">
                  Tindakan & Status
                </h3>
                
                <form onSubmit={handleUpdateStatus} className="flex flex-col gap-4">
                  <SelectInput
                    label="Ubah Status Pengaduan"
                    name="status"
                    options={[
                      { value: 'Menunggu', label: 'Menunggu' },
                      { value: 'Diproses', label: 'Diproses' },
                      { value: 'Selesai', label: 'Selesai' },
                      { value: 'Ditolak', label: 'Ditolak' }
                    ]}
                    value={statusForm.status}
                    onChange={handleStatusFormChange}
                    required
                  />

                  <FormInput
                    label="Keterangan Progres (Ditambah ke Linimasa)"
                    name="keteranganTimeline"
                    value={statusForm.keteranganTimeline}
                    onChange={handleStatusFormChange}
                    placeholder="Contoh: Petugas dikerahkan ke lokasi untuk aspal"
                  />

                  <TextArea
                    label="Tanggapan / Catatan Resmi Admin (Terlihat Warga)"
                    name="catatanAdmin"
                    value={statusForm.catatanAdmin}
                    onChange={handleStatusFormChange}
                    placeholder="Tuliskan respon resmi pemerintah desa..."
                    rows={3}
                  />

                  <Button type="submit" variant="primary" loading={saveLoading} fullWidth icon={RefreshCw}>
                    Update Status & Kirim
                  </Button>
                </form>
              </Card>

              {/* Linimasa view */}
              <Card>
                <div className="flex justify-between items-center gap-2 mb-4">
                  <h3 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider border-l-4 border-primary-500 pl-2">
                    Linimasa Laporan
                  </h3>
                  <button onClick={handlePrint} className="text-xs font-bold text-primary-600 hover:underline flex items-center gap-1">
                    <Printer size={13} />
                    Cetak
                  </button>
                </div>
                
                <div className="relative border-l-2 border-slate-100 dark:border-slate-800 pl-4 flex flex-col gap-5 text-xs ml-2">
                  {selectedItem.timeline.map((step, idx) => (
                    <div key={idx} className="relative">
                      <span className={`absolute -left-[23px] top-0.5 rounded-full w-3.5 h-3.5 border-2 border-white dark:border-slate-900 ${
                        step.status === 'Selesai' ? 'bg-emerald-600' : step.status === 'Diproses' ? 'bg-sky-500' : step.status === 'Ditolak' ? 'bg-rose-500' : 'bg-amber-500'
                      }`}></span>
                      <div>
                        <span className="block text-[9px] text-slate-400 font-bold mb-0.5">{formatDate(step.tanggal)}</span>
                        <h4 className="font-bold text-slate-800 dark:text-white">{step.status}</h4>
                        <p className="text-slate-500 dark:text-slate-400 mt-0.5 leading-normal">{step.keterangan}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

          </div>
        )}
      </Modal>
    </div>
  );
};
export default AdminPengaduan;
