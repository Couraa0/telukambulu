import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { UserAdmin } from '../../data/initialData';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import FormInput from '../../components/common/FormInput';
import SelectInput from '../../components/common/SelectInput';
import Table from '../../components/common/Table';
import Modal from '../../components/common/Modal';
import Badge from '../../components/common/Badge';
import useToast from '../../hooks/useToast';
import { Plus, Edit2, Trash2, ShieldAlert } from 'lucide-react';

export const AdminUsers: React.FC = () => {
  const { showToast } = useToast();
  
  const [users, setUsers] = useState<UserAdmin[]>([]);
  const [loading, setLoading] = useState(true);

  // CRUD Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserAdmin | null>(null);
  
  const [form, setForm] = useState({
    username: '',
    password: '',
    nama: '',
    role: 'Admin Konten' as 'Super Admin' | 'Admin Konten' | 'Admin Pengaduan' | 'Admin Profil' | 'Viewer',
    aktif: true
  });

  // Delete Confirm Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<number | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await api.getUsers();
      setUsers(data);
    } catch (err) {
      console.error(err);
      showToast('Gagal memuat daftar admin.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setForm(prev => ({ ...prev, [name]: checked }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const openAddModal = () => {
    setSelectedUser(null);
    setForm({
      username: '',
      password: '',
      nama: '',
      role: 'Admin Konten',
      aktif: true
    });
    setModalOpen(true);
  };

  const openEditModal = async (item: UserAdmin) => {
    setLoading(true);
    try {
      // Fetch full user details (including password for editing)
      const fullUser = await api.getUserById(item.id);
      setSelectedUser(fullUser);
      setForm({
        username: fullUser.username,
        password: fullUser.password || '',
        nama: fullUser.nama,
        role: fullUser.role,
        aktif: fullUser.aktif
      });
      setModalOpen(true);
    } catch (err: any) {
      showToast(err.message || 'Gagal memuat detil user.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.username || !form.nama || (!selectedUser && !form.password)) {
      showToast('Nama, Username, dan Password wajib diisi.', 'warning');
      return;
    }

    try {
      if (selectedUser) {
        // Edit Mode
        const res = await api.updateUser(selectedUser.id, form);
        setUsers(prev => prev.map(u => u.id === selectedUser.id ? res : u));
        showToast('Akun admin berhasil diperbarui.', 'success');
      } else {
        // Add Mode
        const res = await api.createUser(form);
        setUsers(prev => [...prev, res]);
        showToast('Akun admin berhasil ditambahkan.', 'success');
      }
      setModalOpen(false);
    } catch (err: any) {
      showToast(err.message || 'Gagal menyimpan akun admin.', 'error');
    }
  };

  const triggerDelete = (item: UserAdmin) => {
    if (item.username === 'superadmin') {
      showToast('Akun master Super Admin tidak boleh dihapus.', 'error');
      return;
    }
    setUserToDelete(item.id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (userToDelete === null) return;
    try {
      await api.deleteUser(userToDelete);
      setUsers(prev => prev.filter(u => u.id !== userToDelete));
      showToast('Akun admin berhasil dihapus.', 'success');
    } catch (err: any) {
      showToast(err.message || 'Gagal menghapus akun.', 'error');
    } finally {
      setDeleteModalOpen(false);
      setUserToDelete(null);
    }
  };

  return (
    <div className="font-sans flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Manajemen Akun Administrator</h1>
          <p className="text-xs text-slate-400 mt-1">Kelola data petugas pengelola portal desa beserta penugasan menu dan hak akses.</p>
        </div>
        <Button size="sm" variant="primary" onClick={openAddModal} icon={Plus}>
          Tambah Akun Admin
        </Button>
      </div>

      {/* Warning Alert */}
      <Card className="bg-amber-50/40 dark:bg-amber-950/10 border-amber-250/30 text-amber-800 dark:text-amber-300 p-4 rounded-2xl flex items-start gap-3">
        <ShieldAlert size={20} className="text-amber-500 mt-0.5 flex-shrink-0" />
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider mb-0.5">Penjelasan Pembatasan Hak Akses (Role):</h4>
          <ul className="list-disc pl-4 text-xs mt-1 space-y-1 text-slate-655 dark:text-slate-400 font-medium">
            <li><span className="font-bold text-amber-700 dark:text-amber-300">Super Admin</span>: Akses penuh ke seluruh menu administrasi dan kelola admin.</li>
            <li><span className="font-bold text-amber-700 dark:text-amber-300">Admin Konten</span>: Mengelola berita desa, pengumuman, galeri foto, dan pesona desa (SDA, produk, wisata).</li>
            <li><span className="font-bold text-amber-700 dark:text-amber-300">Admin Pengaduan</span>: Mengelola dan memproses tindak lanjut aduan masyarakat saja.</li>
            <li><span className="font-bold text-amber-700 dark:text-amber-300">Admin Profil</span>: Mengelola sambutan, sejarah, demografi kependudukan, dan kontak desa saja.</li>
            <li><span className="font-bold text-amber-700 dark:text-amber-300">Viewer</span>: Mengakses seluruh menu administrasi secara read-only (tidak dapat menambah, mengubah, atau menghapus data).</li>
          </ul>
        </div>
      </Card>

      <Card noPadding>
        <Table headers={['Nama Lengkap', 'Username', 'Penugasan Role', 'Status', 'Aksi']} empty={users.length === 0} loading={loading}>
          {users.map((item) => (
            <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-850/50 transition-colors">
              <td className="px-6 py-4 font-bold text-slate-805 dark:text-white">{item.nama}</td>
              <td className="px-6 py-4 font-mono text-slate-550 dark:text-slate-400">{item.username}</td>
              <td className="px-6 py-4">
                <Badge type={item.role === 'Super Admin' ? 'danger' : item.role === 'Admin Konten' ? 'info' : item.role === 'Admin Pengaduan' ? 'warning' : item.role === 'Admin Profil' ? 'success' : 'neutral'} variant="soft">
                  {item.role}
                </Badge>
              </td>
              <td className="px-6 py-4">
                <Badge type={item.aktif ? 'success' : 'neutral'} variant="solid">
                  {item.aktif ? 'AKTIF' : 'NONAKTIF'}
                </Badge>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <button onClick={() => openEditModal(item)} className="p-2 text-sky-500 hover:bg-sky-50 dark:hover:bg-sky-950/20 rounded-xl" title="Edit">
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => triggerDelete(item)}
                    disabled={item.username === 'superadmin'}
                    className={`p-2 rounded-xl transition-all ${
                      item.username === 'superadmin'
                        ? 'text-slate-300 dark:text-slate-800 cursor-not-allowed'
                        : 'text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20'
                    }`}
                    title={item.username === 'superadmin' ? 'Superadmin tidak boleh dihapus' : 'Hapus'}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </Table>
      </Card>

      {/* Add / Edit Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={selectedUser ? 'Edit Akun Administrator' : 'Tambah Akun Admin Baru'}>
        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <FormInput
            label="Nama Lengkap Pengelola"
            name="nama"
            value={form.nama}
            onChange={handleInputChange}
            placeholder="Masukkan nama lengkap petugas"
            required
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              label="Username Login"
              name="username"
              value={form.username}
              onChange={handleInputChange}
              placeholder="Masukkan username unik"
              disabled={selectedUser?.username === 'superadmin'}
              required
            />
            <FormInput
              label={selectedUser ? 'Ganti Password (Biarkan kosong jika tetap)' : 'Password Login'}
              name="password"
              type="password"
              value={form.password}
              onChange={handleInputChange}
              placeholder="Masukkan kata sandi"
              required={!selectedUser}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SelectInput
              label="Penugasan Sektor (Role)"
              name="role"
              options={[
                { value: 'Super Admin', label: 'Super Admin (Akses Penuh)' },
                { value: 'Admin Konten', label: 'Admin Konten (Berita, SDA, UMKM, Wisata)' },
                { value: 'Admin Pengaduan', label: 'Admin Pengaduan (Tanggap Warga)' },
                { value: 'Admin Profil', label: 'Admin Profil (Biodata & Kontak)' },
                { value: 'Viewer', label: 'Viewer (Hanya Lihat / Read-Only)' }
              ]}
              value={form.role}
              onChange={handleInputChange}
              disabled={selectedUser?.username === 'superadmin'}
            />
            
            <div className="flex flex-col justify-end pb-3">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="aktif"
                  name="aktif"
                  checked={form.aktif}
                  onChange={handleInputChange}
                  disabled={selectedUser?.username === 'superadmin'}
                  className="w-4.5 h-4.5 text-primary-600 border-slate-300 rounded focus:ring-primary-500 disabled:opacity-40 disabled:cursor-not-allowed"
                />
                <label htmlFor="aktif" className="text-sm font-semibold text-slate-700 dark:text-slate-350 cursor-pointer">
                  Akun aktif & diizinkan masuk portal dashboard
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-slate-105 pt-4 mt-2">
            <Button variant="outline" size="sm" onClick={() => setModalOpen(false)}>Batal</Button>
            <Button type="submit" variant="primary" size="sm">Simpan Akun</Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <Modal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} title="Konfirmasi Hapus Akun Administrator">
        <div className="text-center py-2">
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            Apakah Anda yakin ingin menghapus akun admin pengelola ini? Akses masuk mereka ke panel dashboard akan langsung dicabut secara permanen.
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
export default AdminUsers;
