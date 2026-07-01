const fs = require('fs');
const path = require('path');
const { supabase } = require('./utils/supabase');

const DB_PATH = path.join(__dirname, '../data/db.json');

// Helper function to download image and upload to Supabase Storage
const uploadImageToSupabase = async (url) => {
  if (!url || !url.startsWith('http')) return url;
  
  try {
    const u = new URL(url);
    let filename = path.basename(u.pathname);
    
    // Hashing filename to avoid collisions and clean up unsplash paths
    const crypto = require('crypto');
    if (!filename || filename.length < 5 || !filename.includes('.')) {
      const hash = crypto.createHash('md5').update(url).digest('hex');
      filename = `${hash}.jpg`;
    } else {
      const hash = crypto.createHash('md5').update(url).digest('hex').substring(0, 6);
      filename = `${hash}_${filename}`;
    }

    console.log(`  └─ Downloading & uploading image: ${filename}...`);

    const res = await fetch(url);
    if (!res.ok) throw new Error(`Fetch failed with status ${res.status}`);
    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { data, error } = await supabase.storage
      .from('images')
      .upload(filename, buffer, {
        contentType: res.headers.get('content-type') || 'image/jpeg',
        upsert: true
      });

    if (error) {
      console.warn(`  ⚠️ Failed to upload ${filename} to storage: ${error.message}`);
      return url; // fallback to original URL
    }

    // Construct public Supabase Storage URL
    const publicUrl = `https://pzfkmwmrkmculfxnhjuj.supabase.co/storage/v1/object/public/images/${filename}`;
    return publicUrl;
  } catch (err) {
    console.warn(`  ⚠️ Skip image upload for ${url} (using fallback):`, err.message);
    return url; // fallback to original URL
  }
};

