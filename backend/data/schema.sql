-- SCHEMA FOR DESA DIGITAL TELUKAMBULU DATABASE

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    nama VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    aktif BOOLEAN DEFAULT TRUE
);

-- 2. Profil Table
CREATE TABLE IF NOT EXISTS profil (
    id SERIAL PRIMARY KEY,
    sambutan TEXT,
    nama_kades VARCHAR(255),
    foto_kades TEXT,
    sejarah TEXT,
    visi TEXT,
    misi JSONB,
    peta_wilayah TEXT
);

-- 3. Kontak Table
CREATE TABLE IF NOT EXISTS kontak (
    id SERIAL PRIMARY KEY,
    alamat TEXT,
    telepon VARCHAR(50),
    email VARCHAR(100),
    jam_pelayanan VARCHAR(100),
    social_media JSONB
);

-- 4. Demografi Table
CREATE TABLE IF NOT EXISTS demografi (
    id SERIAL PRIMARY KEY,
    total_penduduk INTEGER DEFAULT 0,
    kepala_keluarga INTEGER DEFAULT 0,
    pria INTEGER DEFAULT 0,
    wanita INTEGER DEFAULT 0,
    pekerjaan JSONB,
    pendidikan JSONB,
    usia JSONB
);

-- 5. Statistik Table (Stored/cached counters)
CREATE TABLE IF NOT EXISTS statistik (
    id SERIAL PRIMARY KEY,
    berita INTEGER DEFAULT 0,
    pengumuman INTEGER DEFAULT 0,
    umkm INTEGER DEFAULT 0,
    wisata INTEGER DEFAULT 0,
    pengaduan_masuk INTEGER DEFAULT 0,
    pengaduan_selesai INTEGER DEFAULT 0
);

-- 6. Perangkat Table
CREATE TABLE IF NOT EXISTS perangkat (
    id SERIAL PRIMARY KEY,
    nama VARCHAR(255) NOT NULL,
    jabatan VARCHAR(255) NOT NULL,
    foto TEXT,
    aktif BOOLEAN DEFAULT TRUE
);

-- 7. Pengumuman Table
CREATE TABLE IF NOT EXISTS pengumuman (
    id SERIAL PRIMARY KEY,
    judul VARCHAR(255) NOT NULL,
    ringkasan TEXT,
    isi TEXT NOT NULL,
    kategori VARCHAR(100) NOT NULL,
    tanggal DATE DEFAULT CURRENT_DATE,
    penting BOOLEAN DEFAULT FALSE,
    status VARCHAR(50) DEFAULT 'publish',
    views INTEGER DEFAULT 0
);

-- 8. Berita Table
CREATE TABLE IF NOT EXISTS berita (
    id SERIAL PRIMARY KEY,
    judul VARCHAR(255) NOT NULL,
    ringkasan TEXT,
    isi TEXT NOT NULL,
    kategori VARCHAR(100) NOT NULL,
    foto TEXT,
    tanggal DATE DEFAULT CURRENT_DATE,
    status VARCHAR(50) DEFAULT 'publish',
    views INTEGER DEFAULT 0,
    penulis VARCHAR(255)
);

-- 9. Sumber Daya Alam (SDA) Table
CREATE TABLE IF NOT EXISTS sda (
    id SERIAL PRIMARY KEY,
    nama VARCHAR(255) NOT NULL,
    kategori VARCHAR(100) NOT NULL,
    potensi VARCHAR(255),
    deskripsi TEXT,
    foto TEXT,
    satuan VARCHAR(50)
);

-- 10. Produk UMKM Table
CREATE TABLE IF NOT EXISTS produk (
    id SERIAL PRIMARY KEY,
    nama VARCHAR(255) NOT NULL,
    deskripsi TEXT,
    harga VARCHAR(100) DEFAULT '0',
    penjual VARCHAR(255),
    kontak VARCHAR(50),
    foto TEXT,
    kategori VARCHAR(100)
);

-- 11. Wisata Table
CREATE TABLE IF NOT EXISTS wisata (
    id SERIAL PRIMARY KEY,
    nama VARCHAR(255) NOT NULL,
    deskripsi TEXT,
    lokasi TEXT,
    harga_tiket VARCHAR(100) DEFAULT '0',
    foto TEXT,
    galeri JSONB
);

-- 12. Pengaduan Table
CREATE TABLE IF NOT EXISTS pengaduan (
    id SERIAL PRIMARY KEY,
    tiket VARCHAR(50) UNIQUE NOT NULL,
    nama VARCHAR(255) NOT NULL,
    nik VARCHAR(20),
    kontak VARCHAR(50) NOT NULL,
    email VARCHAR(100),
    kategori VARCHAR(100) NOT NULL,
    judul VARCHAR(255) NOT NULL,
    isi TEXT NOT NULL,
    lokasi TEXT NOT NULL,
    foto TEXT,
    status VARCHAR(50) DEFAULT 'Menunggu',
    tanggal DATE DEFAULT CURRENT_DATE,
    catatan_admin TEXT DEFAULT '',
    timeline JSONB
);

-- 13. Galeri Table
CREATE TABLE IF NOT EXISTS galeri (
    id SERIAL PRIMARY KEY,
    judul VARCHAR(255) NOT NULL,
    deskripsi TEXT,
    foto TEXT,
    kategori VARCHAR(100) NOT NULL,
    tanggal DATE DEFAULT CURRENT_DATE
);
