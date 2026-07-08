import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Profil, Perangkat, Demografi, DusunDemografi } from '../../data/initialData';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import FormInput from '../../components/common/FormInput';
import TextArea from '../../components/common/TextArea';
import Table from '../../components/common/Table';
import Modal from '../../components/common/Modal';
import useToast from '../../hooks/useToast';
import {
  Users,
  Plus,
  Edit2,
  Trash2,
  Save,
  UserCheck,
  Building,
  School,
  Briefcase,
  Layers
} from 'lucide-react';
import ImageUpload from '../../components/common/ImageUpload';


export const AdminProfilDesa: React.FC = () => {
  const { showToast } = useToast();
  
  // Tab State
  const [activeTab, setActiveTab] = useState<'profil' | 'perangkat' | 'demografi'>('profil');
  
  const [loading, setLoading] = useState(true);

  // 1. Profil State
  const [profilForm, setProfilForm] = useState<Profil | null>(null);

  // 2. Perangkat State
  const [perangkat, setPerangkat] = useState<Perangkat[]>([]);
  const [perangkatModal, setPerangkatModal] = useState(false);
  const [selectedPerangkat, setSelectedPerangkat] = useState<Perangkat | null>(null);
  const [perangkatForm, setPerangkatForm] = useState({
    nama: '',
    jabatan: '',
    foto: ''
  });

  // Delete Confirm Modal State
  const [deleteConfirmModal, setDeleteConfirmModal] = useState(false);
  const [perangkatToDelete, setPerangkatToDelete] = useState<number | null>(null);

  // 3. Demografi State
  const [demoForm, setDemoForm] = useState<Demografi | null>(null);

  useEffect(() => {
    const loadAll = async () => {
      try {
        const [pData, perData, dData] = await Promise.all([
          api.getProfil(),
          api.getPerangkat(),
          api.getDemografi()
        ]);
        setProfilForm(pData);
        setPerangkat(perData);
        setDemoForm(dData);
      } catch (err) {
        console.error(err);
        showToast('Gagal memuat data profil desa.', 'error');
      } finally {
        setLoading(false);
      }
    };
    loadAll();
  }, []);

  // ==================== PROFIL ACTIONS ====================
  const handleProfilChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!profilForm) return;
    const { name, value } = e.target;
    if (name.startsWith('kades_')) {
      const field = name.replace('kades_', '') as keyof typeof profilForm.kepalaDesa;
      setProfilForm({
        ...profilForm,
        kepalaDesa: {
          ...profilForm.kepalaDesa,
          [field]: value
        }
      });
    } else {
      setProfilForm({
        ...profilForm,
        [name]: value
      });
    }
  };

  const handleMisiChange = (idx: number, val: string) => {
    if (!profilForm) return;
    const newMisi = [...profilForm.misi];
    newMisi[idx] = val;
    setProfilForm({ ...profilForm, misi: newMisi });
  };

  const handleAddMisi = () => {
    if (!profilForm) return;
    setProfilForm({ ...profilForm, misi: [...profilForm.misi, ''] });
  };

  const handleRemoveMisi = (idx: number) => {
    if (!profilForm) return;
    const newMisi = profilForm.misi.filter((_, i) => i !== idx);
    setProfilForm({ ...profilForm, misi: newMisi });
  };

  const saveProfil = async () => {
    if (!profilForm) return;
    try {
      const updated = await api.updateProfil(profilForm);
      setProfilForm(updated);
      showToast('Profil desa berhasil diperbarui.', 'success');
    } catch (err: any) {
      showToast(err.message || 'Gagal menyimpan profil.', 'error');
    }
  };

  // ==================== PERANGKAT ACTIONS ====================
  const openAddPerangkat = () => {
    setSelectedPerangkat(null);
    setPerangkatForm({ nama: '', jabatan: '', foto: '' });
    setPerangkatModal(true);
  };

  const openEditPerangkat = (item: Perangkat) => {
    setSelectedPerangkat(item);
    setPerangkatForm({ nama: item.nama, jabatan: item.jabatan, foto: item.foto });
    setPerangkatModal(true);
  };

  const handlePerangkatFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPerangkatForm(prev => ({ ...prev, [name]: value }));
  };

  const savePerangkat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!perangkatForm.nama || !perangkatForm.jabatan) {
      showToast('Nama dan Jabatan wajib diisi.', 'warning');
      return;
    }

    try {
      if (selectedPerangkat) {
        // Edit Mode
        const res = await api.updatePerangkat(selectedPerangkat.id, perangkatForm);
        setPerangkat(prev => prev.map(p => p.id === selectedPerangkat.id ? res : p));
        showToast('Data perangkat berhasil diperbarui.', 'success');
      } else {
        // Add Mode
        const res = await api.createPerangkat(perangkatForm);
        setPerangkat(prev => [...prev, res]);
        showToast('Data perangkat berhasil ditambahkan.', 'success');
      }
      setPerangkatModal(false);
    } catch (err: any) {
      showToast(err.message || 'Gagal menyimpan data perangkat.', 'error');
    }
  };

  const triggerDeletePerangkat = (id: number) => {
    setPerangkatToDelete(id);
    setDeleteConfirmModal(true);
  };

  const confirmDeletePerangkat = async () => {
    if (perangkatToDelete === null) return;
    try {
      await api.deletePerangkat(perangkatToDelete);
      setPerangkat(prev => prev.filter(p => p.id !== perangkatToDelete));
      showToast('Data perangkat berhasil dihapus.', 'success');
    } catch (err: any) {
      showToast(err.message || 'Gagal menghapus data perangkat.', 'error');
    } finally {
      setDeleteConfirmModal(false);
      setPerangkatToDelete(null);
    }
  };

  // ==================== DEMOGRAFI ACTIONS ====================
  const handleDusunDemoChange = (idx: number, field: keyof DusunDemografi, val: number | string) => {
    if (!demoForm) return;
    const newList = [...demoForm.dusunList];
    newList[idx] = {
      ...newList[idx],
      [field]: field === 'nama' ? val : (parseInt(val as string) || 0)
    };
    setDemoForm({ ...demoForm, dusunList: newList });
  };

  const handleAddDusun = () => {
    if (!demoForm) return;
    const newDusun = { nama: 'Dusun Baru', rt: 0, rw: 0, kk: 0, jiwa: 0 };
    setDemoForm({
      ...demoForm,
      dusunList: [...demoForm.dusunList, newDusun]
    });
  };

  const handleRemoveDusun = (idx: number) => {
    if (!demoForm) return;
    const newList = demoForm.dusunList.filter((_, i) => i !== idx);
    setDemoForm({ ...demoForm, dusunList: newList });
  };

  const handleGenderDemoChange = (field: 'lakiLaki' | 'perempuan', val: number) => {
    if (!demoForm) return;
    setDemoForm({
      ...demoForm,
      gender: {
        ...demoForm.gender,
        [field]: val
      }
    });
  };

  const handleDemographyListChange = (type: 'pekerjaan' | 'pendidikan', idx: number, val: number) => {
    if (!demoForm) return;
    const newList = [...demoForm[type]];
    newList[idx] = {
      ...newList[idx],
      jumlah: val
    };
    setDemoForm({ ...demoForm, [type]: newList });
  };

  const saveDemografi = async () => {
    if (!demoForm) return;
    try {
      const updated = await api.updateDemografi(demoForm);
      setDemoForm(updated);
      showToast('Data demografi berhasil diperbarui.', 'success');
    } catch (err: any) {
      showToast(err.message || 'Gagal menyimpan demografi.', 'error');
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-slate-500">Memuat data manajemen profil...</div>;
  }

  return (
    <div className="font-sans flex flex-col gap-6">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Manajemen Profil Desa</h1>
          <p className="text-xs text-slate-400 mt-1">
            Kelola data sejarah, visi-misi, susunan aparatur pemerintahan, dan data demografis kependudukan.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-1.5 scroll-x no-scrollbar">
        <button
          onClick={() => setActiveTab('profil')}
          className={`pb-3 px-4 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'profil'
              ? 'border-primary-600 text-primary-655 dark:text-primary-400'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          <Building size={16} />
          Profil Utama
        </button>
        <button
          onClick={() => setActiveTab('perangkat')}
          className={`pb-3 px-4 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'perangkat'
              ? 'border-primary-600 text-primary-655 dark:text-primary-400'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          <UserCheck size={16} />
          Aparatur Desa
        </button>
        <button
          onClick={() => setActiveTab('demografi')}
          className={`pb-3 px-4 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'demografi'
              ? 'border-primary-600 text-primary-655 dark:text-primary-400'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          <Layers size={16} />
          Data Demografi
        </button>
      </div>

      {/* 1. Tab: Profil Utama */}
      {activeTab === 'profil' && profilForm && (
        <Card className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <TextArea
              label="Sejarah Desa"
              name="sejarah"
              value={profilForm.sejarah}
              onChange={handleProfilChange}
              rows={6}
            />
            <TextArea
              label="Sambutan Kepala Desa"
              name="sambutan"
              value={profilForm.sambutan}
              onChange={handleProfilChange}
              rows={6}
            />
          </div>

          <div className="border-t border-slate-100 dark:border-slate-800 pt-5">
            <FormInput
              label="Visi Desa"
              name="visi"
              value={profilForm.visi}
              onChange={handleProfilChange}
            />
          </div>

          {/* Misi List */}
          <div className="border-t border-slate-100 dark:border-slate-800 pt-5">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-350 mb-3">
              Misi Desa
            </label>
            <div className="flex flex-col gap-3">
              {profilForm.misi.map((item, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <span className="text-xs font-bold text-slate-400 flex-shrink-0 w-6 text-center">{idx + 1}</span>
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => handleMisiChange(idx, e.target.value)}
                    className="w-full text-sm rounded-xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/50 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <button
                    onClick={() => handleRemoveMisi(idx)}
                    className="text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 p-2 rounded-xl"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              <Button size="sm" variant="outline" onClick={handleAddMisi} className="mt-2 w-max">
                + Tambah Baris Misi
              </Button>
            </div>
          </div>

          {/* Kepala Desa Info */}
          <div className="border-t border-slate-100 dark:border-slate-800 pt-5">
            <h4 className="text-sm font-bold text-slate-800 dark:text-white mb-4">Informasi Kepala Desa</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <FormInput
                label="Nama Kepala Desa"
                name="kades_nama"
                value={profilForm.kepalaDesa.nama}
                onChange={handleProfilChange}
              />
              <FormInput
                label="Masa Bakti / Periode"
                name="kades_periode"
                value={profilForm.kepalaDesa.periode}
                onChange={handleProfilChange}
              />
              <ImageUpload
                label="Foto Kepala Desa"
                value={profilForm.kepalaDesa.foto}
                onChange={(url) => setProfilForm(prev => prev ? ({
                  ...prev,
                  kepalaDesa: { ...prev.kepalaDesa, foto: url }
                }) : null)}
              />
            </div>
          </div>

          {/* Geographic & Visual Links */}
          <div className="border-t border-slate-100 dark:border-slate-800 pt-5">
            <h4 className="text-sm font-bold text-slate-800 dark:text-white mb-4">Aset Visual, Geografis & Foto Kantor</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <ImageUpload
                label="Gambar Splash Beranda"
                value={profilForm.gambarSplash || ''}
                onChange={(url) => setProfilForm(prev => prev ? ({ ...prev, gambarSplash: url }) : null)}
              />

              <ImageUpload
                label="Logo Desa"
                value={profilForm.logo || ''}
                onChange={(url) => setProfilForm(prev => prev ? ({ ...prev, logo: url }) : null)}
              />

              <ImageUpload
                label="Foto Kantor Desa"
                value={profilForm.fotoKantor}
                onChange={(url) => setProfilForm(prev => prev ? ({ ...prev, fotoKantor: url }) : null)}
              />

              <FormInput
                label="URL Embed Peta Google Maps"
                name="petaLink"
                value={profilForm.petaLink}
                onChange={handleProfilChange}
              />

            </div>
          </div>

          <div className="flex justify-end border-t border-slate-100 dark:border-slate-800 pt-5">
            <Button variant="primary" onClick={saveProfil} icon={Save}>
              Simpan Perubahan Profil
            </Button>
          </div>
        </Card>
      )}

      {/* 2. Tab: Aparatur Desa */}
      {activeTab === 'perangkat' && (
        <Card className="flex flex-col gap-5">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-base font-bold text-slate-850 dark:text-white font-sans">Daftar Perangkat Desa</h3>
            <Button size="sm" variant="primary" onClick={openAddPerangkat} icon={Plus}>
              Tambah Aparatur
            </Button>
          </div>

          <Table headers={['Nama', 'Jabatan', 'Foto URL', 'Aksi']} empty={perangkat.length === 0}>
            {perangkat.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-850/50 transition-colors">
                <td className="px-6 py-4 font-bold text-slate-800 dark:text-white truncate max-w-[180px]">{item.nama}</td>
                <td className="px-6 py-4 font-semibold text-slate-655 dark:text-slate-400">{item.jabatan}</td>
                <td className="px-6 py-4 font-mono text-slate-400 text-xs truncate max-w-[200px]" title={item.foto}>
                  {item.foto}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditPerangkat(item)}
                      className="p-2 text-sky-500 hover:bg-sky-50 dark:hover:bg-sky-950/20 rounded-xl"
                      title="Edit"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => triggerDeletePerangkat(item.id)}
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
      )}

      {/* 3. Tab: Data Demografi */}
      {activeTab === 'demografi' && demoForm && (
        <Card className="flex flex-col gap-6">
          
          {/* Gender and general stats */}
          <div>
            <h4 className="text-sm font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-1.5">
              <Users size={18} className="text-primary-655" />
              Jumlah Penduduk & Gender
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <FormInput
                label="Jumlah Penduduk Laki-Laki"
                name="lakiLaki"
                type="number"
                value={demoForm.gender.lakiLaki}
                onChange={(e) => handleGenderDemoChange('lakiLaki', parseInt(e.target.value) || 0)}
              />
              <FormInput
                label="Jumlah Penduduk Perempuan"
                name="perempuan"
                type="number"
                value={demoForm.gender.perempuan}
                onChange={(e) => handleGenderDemoChange('perempuan', parseInt(e.target.value) || 0)}
              />
            </div>
          </div>

          {/* Dusun list database */}
          <div className="border-t border-slate-100 dark:border-slate-800 pt-5">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                <Layers size={18} className="text-secondary-500" />
                Rincian Administratif Dusun
              </h4>
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddDusun}
                icon={Plus}
              >
                Tambah Dusun
              </Button>
            </div>
            <div className="flex flex-col gap-4">
              {demoForm.dusunList.map((dusun, idx) => (
                <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-900 border border-slate-150 dark:border-slate-800/80 rounded-2xl flex flex-col sm:flex-row gap-4 items-end">
                  <FormInput
                    label="Nama Dusun"
                    type="text"
                    value={dusun.nama}
                    onChange={(e) => handleDusunDemoChange(idx, 'nama', e.target.value)}
                    className="flex-1 w-full"
                  />
                  <FormInput
                    label="RT"
                    type="number"
                    value={dusun.rt}
                    onChange={(e) => handleDusunDemoChange(idx, 'rt', e.target.value)}
                    className="w-full sm:w-20"
                  />
                  <FormInput
                    label="RW"
                    type="number"
                    value={dusun.rw}
                    onChange={(e) => handleDusunDemoChange(idx, 'rw', e.target.value)}
                    className="w-full sm:w-20"
                  />
                  <FormInput
                    label="Jumlah KK"
                    type="number"
                    value={dusun.kk}
                    onChange={(e) => handleDusunDemoChange(idx, 'kk', e.target.value)}
                    className="w-full sm:w-28"
                  />
                  <FormInput
                    label="Jumlah Jiwa"
                    type="number"
                    value={dusun.jiwa}
                    onChange={(e) => handleDusunDemoChange(idx, 'jiwa', e.target.value)}
                    className="w-full sm:w-28"
                  />
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleRemoveDusun(idx)}
                    icon={Trash2}
                    title="Hapus Dusun"
                    className="w-full sm:w-auto h-10 flex items-center justify-center"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Pekerjaan and Pendidikan */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-slate-100 dark:border-slate-800 pt-5">
            {/* Pekerjaan */}
            <div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-1.5">
                <Briefcase size={18} className="text-accent-600" />
                Mata Pencaharian (Jiwa)
              </h4>
              <div className="flex flex-col gap-3">
                {demoForm.pekerjaan.map((item, idx) => (
                  <FormInput
                    key={idx}
                    label={item.nama}
                    type="number"
                    value={item.jumlah}
                    onChange={(e) => handleDemographyListChange('pekerjaan', idx, parseInt(e.target.value) || 0)}
                  />
                ))}
              </div>
            </div>

            {/* Pendidikan */}
            <div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-1.5">
                <School size={18} className="text-emerald-600" />
                Tingkat Pendidikan (Jiwa)
              </h4>
              <div className="flex flex-col gap-3">
                {demoForm.pendidikan.map((item, idx) => (
                  <FormInput
                    key={idx}
                    label={item.nama}
                    type="number"
                    value={item.jumlah}
                    onChange={(e) => handleDemographyListChange('pendidikan', idx, parseInt(e.target.value) || 0)}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end border-t border-slate-100 dark:border-slate-800 pt-5">
            <Button variant="primary" onClick={saveDemGrid} icon={Save}>
              Simpan Perubahan Demografi
            </Button>
          </div>
        </Card>
      )}

      {/* Perangkat Form Modal */}
      <Modal
        isOpen={perangkatModal}
        onClose={() => setPerangkatModal(false)}
        title={selectedPerangkat ? 'Edit Data Aparatur' : 'Tambah Aparatur Desa'}
      >
        <form onSubmit={savePerangkat} className="flex flex-col gap-4">
          <FormInput
            label="Nama Lengkap Perangkat"
            name="nama"
            value={perangkatForm.nama}
            onChange={handlePerangkatFormChange}
            placeholder="Masukkan nama beserta gelar"
            required
          />
          <FormInput
            label="Jabatan / Fungsi"
            name="jabatan"
            value={perangkatForm.jabatan}
            onChange={handlePerangkatFormChange}
            placeholder="Contoh: Kaur Keuangan"
            required
          />
          <ImageUpload
            label="Foto Profil Aparatur"
            value={perangkatForm.foto}
            onChange={(url) => setPerangkatForm(prev => ({ ...prev, foto: url }))}
          />

          <div className="flex justify-end gap-3 border-t border-slate-105 pt-4 mt-2">
            <Button variant="outline" size="sm" onClick={() => setPerangkatModal(false)}>
              Batal
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Simpan Aparatur
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteConfirmModal}
        onClose={() => setDeleteConfirmModal(false)}
        title="Konfirmasi Hapus Aparatur"
      >
        <div className="text-center py-2">
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            Apakah Anda yakin ingin menghapus data perangkat desa ini? Tindakan ini bersifat permanen dan tidak dapat dibatalkan.
          </p>
          <div className="flex justify-center gap-3">
            <Button variant="outline" size="sm" onClick={() => setDeleteConfirmModal(false)}>
              Batal
            </Button>
            <Button variant="danger" size="sm" onClick={confirmDeletePerangkat}>
              Ya, Hapus Data
            </Button>
          </div>
        </div>
      </Modal>

    </div>
  );

  // Helper function to call saveDemografi
  function saveDemGrid() {
    saveDemografi();
  }
};
export default AdminProfilDesa;
