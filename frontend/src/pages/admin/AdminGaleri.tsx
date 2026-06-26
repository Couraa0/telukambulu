import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Galeri } from '../../data/initialData';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import FormInput from '../../components/common/FormInput';
import SelectInput from '../../components/common/SelectInput';
import TextArea from '../../components/common/TextArea';
import Table from '../../components/common/Table';
import Modal from '../../components/common/Modal';
import Badge from '../../components/common/Badge';
import SearchBar from '../../components/common/SearchBar';
import useToast from '../../hooks/useToast';
import { formatDate } from '../../utils/helpers';
import { Plus, Edit2, Trash2, Calendar } from 'lucide-react';
import ImageUpload from '../../components/common/ImageUpload';


export const AdminGaleri: React.FC = () => {
  const { showToast } = useToast();
  
  const [galeri, setGaleri] = useState<Galeri[]>([]);
  const [filtered, setFiltered] = useState<Galeri[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('');
  const [categories, setCategories] = useState<string[]>([]);

  // CRUD Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Galeri | null>(null);
  
  const [form, setForm] = useState({
    judul: '',
    deskripsi: '',
    foto: '',
    kategori: '',
    tanggal: new Date().toISOString().split('T')[0]
  });

  // Delete Confirm Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);

  useEffect(() => {
    loadGaleri();
  }, []);

  const loadGaleri = async () => {
    setLoading(true);
    try {
      const data = await api.getGaleri();
      setGaleri(data);
      setFiltered(data);
      const cats = Array.from(new Set(data.map(item => item.kategori)));
      setCategories(cats);
    } catch (err) {
      console.error(err);
      showToast('Gagal memuat galeri foto.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let result = [...galeri];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(item =>
        item.judul.toLowerCase().includes(q) || item.deskripsi.toLowerCase().includes(q)
      );
    }
    if (selectedCat) {
      result = result.filter(item => item.kategori === selectedCat);
    }
    
    // Sort newest
    result.sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime());
    setFiltered(result);
  }, [search, selectedCat, galeri]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const openAddModal = () => {
    setSelectedItem(null);
    setForm({
      judul: '',
      deskripsi: '',
      foto: 'https://images.unsplash.com/photo-1544531586-fde5298cdd40?auto=format&fit=crop&q=80&w=600',
      kategori: 'Pemerintahan',
      tanggal: new Date().toISOString().split('T')[0]
    });
    setModalOpen(true);
  };

  const openEditModal = (item: Galeri) => {
    setSelectedItem(item);
    setForm({
      judul: item.judul,
      deskripsi: item.deskripsi,
      foto: item.foto,
      kategori: item.kategori,
      tanggal: item.tanggal
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.judul || !form.deskripsi || !form.kategori || !form.foto) {
      showToast('Judul, Deskripsi, Kategori, dan Foto URL wajib diisi.', 'warning');
      return;
    }

    try {
      if (selectedItem) {
        // Edit Mode
        const res = await api.updateGaleri(selectedItem.id, form);
        setGaleri(prev => prev.map(item => item.id === selectedItem.id ? res : item));
        showToast('Foto galeri berhasil diperbarui.', 'success');
      } else {
        // Add Mode
        const res = await api.createGaleri(form);
        setGaleri(prev => [...prev, res]);
        showToast('Foto galeri berhasil ditambahkan.', 'success');
      }
      setModalOpen(false);
    } catch (err: any) {
      showToast(err.message || 'Gagal menyimpan foto galeri.', 'error');
    }
  };

  const triggerDelete = (id: number) => {
    setItemToDelete(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (itemToDelete === null) return;
    try {
      await api.deleteGaleri(itemToDelete);
      setGaleri(prev => prev.filter(item => item.id !== itemToDelete));
      showToast('Foto galeri berhasil dihapus.', 'success');
    } catch (err: any) {
      showToast(err.message || 'Gagal menghapus foto galeri.', 'error');
    } finally {
      setDeleteModalOpen(false);
      setItemToDelete(null);
    }
  };

  return (
    <div className="font-sans flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Kelola Galeri Kegiatan</h1>
          <p className="text-xs text-slate-400 mt-1">Kelola album dokumentasi visual kegiatan resmi warga dan pemdes.</p>
        </div>
        <Button size="sm" variant="primary" onClick={openAddModal} icon={Plus}>
          Tambah Foto Dokumentasi
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-2xl shadow-sm">
        <SearchBar value={search} onChange={setSearch} placeholder="Cari foto..." />
        <SelectInput
          options={['', ...categories]}
          value={selectedCat}
          onChange={(e) => setSelectedCat(e.target.value)}
          placeholder="Semua Kategori"
          className="w-full sm:w-48"
        />
      </div>

      <Card noPadding>
        <Table headers={['Preview', 'Judul Foto', 'Kategori', 'Tanggal', 'Aksi']} empty={filtered.length === 0} loading={loading}>
          {filtered.map((item) => (
            <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-850/50 transition-colors">
              <td className="px-6 py-3 whitespace-nowrap">
                <img
                  src={item.foto}
                  alt={item.judul}
                  className="w-12 h-12 object-cover rounded-xl bg-slate-100 border"
                />
              </td>
              <td className="px-6 py-4 font-bold text-slate-800 dark:text-white truncate max-w-[200px]" title={item.judul}>
                {item.judul}
              </td>
              <td className="px-6 py-4">
                <Badge type="info" variant="soft">{item.kategori}</Badge>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-slate-550 dark:text-slate-405 font-medium flex items-center gap-1.5 mt-2 border-none">
                <Calendar size={14} />
                {formatDate(item.tanggal)}
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <button onClick={() => openEditModal(item)} className="p-2 text-sky-500 hover:bg-sky-50 dark:hover:bg-sky-950/20 rounded-xl">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => triggerDelete(item.id)} className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-xl">
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </Table>
      </Card>

      {/* Add / Edit Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={selectedItem ? 'Edit Dokumentasi Foto' : 'Tambah Foto Kegiatan Baru'}>
        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <FormInput
            label="Judul Foto Kegiatan"
            name="judul"
            value={form.judul}
            onChange={handleInputChange}
            placeholder="Contoh: Rapat Musrenbang 2026"
            required
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              label="Kategori Kegiatan"
              name="kategori"
              value={form.kategori}
              onChange={handleInputChange}
              placeholder="Contoh: Pemerintahan, Kesehatan, Budaya"
              required
            />
            <FormInput
              label="Tanggal Kegiatan"
              name="tanggal"
              type="date"
              value={form.tanggal}
              onChange={handleInputChange}
              required
            />
          </div>

          <ImageUpload
            label="Foto Dokumentasi Acara"
            value={form.foto}
            onChange={(url) => setForm(prev => ({ ...prev, foto: url }))}
            required
          />


          <TextArea
            label="Deskripsi Singkat Acara"
            name="deskripsi"
            value={form.deskripsi}
            onChange={handleInputChange}
            placeholder="Tuliskan keterangan detail mengenai acara atau kegiatan yang dilaksanakan..."
            rows={4}
            required
          />

          <div className="flex justify-end gap-3 border-t border-slate-105 pt-4 mt-2">
            <Button variant="outline" size="sm" onClick={() => setModalOpen(false)}>Batal</Button>
            <Button type="submit" variant="primary" size="sm">Simpan Foto</Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirm */}
      <Modal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} title="Konfirmasi Hapus Dokumentasi Foto">
        <div className="text-center py-2">
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            Apakah Anda yakin ingin menghapus dokumentasi foto ini dari galeri publik?
          </p>
          <div className="flex justify-center gap-3">
            <Button variant="outline" size="sm" onClick={() => setDeleteModalOpen(false)}>Batal</Button>
            <Button variant="danger" size="sm" onClick={confirmDelete}>Ya, Hapus Data</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
export default AdminGaleri;
