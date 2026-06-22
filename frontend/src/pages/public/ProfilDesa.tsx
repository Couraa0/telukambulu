import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Profil, Perangkat, Demografi } from '../../data/initialData';
import SectionTitle from '../../components/common/SectionTitle';
import Card from '../../components/common/Card';
import Breadcrumb from '../../components/common/Breadcrumb';
import Skeleton from '../../components/common/Skeleton';
import { useSEO } from '../../hooks/useSEO';
import { MapPin, Users, School, Briefcase, Eye } from 'lucide-react';

export const ProfilDesa: React.FC = () => {
  useSEO({
    title: 'Profil & Sejarah Desa Telukambulu',
    description: 'Pelajari sejarah singkat, visi misi pembangunan, struktur organisasi aparatur pemerintahan, dan informasi demografi kependudukan Desa Telukambulu, Karawang.',
    keywords: 'Profil Desa, Sejarah Telukambulu, Visi Misi Desa, Aparatur Telukambulu, Demografi Karawang'
  });

  const [profil, setProfil] = useState<Profil | null>(null);
  const [perangkat, setPerangkat] = useState<Perangkat[]>([]);
  const [demografi, setDemografi] = useState<Demografi | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pData, perData, dData] = await Promise.all([
          api.getProfil(),
          api.getPerangkat(),
          api.getDemografi(),
        ]);
        setProfil(pData);
        setPerangkat(perData);
        setDemografi(dData);
      } catch (err) {
        console.error('Failed to load profile data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Calculate total KK and population from dusun list
  const totalKK = demografi?.dusunList?.reduce((acc, d) => acc + d.kk, 0) || 0;
  const totalJiwa = demografi?.dusunList?.reduce((acc, d) => acc + d.jiwa, 0) || 0;

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 font-sans">
      <Breadcrumb items={[{ label: 'Profil Desa' }]} />
      
      {/* 1. Header & Sejarah */}
      <section className="mb-16">
        <SectionTitle title="Profil Desa Telukambulu" subtitle="Kecamatan Batujaya, Kabupaten Karawang, Jawa Barat" />
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8">
            <Card>
              <h3 className="text-lg font-bold mb-4 text-slate-850 dark:text-white font-sans">Sejarah Singkat</h3>
              {loading ? (
                <Skeleton variant="text" count={2} />
              ) : (
                <>
                  <p className="text-sm sm:text-base text-slate-655 dark:text-slate-350 leading-relaxed mb-4">
                    {profil?.sejarah}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                    Kondisi geografis yang diapit sungai Citarum Utara menjadikan tanah di desa ini sangat cocok untuk budidaya padi. Hal ini menjadikan Telukambulu memiliki andil besar dalam penopang kedaulatan pangan regional Karawang Utara.
                  </p>
                </>
              )}
            </Card>
          </div>
          <div className="lg:col-span-4">
            <Card noPadding className="overflow-hidden shadow-md">
              {loading ? (
                <div className="h-56 bg-slate-200 dark:bg-emerald-950/20 animate-pulse" />
              ) : (
                <img
                  src={profil?.fotoKantor || "https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&q=80&w=400"}
                  alt="Kantor Desa Telukambulu"
                  className="w-full h-56 object-cover bg-slate-100"
                />
              )}
              <div className="p-5">
                <h4 className="text-sm font-bold text-slate-800 dark:text-white mb-2">Kantor Kepala Desa</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Pusat administrasi, rapat pembangunan (Musrenbangdes), dan koordinasi pelayanan masyarakat Desa Telukambulu.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* 2. Visi & Misi */}
      <section className="mb-16 bg-slate-100 dark:bg-slate-900/40 p-8 sm:p-12 rounded-3xl">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-sans">Visi & Misi Desa</h3>
          <div className="h-1.5 w-12 bg-primary-600 rounded-full mx-auto mt-3"></div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Visi */}
          <div>
            <Card className="h-full border-l-4 border-l-primary-600">
              <h4 className="text-xs uppercase font-bold text-primary-600 dark:text-primary-400 tracking-widest mb-3">
                VISI UTAMA
              </h4>
              {loading ? (
                <Skeleton variant="text" count={1} />
              ) : (
                <p className="text-lg font-bold text-slate-880 dark:text-white leading-relaxed italic font-sans">
                  "{profil?.visi}"
                </p>
              )}
            </Card>
          </div>
          {/* Misi */}
          <div>
            <Card className="h-full">
              <h4 className="text-xs uppercase font-bold text-secondary-655 dark:text-secondary-400 tracking-widest mb-4">
                MISI PEMBANGUNAN
              </h4>
              {loading ? (
                <Skeleton variant="text" count={1} />
              ) : (
                <ul className="flex flex-col gap-3.5 text-sm text-slate-655 dark:text-slate-350">
                  {profil?.misi?.map((item, index) => (
                    <li key={index} className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-950/40 text-primary-750 dark:text-primary-450 font-bold text-xs flex items-center justify-center">
                        {index + 1}
                      </span>
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          </div>
        </div>
      </section>

      {/* 3. Aparatur Pemerintahan */}
      <section className="mb-16">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-sans">Aparatur Pemerintahan Desa</h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">Daftar perangkat desa pelayan publik Desa Telukambulu</p>
          <div className="h-1.5 w-12 bg-primary-600 rounded-full mx-auto mt-3"></div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5">
          {loading ? (
            <Skeleton variant="card" count={6} />
          ) : (
            perangkat.map((item) => (
              <Card key={item.id} hoverEffect noPadding className="flex flex-col overflow-hidden text-center">
                <img
                  src={
                    item.foto && !item.foto.includes('unsplash.com/photo-1560250097-0b93528c311a')
                      ? item.foto
                      : "/assets/images/kepala-desa.png"
                  }
                  alt={item.nama}
                  className="w-full h-44 object-cover bg-slate-100"
                />
                <div className="p-3">
                  <h5 className="text-xs sm:text-sm font-bold text-slate-850 dark:text-white leading-tight truncate" title={item.nama}>
                    {item.nama}
                  </h5>
                  <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-wider">{item.jabatan}</p>
                </div>
              </Card>
            ))
          )}
        </div>
      </section>

      {/* 4. Demografi & Geografi */}
      <section className="mb-16">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-sans">Demografi & Wilayah Desa</h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">Data kependudukan, wilayah administratif, dan infografis mata pencaharian warga.</p>
          <div className="h-1.5 w-12 bg-primary-600 rounded-full mx-auto mt-3"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Dusun Table */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <Card>
              <h4 className="text-sm font-bold text-slate-850 dark:text-white mb-4 flex items-center gap-2 font-sans">
                <MapPin size={18} className="text-primary-500" />
                Data Administratif Wilayah Dusun
              </h4>
              <div className="overflow-x-auto">
                {loading ? (
                  <Skeleton variant="list" count={1} />
                ) : (
                  <table className="min-w-full text-left text-xs sm:text-sm">
                    <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-100 dark:border-slate-800">
                      <tr>
                        <th className="px-4 py-3">Nama Dusun</th>
                        <th className="px-4 py-3 text-center">Jumlah RT</th>
                        <th className="px-4 py-3 text-center">Jumlah RW</th>
                        <th className="px-4 py-3 text-center">Jumlah KK</th>
                        <th className="px-4 py-3 text-center">Jumlah Jiwa</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {demografi?.dusunList?.map((dusun, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/50 transition-colors">
                          <td className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-300">{dusun.nama}</td>
                          <td className="px-4 py-3 text-center">{dusun.rt}</td>
                          <td className="px-4 py-3 text-center">{dusun.rw}</td>
                          <td className="px-4 py-3 text-center">{dusun.kk}</td>
                          <td className="px-4 py-3 text-center font-bold text-slate-880 dark:text-white">{dusun.jiwa}</td>
                        </tr>
                      ))}
                      <tr className="bg-slate-55 dark:bg-slate-900 font-bold border-t-2 border-slate-200 dark:border-slate-800">
                        <td className="px-4 py-3 text-slate-800 dark:text-white">TOTAL</td>
                        <td className="px-4 py-3 text-center">{demografi?.dusunList?.reduce((acc, d) => acc + d.rt, 0)}</td>
                        <td className="px-4 py-3 text-center">{demografi?.dusunList?.reduce((acc, d) => acc + d.rw, 0)}</td>
                        <td className="px-4 py-3 text-center">{totalKK}</td>
                        <td className="px-4 py-3 text-center text-primary-600 dark:text-primary-400">{totalJiwa}</td>
                      </tr>
                    </tbody>
                  </table>
                )}
              </div>
            </Card>

            {/* Demographics details grids */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Pekerjaan */}
              <Card>
                <h4 className="text-sm font-bold text-slate-850 dark:text-white mb-4 flex items-center gap-2 font-sans">
                  <Briefcase size={18} className="text-secondary-500" />
                  Mata Pencaharian Utama
                </h4>
                <div className="flex flex-col gap-3">
                  {loading ? (
                    <Skeleton variant="text" count={1} />
                  ) : (
                    demografi?.pekerjaan?.map((item, idx) => {
                      const pct = totalJiwa > 0 ? ((item.jumlah / totalJiwa) * 100).toFixed(1) : '0';
                      return (
                        <div key={idx} className="text-xs">
                          <div className="flex justify-between text-slate-600 dark:text-slate-400 font-semibold mb-1">
                            <span>{item.nama}</span>
                            <span>{item.jumlah} Jiwa ({pct}%)</span>
                          </div>
                          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                            <div className="bg-secondary-500 h-full rounded-full" style={{ width: `${pct}%` }}></div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </Card>

              {/* Pendidikan */}
              <Card>
                <h4 className="text-sm font-bold text-slate-850 dark:text-white mb-4 flex items-center gap-2 font-sans">
                  <School size={18} className="text-accent-500" />
                  Tingkat Pendidikan
                </h4>
                <div className="flex flex-col gap-3">
                  {loading ? (
                    <Skeleton variant="text" count={1} />
                  ) : (
                    demografi?.pendidikan?.map((item, idx) => {
                      const pct = totalJiwa > 0 ? ((item.jumlah / totalJiwa) * 100).toFixed(1) : '0';
                      return (
                        <div key={idx} className="text-xs">
                          <div className="flex justify-between text-slate-600 dark:text-slate-400 font-semibold mb-1">
                            <span>{item.nama}</span>
                            <span>{item.jumlah} Jiwa ({pct}%)</span>
                          </div>
                          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                            <div className="bg-accent-500 h-full rounded-full" style={{ width: `${pct}%` }}></div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </Card>

            </div>
          </div>

          {/* Map & Gender ratio */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            
            {/* Gender Ratio */}
            <Card className="text-center">
              <h4 className="text-sm font-bold text-slate-850 dark:text-white mb-4 flex items-center justify-center gap-2 font-sans">
                <Users size={18} className="text-primary-500" />
                Rasio Jenis Kelamin
              </h4>
              {loading ? (
                <Skeleton variant="text" count={1} />
              ) : (
                <>
                  <div className="flex items-center justify-center gap-8 py-2">
                    <div className="flex flex-col items-center">
                      <span className="text-2xl font-black text-secondary-500">
                        {demografi?.gender.lakiLaki}
                      </span>
                      <span className="text-[10px] text-slate-400 font-bold uppercase mt-1">Laki-Laki</span>
                    </div>
                    <div className="h-10 w-[1px] bg-slate-200 dark:bg-slate-800"></div>
                    <div className="flex flex-col items-center">
                      <span className="text-2xl font-black text-rose-500">
                        {demografi?.gender.perempuan}
                      </span>
                      <span className="text-[10px] text-slate-400 font-bold uppercase mt-1">Perempuan</span>
                    </div>
                  </div>
                  {/* Ratio bar */}
                  <div className="w-full h-3.5 bg-rose-500 rounded-full overflow-hidden flex mt-4 shadow-inner">
                    <div
                      className="bg-secondary-500 h-full"
                      style={{
                        width: `${
                          demografi ? (demografi.gender.lakiLaki / (demografi.gender.lakiLaki + demografi.gender.perempuan)) * 100 : 50
                        }%`,
                      }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-[9px] font-bold text-slate-400 uppercase mt-1">
                    <span>
                      {demografi
                        ? ((demografi.gender.lakiLaki / (demografi.gender.lakiLaki + demografi.gender.perempuan)) * 100).toFixed(0)
                        : 50}
                      % Laki-laki
                    </span>
                    <span>
                      {demografi
                        ? ((demografi.gender.perempuan / (demografi.gender.lakiLaki + demografi.gender.perempuan)) * 100).toFixed(0)
                        : 50}
                      % Perempuan
                    </span>
                  </div>
                </>
              )}
            </Card>

            {/* Geographic Maps Link */}
            <Card noPadding className="overflow-hidden h-72 relative">
              {loading ? (
                <div className="w-full h-full bg-slate-200 dark:bg-emerald-950/20 animate-pulse" />
              ) : (
                <iframe
                  title="Peta Wilayah Telukambulu"
                  src={profil?.petaLink}
                  className="w-full h-full border-none"
                  allowFullScreen={false}
                  loading="lazy"
                ></iframe>
              )}
            </Card>

          </div>

        </div>
      </section>

    </div>
  );
};
export default ProfilDesa;
