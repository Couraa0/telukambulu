import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Berita } from '../../data/initialData';
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
import { formatDate } from '../../utils/helpers';
import { Plus, Edit2, Trash2, Calendar, Eye } from 'lucide-react';
import ImageUpload from '../../components/common/ImageUpload';


export const AdminBerita: React.FC = () => {
  const { showToast } = useToast();
  
  const [berita, setBerita] = useState<Berita[]>([]);
  const [filtered, setFiltered] = useState<Berita[]>([]);
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
  const [selectedItem, setSelectedItem] = useState<Berita | null>(null);
  
  const [form, setForm] = useState({
    judul: '',
    ringkasan: '',
    isi: '',
    kategori: '',
    gambar: '',
    penulis: '',
    tanggal: new Date().toISOString().split('T')[0],
    status: 'publish' as 'publish' | 'draft'
  });

  // Delete Confirm Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);

  useEffect(() => {
    loadBerita();
  }, []);

  const loadBerita = async () => {
    setLoading(true);
    try {
      const data = await api.getBerita();
      setBerita(data);
      setFiltered(data);
      
      const cats = Array.from(new Set(data.map(item => item.kategori)));
      setCategories(cats);
    } catch (err) {
      console.error(err);
      showToast('Gagal memuat berita.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let result = [...berita];
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
  }, [search, selectedCat, berita]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const openAddModal = () => {
    setSelectedItem(null);
    setForm({
      judul: '',
      ringkasan: '',
      isi: '',
      kategori: 'Pemerintahan',
      gambar: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=600',
      penulis: 'Admin Desa',
      tanggal: new Date().toISOString().split('T')[0],
      status: 'publish'
    });
    setModalOpen(true);
  };

  const openEditModal = (item: Berita) => {
    setSelectedItem(item);
    setForm({
      judul: item.judul,
      ringkasan: item.ringkasan,
      isi: item.isi,
      kategori: item.kategori,
      gambar: item.gambar,
      penulis: item.penulis,
      tanggal: item.tanggal,
      status: item.status
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.judul || !form.isi || !form.kategori || !form.gambar || !form.penulis) {
      showToast('Judul, Kategori, Penulis, Gambar URL, dan Isi wajib diisi.', 'warning');
      return;
    }

    try {
      if (selectedItem) {
        // Edit Mode
        const res = await api.updateBerita(selectedItem.id, form);
        setBerita(prev => prev.map(item => item.id === selectedItem.id ? res : item));
        showToast('Berita berhasil diperbarui.', 'success');
      } else {
        // Add Mode
        const res = await api.createBerita(form);
        setBerita(prev => [...prev, res]);
        showToast('Berita berhasil diterbitkan.', 'success');
      }
      setModalOpen(false);
    } catch (err: any) {
      showToast(err.message || 'Gagal menyimpan berita.', 'error');
    }
  };

  const triggerDelete = (id: number) => {
    setItemToDelete(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (itemToDelete === null) return;
    try {
      await api.deleteBerita(itemToDelete);
      setBerita(prev => prev.filter(item => item.id !== itemToDelete));
      showToast('Berita berhasil dihapus.', 'success');
    } catch (err: any) {
      showToast(err.message || 'Gagal menghapus berita.', 'error');
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
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Kelola Berita & Artikel</h1>
          <p className="text-xs text-slate-400 mt-1">Buat, sunting, dan hapus artikel berita/kegiatan desa.</p>
        </div>
        <Button size="sm" variant="primary" onClick={openAddModal} icon={Plus}>
          Tulis Berita
        </Button>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-2xl shadow-sm">
        <SearchBar value={search} onChange={setSearch} placeholder="Cari berita..." />
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
        <Table headers={['Judul', 'Kategori', 'Tanggal', 'Dibaca', 'Status', 'Aksi']} empty={paginatedItems.length === 0} loading={loading}>
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
              <td className="px-6 py-4 whitespace-nowrap text-slate-500 dark:text-slate-405 font-medium flex items-center gap-1.5 mt-2.5 border-none">
                <Eye size={14} />
                {item.views || 0} Kali
              </td>
              <td className="px-6 py-4">
                <Badge type={item.status === 'publish' ? 'success' : 'neutral'} variant="soft">
                  {item.status.toUpperCase()}
                </Badge>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(item)}
                    className="p-2 text-sky-500 hover:bg-sky-50 dark:hover:bg-sky-950/20 rounded-xl"
                    title="Edit"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => triggerDelete(item.id)}
                    className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-xl"
                    title="Hapus"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </Table>
      </Card>

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

      {/* Add / Edit Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={selectedItem ? 'Edit Berita' : 'Tulis Berita Baru'}>
        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <FormInput
            label="Judul Berita"
            name="judul"
            value={form.judul}
            onChange={handleInputChange}
            placeholder="Contoh: Panen Raya Kelompok Tani Krajan"
            required
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              label="Kategori Berita"
              name="kategori"
              value={form.kategori}
              onChange={handleInputChange}
              placeholder="Contoh: Pertanian, Wisata"
              required
            />
            <FormInput
              label="Nama Penulis"
              name="penulis"
              value={form.penulis}
              onChange={handleInputChange}
              placeholder="Nama penulis/kontributor"
              required
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              label="Tanggal Terbit"
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

          <ImageUpload
            label="Gambar Utama Berita"
            value={form.gambar}
            onChange={(url) => setForm(prev => ({ ...prev, gambar: url }))}
            required
          />


          <FormInput
            label="Ringkasan Berita"
            name="ringkasan"
            value={form.ringkasan}
            onChange={handleInputChange}
            placeholder="Masukkan cuplikan ringkasan berita 1-2 kalimat"
          />

          <TextArea
            label="Isi Berita Lengkap"
            name="isi"
            value={form.isi}
            onChange={handleInputChange}
            placeholder="Tulis artikel berita secara detail..."
            rows={6}
            required
          />

          <div className="flex justify-end gap-3 border-t border-slate-105 pt-4 mt-2">
            <Button variant="outline" size="sm" onClick={() => setModalOpen(false)}>
              Batal
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Simpan Berita
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} title="Konfirmasi Hapus Berita">
        <div className="text-center py-2">
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            Apakah Anda yakin ingin menghapus berita ini? Berita tidak akan terlihat lagi di portal publik.
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
export default AdminBerita;
