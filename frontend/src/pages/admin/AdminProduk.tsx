import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Produk } from '../../data/initialData';
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
import { ShoppingBag, Plus, Edit2, Trash2 } from 'lucide-react';

export const AdminProduk: React.FC = () => {
  const { showToast } = useToast();
  
  const [produk, setProduk] = useState<Produk[]>([]);
  const [filtered, setFiltered] = useState<Produk[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('');
  const [categories, setCategories] = useState<string[]>([]);

  // CRUD Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Produk | null>(null);
  
  const [form, setForm] = useState({
    nama: '',
    kategori: '',
    foto: '',
    deskripsi: '',
    harga: '',
    stok: '',
    penjual: '',
    kontak: '',
    lokasi: ''
  });

  // Delete Confirm Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);

  useEffect(() => {
    loadProduk();
  }, []);

  const loadProduk = async () => {
    setLoading(true);
    try {
      const data = await api.getProduk();
      setProduk(data);
      setFiltered(data);
      const cats = Array.from(new Set(data.map(item => item.kategori)));
      setCategories(cats);
    } catch (err) {
      console.error(err);
      showToast('Gagal memuat produk UMKM.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let result = [...produk];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(item =>
        item.nama.toLowerCase().includes(q) || item.deskripsi.toLowerCase().includes(q) || item.penjual.toLowerCase().includes(q)
      );
    }
    if (selectedCat) {
      result = result.filter(item => item.kategori === selectedCat);
    }
    setFiltered(result);
  }, [search, selectedCat, produk]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const openAddModal = () => {
    setSelectedItem(null);
    setForm({
      nama: '',
      kategori: 'Kerajinan',
      foto: 'https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&q=80&w=600',
      deskripsi: '',
      harga: '',
      stok: 'Tersedia',
      penjual: '',
      kontak: '',
      lokasi: 'Desa Telukambulu'
    });
    setModalOpen(true);
  };

  const openEditModal = (item: Produk) => {
    setSelectedItem(item);
    setForm({
      nama: item.nama,
      kategori: item.kategori,
      foto: item.foto,
      deskripsi: item.deskripsi,
      harga: item.harga,
      stok: item.stok,
      penjual: item.penjual,
      kontak: item.kontak,
      lokasi: item.lokasi
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nama || !form.kategori || !form.harga || !form.penjual || !form.kontak) {
      showToast('Nama Produk, Kategori, Harga, Nama Pelaku Usaha, dan No WhatsApp wajib diisi.', 'warning');
      return;
    }

    try {
      if (selectedItem) {
        // Edit Mode
        const res = await api.updateProduk(selectedItem.id, form);
        setProduk(prev => prev.map(item => item.id === selectedItem.id ? res : item));
        showToast('Produk UMKM berhasil diperbarui.', 'success');
      } else {
        // Add Mode
        const res = await api.createProduk(form);
        setProduk(prev => [...prev, res]);
        showToast('Produk UMKM berhasil ditambahkan.', 'success');
      }
      setModalOpen(false);
    } catch (err: any) {
      showToast(err.message || 'Gagal menyimpan produk.', 'error');
    }
  };

  const triggerDelete = (id: number) => {
    setItemToDelete(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (itemToDelete === null) return;
    try {
      await api.deleteProduk(itemToDelete);
      setProduk(prev => prev.filter(item => item.id !== itemToDelete));
      showToast('Produk UMKM berhasil dihapus.', 'success');
    } catch (err: any) {
      showToast(err.message || 'Gagal menghapus produk.', 'error');
    } finally {
      setDeleteModalOpen(false);
      setItemToDelete(null);
    }
  };

  return (
    <div className="font-sans flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Kelola Produk Unggulan UMKM</h1>
          <p className="text-xs text-slate-400 mt-1">Kelola katalog promosi dan pemasaran produk kerajinan/kuliner pelaku UMKM warga desa.</p>
        </div>
        <Button size="sm" variant="primary" onClick={openAddModal} icon={Plus}>
          Tambah Produk
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-2xl shadow-sm">
        <SearchBar value={search} onChange={setSearch} placeholder="Cari nama produk..." />
        <SelectInput
          options={['', ...categories]}
          value={selectedCat}
          onChange={(e) => setSelectedCat(e.target.value)}
          placeholder="Semua Kategori"
          className="w-full sm:w-48"
        />
      </div>

      <Card noPadding>
        <Table headers={['Nama Produk', 'Kategori', 'Harga', 'Usaha / Penjual', 'Aksi']} empty={filtered.length === 0} loading={loading}>
          {filtered.map((item) => (
            <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-850/50 transition-colors">
              <td className="px-6 py-4 font-bold text-slate-800 dark:text-white truncate max-w-[200px]" title={item.nama}>
                {item.nama}
              </td>
              <td className="px-6 py-4">
                <Badge type="success" variant="soft">{item.kategori}</Badge>
              </td>
              <td className="px-6 py-4 font-bold text-primary-600 dark:text-primary-400">{item.harga}</td>
              <td className="px-6 py-4 text-slate-700 dark:text-slate-300 font-semibold">{item.penjual}</td>
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
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={selectedItem ? 'Edit Produk UMKM' : 'Tambah Produk Baru'}>
        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <FormInput
            label="Nama Produk Lokal"
            name="nama"
            value={form.nama}
            onChange={handleInputChange}
            placeholder="Contoh: Besek Bambu Bulat"
            required
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              label="Kategori Produk"
              name="kategori"
              value={form.kategori}
              onChange={handleInputChange}
              placeholder="Contoh: Kerajinan, Kuliner"
              required
            />
            <FormInput
              label="Harga Jual / Kisaran Harga"
              name="harga"
              value={form.harga}
              onChange={handleInputChange}
              placeholder="Contoh: Rp 25.000 / pcs"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              label="Nama Pelaku Usaha / Pengrajin"
              name="penjual"
              value={form.penjual}
              onChange={handleInputChange}
              placeholder="Contoh: Kelompok Wanita Tani Melati"
              required
            />
            <FormInput
              label="Nomor WhatsApp Penjual (Tanpa tanda + / 62)"
              name="kontak"
              value={form.kontak}
              onChange={handleInputChange}
              placeholder="Contoh: 81234567890"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              label="Ketersediaan Stok / Keterangan"
              name="stok"
              value={form.stok}
              onChange={handleInputChange}
              placeholder="Contoh: Ready / Pre-order 3 hari"
            />
            <FormInput
              label="Alamat / Lokasi Usaha"
              name="lokasi"
              value={form.lokasi}
              onChange={handleInputChange}
              placeholder="Contoh: Dusun Krajan RT 01/RW 03"
            />
          </div>

          <FormInput
            label="URL Foto Produk"
            name="foto"
            value={form.foto}
            onChange={handleInputChange}
            placeholder="Contoh: https://images.unsplash.com/..."
          />

          <TextArea
            label="Deskripsi Detail Produk"
            name="deskripsi"
            value={form.deskripsi}
            onChange={handleInputChange}
            placeholder="Uraikan detail bahan, kelebihan produk, dan info spesifikasi lainnya..."
            rows={4}
            required
          />

          <div className="flex justify-end gap-3 border-t border-slate-105 pt-4 mt-2">
            <Button variant="outline" size="sm" onClick={() => setModalOpen(false)}>Batal</Button>
            <Button type="submit" variant="primary" size="sm">Simpan Produk</Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <Modal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} title="Konfirmasi Hapus Produk UMKM">
        <div className="text-center py-2">
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            Apakah Anda yakin ingin menghapus produk UMKM ini? Promosi di halaman publik akan terhenti.
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
export default AdminProduk;
