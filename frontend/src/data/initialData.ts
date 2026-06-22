export interface KepalaDesa {
  nama: string;
  foto: string;
  periode: string;
}

export interface Profil {
  sejarah: string;
  visi: string;
  misi: string[];
  sambutan: string;
  kepalaDesa: KepalaDesa;
  petaPlaceholder: string;
  petaLink: string;
  fotoKantor: string;
}

export interface Statistik {
  penduduk: number;
  dusun: number;
  luasWilayah: number;
  umkm: number;
  wisata: number;
  pengaduanSelesai: number;
  [key: string]: number; // Allow dynamic addition
}

export interface Perangkat {
  id: number;
  nama: string;
  jabatan: string;
  foto: string;
}

export interface DusunDemografi {
  nama: string;
  rt: number;
  rw: number;
  kk: number;
  jiwa: number;
}

export interface DemografiItem {
  nama: string;
  jumlah: number;
}

export interface Demografi {
  dusunList: DusunDemografi[];
  pekerjaan: DemografiItem[];
  pendidikan: DemografiItem[];
  gender: {
    lakiLaki: number;
    perempuan: number;
  };
}

export interface Pengumuman {
  id: number;
  judul: string;
  ringkasan: string;
  isi: string;
  kategori: string;
  tanggal: string;
  penting: boolean;
  status: 'publish' | 'draft';
}

export interface Berita {
  id: number;
  judul: string;
  ringkasan: string;
  isi: string;
  kategori: string;
  gambar: string;
  penulis: string;
  tanggal: string;
  views: number;
  status: 'publish' | 'draft';
}

export interface SDA {
  id: number;
  nama: string;
  kategori: string;
  foto: string;
  deskripsi: string;
  lokasi: string;
  manfaat: string;
  potensi: string;
}

export interface Produk {
  id: number;
  nama: string;
  kategori: string;
  foto: string;
  deskripsi: string;
  harga: string;
  stok: string;
  penjual: string;
  kontak: string;
  lokasi: string;
}

export interface Wisata {
  id: number;
  nama: string;
  foto: string;
  deskripsi: string;
  lokasi: string;
  fasilitas: string;
  operasional: string;
  tiket: string;
  kontak: string;
  galeri: string[];
}

export interface TimelineEvent {
  tanggal: string;
  status: string;
  keterangan: string;
}

export interface Pengaduan {
  id: number;
  tiket: string;
  nama: string;
  nik?: string;
  kontak: string;
  email?: string;
  kategori: string;
  judul: string;
  isi: string;
  lokasi: string;
  foto?: string;
  status: 'Menunggu' | 'Diproses' | 'Selesai' | 'Ditolak';
  tanggal: string;
  catatanAdmin: string;
  timeline: TimelineEvent[];
}

export interface Galeri {
  id: number;
  judul: string;
  deskripsi: string;
  foto: string;
  kategori: string;
  tanggal: string;
}

export interface LayananAdmin {
  layanan: string;
  syarat: string;
}

export interface Kontak {
  alamat: string;
  telepon: string;
  whatsapp: string;
  email: string;
  jamPelayanan: string;
  mapsLink: string;
  socialMedia: {
    facebook: string;
    instagram: string;
    youtube: string;
    twitter: string;
  };
  layananAdministrasi: LayananAdmin[];
}

export interface UserAdmin {
  id: number;
  username: string;
  password?: string;
  nama: string;
  role: 'Super Admin' | 'Admin Konten' | 'Admin Pengaduan' | 'Admin Profil';
  aktif: boolean;
}

export interface DesaDatabase {
  profil: Profil;
  statistik: Statistik;
  perangkat: Perangkat[];
  demografi: Demografi;
  pengumuman: Pengumuman[];
  berita: Berita[];
  sda: SDA[];
  produk: Produk[];
  wisata: Wisata[];
  pengaduan: Pengaduan[];
  galeri: Galeri[];
  kontak: Kontak;
  users: UserAdmin[];
}