const run = async () => {
  console.log('\n🌱 Starting Supabase Seeding with Storage Image Uploads...\n');

  if (!fs.existsSync(DB_PATH)) {
    console.error('❌ Error: db.json file not found at:', DB_PATH);
    process.exit(1);
  }

  const raw = fs.readFileSync(DB_PATH, 'utf8');
  const db = JSON.parse(raw);

  // Helper function to seed a table
  const seedTable = async (tableName, dataArray, mapFn = async (x) => x) => {
    console.log(`- Seeding table "${tableName}" with ${dataArray.length} items...`);
    
    // Clear table first
    const { error: clearError } = await supabase.from(tableName).delete().neq('id', 0);
    if (clearError) {
      console.warn(`⚠️ Warning while clearing table "${tableName}":`, clearError.message);
    }

    // Process & map data asynchronously
    const mappedData = [];
    for (const item of dataArray) {
      const mapped = await mapFn(item);
      mappedData.push(mapped);
    }

    // Insert new records
    const { error: insertError } = await supabase.from(tableName).insert(mappedData);
    if (insertError) {
      console.error(`❌ Error seeding table "${tableName}":`, insertError.message);
    } else {
      console.log(`✅ Table "${tableName}" successfully seeded!`);
    }
  };

  try {
    // 1. users
    const bcrypt = require('bcryptjs');
    console.log('- Preparing "users" passwords (hashing)...');
    await seedTable('users', db.users, async (user) => {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      return {
        ...user,
        password: hashedPassword
      };
    });

    // 2. profil (single record)
    console.log('- Preparing "profil" images...');
    const p = db.profil;
    const foto_kades = await uploadImageToSupabase(p.kepalaDesa?.foto);
    const foto_kantor = await uploadImageToSupabase(p.fotoKantor);
    const mappedProfil = {
      id: 1,
      sejarah: p.sejarah,
      visi: p.visi,
      misi: p.misi,
      sambutan: p.sambutan,
      nama_kades: p.kepalaDesa?.nama || '',
      foto_kades,
      periode_kades: p.kepalaDesa?.periode || '2020 - 2026',
      peta_wilayah: p.petaLink || '',
      foto_kantor
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
        facebook: k.socialMedia?.facebook || '',
        instagram: k.socialMedia?.instagram || '',
        youtube: k.socialMedia?.youtube || '',
        twitter: k.socialMedia?.twitter || '',
        whatsapp: k.whatsapp || '',
        mapsLink: k.mapsLink || '',
        layananAdministrasi: k.layananAdministrasi || []
      }
    };
    await seedTable('kontak', [mappedKontak]);

    // 4. demografi (single record)
    const d = db.demografi;
    const mappedDemografi = {
      id: 1,
      total_penduduk: (d.gender?.lakiLaki || 0) + (d.gender?.perempuan || 0),
      kepala_keluarga: Array.isArray(d.dusunList) ? d.dusunList.reduce((acc, curr) => acc + (curr.kk || 0), 0) : 0,
      pria: d.gender?.lakiLaki || 0,
      wanita: d.gender?.perempuan || 0,
      pekerjaan: d.pekerjaan || [],
      pendidikan: d.pendidikan || [],
      dusun_list: d.dusunList || []
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
    console.log('- Preparing "perangkat" images...');
    await seedTable('perangkat', db.perangkat, async (item) => {
      const foto = await uploadImageToSupabase(item.foto);
      return {
        id: item.id,
        nama: item.nama,
        jabatan: item.jabatan,
        foto,
        aktif: item.aktif !== undefined ? item.aktif : true
      };
    });

    // 7. pengumuman
    await seedTable('pengumuman', db.pengumuman);

    // 8. berita
    console.log('- Preparing "berita" images...');
    await seedTable('berita', db.berita, async (item) => {
      const foto = await uploadImageToSupabase(item.gambar);
      return {
        id: item.id,
        judul: item.judul,
        ringkasan: item.ringkasan,
        isi: item.isi,
        kategori: item.kategori,
        foto,
        tanggal: item.tanggal,
        status: item.status,
        views: item.views,
        penulis: item.penulis
      };
    });

    // 9. sda
    console.log('- Preparing "sda" images...');
    await seedTable('sda', db.sda, async (item) => {
      const foto = await uploadImageToSupabase(item.foto);
      return {
        id: item.id,
        nama: item.nama,
        kategori: item.kategori,
        foto,
        deskripsi: item.deskripsi,
        potensi: item.potensi,
        manfaat: item.manfaat,
        lokasi: item.lokasi
      };
    });

    // 10. produk
    console.log('- Preparing "produk" images...');
    await seedTable('produk', db.produk, async (item) => {
      const foto = await uploadImageToSupabase(item.foto);
      return {
        id: item.id,
        nama: item.nama,
        deskripsi: item.deskripsi,
        harga: item.harga,
        penjual: item.penjual,
        kontak: item.kontak,
        foto,
        kategori: item.kategori,
        stok: item.stok,
        lokasi: item.lokasi
      };
    });

    // 11. wisata
    console.log('- Preparing "wisata" images...');
    await seedTable('wisata', db.wisata, async (item) => {
      const foto = await uploadImageToSupabase(item.foto);
      const galeri = [];
      if (Array.isArray(item.galeri)) {
        for (const img of item.galeri) {
          const u = await uploadImageToSupabase(img);
          galeri.push(u);
        }
      } else {
        galeri.push(foto);
      }
      return {
        id: item.id,
        nama: item.nama,
        deskripsi: item.deskripsi,
        lokasi: item.lokasi,
        harga_tiket: item.tiket || item.harga_tiket || '0',
        foto,
        galeri,
        fasilitas: item.fasilitas || '',
        operasional: item.operasional || '',
        kontak: item.kontak || ''
      };
    });

    // 12. pengaduan
    console.log('- Preparing "pengaduan" images...');
    await seedTable('pengaduan', db.pengaduan, async (item) => {
      const foto = await uploadImageToSupabase(item.foto);
      return {
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
        foto,
        status: item.status,
        tanggal: item.tanggal,
        catatan_admin: item.catatanAdmin,
        timeline: item.timeline
      };
    });

    // 13. galeri
    console.log('- Preparing "galeri" images...');
    await seedTable('galeri', db.galeri, async (item) => {
      const foto = await uploadImageToSupabase(item.foto);
      return {
        id: item.id,
        judul: item.judul,
        deskripsi: item.deskripsi,
        foto,
        kategori: item.kategori,
        tanggal: item.tanggal
      };
    });

    console.log('\n✨ Database seeding completed successfully with Storage uploads!\n');
  } catch (error) {
    console.error('❌ Seeding process failed:', error);
  }
};

run();
