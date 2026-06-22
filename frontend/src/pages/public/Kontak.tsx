import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Kontak as IKontak } from '../../data/initialData';
import SectionTitle from '../../components/common/SectionTitle';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import FormInput from '../../components/common/FormInput';
import TextArea from '../../components/common/TextArea';
import Breadcrumb from '../../components/common/Breadcrumb';
import Skeleton from '../../components/common/Skeleton';
import { useSEO } from '../../hooks/useSEO';
import useToast from '../../hooks/useToast';
import { MapPin, Phone, Mail, Clock, Send, Info, FileText } from 'lucide-react';

export const Kontak: React.FC = () => {
  useSEO({
    title: 'Hubungi Kami - Pelayanan Desa Telukambulu',
    description: 'Ketahui alamat kantor kepala desa, kontak email/telepon resmi, jam operasional pelayanan dokumen, dan formulir pengiriman pesan pengaduan.',
    keywords: 'Hubungi Desa, Kontak Kantor Desa, Pelayanan Telukambulu, Alamat Batujaya'
  });

  const { showToast } = useToast();
  const [kontak, setKontak] = useState<IKontak | null>(null);
  const [loading, setLoading] = useState(true);

  // Form State
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    subjek: '',
    pesan: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    api.getKontak()
      .then(setKontak)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    const tempErrors: Record<string, string> = {};
    if (!formData.nama) tempErrors.nama = 'Nama wajib diisi.';
    if (!formData.email) tempErrors.email = 'Email wajib diisi.';
    if (!formData.subjek) tempErrors.subjek = 'Subjek wajib diisi.';
    if (!formData.pesan) tempErrors.pesan = 'Pesan wajib diisi.';
    
    if (Object.keys(tempErrors).length > 0) {
      setErrors(tempErrors);
      return;
    }

    setFormLoading(true);
    setTimeout(() => {
      setFormLoading(false);
      showToast('Pesan Anda berhasil dikirim! Kami akan segera membalas email Anda.', 'success');
      setFormData({ nama: '', email: '', subjek: '', pesan: '' });
    }, 1000);
  };

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 font-sans">
      <Breadcrumb items={[{ label: 'Hubungi Kami' }]} />
      <SectionTitle title="Kontak & Layanan Desa" subtitle="Alamat kantor kepala desa, jam operasional pelayanan administrasi, dan formulir kontak pesan elektronik." />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Contact Info & Maps */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <Card>
            <h3 className="text-sm font-bold text-slate-850 dark:text-white uppercase tracking-wider mb-5 border-l-4 border-primary-600 pl-3">
              Informasi Kantor
            </h3>

            {loading ? (
              <Skeleton variant="text" count={2} />
            ) : (
              <ul className="flex flex-col gap-5 text-xs sm:text-sm text-slate-655 dark:text-slate-400">
                <li className="flex gap-3">
                  <MapPin size={18} className="text-primary-600 mt-0.5 flex-shrink-0" />
                  <span className="leading-relaxed">{kontak?.alamat}</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone size={16} className="text-primary-600 flex-shrink-0" />
                  <span>{kontak?.telepon}</span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail size={16} className="text-primary-600 flex-shrink-0" />
                  <span>{kontak?.email}</span>
                </li>
                <li className="flex items-start gap-3">
                  <Clock size={16} className="text-primary-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="block font-bold text-slate-700 dark:text-slate-300">Jam Operasional Pelayanan:</span>
                    <span className="block text-xs mt-0.5">{kontak?.jamPelayanan}</span>
                  </div>
                </li>
              </ul>
            )}
          </Card>

          {/* Maps Iframe */}
          <Card noPadding className="overflow-hidden h-72">
            {loading ? (
              <div className="w-full h-full bg-slate-200 dark:bg-emerald-950/20 animate-pulse" />
            ) : (
              <iframe
                title="Lokasi Kantor Desa"
                src={kontak?.mapsLink}
                className="w-full h-full border-none"
                allowFullScreen={false}
                loading="lazy"
              ></iframe>
            )}
          </Card>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          
          {/* Layanan Administrasi / Dokumen Wajib */}
          <Card>
            <h3 className="text-sm font-bold text-slate-850 dark:text-white uppercase tracking-wider mb-5 border-l-4 border-primary-600 pl-3">
              Persyaratan Administrasi Kependudukan
            </h3>

            {loading ? (
              <Skeleton variant="list" count={1} />
            ) : (
              <div className="flex flex-col gap-4">
                {kontak?.layananAdministrasi?.map((item, idx) => (
                  <div key={idx} className="border-b border-slate-100 dark:border-slate-800/80 pb-3.5 last:border-none last:pb-0 text-xs sm:text-sm">
                    <h4 className="font-bold text-slate-880 dark:text-white flex items-center gap-2 mb-1.5">
                      <FileText size={16} className="text-secondary-500" />
                      {item.layanan}
                    </h4>
                    <p className="text-slate-500 dark:text-slate-400 pl-6 leading-relaxed">
                      <span className="font-semibold text-slate-400 uppercase tracking-widest text-[9px] mr-1 block sm:inline">Persyaratan:</span>
                      {item.syarat}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Form Card */}
          <Card>
            <h3 className="text-sm font-bold text-slate-850 dark:text-white uppercase tracking-wider mb-5 border-l-4 border-primary-600 pl-3">
              Kirim Pesan Elektronik
            </h3>

            <form onSubmit={handleFormSubmit} className="flex flex-col gap-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <FormInput
                  label="Nama Anda"
                  name="nama"
                  value={formData.nama}
                  onChange={handleInputChange}
                  placeholder="Masukkan nama lengkap"
                  error={errors.nama}
                  required
                />
                <FormInput
                  label="Alamat Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Masukkan email Anda"
                  error={errors.email}
                  required
                />
              </div>

              <FormInput
                label="Subjek Pesan"
                name="subjek"
                value={formData.subjek}
                onChange={handleInputChange}
                placeholder="Topik atau perihal pesan"
                error={errors.subjek}
                required
              />

              <TextArea
                label="Isi Pesan / Pertanyaan"
                name="pesan"
                value={formData.pesan}
                onChange={handleInputChange}
                placeholder="Tuliskan pesan Anda di sini secara detail..."
                error={errors.pesan}
                required
              />

              <div className="flex justify-end pt-2">
                <Button type="submit" variant="primary" loading={formLoading} icon={Send}>
                  Kirim Pesan
                </Button>
              </div>
            </form>
          </Card>

        </div>

      </div>
    </div>
  );
};
export default Kontak;
