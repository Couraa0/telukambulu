import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Pengumuman } from '../../data/initialData';
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
import { useAuth } from '../../context/AuthContext';
import { formatDate } from '../../utils/helpers';
import { Plus, Edit2, Trash2, Calendar, Eye } from 'lucide-react';

export const AdminPengumuman: React.FC = () => {
  const { showToast } = useToast();
  const { user } = useAuth();
  
  const [pengumuman, setPengumuman] = useState<Pengumuman[]>([]);
  const [filtered, setFiltered] = useState<Pengumuman[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // CRUD Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Pengumuman | null>(null);
  
  const [form, setForm] = useState({
    judul: '',
    ringkasan: '',
    isi: '',
    kategori: '',
    tanggal: new Date().toISOString().split('T')[0],
    penting: false,
    status: 'publish' as 'publish' | 'draft'
  });

  // Delete Confirm Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);

  useEffect(() => {
    loadPengumuman();
  }, []);

  const loadPengumuman = async () => {
    setLoading(true);
    try {
      const data = await api.getPengumuman();
      setPengumuman(data);
      setFiltered(data);
      
      const cats = Array.from(new Set(data.map(item => item.kategori)));
      setCategories(cats);
    } catch (err) {
      console.error(err);
      showToast('Gagal memuat pengumuman.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let result = [...pengumuman];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(item =>
        item.judul.toLowerCase().includes(q) || item.isi.toLowerCase().includes(q) || item.ringkasan.toLowerCase().includes(q)
      );
    }
    if (selectedCat) {
      result = result.filter(item => item.kategori === selectedCat);
    }
    
    // Sort by newest date
    result.sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime());
    
    setFiltered(result);
    setCurrentPage(1);
  }, [search, selectedCat, pengumuman]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setForm(prev => ({ ...prev, [name]: checked }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const openAddModal = () => {
    setSelectedItem(null);
    setForm({
      judul: '',
      ringkasan: '',
      isi: '',
      kategori: 'Kegiatan Warga',
      tanggal: new Date().toISOString().split('T')[0],
      penting: false,
      status: 'publish'
    });
    setModalOpen(true);
  };

  const openEditModal = (item: Pengumuman) => {
    setSelectedItem(item);
    setForm({
      judul: item.judul,
      ringkasan: item.ringkasan,
      isi: item.isi,
      kategori: item.kategori,
      tanggal: item.tanggal,
      penting: item.penting,
      status: item.status
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.judul || !form.isi || !form.kategori) {
      showToast('Judul, Isi, dan Kategori pengumuman wajib diisi.', 'warning');
      return;
    }

    try {
      if (selectedItem) {
        // Edit Mode
        const res = await api.updatePengumuman(selectedItem.id, form);
        setPengumuman(prev => prev.map(item => item.id === selectedItem.id ? res : item));
        showToast('Pengumuman berhasil diperbarui.', 'success');
      } else {
        // Add Mode
        const res = await api.createPengumuman(form);
        setPengumuman(prev => [...prev, res]);
        showToast('Pengumuman berhasil diterbitkan.', 'success');
      }
      setModalOpen(false);
    } catch (err: any) {
      showToast(err.message || 'Gagal menyimpan pengumuman.', 'error');
    }
  };

  const triggerDelete = (id: number) => {
    setItemToDelete(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (itemToDelete === null) return;
    try {
      await api.deletePengumuman(itemToDelete);
      setPengumuman(prev => prev.filter(item => item.id !== itemToDelete));
      showToast('Pengumuman berhasil dihapus.', 'success');
    } catch (err: any) {
      showToast(err.message || 'Gagal menghapus pengumuman.', 'error');
    } finally {
      setDeleteModalOpen(false);
      setItemToDelete(null);
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
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Kelola Pengumuman Desa</h1>
          <p className="text-xs text-slate-400 mt-1">Buat, sunting, dan hapus pengumuman resmi desa.</p>
        </div>
        {user?.role !== 'Viewer' && (
          <Button size="sm" variant="primary" onClick={openAddModal} icon={Plus}>
            Buat Pengumuman
          </Button>
        )}
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-2xl shadow-sm">
        <SearchBar value={search} onChange={setSearch} placeholder="Cari pengumuman..." />
        <SelectInput
          options={['', ...categories]}
          value={selectedCat}
          onChange={(e) => setSelectedCat(e.target.value)}
          placeholder="Semua Kategori"
          className="w-full sm:w-48"
        />
      </div>

      {/* Table Data */}
      <Card noPadding>
        <Table headers={['Judul', 'Kategori', 'Tanggal', 'Status', 'Prioritas', 'Aksi']} empty={paginatedItems.length === 0} loading={loading}>
          {paginatedItems.map((item) => (
            <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-850/50 transition-colors">
              <td className="px-6 py-4 font-bold text-slate-800 dark:text-white truncate max-w-[250px]" title={item.judul}>
                {item.judul}
              </td>
              <td className="px-6 py-4 font-semibold text-slate-655 dark:text-slate-400">{item.kategori}</td>
              <td className="px-6 py-4 whitespace-nowrap text-slate-500 dark:text-slate-405 font-medium flex items-center gap-1.5 mt-2.5 border-none">
                <Calendar size={14} />
                {formatDate(item.tanggal)}
              </td>
              <td className="px-6 py-4">
                <Badge type={item.status === 'publish' ? 'success' : 'neutral'} variant="soft">
                  {item.status.toUpperCase()}
                </Badge>
              </td>
              <td className="px-6 py-4">
                {item.penting ? (
                  <Badge type="danger" variant="solid" className="text-[10px]">PENTING</Badge>
                ) : (
                  <span className="text-xs text-slate-400">Biasa</span>
                )}
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(item)}
                    className="p-2 text-sky-500 hover:bg-sky-50 dark:hover:bg-sky-950/20 rounded-xl"
                    title={user?.role === 'Viewer' ? 'Lihat Detail' : 'Edit'}
                  >
                    {user?.role === 'Viewer' ? <Eye size={16} /> : <Edit2 size={16} />}
                  </button>
                  {user?.role !== 'Viewer' && (
                    <button
                      onClick={() => triggerDelete(item.id)}
                      className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-xl"
                      title="Hapus"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </Table>
      </Card>

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

      {/* Add / Edit Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={selectedItem ? (user?.role === 'Viewer' ? 'Detail Pengumuman' : 'Edit Pengumuman') : 'Buat Pengumuman Baru'}>
        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <fieldset disabled={user?.role === 'Viewer'} className="flex flex-col gap-4">
            <FormInput
              label="Judul Pengumuman"
              name="judul"
              value={form.judul}
              onChange={handleInputChange}
              placeholder="Contoh: Jadwal Pembagian BLT Triwulan II"
              required
            />
            <FormInput
              label="Kategori Pengumuman"
              name="kategori"
              value={form.kategori}
              onChange={handleInputChange}
              placeholder="Contoh: Bantuan Sosial, Pemberdayaan"
              required
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormInput
                label="Tanggal Publikasi"
                name="tanggal"
                type="date"
                value={form.tanggal}
                onChange={handleInputChange}
                required
              />
              <SelectInput
                label="Status Publikasi"
                name="status"
                options={[
                  { value: 'publish', label: 'Terbitkan (Publish)' },
                  { value: 'draft', label: 'Draf (Draft)' }
                ]}
                value={form.status}
                onChange={handleInputChange}
              />
            </div>

            <div className="flex items-center gap-2 py-1.5">
              <input
                type="checkbox"
                id="penting"
                name="penting"
                checked={form.penting}
                onChange={handleInputChange}
                className="w-4.5 h-4.5 text-primary-600 border-slate-300 rounded focus:ring-primary-500 disabled:opacity-50"
              />
              <label htmlFor="penting" className="text-sm font-semibold text-slate-700 dark:text-slate-350 cursor-pointer">
                Tandai sebagai PENTING / DARURAT (Muncul badge merah menyala)
              </label>
            </div>

            <FormInput
              label="Ringkasan Pendek (Untuk Tampilan Card)"
              name="ringkasan"
              value={form.ringkasan}
              onChange={handleInputChange}
              placeholder="Tulis ringkasan singkat dalam 1-2 kalimat"
            />

            <TextArea
              label="Isi Lengkap Pengumuman"
              name="isi"
              value={form.isi}
              onChange={handleInputChange}
              placeholder="Tulis isi pengumuman lengkap secara lengkap..."
              rows={5}
              required
            />
          </fieldset>

          <div className="flex justify-end gap-3 border-t border-slate-105 pt-4 mt-2">
            <Button variant="outline" size="sm" onClick={() => setModalOpen(false)}>
              {user?.role === 'Viewer' ? 'Tutup' : 'Batal'}
            </Button>
            {user?.role !== 'Viewer' && (
              <Button type="submit" variant="primary" size="sm">
                Simpan Pengumuman
              </Button>
            )}
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} title="Konfirmasi Hapus Pengumuman">
        <div className="text-center py-2">
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            Apakah Anda yakin ingin menghapus pengumuman ini? Pengumuman tidak akan terlihat lagi di portal warga.
          </p>
          <div className="flex justify-center gap-3">
            <Button variant="outline" size="sm" onClick={() => setDeleteModalOpen(false)}>
              Batal
            </Button>
            <Button variant="danger" size="sm" onClick={confirmDelete}>
              Ya, Hapus Data
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
export default AdminPengumuman;
