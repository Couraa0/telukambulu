import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { SDA } from '../../data/initialData';
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
import { Plus, Edit2, Trash2, MapPin } from 'lucide-react';
import ImageUpload from '../../components/common/ImageUpload';


export const AdminSDA: React.FC = () => {
  const { showToast } = useToast();
  
  const [sda, setSda] = useState<SDA[]>([]);
  const [filtered, setFiltered] = useState<SDA[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('');
  const [categories, setCategories] = useState<string[]>([]);

  // CRUD Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<SDA | null>(null);
  
  const [form, setForm] = useState({
    nama: '',
    kategori: '',
    foto: '',
    deskripsi: '',
    lokasi: '',
    manfaat: '',
    potensi: ''
  });

  // Delete Confirm Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);

  useEffect(() => {
    loadSDA();
  }, []);

  const loadSDA = async () => {
    setLoading(true);
    try {
      const data = await api.getSDA();
      setSda(data);
      setFiltered(data);
      const cats = Array.from(new Set(data.map(item => item.kategori)));
      setCategories(cats);
    } catch (err) {
      console.error(err);
      showToast('Gagal memuat potensi SDA.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let result = [...sda];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(item =>
        item.nama.toLowerCase().includes(q) || item.deskripsi.toLowerCase().includes(q) || item.lokasi.toLowerCase().includes(q)
      );
    }
    if (selectedCat) {
      result = result.filter(item => item.kategori === selectedCat);
    }
    setFiltered(result);
  }, [search, selectedCat, sda]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const openAddModal = () => {
    setSelectedItem(null);
    setForm({
      nama: '',
      kategori: 'Pertanian',
      foto: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=600',
      deskripsi: '',
      lokasi: '',
      manfaat: '',
      potensi: ''
    });
    setModalOpen(true);
  };

  const openEditModal = (item: SDA) => {
    setSelectedItem(item);
    setForm({
      nama: item.nama,
      kategori: item.kategori,
      foto: item.foto,
      deskripsi: item.deskripsi,
      lokasi: item.lokasi,
      manfaat: item.manfaat,
      potensi: item.potensi
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nama || !form.kategori || !form.deskripsi || !form.lokasi) {
      showToast('Nama, Kategori, Deskripsi, dan Lokasi wajib diisi.', 'warning');
      return;
    }

    try {
      if (selectedItem) {
        // Edit Mode
        const res = await api.updateSDA(selectedItem.id, form);
        setSda(prev => prev.map(item => item.id === selectedItem.id ? res : item));
        showToast('Potensi alam berhasil diperbarui.', 'success');
      } else {
        // Add Mode
        const res = await api.createSDA(form);
        setSda(prev => [...prev, res]);
        showToast('Potensi alam berhasil ditambahkan.', 'success');
      }
      setModalOpen(false);
    } catch (err: any) {
      showToast(err.message || 'Gagal menyimpan potensi alam.', 'error');
    }
  };

  const triggerDelete = (id: number) => {
    setItemToDelete(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (itemToDelete === null) return;
    try {
      await api.deleteSDA(itemToDelete);
      setSda(prev => prev.filter(item => item.id !== itemToDelete));
      showToast('Potensi alam berhasil dihapus.', 'success');
    } catch (err: any) {
      showToast(err.message || 'Gagal menghapus potensi alam.', 'error');
    } finally {
      setDeleteModalOpen(false);
      setItemToDelete(null);
    }
  };

  return (
    <div className="font-sans flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Kelola Sumber Daya Alam (SDA)</h1>
          <p className="text-xs text-slate-400 mt-1">Kelola daftar potensi, aset wilayah tani, perairan, dan kehutanan desa.</p>
        </div>
        <Button size="sm" variant="primary" onClick={openAddModal} icon={Plus}>
          Tambah Potensi Alam
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-2xl shadow-sm">
        <SearchBar value={search} onChange={setSearch} placeholder="Cari potensi..." />
        <SelectInput
          options={['', ...categories]}
          value={selectedCat}
          onChange={(e) => setSelectedCat(e.target.value)}
          placeholder="Semua Kategori"
          className="w-full sm:w-48"
        />
      </div>

      <Card noPadding>
        <Table headers={['Nama Potensi', 'Kategori', 'Lokasi Wilayah', 'Aksi']} empty={filtered.length === 0} loading={loading}>
          {filtered.map((item) => (
            <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-850/50 transition-colors">
              <td className="px-6 py-4 font-bold text-slate-800 dark:text-white truncate max-w-[200px]" title={item.nama}>
                {item.nama}
              </td>
              <td className="px-6 py-4">
                <Badge type="success" variant="soft">{item.kategori}</Badge>
              </td>
              <td className="px-6 py-4 text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1 mt-2.5 border-none truncate max-w-[250px]" title={item.lokasi}>
                <MapPin size={14} className="text-slate-400" />
                {item.lokasi}
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
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={selectedItem ? 'Edit Potensi Alam' : 'Tambah Potensi Alam Baru'}>
        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <FormInput
            label="Nama Aset / Potensi Alam"
            name="nama"
            value={form.nama}
            onChange={handleInputChange}
            placeholder="Contoh: Hamparan Sawah Irigasi Krajan"
            required
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              label="Kategori Potensi"
              name="kategori"
              value={form.kategori}
              onChange={handleInputChange}
              placeholder="Contoh: Pertanian, Perairan, Kebun"
              required
            />
            <FormInput
              label="Lokasi Wilayah Kejadian"
              name="lokasi"
              value={form.lokasi}
              onChange={handleInputChange}
              placeholder="Contoh: Dusun Krajan RT 02/RW 03"
              required
            />
          </div>

          <ImageUpload
            label="Foto Aset Potensi Alam"
            value={form.foto}
            onChange={(url) => setForm(prev => ({ ...prev, foto: url }))}
          />


          <TextArea
            label="Deskripsi Lengkap"
            name="deskripsi"
            value={form.deskripsi}
            onChange={handleInputChange}
            placeholder="Terangkan secara detail tentang luas lahan, kepemilikan, dan status aset..."
            rows={4}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TextArea
              label="Manfaat Bagi Warga"
              name="manfaat"
              value={form.manfaat}
              onChange={handleInputChange}
              placeholder="Sebutkan manfaat ekonomi atau ekologi saat ini..."
              rows={3}
            />
            <TextArea
              label="Rencana Pengembangan Ke Depan"
              name="potensi"
              value={form.potensi}
              onChange={handleInputChange}
              placeholder="Sebutkan rencana program pengembangan di masa depan..."
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-3 border-t border-slate-105 pt-4 mt-2">
            <Button variant="outline" size="sm" onClick={() => setModalOpen(false)}>Batal</Button>
            <Button type="submit" variant="primary" size="sm">Simpan Potensi</Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <Modal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} title="Konfirmasi Hapus Potensi Alam">
        <div className="text-center py-2">
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            Apakah Anda yakin ingin menghapus data potensi alam ini dari portal?
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
export default AdminSDA;