export const initialData: DesaDatabase = {
  "profil": {
    "sejarah": "Desa Telukambulu terletak di wilayah Kecamatan Batujaya, Kabupaten Karawang, Provinsi Jawa Barat. Nama Telukambulu berasal dari kata 'Teluk' yang berarti lekukan pantai/sungai dan 'Ambulu' yang merujuk pada jenis pohon bambu hutan atau air yang bergolak. Sejak zaman kerajaan Tarumanegara hingga kolonial Belanda, wilayah ini merupakan kawasan pertanian subur yang dialiri oleh cabang Sungai Citarum. Desa ini secara resmi berdiri mandiri pasca-kemerdekaan dan terus berkembang menjadi salah satu pusat lumbung padi dan pelestarian cagar budaya di Karawang Utara.",
    "visi": "Mewujudkan Desa Telukambulu yang Mandiri, Sejahtera, Transparan, dan Unggul dalam Sektor Pertanian serta Pariwisata Budaya Berlandaskan Gotong Royong.",
    "misi": [
      "Meningkatkan kualitas pelayanan publik berbasis digital yang cepat, ramah, dan bebas pungli.",
      "Mengoptimalkan produktivitas sektor pertanian melalui modernisasi irigasi dan pembinaan kelompok tani.",
      "Mengembangkan potensi desa wisata budaya di sekitar kawasan Candi Batujaya.",
      "Mendorong pertumbuhan UMKM lokal melalui pelatihan keterampilan dan digitalisasi pemasaran.",
      "Membangun infrastruktur desa yang merata, berkelanjutan, dan ramah lingkungan.",
      "Mewujudkan tata kelola pemerintahan desa yang bersih, transparan, dan akuntabel."
    ],
    "sambutan": "Sampurasun, Selamat datang di portal resmi Sistem Informasi Desa Digital Telukambulu. Kami berkomitmen untuk terus menghadirkan keterbukaan informasi publik dan mendekatkan layanan kepada masyarakat melalui platform digital ini. Melalui website ini, warga dapat dengan mudah mengakses berita desa, mengurus keperluan pengaduan, hingga menjelajahi potensi ekonomi kreatif dan wisata sejarah yang kami miliki. Mari bersama-sama membangun Telukambulu yang lebih maju dan sejahtera.",
    "kepalaDesa": {
      "nama": "H. Ahmad Saprudin, S.IP",
      "foto": "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=300",
      "periode": "2020 - 2026"
    },
    "petaPlaceholder": "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=800",
    "petaLink": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.8654271813134!2d107.1654497!3d-6.1487807!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f131!3m3!1m2!1s0x2e6a575b6a71e72b%3A0xc319efb0a7abcf73!2sTelukambulu%2C%20Kec.%20Batujaya%2C%20Karawang%2C%20Jawa%20Barat!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid",
    "fotoKantor": "https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&q=80&w=800"
  },
  "statistik": {
    "penduduk": 8450,
    "dusun": 4,
    "luasWilayah": 642.5,
    "umkm": 42,
    "wisata": 3,
    "pengaduanSelesai": 118
  },
  "perangkat": [
    {
      "id": 1,
      "nama": "H. Ahmad Saprudin, S.IP",
      "jabatan": "Kepala Desa",
      "foto": "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=300"
    },
    {
      "id": 2,
      "nama": "Mulyadi, S.E",
      "jabatan": "Sekretaris Desa",
      "foto": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=300"
    },
    {
      "id": 3,
      "nama": "Siti Aminah",
      "jabatan": "Kaur Keuangan",
      "foto": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300"
    },
    {
      "id": 4,
      "nama": "Kurniawan",
      "jabatan": "Kaur Pemerintahan",
      "foto": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=300"
    },
    {
      "id": 5,
      "nama": "Dedi Mulyono",
      "jabatan": "Kasi Kesejahteraan Rakyat",
      "foto": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300"
    },
    {
      "id": 6,
      "nama": "Neneng Hasanah",
      "jabatan": "Kaur Tata Usaha dan Umum",
      "foto": "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=300"
    }
  ],
  "demografi": {
    "dusunList": [
      { "nama": "Dusun Telukambulu I", "rt": 6, "rw": 2, "kk": 620, "jiwa": 2150 },
      { "nama": "Dusun Telukambulu II", "rt": 5, "rw": 2, "kk": 580, "jiwa": 1980 },
      { "nama": "Dusun Krajan", "rt": 7, "rw": 2, "kk": 680, "jiwa": 2350 },
      { "nama": "Dusun Rawasikut", "rt": 6, "rw": 2, "kk": 550, "jiwa": 1970 }
    ],
    "pekerjaan": [
      { "nama": "Petani", "jumlah": 2840 },
      { "nama": "Buruh Tani", "jumlah": 1950 },
      { "nama": "Karyawan Swasta", "jumlah": 980 },
      { "nama": "Wiraswasta / UMKM", "jumlah": 750 },
      { "nama": "PNS / TNI / Polri", "jumlah": 120 },
      { "nama": "Lainnya / Tidak Bekerja", "jumlah": 1810 }
    ],
    "pendidikan": [
      { "nama": "Tidak/Belum Sekolah", "jumlah": 1250 },
      { "nama": "SD / Sederajat", "jumlah": 3410 },
      { "nama": "SMP / Sederajat", "jumlah": 2180 },
      { "nama": "SMA / Sederajat", "jumlah": 1390 },
      { "nama": "Diploma (D1-D3)", "jumlah": 110 },
      { "nama": "Sarjana (S1-S3)", "jumlah": 110 }
    ],
    "gender": {
      "lakiLaki": 4290,
      "perempuan": 4160
    }
  },
  "pengumuman": [
    {
      "id": 1,
      "judul": "Penyaluran Bantuan Langsung Tunai (BLT) Tahap II Tahun 2026",
      "ringkasan": "Pengumuman jadwal pembagian BLT Dana Desa Tahap II bagi keluarga penerima manfaat di Kantor Desa.",
      "isi": "Diberitahukan kepada seluruh warga Desa Telukambulu yang terdaftar sebagai Penerima Manfaat BLT-DD Tahap II, bahwa penyaluran dana bantuan sebesar Rp 300.000,- akan dilaksanakan pada hari Rabu, 24 Juni 2026 mulai pukul 08.00 WIB s/d selesai bertempat di Aula Kantor Desa Telukambulu. Harap membawa KTP asli dan Kartu Keluarga (KK).",
      "kategori": "Bantuan Sosial",
      "tanggal": "2026-06-18",
      "penting": true,
      "status": "publish"
    },
    {
      "id": 2,
      "judul": "Kerja Bakti Massal Kebersihan Lingkungan dan Saluran Irigasi",
      "ringkasan": "Mengundang warga untuk berpartisipasi dalam pembersihan menyambut musim tanam gadu.",
      "isi": "Dalam rangka mengantisipasi genangan air dan memastikan kelancaran suplai air irigasi pertanian menghadapi musim tanam gadu, Pemerintah Desa mengundang seluruh RW/RT dan warga untuk bergotong royong membersihkan saluran air dan jalan desa pada hari Minggu, 21 Juni 2026 pukul 07.00 WIB. Titik kumpul berada di balai dusun masing-masing.",
      "kategori": "Kegiatan Warga",
      "tanggal": "2026-06-15",
      "penting": false,
      "status": "publish"
    },
    {
      "id": 3,
      "judul": "Pendaftaran Pelatihan Digital Marketing & E-Commerce Gratis bagi Pelaku UMKM",
      "ringkasan": "Pelatihan peningkatan omset UMKM desa melalui marketplace dan media sosial.",
      "isi": "Membuka pendaftaran program inkubasi UMKM Desa Telukambulu. Pelatihan akan dilaksanakan selama 3 hari pada awal Juli 2026. Diajarkan cara membuat akun toko online, cara memotret produk dengan HP, dan iklan media sosial. Pendaftaran di Kantor Desa atau via WA melalui Kaur Kesejahteraan Rakyat paling lambat 28 Juni 2026. Kuota terbatas 25 UMKM.",
      "kategori": "Pemberdayaan",
      "tanggal": "2026-06-12",
      "penting": true,
      "status": "publish"
    }
  ],
  "berita": [
    {
      "id": 1,
      "judul": "Kelompok Tani Desa Telukambulu Panen Raya Padi Unggul Varietas Inpari 32",
      "ringkasan": "Hasil panen raya padi di Telukambulu mencapai 7,8 ton per hektar, membawa angin segar bagi ketahanan pangan lokal.",
      "isi": "Kelompok Tani 'Subur Makmur' Desa Telukambulu hari ini melaksanakan panen raya padi varietas Inpari 32. Kegiatan panen raya ini dihadiri langsung oleh Kepala Dinas Pertanian Kabupaten Karawang beserta jajaran Muspika Batujaya. Kepala Desa Telukambulu menyatakan bahwa sistem pengairan teknis baru yang diperbaiki pada awal tahun sangat membantu meningkatkan produktivitas dari yang sebelumnya rata-rata 6,5 ton menjadi 7,8 ton per hektar. Panen ini diharapkan menjaga kestabilan ekonomi para petani di tengah fluktuasi harga gabah nasional.",
      "kategori": "Pertanian",
      "gambar": "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=800",
      "penulis": "Admin Konten",
      "tanggal": "2026-06-17",
      "views": 320,
      "status": "publish"
    },
    {
      "id": 2,
      "judul": "Pemerintah Desa Telukambulu Luncurkan Aplikasi Cek Pengaduan Online",
      "ringkasan": "Layanan transparansi baru diluncurkan untuk memantau keluhan warga secara real-time.",
      "isi": "Guna mewujudkan tata kelola desa yang bersih dan tanggap, Pemdes Telukambulu meluncurkan portal Sistem Informasi Desa Digital dengan fitur pelacakan pengaduan berbasis tiket (nomor ADU). Melalui sistem ini, warga tidak perlu lagi mendatangi balai desa hanya untuk menanyakan tindak lanjut laporan infrastruktur rusak atau sengketa lingkungan. Semua progres penanganan dicatat secara transparan oleh admin sektor dan dapat langsung diakses publik.",
      "kategori": "Pemerintahan",
      "gambar": "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=800",
      "penulis": "H. Ahmad Saprudin",
      "tanggal": "2026-06-16",
      "views": 185,
      "status": "publish"
    },
    {
      "id": 3,
      "judul": "Melihat Pesona Wisata Sejarah Candi Jiwa Batujaya yang Berlokasi Dekat Desa",
      "ringkasan": "Candi Budha tertua di Jawa Barat menjadi daya tarik utama wisatawan nusantara maupun mancanegara.",
      "isi": "Situs Cagar Budaya Candi Batujaya yang letaknya berbatasan langsung dengan Desa Telukambulu merupakan situs percandian Buddha tertua di Nusantara, diperkirakan berasal dari abad ke-2 hingga ke-4 Masehi pada masa Kerajaan Tarumanegara. Objek wisata ini menjadi magnet ekonomi baru bagi warga Telukambulu yang mulai berjualan kuliner, produk kerajinan bambu, dan penginapan homestay bagi pengunjung yang ingin meneliti arkeologi lokal.",
      "kategori": "Wisata",
      "gambar": "https://images.unsplash.com/photo-1608958416710-53bc1be1947b?auto=format&fit=crop&q=80&w=800",
      "penulis": "Admin Konten",
      "tanggal": "2026-06-10",
      "views": 540,
      "status": "publish"
    }
  ],
  "sda": [
    {
      "id": 1,
      "nama": "Hamparan Sawah Irigasi Teknis",
      "kategori": "Pertanian",
      "foto": "https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&q=80&w=600",
      "deskripsi": "Lahan persawahan seluas kurang lebih 450 hektar yang ditopang oleh saluran irigasi teknis bendung Citarum Utara.",
      "lokasi": "Seluruh wilayah utara, timur, dan barat Desa Telukambulu",
      "manfaat": "Sebagai lumbung gabah utama warga dengan intensitas tanam mencapai 2-3 kali setahun.",
      "potensi": "Peningkatan mekanisasi pertanian pasca panen dan pengolahan beras organik premium."
    },
    {
      "id": 2,
      "nama": "Aliran Sungai Cabang Citarum",
      "kategori": "Perairan",
      "foto": "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=600",
      "deskripsi": "Aliran anak sungai Citarum yang melintasi sepanjang batas timur desa Telukambulu, menyediakan debit air melimpah.",
      "lokasi": "Perbatasan sebelah Timur Desa Telukambulu",
      "manfaat": "Sumber pengairan irigasi pertanian, pembudidayaan ikan tawar keramba jaring apung, dan sanitasi umum.",
      "potensi": "Pengembangan budidaya air tawar modern dan wisata air susur sungai lokal."
    },
    {
      "id": 3,
      "nama": "Hutan Bambu Pinggiran Sungai",
      "kategori": "Kehutanan / Kebun",
      "foto": "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&q=80&w=600",
      "deskripsi": "Kawasan pohon bambu alami (bambu tali dan bambu petung) yang tumbuh subur di lereng lekukan sungai.",
      "lokasi": "Bantaran Sungai Dusun Rawasikut",
      "manfaat": "Sebagai penahan erosi alami bantaran sungai dan bahan baku industri anyaman bambu perajin desa.",
      "potensi": "Pengolahan arang bambu aktif dan kerajinan furnitur bambu artistik bernilai ekspor."
    }
  ],
  "produk": [
    {
      "id": 1,
      "nama": "Anyaman Bambu Tradisional Telukambulu",
      "kategori": "Kerajinan",
      "foto": "https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&q=80&w=600",
      "deskripsi": "Produk anyaman bambu berkualitas tinggi mulai dari besek ramah lingkungan, tudung saji, tampah hias, hingga tas fashion etnik.",
      "harga": "Rp 15.000 - Rp 120.000",
      "stok": "Tersedia (Pre-order untuk jumlah besar)",
      "penjual": "Kelompok Perajin Wanita 'Bambu Indah'",
      "kontak": "6281234567890",
      "lokasi": "Dusun Rawasikut RT 02/RW 04, Telukambulu"
    },
    {
      "id": 2,
      "nama": "Beras Merah Organik 'Cap Candi'",
      "kategori": "Kuliner / Bahan Pangan",
      "foto": "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=600",
      "deskripsi": "Beras merah organik tanpa pestisida kimia yang diproduksi langsung oleh Gabungan Kelompok Tani (Gapoktan) Telukambulu. Kaya serat, rendah gula, dan wangi.",
      "harga": "Rp 18.000 / kg",
      "stok": "150 kg",
      "penjual": "Gapoktan Subur Makmur",
      "kontak": "6289876543210",
      "lokasi": "Dusun Krajan RT 01/RW 03, Telukambulu"
    },
    {
      "id": 3,
      "nama": "Krupuk Gadung Renyah Khas Karawang",
      "kategori": "Makanan Ringan",
      "foto": "https://images.unsplash.com/photo-1599490659213-e2b9527b0876?auto=format&fit=crop&q=80&w=600",
      "deskripsi": "Keripik dari umbi gadung hutan yang diolah secara higienis melalui perendaman abu gosok tradisional untuk menghilangkan kadar racunnya, menghasilkan cemilan gurih renyah.",
      "harga": "Rp 12.000 / bungkus (250g)",
      "stok": "80 bungkus",
      "penjual": "Ibu Warsiah (KWT Sekarwangi)",
      "kontak": "6285678901234",
      "lokasi": "Dusun Telukambulu II RT 03/RW 02"
    }
  ],
  "wisata": [
    {
      "id": 1,
      "nama": "Situs Percandian Candi Jiwa Batujaya",
      "foto": "https://images.unsplash.com/photo-1608958416710-53bc1be1947b?auto=format&fit=crop&q=80&w=600",
      "deskripsi": "Struktur candi tertua di pulau Jawa yang terbuat dari bata merah dan diyakini dibangun pada masa kerajaan Tarumanegara. Berada di tengah persawahan yang hijau, menyuguhkan pemandangan magis kala matahari terbenam.",
      "lokasi": "Segaran dan Telukambulu, Batujaya",
      "fasilitas": "Pusat informasi, gazebo istirahat, warung kuliner warga, penyewaan sepeda, pemandu wisata lokal.",
      "operasional": "Setiap Hari, 08.00 - 17.00 WIB",
      "tiket": "Rp 5.000 (Retribusi kebersihan)",
      "kontak": "081299002233 (Pokdarwis Batujaya)",
      "galeri": [
        "https://images.unsplash.com/photo-1608958416710-53bc1be1947b?auto=format&fit=crop&q=80&w=600",
        "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&q=80&w=600"
      ]
    },
    {
      "id": 2,
      "nama": "Candi Blandongan Batujaya",
      "foto": "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=600",
      "deskripsi": "Candi Blandongan adalah salah satu candi utama dalam kompleks percandian Batujaya. Memiliki struktur persegi berukuran 24x24 meter dengan sisa tangga di keempat sisinya. Sangat bernilai arkeologi tinggi.",
      "lokasi": "Kawasan Percandian Batujaya (Perbatasan Segaran - Telukambulu)",
      "fasilitas": "Museum penyimpanan artefak, toilet umum, tempat parkir luas, jalur pejalan kaki.",
      "operasional": "Setiap Hari, 08.00 - 16.30 WIB",
      "tiket": "Rp 5.000",
      "kontak": "081299002233",
      "galeri": [
        "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=600",
        "https://images.unsplash.com/photo-1503177119275-0aa32b31d468?auto=format&fit=crop&q=80&w=600"
      ]
    },
    {
      "id": 3,
      "nama": "Taman Agro-Ekowisata Sawah Telukambulu",
      "foto": "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=600",
      "deskripsi": "Destinasi wisata buatan berupa jalur jembatan kayu di atas hamparan persawahan hijau, dilengkapi dengan spot swafoto instagramable, edukasi bercocok tanam padi, dan gazebo santai menikmati kuliner lokal.",
      "lokasi": "Dusun Krajan, Telukambulu",
      "fasilitas": "Jembatan kayu swafoto, gazebo kuliner, spot memancing ikan, warung kopi sawah, toilet.",
      "operasional": "Sabtu - Minggu, 07.00 - 18.00 WIB",
      "tiket": "Rp 3.000",
      "kontak": "085671122334 (Karang Taruna)",
      "galeri": [
        "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=600",
        "https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?auto=format&fit=crop&q=80&w=600"
      ]
    }
  ],
  "pengaduan": [
    {
      "id": 1,
      "tiket": "ADU-2026-0001",
      "nama": "Supriyadi",
      "nik": "3215112203870002",
      "kontak": "081299998888",
      "email": "supri@mail.com",
      "kategori": "Infrastruktur",
      "judul": "Jalan Penghubung Dusun Krajan Rusak Parah",
      "isi": "Melaporkan bahwa jalan utama penghubung Dusun Krajan dengan Desa Segaran aspalnya sudah mengelupas dan banyak lubang sedalam 15cm yang sering menimbulkan genangan banjir jika hujan turun. Sangat membahayakan pengendara motor yang lewat di malam hari karena minim penerangan.",
      "lokasi": "Jalan Raya Dusun Krajan RT 02/RW 03 dekat jembatan air",
      "foto": "https://images.unsplash.com/photo-1515162305285-0293e4767cc2?auto=format&fit=crop&q=80&w=600",
      "status": "Selesai",
      "tanggal": "2026-06-15",
      "catatanAdmin": "Jalan telah diperbaiki menggunakan dana desa anggaran triwulan II. Proses penambalan selesai pada 18 Juni 2026.",
      "timeline": [
        { "tanggal": "2026-06-15", "status": "Menunggu", "keterangan": "Aduan warga berhasil diterima oleh sistem pengaduan desa." },
        { "tanggal": "2026-06-16", "status": "Diproses", "keterangan": "Laporan diteruskan ke Dinas Pekerjaan Umum Desa dan diverifikasi lapangan oleh Kepala Dusun." },
        { "tanggal": "2026-06-18", "status": "Selesai", "keterangan": "Penambalan aspal selesai dikerjakan bersama warga secara gotong royong." }
      ]
    },
    {
      "id": 2,
      "tiket": "ADU-2026-0002",
      "nama": "Kurnia Sandi",
      "nik": "3215110408990001",
      "kontak": "085611122233",
      "email": "kurnia@mail.com",
      "kategori": "Lingkungan",
      "judul": "Tumpukan Sampah Liar di Bantaran Irigasi Rawasikut",
      "isi": "Ada beberapa oknum pembuang sampah liar yang menumpuk sampah plastik di tepi saluran irigasi. Akibatnya bau tidak sedap dan menyumbat pintu air persawahan. Mohon segera dipasang plang larangan membuang sampah.",
      "lokasi": "Bantaran Saluran Air Rawasikut RT 03/RW 04",
      "foto": "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&q=80&w=600",
      "status": "Diproses",
      "tanggal": "2026-06-18",
      "catatanAdmin": "Petugas kebersihan desa sedang menjadwalkan pengangkutan sampah besar-besaran bersama Karang Taruna pada hari Minggu besok.",
      "timeline": [
        { "tanggal": "2026-06-18", "status": "Menunggu", "keterangan": "Pengaduan masuk ke antrean administrator." },
        { "tanggal": "2026-06-19", "status": "Diproses", "keterangan": "Disetujui untuk penanganan kebersihan kerja bakti dan penyediaan bak sampah permanen di lokasi." }
      ]
    }
  ],
  "galeri": [
    {
      "id": 1,
      "judul": "Musyawarah Perencanaan Pembangunan Desa (Musrenbangdes) 2026",
      "deskripsi": "Rapat kerja membahas pengusulan pembangunan desa untuk tahun anggaran berikutnya bersama tokoh masyarakat, RT/RW, dan BPD.",
      "foto": "https://images.unsplash.com/photo-1544531586-fde5298cdd40?auto=format&fit=crop&q=80&w=600",
      "kategori": "Pemerintahan",
      "tanggal": "2026-05-12"
    },
    {
      "id": 2,
      "judul": "Penyaluran Imunisasi Balita Posyandu Melati 03",
      "deskripsi": "Kegiatan bulanan pemeriksaan kesehatan, pemberian vitamin A, dan vaksinasi balita oleh bidan desa.",
      "foto": "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=600",
      "kategori": "Kesehatan",
      "tanggal": "2026-06-05"
    },
    {
      "id": 3,
      "judul": "Pesta Rakyat dan Syukuran Bumi Petani Telukambulu",
      "deskripsi": "Tradisi tahunan sedekah bumi sebagai wujud syukur atas hasil panen raya padi melimpah.",
      "foto": "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&q=80&w=600",
      "kategori": "Sosial Budaya",
      "tanggal": "2026-06-12"
    },
    {
      "id": 4,
      "judul": "Pelatihan Pembuatan Kerajinan Bambu Kreatif",
      "deskripsi": "Pemberdayaan ibu-ibu rumah tangga untuk meningkatkan pendapatan melalui anyaman bambu bernilai jual.",
      "foto": "https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&q=80&w=600",
      "kategori": "Pemberdayaan",
      "tanggal": "2026-06-14"
    }
  ],
  "kontak": {
    "alamat": "Jl. Raya Batujaya No. 12, Desa Telukambulu, Kecamatan Batujaya, Kabupaten Karawang, Jawa Barat 41354",
    "telepon": "(0267) 841234",
    "whatsapp": "6281234567890",
    "email": "info@telukambulu.desa.id",
    "jamPelayanan": "Senin - Jumat, pukul 08:00 - 15:30 WIB",
    "mapsLink": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.8654271813134!2d107.1654497!3d-6.1487807!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f131!3m3!1m2!1s0x2e6a575b6a71e72b%3A0xc319efb0a7abcf73!2sTelukambulu%2C%20Kec.%20Batujaya%2C%20Karawang%2C%20Jawa%20Barat!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid",
    "socialMedia": {
      "facebook": "https://facebook.com/desatelukambulu",
      "instagram": "https://instagram.com/desatelukambulu",
      "youtube": "https://youtube.com/@desatelukambulu",
      "twitter": "https://twitter.com/desatelukambulu"
    },
    "layananAdministrasi": [
      { "layanan": "Pembuatan Kartu Keluarga (KK) Baru / Perubahan", "syarat": "KK lama, surat pengantar RT/RW, fotokopi buku nikah/akta cerai." },
      { "layanan": "Surat Keterangan Usaha (SKU)", "syarat": "KTP, KK, surat pengantar RT/RW, foto tempat/kegiatan usaha." },
      { "layanan": "Surat Keterangan Tidak Mampu (SKTM)", "syarat": "KTP, KK, surat pengantar RT/RW, surat pernyataan tidak mampu bermaterai." },
      { "layanan": "Surat Keterangan Domisili", "syarat": "KTP, KK, surat pengantar RT/RW." },
      { "layanan": "Surat Keterangan Kematian / Kelahiran", "syarat": "Surat keterangan dari rumah sakit/bidan, KTP pelapor, KK." }
    ]
  },
  "users": [
    {
      "id": 1,
      "username": "superadmin",
      "password": "admin123",
      "nama": "Bapak H. Ahmad (Kades)",
      "role": "Super Admin",
      "aktif": true
    },
    {
      "id": 2,
      "username": "konten",
      "password": "konten123",
      "nama": "Mulyadi (Sekdes)",
      "role": "Admin Konten",
      "aktif": true
    },
    {
      "id": 3,
      "username": "pengaduan",
      "password": "adu123",
      "nama": "Kurniawan (Kaur Pemerintah)",
      "role": "Admin Pengaduan",
      "aktif": true
    },
    {
      "id": 4,
      "username": "profil",
      "password": "profil123",
      "nama": "Siti Aminah (Kaur Keuangan)",
      "role": "Admin Profil",
      "aktif": true
    }
  ]
};
