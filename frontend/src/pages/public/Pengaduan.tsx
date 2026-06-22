import React, { useState } from 'react';
import { api } from '../../services/api';
import SectionTitle from '../../components/common/SectionTitle';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import FormInput from '../../components/common/FormInput';
import SelectInput from '../../components/common/SelectInput';
import TextArea from '../../components/common/TextArea';
import Breadcrumb from '../../components/common/Breadcrumb';
import Modal from '../../components/common/Modal';
import useToast from '../../hooks/useToast';
import { MessageSquareWarning, ShieldCheck, Copy, Check, Ticket } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Pengaduan: React.FC = () => {
  const { showToast } = useToast();
  
  // Form State
  const [formData, setFormData] = useState({
    nama: '',
    nik: '',
    kontak: '',
    email: '',
    kategori: '',
    judul: '',
    isi: '',
    lokasi: '',
    foto: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // Success Modal State
  const [successModal, setSuccessModal] = useState(false);
  const [generatedTicket, setGeneratedTicket] = useState('');

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

  const validateForm = () => {
    const tempErrors: Record<string, string> = {};
    if (!formData.nama) tempErrors.nama = 'Nama wajib diisi.';
    if (!formData.kontak) tempErrors.kontak = 'Nomor HP/WhatsApp wajib diisi.';
    if (!formData.kategori) tempErrors.kategori = 'Pilih kategori pengaduan.';
    if (!formData.judul) tempErrors.judul = 'Judul pengaduan wajib diisi.';
    if (!formData.isi) tempErrors.isi = 'Detail isi pengaduan wajib diisi.';
    if (!formData.lokasi) tempErrors.lokasi = 'Lokasi kejadian wajib diisi.';
    
    // Simple WhatsApp format validation
    if (formData.kontak && !/^[0-9+]{8,15}$/.test(formData.kontak)) {
      tempErrors.kontak = 'Nomor HP tidak valid (hanya angka/tanda +).';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const res = await api.createPengaduan(formData);
      if (res.success) {
        setGeneratedTicket(res.tiket);
        setSuccessModal(true);
        showToast('Pengaduan Anda berhasil diajukan!', 'success');
        
        // Reset form
        setFormData({
          nama: '',
          nik: '',
          kontak: '',
          email: '',
          kategori: '',
          judul: '',
          isi: '',
          lokasi: '',
          foto: '',
        });
      } else {
        showToast(res.message || 'Gagal mengajukan pengaduan.', 'error');
      }
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Gagal mengajukan pengaduan.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyTicket = () => {
    navigator.clipboard.writeText(generatedTicket);
    setIsCopied(true);
    showToast('Nomor tiket berhasil disalin.', 'info');
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 font-sans">
      <Breadcrumb items={[{ label: 'Pengaduan Warga' }]} />
      <SectionTitle title="Layanan Pengaduan Masyarakat" subtitle="Laporkan masalah infrastruktur jalan, kebersihan lingkungan, pelayanan publik, atau ketertiban sosial secara digital." />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Form Column */}
        <div className="lg:col-span-8">
          <Card>
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="p-2 bg-primary-50 dark:bg-primary-950/20 text-primary-600 rounded-xl">
                <MessageSquareWarning size={20} />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-850 dark:text-white leading-tight">Formulir Pengaduan</h3>
                <p className="text-xs text-slate-400">Identitas NIK bersifat opsional, laporan Anda dijamin keamanannya.</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <FormInput
                  label="Nama Pelapor"
                  name="nama"
                  value={formData.nama}
                  onChange={handleInputChange}
                  placeholder="Masukkan nama lengkap Anda"
                  error={errors.nama}
                  required
                />
                <FormInput
                  label="NIK (Nomor Induk Kependudukan) - Opsional"
                  name="nik"
                  value={formData.nik}
                  onChange={handleInputChange}
                  placeholder="Masukkan 16 digit NIK"
                  error={errors.nik}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <FormInput
                  label="Nomor HP / WhatsApp"
                  name="kontak"
                  value={formData.kontak}
                  onChange={handleInputChange}
                  placeholder="Contoh: 0812XXXXXXXX"
                  error={errors.kontak}
                  required
                />
                <FormInput
                  label="Email - Opsional"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Contoh: nama@mail.com"
                  error={errors.email}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <SelectInput
                  label="Kategori Pengaduan"
                  name="kategori"
                  options={categories}
                  value={formData.kategori}
                  onChange={handleInputChange}
                  placeholder="Pilih Kategori"
                  error={errors.kategori}
                  required
                />
                <FormInput
                  label="URL Foto Bukti Kejadian (Dummy Image) - Opsional"
                  name="foto"
                  value={formData.foto}
                  onChange={handleInputChange}
                  placeholder="Contoh: https://images.unsplash.com/..."
                />
              </div>

              <FormInput
                label="Judul Laporan"
                name="judul"
                value={formData.judul}
                onChange={handleInputChange}
                placeholder="Tuliskan subjek pengaduan secara singkat"
                error={errors.judul}
                required
              />

              <FormInput
                label="Lokasi Kejadian"
                name="lokasi"
                value={formData.lokasi}
                onChange={handleInputChange}
                placeholder="Sebutkan dusun, RT, RW, atau patokan tempat"
                error={errors.lokasi}
                required
              />

              <TextArea
                label="Isi Laporan / Detail Kejadian"
                name="isi"
                value={formData.isi}
                onChange={handleInputChange}
                placeholder="Ceritakan kronologis kejadian, tanggal, dan kronologi secara rinci..."
                error={errors.isi}
                required
              />

              <div className="border-t border-slate-100 dark:border-slate-800 pt-5 flex justify-end">
                <Button type="submit" variant="primary" loading={loading}>
                  Kirim Laporan Pengaduan
                </Button>
              </div>
            </form>
          </Card>
        </div>

        {/* Info Column */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <Card className="bg-primary-50/40 dark:bg-primary-950/10 border-primary-100 dark:border-primary-900/30">
            <h4 className="text-sm font-bold text-primary-850 dark:text-primary-300 mb-3 font-sans">
              Ketentuan Pengaduan
            </h4>
            <ul className="flex flex-col gap-2.5 text-xs text-slate-655 dark:text-slate-400 leading-relaxed list-disc pl-4">
              <li>Laporan yang dikirimkan harus berupa fakta lapangan, bukan fitnah atau hoaks.</li>
              <li>Pastikan nomor HP/WhatsApp aktif agar petugas dapat melakukan koordinasi atau klarifikasi lanjutan.</li>
              <li>Warga dapat menyembunyikan identitas NIK, namun diimbau tetap menuliskan nama asli demi keseriusan laporan.</li>
              <li>Proses penanganan pengaduan rata-rata memakan waktu 2 s/d 7 hari kerja tergantung kompleksitas permasalahan.</li>
            </ul>
          </Card>

          <Card className="text-center">
            <Ticket size={28} className="text-secondary-500 mx-auto mb-3" />
            <h4 className="text-sm font-bold text-slate-850 dark:text-white mb-2">Sudah Memiliki Tiket Laporan?</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">
              Jika Anda sudah mengajukan pengaduan sebelumnya, silakan cek status penanganan dan tanggapan admin secara online.
            </p>
            <Link
              to="/cek-pengaduan"
              className="inline-flex w-full items-center justify-center bg-secondary-600 hover:bg-secondary-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs shadow-md transition-all active:scale-95"
            >
              Lacak Pengaduan Anda
            </Link>
          </Card>
        </div>

      </div>

      {/* Success Modal */}
      <Modal isOpen={successModal} onClose={() => setSuccessModal(false)} title="Pengaduan Berhasil Dikirim!">
        <div className="text-center py-4 font-sans">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-4">
            <ShieldCheck size={28} />
          </div>
          <h4 className="text-base font-bold text-slate-800 dark:text-white mb-2">
            Terima kasih atas kepedulian Anda
          </h4>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-6 max-w-sm mx-auto leading-relaxed">
            Laporan Anda telah terdaftar di sistem desa. Harap simpan nomor tiket di bawah ini untuk melacak progres tindak lanjut petugas:
          </p>

          <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl py-3 px-4 flex items-center justify-between max-w-xs mx-auto mb-6">
            <span className="font-mono text-base font-extrabold text-slate-850 dark:text-white">{generatedTicket}</span>
            <button
              onClick={handleCopyTicket}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1.5 rounded-lg"
              title="Salin Nomor Tiket"
            >
              {isCopied ? <Check size={18} className="text-emerald-650" /> : <Copy size={18} />}
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => setSuccessModal(false)}
              className="bg-primary-600 hover:bg-primary-705 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition-all shadow-md"
            >
              Selesai & Tutup
            </button>
            <Link
              to={`/cek-pengaduan?ticket=${generatedTicket}`}
              className="border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-850 font-bold px-5 py-2.5 rounded-xl text-xs transition-all"
            >
              Lacak Status Sekarang
            </Link>
          </div>
        </div>
      </Modal>
    </div>
  );
};
export default Pengaduan;
