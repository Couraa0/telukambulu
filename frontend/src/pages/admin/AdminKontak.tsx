import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Kontak, LayananAdmin } from '../../data/initialData';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import FormInput from '../../components/common/FormInput';
import useToast from '../../hooks/useToast';
import { useAuth } from '../../context/AuthContext';
import { Save, Contact, Link as LinkIcon, FileText, Trash2, Plus } from 'lucide-react';

export const AdminKontak: React.FC = () => {
  const { showToast } = useToast();
  const { user } = useAuth();
  
  const [kontak, setKontak] = useState<Kontak | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getKontak()
      .then(setKontak)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!kontak) return;
    const { name, value } = e.target;
    
    if (name.startsWith('social_')) {
      const field = name.replace('social_', '') as keyof typeof kontak.socialMedia;
      setKontak({
        ...kontak,
        socialMedia: {
          ...kontak.socialMedia,
          [field]: value
        }
      });
    } else {
      setKontak({
        ...kontak,
        [name]: value
      });
    }
  };

  const handleLayananChange = (idx: number, field: keyof LayananAdmin, val: string) => {
    if (!kontak) return;
    const newLayanan = [...kontak.layananAdministrasi];
    newLayanan[idx] = {
      ...newLayanan[idx],
      [field]: val
    };
    setKontak({
      ...kontak,
      layananAdministrasi: newLayanan
    });
  };

  const handleAddLayanan = () => {
    if (!kontak) return;
    setKontak({
      ...kontak,
      layananAdministrasi: [...kontak.layananAdministrasi, { layanan: '', syarat: '' }]
    });
  };

  const handleRemoveLayanan = (idx: number) => {
    if (!kontak) return;
    const newLayanan = kontak.layananAdministrasi.filter((_, i) => i !== idx);
    setKontak({
      ...kontak,
      layananAdministrasi: newLayanan
    });
  };

  const handleSave = async () => {
    if (!kontak) return;
    try {
      const res = await api.updateKontak(kontak);
      setKontak(res);
      showToast('Kontak dan Layanan Administrasi berhasil diperbarui.', 'success');
    } catch (err: any) {
      showToast(err.message || 'Gagal memperbarui kontak.', 'error');
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-slate-500">Memuat data manajemen kontak...</div>;
  }

  return (
    <div className="font-sans flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Kelola Kontak & Informasi Pelayanan</h1>
          <p className="text-xs text-slate-400 mt-1">Ubah nomor operasional, email, tautan media sosial, serta daftar syarat surat administrasi desa.</p>
        </div>
      </div>

      <fieldset disabled={user?.role === 'Viewer'} className="contents">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Core Fields & Socials */}
        <div className="lg:col-span-6 flex flex-col gap-6">
          <Card>
            <h3 className="text-sm font-bold text-slate-850 dark:text-white uppercase tracking-wider mb-5 flex items-center gap-2">
              <Contact size={18} className="text-primary-655" />
              Kontak Hubung Kantor
            </h3>

            <div className="flex flex-col gap-4">
              <FormInput
                label="Alamat Kantor Desa"
                name="alamat"
                value={kontak?.alamat || ''}
                onChange={handleInputChange}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormInput
                  label="No. Telepon Kantor"
                  name="telepon"
                  value={kontak?.telepon || ''}
                  onChange={handleInputChange}
                />
                <FormInput
                  label="WhatsApp Center Desa (Gunakan kode 62)"
                  name="whatsapp"
                  value={kontak?.whatsapp || ''}
                  onChange={handleInputChange}
                />
              </div>
              <FormInput
                label="Alamat Email Desa"
                name="email"
                type="email"
                value={kontak?.email || ''}
                onChange={handleInputChange}
              />
              <FormInput
                label="Jam Layanan Operasional"
                name="jamPelayanan"
                value={kontak?.jamPelayanan || ''}
                onChange={handleInputChange}
              />
              <FormInput
                label="URL Iframe Google Maps"
                name="mapsLink"
                value={kontak?.mapsLink || ''}
                onChange={handleInputChange}
              />
            </div>
          </Card>

          <Card>
            <h3 className="text-sm font-bold text-slate-850 dark:text-white uppercase tracking-wider mb-5 flex items-center gap-2">
              <LinkIcon size={18} className="text-secondary-500" />
              Media Sosial Resmi
            </h3>
            <div className="flex flex-col gap-4">
              <FormInput
                label="Facebook URL"
                name="social_facebook"
                value={kontak?.socialMedia.facebook || ''}
                onChange={handleInputChange}
              />
              <FormInput
                label="Instagram URL"
                name="social_instagram"
                value={kontak?.socialMedia.instagram || ''}
                onChange={handleInputChange}
              />
              <FormInput
                label="YouTube Channel URL"
                name="social_youtube"
                value={kontak?.socialMedia.youtube || ''}
                onChange={handleInputChange}
              />
              <FormInput
                label="Twitter / X URL"
                name="social_twitter"
                value={kontak?.socialMedia.twitter || ''}
                onChange={handleInputChange}
              />
            </div>
          </Card>
        </div>

        {/* Right Column: Administrative Documents */}
        <div className="lg:col-span-6 flex flex-col gap-6">
          <Card>
            <div className="flex justify-between items-center gap-2 mb-5">
              <h3 className="text-sm font-bold text-slate-850 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <FileText size={18} className="text-accent-500" />
                Daftar Persyaratan Surat Administrasi
              </h3>
              {user?.role !== 'Viewer' && (
                <Button size="sm" variant="outline" onClick={handleAddLayanan} icon={Plus}>
                  Tambah Jenis Surat
                </Button>
              )}
            </div>

            <div className="flex flex-col gap-5">
              {kontak?.layananAdministrasi.map((item, idx) => (
                <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-2xl flex flex-col gap-3 relative">
                  {user?.role !== 'Viewer' && (
                    <button
                      onClick={() => handleRemoveLayanan(idx)}
                      className="absolute top-2 right-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 p-2 rounded-xl"
                      title="Hapus Jenis Surat"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                  
                  <FormInput
                    label="Nama Layanan Administrasi / Surat"
                    name={`layanan_${idx}`}
                    value={item.layanan}
                    onChange={(e) => handleLayananChange(idx, 'layanan', e.target.value)}
                    placeholder="Contoh: Pembuatan Surat Keterangan Usaha (SKU)"
                    className="w-[90%]"
                    required
                  />

                  {/* Manual input style for requirements textarea to avoid creating a new file */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-350 mb-1.5">
                      Persyaratan Dokumen (Pisahkan dengan koma)
                    </label>
                    <textarea
                      value={item.syarat}
                      onChange={(e) => handleLayananChange(idx, 'syarat', e.target.value)}
                      placeholder="Contoh: KTP asli, KK, Surat Pengantar RT/RW"
                      rows={2.5}
                      className="w-full text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/50 py-2.5 px-4 focus:outline-none focus:ring-4 focus:border-primary-500 focus:ring-primary-500/20 transition-all duration-200"
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </fieldset>
 
      {user?.role !== 'Viewer' && (
        <div className="flex justify-end gap-3 mt-4">
          <Button variant="primary" onClick={handleSave} icon={Save} className="py-3 px-6 shadow-md shadow-primary-600/10">
            Simpan Semua Perubahan
          </Button>
        </div>
      )}
    </div>
  );
};
export default AdminKontak;
