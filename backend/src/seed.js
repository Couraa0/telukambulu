const fs = require('fs');
const path = require('path');
const { supabase } = require('./utils/supabase');

const DB_PATH = path.join(__dirname, '../data/db.json');

const run = async () => {
  console.log('\n🌱 Starting Supabase Seeding...\n');

  if (!fs.existsSync(DB_PATH)) {
    console.error('❌ Error: db.json file not found at:', DB_PATH);
    process.exit(1);
  }

  const raw = fs.readFileSync(DB_PATH, 'utf8');
  const db = JSON.parse(raw);

  // Helper function to seed a table
  const seedTable = async (tableName, dataArray, mapFn = (x) => x) => {
    console.log(`- Seeding table "${tableName}" with ${dataArray.length} items...`);
    
    // Clear table first
    const { error: clearError } = await supabase.from(tableName).delete().neq('id', 0);
    if (clearError) {
      console.warn(`⚠️ Warning while clearing table "${tableName}":`, clearError.message);
    }

    // Insert new records
    const mappedData = dataArray.map(mapFn);
    const { error: insertError } = await supabase.from(tableName).insert(mappedData);
    if (insertError) {
      console.error(`❌ Error seeding table "${tableName}":`, insertError.message);
    } else {
      console.log(`✅ Table "${tableName}" successfully seeded!`);
    }
  };

  try {
    // 1. users
    await seedTable('users', db.users);

    // 2. profil (single record)
    const p = db.profil;
    const mappedProfil = {
      id: 1,
      sejarah: p.sejarah,
      visi: p.visi,
      misi: p.misi,
      sambutan: p.sambutan,
      nama_kades: p.kepalaDesa.nama,
      foto_kades: p.kepalaDesa.foto,
      peta_wilayah: p.petaLink
    };
    await seedTable('profil', [mappedProfil]);

    // 3. kontak (single record)
    const k = db.kontak;
    const mappedKontak = {
      id: 1,
      alamat: k.alamat,
      telepon: k.telepon,
      email: k.email,
      jam_pelayanan: k.jamPelayanan,
      social_media: {
        ...k.socialMedia,
        whatsapp: k.whatsapp,
        layananAdministrasi: k.layananAdministrasi
      }
    };
    await seedTable('kontak', [mappedKontak]);

    // 4. demografi (single record)
    const d = db.demografi;
    const mappedDemografi = {
      id: 1,
      total_penduduk: d.gender.lakiLaki + d.gender.perempuan,
      kepala_keluarga: d.dusunList.reduce((acc, curr) => acc + curr.kk, 0),
      pria: d.gender.lakiLaki,
      wanita: d.gender.perempuan,
      pekerjaan: d.pekerjaan,
      pendidikan: d.pendidikan,
      usia: d.dusunList
    };
    await seedTable('demografi', [mappedDemografi]);

    // 5. statistik (single record)
    const mappedStatistik = {
      id: 1,
      berita: db.berita.length,
      pengumuman: db.pengumuman.length,
      umkm: db.produk.length,
      wisata: db.wisata.length,
      pengaduan_masuk: db.pengaduan.length,
      pengaduan_selesai: db.pengaduan.filter(x => x.status === 'Selesai').length
    };
    await seedTable('statistik', [mappedStatistik]);

    // 6. perangkat
    await seedTable('perangkat', db.perangkat);

    // 7. pengumuman
    await seedTable('pengumuman', db.pengumuman);

    // 8. berita
    await seedTable('berita', db.berita, (item) => ({
      id: item.id,
      judul: item.judul,
      ringkasan: item.ringkasan,
      isi: item.isi,
      kategori: item.kategori,
      foto: item.gambar,
      tanggal: item.tanggal,
      status: item.status,
      views: item.views,
      penulis: item.penulis
    }));

    // 9. sda
    await seedTable('sda', db.sda, (item) => ({
      id: item.id,
      nama: item.nama,
      kategori: item.kategori,
      foto: item.foto,
      deskripsi: item.deskripsi,
      potensi: item.potensi,
      satuan: item.manfaat
    }));

    // 10. produk
    await seedTable('produk', db.produk, (item) => ({
      id: item.id,
      nama: item.nama,
      deskripsi: item.deskripsi,
      harga: item.harga,
      penjual: item.penjual,
      kontak: item.kontak,
      foto: item.foto,
      kategori: item.kategori
    }));

    // 11. wisata
    await seedTable('wisata', db.wisata);

    // 12. pengaduan
    await seedTable('pengaduan', db.pengaduan, (item) => ({
      id: item.id,
      tiket: item.tiket,
      nama: item.nama,
      nik: item.nik,
      kontak: item.kontak,
      email: item.email,
      kategori: item.kategori,
      judul: item.judul,
      isi: item.isi,
      lokasi: item.lokasi,
      foto: item.foto,
      status: item.status,
      tanggal: item.tanggal,
      catatan_admin: item.catatanAdmin,
      timeline: item.timeline
    }));

    // 13. galeri
    await seedTable('galeri', db.galeri);

    console.log('\n✨ Database seeding completed successfully!\n');
  } catch (error) {
    console.error('❌ Seeding process failed:', error);
  }
};

run();
