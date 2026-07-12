import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Wisata } from '../../data/initialData';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import FormInput from '../../components/common/FormInput';
import TextArea from '../../components/common/TextArea';
import Table from '../../components/common/Table';
import Modal from '../../components/common/Modal';
import SearchBar from '../../components/common/SearchBar';
import useToast from '../../hooks/useToast';
import { useAuth } from '../../context/AuthContext';
import { Plus, Edit2, Trash2, Clock, Eye } from 'lucide-react';
import ImageUpload from '../../components/common/ImageUpload';


export const AdminWisata: React.FC = () => {
  const { showToast } = useToast();
  const { user } = useAuth();
  
  const [wisata, setWisata] = useState<Wisata[]>([]);
  const [filtered, setFiltered] = useState<Wisata[]>([]);
  const [loading, setLoading] = useState(true);

  // Search
  const [search, setSearch] = useState('');

  // CRUD Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Wisata | null>(null);
  
  const [form, setForm] = useState({
    nama: '',
    foto: '',
    deskripsi: '',
    lokasi: '',
    fasilitas: '',
    operasional: '',
    tiket: '',
    kontak: ''
  });

  // Delete Confirm Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);

  useEffect(() => {
    loadWisata();
  }, []);

  const loadWisata = async () => {
    setLoading(true);
    try {
      const data = await api.getWisata();
      setWisata(data);
      setFiltered(data);
    } catch (err) {
      console.error(err);
      showToast('Gagal memuat destinasi wisata.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let result = [...wisata];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(item =>
        item.nama.toLowerCase().includes(q) || item.deskripsi.toLowerCase().includes(q) || item.lokasi.toLowerCase().includes(q)
      );
    }
    setFiltered(result);
  }, [search, wisata]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const openAddModal = () => {
    setSelectedItem(null);
    setForm({
      nama: '',
      foto: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=600',
      deskripsi: '',
      lokasi: 'Batujaya, Karawang',
      fasilitas: '',
      operasional: 'Setiap Hari, 08.00 - 17.00 WIB',
      tiket: 'Rp 5.000',
      kontak: ''
    });
    setModalOpen(true);
  };

  const openEditModal = (item: Wisata) => {
    setSelectedItem(item);
    setForm({
      nama: item.nama,
      foto: item.foto,
      deskripsi: item.deskripsi,
      lokasi: item.lokasi,
      fasilitas: item.fasilitas,
      operasional: item.operasional,
      tiket: item.tiket,
      kontak: item.kontak
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nama || !form.deskripsi || !form.lokasi || !form.operasional || !form.tiket) {
      showToast('Nama Wisata, Deskripsi, Lokasi, Jam Operasional, dan Harga Tiket wajib diisi.', 'warning');
      return;
    }

    try {
      if (selectedItem) {
        // Edit Mode
        const res = await api.updateWisata(selectedItem.id, form);
        setWisata(prev => prev.map(item => item.id === selectedItem.id ? res : item));
        showToast('Destinasi wisata berhasil diperbarui.', 'success');
      } else {
        // Add Mode
        const res = await api.createWisata(form);
        setWisata(prev => [...prev, res]);
        showToast('Destinasi wisata berhasil ditambahkan.', 'success');
      }
      setModalOpen(false);
    } catch (err: any) {
      showToast(err.message || 'Gagal menyimpan destinasi wisata.', 'error');
    }
  };

  const triggerDelete = (id: number) => {
    setItemToDelete(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (itemToDelete === null) return;
    try {
      await api.deleteWisata(itemToDelete);
      setWisata(prev => prev.filter(item => item.id !== itemToDelete));
      showToast('Destinasi wisata berhasil dihapus.', 'success');
    } catch (err: any) {
      showToast(err.message || 'Gagal menghapus destinasi wisata.', 'error');
    } finally {
      setDeleteModalOpen(false);
      setItemToDelete(null);
    }
  };

  return (
    <div className="font-sans flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Kelola Destinasi Wisata</h1>
          <p className="text-xs text-slate-400 mt-1">Kelola data destinasi pariwisata sejarah dan ekowisata alam desa.</p>
        </div>
        {user?.role !== 'Viewer' && (
          <Button size="sm" variant="primary" onClick={openAddModal} icon={Plus}>
            Tambah Destinasi
          </Button>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-2xl shadow-sm">
        <SearchBar value={search} onChange={setSearch} placeholder="Cari destinasi..." />
      </div>

      <Card noPadding>
        <Table headers={['Nama Wisata', 'Harga Tiket', 'Jam Operasional', 'Lokasi', 'Aksi']} empty={filtered.length === 0} loading={loading}>
          {filtered.map((item) => (
            <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-850/50 transition-colors">
              <td className="px-6 py-4 font-bold text-slate-800 dark:text-white truncate max-w-[200px]" title={item.nama}>
                {item.nama}
              </td>
              <td className="px-6 py-4 font-bold text-primary-600 dark:text-primary-400">{item.tiket}</td>
              <td className="px-6 py-4 font-semibold text-slate-550 dark:text-slate-450 flex items-center gap-1 mt-2.5 border-none">
                <Clock size={14} className="text-slate-400" />
                {item.operasional}
              </td>
              <td className="px-6 py-4 truncate max-w-[150px]" title={item.lokasi}>{item.lokasi}</td>
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

      {/* Add / Edit Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={selectedItem ? (user?.role === 'Viewer' ? 'Detail Destinasi Wisata' : 'Edit Destinasi Wisata') : 'Tambah Destinasi Baru'}>
        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <fieldset disabled={user?.role === 'Viewer'} className="flex flex-col gap-4">
            <FormInput
              label="Nama Destinasi Wisata"
              name="nama"
              value={form.nama}
              onChange={handleInputChange}
              placeholder="Contoh: Candi Blandongan Batujaya"
              required
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormInput
                label="Lokasi Administrasi"
                name="lokasi"
                value={form.lokasi}
                onChange={handleInputChange}
                placeholder="Contoh: Perbatasan Segaran - Telukambulu"
                required
              />
              <FormInput
                label="Harga Tiket Masuk"
                name="tiket"
                value={form.tiket}
                onChange={handleInputChange}
                placeholder="Contoh: Rp 5.000 / orang"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormInput
                label="Jam Operasional"
                name="operasional"
                value={form.operasional}
                onChange={handleInputChange}
                placeholder="Contoh: Setiap Hari, 08.00 - 17.00 WIB"
                required
              />
              <FormInput
                label="Kontak / WhatsApp Pengelola"
                name="kontak"
                value={form.kontak}
                onChange={handleInputChange}
                placeholder="Contoh: 081299002233"
              />
            </div>

            <ImageUpload
              label="Foto Utama Destinasi"
              value={form.foto}
              onChange={(url) => setForm(prev => ({ ...prev, foto: url }))}
              disabled={user?.role === 'Viewer'}
            />

            <TextArea
              label="Fasilitas yang Tersedia"
              name="fasilitas"
              value={form.fasilitas}
              onChange={handleInputChange}
              placeholder="Contoh: Toilet umum, Area parkir, Museum barang antik, Gazebo santai"
              rows={2}
            />

            <TextArea
              label="Deskripsi Lengkap Destinasi"
              name="deskripsi"
              value={form.deskripsi}
              onChange={handleInputChange}
              placeholder="Uraikan keindahan, sejarah singkat, dan panduan perjalanan menuju tempat wisata..."
              rows={4}
              required
            />
          </fieldset>

          <div className="flex justify-end gap-3 border-t border-slate-105 pt-4 mt-2">
            <Button variant="outline" size="sm" onClick={() => setModalOpen(false)}>
              {user?.role === 'Viewer' ? 'Tutup' : 'Batal'}
            </Button>
            {user?.role !== 'Viewer' && (
              <Button type="submit" variant="primary" size="sm">Simpan Destinasi</Button>
            )}
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <Modal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} title="Konfirmasi Hapus Destinasi Wisata">
        <div className="text-center py-2">
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            Apakah Anda yakin ingin menghapus destinasi wisata ini dari portal?
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
export default AdminWisata;
