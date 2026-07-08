const express = require('express');
const cors = require('cors');
const multer = require('multer');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const bcrypt = require('bcryptjs');
const { supabase } = require('./utils/supabase');

const getNextId = async (tableName) => {
  const { data, error } = await supabase
    .from(tableName)
    .select('id')
    .order('id', { ascending: false })
    .limit(1);
  if (error || !data || data.length === 0) {
    return 1;
  }
  return data[0].id + 1;
};


const app = express();
const PORT = process.env.PORT || 5000;

// Enable proxy trust for accurate rate limiting behind reverse proxies (Vercel, Heroku, etc.)
app.set('trust proxy', 1);

// Enable Helmet for security headers
app.use(helmet());

// Configure CORS with production origin restriction
const envOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(',').map(o => o.trim())
  : [];

const allowedOrigins = [
  ...envOrigins,
  'https://www.telukambulu.com',
  'https://telukambulu.com',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
  'http://localhost:5000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5000'
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, postman)
    if (!origin) return callback(null, true);
    
    // In development mode, allow all origins
    if (process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    } else {
      console.warn(`[CORS Blocked] Origin "${origin}" is not in the allowed list:`, allowedOrigins);
      return callback(new Error('Blocked by CORS policy'));
    }
  },
  credentials: true
}));

app.use(express.json());

// Global rate limiter (15 minutes, max 200 requests)
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Terlalu banyak permintaan dari IP ini, silakan coba lagi setelah 15 menit.'
  }
});
app.use('/api/', globalLimiter);

// Specific rate limiters for login and complaint submission
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Terlalu banyak percobaan login. Silakan coba lagi setelah 15 menit.'
  }
});

const complaintLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Batas pengajuan pengaduan terlampaui. Anda hanya dapat mengirim 5 pengaduan per jam.'
  }
});

// Logger middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Root / Home endpoints
app.get('/', (req, res) => {
  res.json({
    message: "Welcome to Desa Digital Telukambulu API",
    status: "active"
  });
});

app.get('/api', (req, res) => {
  res.json({
    message: "Desa Digital Telukambulu API Endpoint",
    status: "active"
  });
});

// Configure Multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// ==================== UPLOAD API ====================
app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Tidak ada berkas yang diunggah.' });
    }

    const file = req.file;
    
    // Validate mime-type (only images)
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return res.status(400).json({
        success: false,
        message: 'Format berkas tidak didukung. Hanya gambar (JPEG, PNG, WEBP, GIF) yang diperbolehkan.'
      });
    }

    // Validate extension
    const fileExt = file.originalname.split('.').pop().toLowerCase();
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
    if (!allowedExtensions.includes(fileExt)) {
      return res.status(400).json({
        success: false,
        message: 'Ekstensi berkas tidak valid. Hanya gambar yang diperbolehkan.'
      });
    }

    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;

    console.log(`Uploading file ${fileName} to Supabase storage bucket 'images'...`);

    const { data, error } = await supabase.storage
      .from('images')
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        upsert: true
      });

    if (error) throw error;

    const { data: publicData } = supabase.storage.from('images').getPublicUrl(fileName);
    const publicUrl = publicData.publicUrl;

    res.json({
      success: true,
      message: 'Berkas berhasil diunggah.',
      url: publicUrl
    });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ==================== AUTH API ====================
app.post('/api/auth/login', authLimiter, async (req, res) => {
  const { username, password } = req.body;
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .maybeSingle();

    if (error) throw error;
    if (!user) {
      return res.status(401).json({ success: false, message: 'Username atau password salah.' });
    }

    // Compare hashed password using bcrypt
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Username atau password salah.' });
    }

    if (!user.aktif) {
      return res.status(403).json({ success: false, message: 'Akun Anda telah dinonaktifkan oleh Super Admin.' });
    }

    const userData = {
      id: user.id,
      username: user.username,
      nama: user.nama,
      role: user.role,
      aktif: user.aktif
    };

    res.json({ success: true, message: 'Login berhasil.', user: userData });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ==================== PROFIL & KONTAK API ====================
app.get('/api/profil', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('profil')
      .select('*')
      .eq('id', 1)
      .single();

    if (error) throw error;

    let petaLink = data.peta_wilayah || '';
    let petaPlaceholder = '';
    let logo = '';
    let gambarSplash = '';
    if (petaLink.trim().startsWith('{')) {
      try {
        const parsed = JSON.parse(petaLink);
        petaLink = parsed.petaLink || '';
        petaPlaceholder = parsed.petaPlaceholder || '';
        logo = parsed.logo || '';
        gambarSplash = parsed.gambarSplash || '';
      } catch (e) {
        console.error('Failed to parse peta_wilayah JSON:', e);
      }
    }

    res.json({
      sejarah: data.sejarah,
      visi: data.visi,
      misi: data.misi,
      sambutan: data.sambutan,
      kepalaDesa: {
        nama: data.nama_kades,
        foto: data.foto_kades,
        periode: data.periode_kades
      },
      petaLink,
      petaPlaceholder,
      logo,
      gambarSplash,
      fotoKantor: data.foto_kantor
    });
  } catch (err) {
    console.error('Error fetching profil:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

app.put('/api/profil', async (req, res) => {
  try {
    const p = req.body;
    let peta_wilayah = p.petaLink || '';
    if (p.petaPlaceholder || p.logo || p.gambarSplash || p.petaLink) {
      peta_wilayah = JSON.stringify({
        petaLink: p.petaLink || '',
        petaPlaceholder: p.petaPlaceholder || '',
        logo: p.logo || '',
        gambarSplash: p.gambarSplash || ''
      });
    }

    const updateData = {
      sejarah: p.sejarah,
      visi: p.visi,
      misi: p.misi,
      sambutan: p.sambutan,
      nama_kades: p.kepalaDesa?.nama,
      foto_kades: p.kepalaDesa?.foto,
      periode_kades: p.kepalaDesa?.periode,
      peta_wilayah,
      foto_kantor: p.fotoKantor
    };

    const { data, error } = await supabase
      .from('profil')
      .update(updateData)
      .eq('id', 1)
      .select()
      .single();

    if (error) throw error;

    let responsePetaLink = data.peta_wilayah || '';
    let responsePetaPlaceholder = '';
    let responseLogo = '';
    let responseGambarSplash = '';
    if (responsePetaLink.trim().startsWith('{')) {
      try {
        const parsed = JSON.parse(responsePetaLink);
        responsePetaLink = parsed.petaLink || '';
        responsePetaPlaceholder = parsed.petaPlaceholder || '';
        responseLogo = parsed.logo || '';
        responseGambarSplash = parsed.gambarSplash || '';
      } catch (e) {
        console.error('Failed to parse response peta_wilayah JSON:', e);
      }
    }

    res.json({
      success: true,
      message: 'Profil desa berhasil diperbarui.',
      data: {
        sejarah: data.sejarah,
        visi: data.visi,
        misi: data.misi,
        sambutan: data.sambutan,
        kepalaDesa: {
          nama: data.nama_kades,
          foto: data.foto_kades,
          periode: data.periode_kades
        },
        petaLink: responsePetaLink,
        petaPlaceholder: responsePetaPlaceholder,
        logo: responseLogo,
        gambarSplash: responseGambarSplash,
        fotoKantor: data.foto_kantor
      }
    });
  } catch (err) {
    console.error('Error updating profil:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get('/api/statistik', async (req, res) => {
  try {
    const { data: stats, error: statsError } = await supabase
      .from('statistik')
      .select('*')
      .eq('id', 1)
      .single();

    const { data: demo, error: demoError } = await supabase
      .from('demografi')
      .select('total_penduduk, dusun_list')
      .eq('id', 1)
      .single();

    if (statsError) throw statsError;
    if (demoError) throw demoError;

    res.json({
      penduduk: demo.total_penduduk || 8450,
      dusun: Array.isArray(demo.dusun_list) ? demo.dusun_list.length : 4,
      luasWilayah: 642.5,
      umkm: stats.umkm || 0,
      wisata: stats.wisata || 0,
      pengaduanSelesai: stats.pengaduan_selesai || 0
    });
  } catch (err) {
    console.error('Error fetching statistik:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get('/api/perangkat', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('perangkat')
      .select('*')
      .order('id', { ascending: true });

    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error('Error fetching perangkat:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Manage Perangkat Desa
app.post('/api/perangkat', async (req, res) => {
  try {
    const id = await getNextId('perangkat');
    const { data, error } = await supabase
      .from('perangkat')
      .insert({ ...req.body, id })
      .select()
      .single();

    if (error) throw error;
    res.status(201).json({ success: true, message: 'Perangkat desa berhasil ditambahkan.', data });
  } catch (err) {
    console.error('Error creating perangkat:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

app.put('/api/perangkat/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('perangkat')
      .update(req.body)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    res.json({ success: true, message: 'Data perangkat berhasil diperbarui.', data });
  } catch (err) {
    console.error('Error updating perangkat:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

app.delete('/api/perangkat/:id', async (req, res) => {
  try {
    const { error } = await supabase
      .from('perangkat')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;
    res.json({ success: true, message: 'Data perangkat berhasil dihapus.' });
  } catch (err) {
    console.error('Error deleting perangkat:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Demografi
app.get('/api/demografi', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('demografi')
      .select('*')
      .eq('id', 1)
      .single();

    if (error) throw error;

    res.json({
      dusunList: data.dusun_list || [],
      pekerjaan: data.pekerjaan || [],
      pendidikan: data.pendidikan || [],
      gender: {
        lakiLaki: data.pria,
        perempuan: data.wanita
      }
    });
  } catch (err) {
    console.error('Error fetching demografi:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

app.put('/api/demografi', async (req, res) => {
  try {
    const d = req.body;
    const updateData = {
      total_penduduk: (d.gender?.lakiLaki || 0) + (d.gender?.perempuan || 0),
      kepala_keluarga: Array.isArray(d.dusunList) ? d.dusunList.reduce((acc, curr) => acc + (curr.kk || 0), 0) : 0,
      pria: d.gender?.lakiLaki || 0,
      wanita: d.gender?.perempuan || 0,
      pekerjaan: d.pekerjaan || [],
      pendidikan: d.pendidikan || [],
      dusun_list: d.dusunList || []
    };

    const { data, error } = await supabase
      .from('demografi')
      .update(updateData)
      .eq('id', 1)
      .select()
      .single();

    if (error) throw error;

    res.json({
      success: true,
      message: 'Data demografi berhasil diperbarui.',
      data: {
        dusunList: data.dusun_list || [],
        pekerjaan: data.pekerjaan || [],
        pendidikan: data.pendidikan || [],
        gender: {
          lakiLaki: data.pria,
          perempuan: data.wanita
        }
      }
    });
  } catch (err) {
    console.error('Error updating demografi:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ==================== PENGUMUMAN API ====================
app.get('/api/pengumuman', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('pengumuman')
      .select('*')
      .order('id', { ascending: true });

    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error('Error fetching pengumuman:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get('/api/pengumuman/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('pengumuman')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error) throw error;

    // Increment views counter asynchronously
    const nextViews = (data.views || 0) + 1;
    await supabase
      .from('pengumuman')
      .update({ views: nextViews })
      .eq('id', req.params.id);

    res.json({ ...data, views: nextViews });
  } catch (err) {
    console.error('Error fetching pengumuman by id:', err);
    res.status(404).json({ message: 'Pengumuman tidak ditemukan.' });
  }
});

app.post('/api/pengumuman', async (req, res) => {
  try {
    const id = await getNextId('pengumuman');
    const { data, error } = await supabase
      .from('pengumuman')
      .insert({ ...req.body, id, views: 0 })
      .select()
      .single();

    if (error) throw error;

    // Update stats count
    const { count } = await supabase
      .from('pengumuman')
      .select('*', { count: 'exact', head: true });
    await supabase.from('statistik').update({ pengumuman: count || 0 }).eq('id', 1);

    res.status(201).json({ success: true, message: 'Pengumuman berhasil ditambahkan.', data });
  } catch (err) {
    console.error('Error creating pengumuman:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

app.put('/api/pengumuman/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('pengumuman')
      .update(req.body)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    res.json({ success: true, message: 'Pengumuman berhasil diperbarui.', data });
  } catch (err) {
    console.error('Error updating pengumuman:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

app.delete('/api/pengumuman/:id', async (req, res) => {
  try {
    const { error } = await supabase
      .from('pengumuman')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;

    // Update stats count
    const { count } = await supabase
      .from('pengumuman')
      .select('*', { count: 'exact', head: true });
    await supabase.from('statistik').update({ pengumuman: count || 0 }).eq('id', 1);

    res.json({ success: true, message: 'Pengumuman berhasil dihapus.' });
  } catch (err) {
    console.error('Error deleting pengumuman:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ==================== BERITA API ====================
const mapBerita = (item) => ({
  id: item.id,
  judul: item.judul,
  ringkasan: item.ringkasan,
  isi: item.isi,
  kategori: item.kategori,
  gambar: item.foto, // map database foto to frontend gambar
  tanggal: item.tanggal,
  status: item.status,
  views: item.views,
  penulis: item.penulis
});

app.get('/api/berita', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('berita')
      .select('*')
      .order('id', { ascending: true });

    if (error) throw error;
    res.json(data.map(mapBerita));
  } catch (err) {
    console.error('Error fetching berita:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get('/api/berita/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('berita')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error) throw error;

    // Increment views counter
    const nextViews = (data.views || 0) + 1;
    await supabase
      .from('berita')
      .update({ views: nextViews })
      .eq('id', req.params.id);

    res.json(mapBerita({ ...data, views: nextViews }));
  } catch (err) {
    console.error('Error fetching berita by id:', err);
    res.status(404).json({ message: 'Berita tidak ditemukan.' });
  }
});

app.post('/api/berita', async (req, res) => {
  try {
    const id = await getNextId('berita');
    const body = req.body;
    const insertData = {
      id,
      judul: body.judul,
      ringkasan: body.ringkasan,
      isi: body.isi,
      kategori: body.kategori,
      foto: body.gambar, // map frontend gambar to database foto
      tanggal: body.tanggal,
      status: body.status,
      views: 0,
      penulis: body.penulis
    };

    const { data, error } = await supabase
      .from('berita')
      .insert(insertData)
      .select()
      .single();

    if (error) throw error;

    // Update stats count
    const { count } = await supabase
      .from('berita')
      .select('*', { count: 'exact', head: true });
    await supabase.from('statistik').update({ berita: count || 0 }).eq('id', 1);

    res.status(201).json({ success: true, message: 'Berita berhasil ditambahkan.', data: mapBerita(data) });
  } catch (err) {
    console.error('Error creating berita:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

app.put('/api/berita/:id', async (req, res) => {
  try {
    const body = req.body;
    const updateData = { ...body };
    if (body.gambar !== undefined) {
      updateData.foto = body.gambar;
      delete updateData.gambar;
    }

    const { data, error } = await supabase
      .from('berita')
      .update(updateData)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    res.json({ success: true, message: 'Berita berhasil diperbarui.', data: mapBerita(data) });
  } catch (err) {
    console.error('Error updating berita:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

app.delete('/api/berita/:id', async (req, res) => {
  try {
    const { error } = await supabase
      .from('berita')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;

    // Update stats count
    const { count } = await supabase
      .from('berita')
      .select('*', { count: 'exact', head: true });
    await supabase.from('statistik').update({ berita: count || 0 }).eq('id', 1);

    res.json({ success: true, message: 'Berita berhasil dihapus.' });
  } catch (err) {
    console.error('Error deleting berita:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ==================== SDA API ====================
app.get('/api/sda', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('sda')
      .select('*')
      .order('id', { ascending: true });

    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error('Error fetching SDA:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get('/api/sda/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('sda')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error('Error fetching SDA by id:', err);
    res.status(404).json({ message: 'Data SDA tidak ditemukan.' });
  }
});

app.post('/api/sda', async (req, res) => {
  try {
    const id = await getNextId('sda');
    const { data, error } = await supabase
      .from('sda')
      .insert({ ...req.body, id })
      .select()
      .single();

    if (error) throw error;
    res.status(201).json({ success: true, message: 'Data SDA berhasil ditambahkan.', data });
  } catch (err) {
    console.error('Error creating SDA:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

app.put('/api/sda/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('sda')
      .update(req.body)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    res.json({ success: true, message: 'Data SDA berhasil diperbarui.', data });
  } catch (err) {
    console.error('Error updating SDA:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

app.delete('/api/sda/:id', async (req, res) => {
  try {
    const { error } = await supabase
      .from('sda')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;
    res.json({ success: true, message: 'Data SDA berhasil dihapus.' });
  } catch (err) {
    console.error('Error deleting SDA:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ==================== PRODUK API (UMKM) ====================
app.get('/api/produk', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('produk')
      .select('*')
      .order('id', { ascending: true });

    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error('Error fetching produk:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get('/api/produk/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('produk')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error('Error fetching produk by id:', err);
    res.status(404).json({ message: 'Produk tidak ditemukan.' });
  }
});

app.post('/api/produk', async (req, res) => {
  try {
    const id = await getNextId('produk');
    const { data, error } = await supabase
      .from('produk')
      .insert({ ...req.body, id })
      .select()
      .single();

    if (error) throw error;

    // Update stats count
    const { count } = await supabase
      .from('produk')
      .select('*', { count: 'exact', head: true });
    await supabase.from('statistik').update({ umkm: count || 0 }).eq('id', 1);

    res.status(201).json({ success: true, message: 'Produk berhasil ditambahkan.', data });
  } catch (err) {
    console.error('Error creating produk:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

app.put('/api/produk/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('produk')
      .update(req.body)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    res.json({ success: true, message: 'Produk berhasil diperbarui.', data });
  } catch (err) {
    console.error('Error updating produk:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

app.delete('/api/produk/:id', async (req, res) => {
  try {
    const { error } = await supabase
      .from('produk')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;

    // Update stats count
    const { count } = await supabase
      .from('produk')
      .select('*', { count: 'exact', head: true });
    await supabase.from('statistik').update({ umkm: count || 0 }).eq('id', 1);

    res.json({ success: true, message: 'Produk berhasil dihapus.' });
  } catch (err) {
    console.error('Error deleting produk:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ==================== WISATA API ====================
const mapWisata = (item) => ({
  id: item.id,
  nama: item.nama,
  deskripsi: item.deskripsi,
  lokasi: item.lokasi,
  foto: item.foto,
  tiket: item.harga_tiket, // map database harga_tiket to frontend tiket
  galeri: Array.isArray(item.galeri) ? item.galeri : [item.foto],
  fasilitas: item.fasilitas || '',
  operasional: item.operasional || '',
  kontak: item.kontak || ''
});

app.get('/api/wisata', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('wisata')
      .select('*')
      .order('id', { ascending: true });

    if (error) throw error;
    res.json(data.map(mapWisata));
  } catch (err) {
    console.error('Error fetching wisata:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get('/api/wisata/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('wisata')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error) throw error;
    res.json(mapWisata(data));
  } catch (err) {
    console.error('Error fetching wisata by id:', err);
    res.status(404).json({ message: 'Destinasi wisata tidak ditemukan.' });
  }
});

app.post('/api/wisata', async (req, res) => {
  try {
    const id = await getNextId('wisata');
    const body = req.body;
    const insertData = {
      id,
      nama: body.nama,
      deskripsi: body.deskripsi,
      lokasi: body.lokasi,
      harga_tiket: body.tiket || '0', // map frontend tiket to database harga_tiket
      foto: body.foto,
      galeri: body.galeri || [body.foto],
      fasilitas: body.fasilitas || '',
      operasional: body.operasional || '',
      kontak: body.kontak || ''
    };

    const { data, error } = await supabase
      .from('wisata')
      .insert(insertData)
      .select()
      .single();

    if (error) throw error;

    // Update stats count
    const { count } = await supabase
      .from('wisata')
      .select('*', { count: 'exact', head: true });
    await supabase.from('statistik').update({ wisata: count || 0 }).eq('id', 1);

    res.status(201).json({ success: true, message: 'Destinasi wisata berhasil ditambahkan.', data: mapWisata(data) });
  } catch (err) {
    console.error('Error creating wisata:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

app.put('/api/wisata/:id', async (req, res) => {
  try {
    const body = req.body;
    const updateData = { ...body };
    if (body.tiket !== undefined) {
      updateData.harga_tiket = body.tiket;
      delete updateData.tiket;
    }

    const { data, error } = await supabase
      .from('wisata')
      .update(updateData)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    res.json({ success: true, message: 'Destinasi wisata berhasil diperbarui.', data: mapWisata(data) });
  } catch (err) {
    console.error('Error updating wisata:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

app.delete('/api/wisata/:id', async (req, res) => {
  try {
    const { error } = await supabase
      .from('wisata')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;

    // Update stats count
    const { count } = await supabase
      .from('wisata')
      .select('*', { count: 'exact', head: true });
    await supabase.from('statistik').update({ wisata: count || 0 }).eq('id', 1);

    res.json({ success: true, message: 'Destinasi wisata berhasil dihapus.' });
  } catch (err) {
    console.error('Error deleting wisata:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ==================== PENGADUAN API ====================
const mapPengaduan = (item) => ({
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
  catatanAdmin: item.catatan_admin, // map to camelCase
  timeline: item.timeline || []
});

app.get('/api/pengaduan', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('pengaduan')
      .select('*')
      .order('id', { ascending: true });

    if (error) throw error;
    res.json(data.map(mapPengaduan));
  } catch (err) {
    console.error('Error fetching pengaduan:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get('/api/pengaduan/status/:ticket', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('pengaduan')
      .select('*')
      .ilike('tiket', req.params.ticket)
      .maybeSingle();

    if (error) throw error;
    if (!data) return res.status(404).json({ message: 'Nomor tiket pengaduan tidak ditemukan.' });

    res.json(mapPengaduan(data));
  } catch (err) {
    console.error('Error fetching ticket status:', err);
    res.status(550).json({ success: false, message: err.message });
  }
});

// Submit Complaint
app.post('/api/pengaduan', complaintLimiter, async (req, res) => {
  try {
    const body = req.body;
    const year = new Date().getFullYear();

    // Get list of all complaints to calculate next ticket sequence number
    const { data: list, error: listError } = await supabase
      .from('pengaduan')
      .select('tiket');

    if (listError) throw listError;

    let nextNum = 1;
    if (list && list.length > 0) {
      const ticketNums = list
        .map(c => {
          const parts = c.tiket ? c.tiket.split('-') : [];
          return parts.length === 3 ? parseInt(parts[2]) : 0;
        })
        .filter(num => !isNaN(num));
      if (ticketNums.length > 0) {
        nextNum = Math.max(...ticketNums) + 1;
      }
    }

    const paddedNum = String(nextNum).padStart(4, '0');
    const ticketCode = `ADU-${year}-${paddedNum}`;

    const id = await getNextId('pengaduan');
    const insertData = {
      id,
      tiket: ticketCode,
      nama: body.nama,
      nik: body.nik,
      kontak: body.kontak,
      email: body.email,
      kategori: body.kategori,
      judul: body.judul,
      isi: body.isi,
      lokasi: body.lokasi,
      foto: body.foto,
      status: 'Menunggu',
      tanggal: new Date().toISOString().split('T')[0],
      catatan_admin: '',
      timeline: [
        {
          tanggal: new Date().toISOString().split('T')[0],
          status: 'Menunggu',
          keterangan: 'Aduan berhasil dikirim oleh warga dan menunggu verifikasi.'
        }
      ]
    };

    const { data, error } = await supabase
      .from('pengaduan')
      .insert(insertData)
      .select()
      .single();

    if (error) throw error;

    // Update stats count
    const { count } = await supabase
      .from('pengaduan')
      .select('*', { count: 'exact', head: true });
    await supabase.from('statistik').update({ pengaduan_masuk: count || 0 }).eq('id', 1);

    res.status(201).json({ success: true, message: 'Pengaduan berhasil diajukan.', tiket: ticketCode, data: mapPengaduan(data) });
  } catch (err) {
    console.error('Error creating pengaduan:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Update Complaint Status & Notes
app.put('/api/pengaduan/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { status, catatanAdmin, keteranganTimeline } = req.body;

    const { data: oldAdu, error: getError } = await supabase
      .from('pengaduan')
      .select('*')
      .eq('id', id)
      .single();

    if (getError) throw getError;

    const oldStatus = oldAdu.status;
    const updateData = {};

    if (status !== undefined) updateData.status = status;
    if (catatanAdmin !== undefined) updateData.catatan_admin = catatanAdmin;

    // Build next timeline step
    const nextTimeline = [...(oldAdu.timeline || [])];
    if (status !== undefined && status !== oldStatus || keteranganTimeline) {
      nextTimeline.push({
        tanggal: new Date().toISOString().split('T')[0],
        status: status || oldStatus,
        keterangan: keteranganTimeline || `Status pengaduan diubah menjadi ${status}.`
      });
      updateData.timeline = nextTimeline;
    }

    const { data, error } = await supabase
      .from('pengaduan')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    // Update completed statistics count
    const { count: completedCount } = await supabase
      .from('pengaduan')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'Selesai');

    await supabase.from('statistik').update({ pengaduan_selesai: completedCount || 0 }).eq('id', 1);

    res.json({ success: true, message: 'Status pengaduan berhasil diperbarui.', data: mapPengaduan(data) });
  } catch (err) {
    console.error('Error updating pengaduan:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

app.delete('/api/pengaduan/:id', async (req, res) => {
  try {
    const { error } = await supabase
      .from('pengaduan')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;

    // Update stats counts
    const { count: totalCount } = await supabase.from('pengaduan').select('*', { count: 'exact', head: true });
    const { count: completedCount } = await supabase.from('pengaduan').select('*', { count: 'exact', head: true }).eq('status', 'Selesai');

    await supabase.from('statistik').update({
      pengaduan_masuk: totalCount || 0,
      pengaduan_selesai: completedCount || 0
    }).eq('id', 1);

    res.json({ success: true, message: 'Data pengaduan berhasil dihapus.' });
  } catch (err) {
    console.error('Error deleting pengaduan:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ==================== GALERI API ====================
app.get('/api/galeri', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('galeri')
      .select('*')
      .order('id', { ascending: true });

    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error('Error fetching galeri:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/galeri', async (req, res) => {
  try {
    const id = await getNextId('galeri');
    const { data, error } = await supabase
      .from('galeri')
      .insert({ ...req.body, id })
      .select()
      .single();

    if (error) throw error;
    res.status(201).json({ success: true, message: 'Foto berhasil ditambahkan ke galeri.', data });
  } catch (err) {
    console.error('Error creating galeri:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

app.put('/api/galeri/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('galeri')
      .update(req.body)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    res.json({ success: true, message: 'Foto galeri berhasil diperbarui.', data });
  } catch (err) {
    console.error('Error updating galeri:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

app.delete('/api/galeri/:id', async (req, res) => {
  try {
    const { error } = await supabase
      .from('galeri')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;
    res.json({ success: true, message: 'Foto galeri berhasil dihapus.' });
  } catch (err) {
    console.error('Error deleting galeri:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ==================== KONTAK API ====================
app.get('/api/kontak', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('kontak')
      .select('*')
      .eq('id', 1)
      .single();

    if (error) throw error;

    res.json({
      alamat: data.alamat,
      telepon: data.telepon,
      email: data.email,
      jamPelayanan: data.jam_pelayanan,
      whatsapp: data.social_media?.whatsapp || '',
      mapsLink: data.social_media?.mapsLink || '',
      socialMedia: {
        facebook: data.social_media?.facebook || '',
        instagram: data.social_media?.instagram || '',
        youtube: data.social_media?.youtube || '',
        twitter: data.social_media?.twitter || '',
      },
      layananAdministrasi: data.social_media?.layananAdministrasi || []
    });
  } catch (err) {
    console.error('Error fetching kontak:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

app.put('/api/kontak', async (req, res) => {
  try {
    const k = req.body;
    const updateData = {
      alamat: k.alamat,
      telepon: k.telepon,
      email: k.email,
      jam_pelayanan: k.jamPelayanan,
      social_media: {
        facebook: k.socialMedia?.facebook || '',
        instagram: k.socialMedia?.instagram || '',
        youtube: k.socialMedia?.youtube || '',
        twitter: k.socialMedia?.twitter || '',
        whatsapp: k.whatsapp,
        mapsLink: k.mapsLink,
        layananAdministrasi: k.layananAdministrasi || []
      }
    };

    const { data, error } = await supabase
      .from('kontak')
      .update(updateData)
      .eq('id', 1)
      .select()
      .single();

    if (error) throw error;

    res.json({
      success: true,
      message: 'Kontak desa berhasil diperbarui.',
      data: {
        alamat: data.alamat,
        telepon: data.telepon,
        email: data.email,
        jamPelayanan: data.jam_pelayanan,
        whatsapp: data.social_media?.whatsapp || '',
        mapsLink: data.social_media?.mapsLink || '',
        socialMedia: {
          facebook: data.social_media?.facebook || '',
          instagram: data.social_media?.instagram || '',
          youtube: data.social_media?.youtube || '',
          twitter: data.social_media?.twitter || '',
        },
        layananAdministrasi: data.social_media?.layananAdministrasi || []
      }
    });
  } catch (err) {
    console.error('Error updating kontak:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ==================== USER MANAGEMENT API ====================
app.get('/api/users', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, username, nama, role, aktif')
      .order('id', { ascending: true });

    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Detail user including password (for edit modal in admin view)
app.get('/api/users/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error('Error fetching user by id:', err);
    res.status(404).json({ message: 'User tidak ditemukan.' });
  }
});

app.post('/api/users', async (req, res) => {
  try {
    const { username, password } = req.body;

    const { data: existing } = await supabase
      .from('users')
      .select('id')
      .ilike('username', username)
      .maybeSingle();

    if (existing) {
      return res.status(400).json({ success: false, message: 'Username sudah digunakan.' });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const nextId = await getNextId('users');

    const { data, error } = await supabase
      .from('users')
      .insert({ ...req.body, id: nextId, password: hashedPassword, aktif: true })
      .select()
      .single();

    if (error) throw error;
    res.status(201).json({ success: true, message: 'User admin berhasil ditambahkan.', data });
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

app.put('/api/users/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const body = req.body;

    const { data: user, error: getError } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (getError) throw getError;

    // Prevent editing the superadmin username or status to preserve master access
    if (user.username === 'superadmin' && body.username !== undefined && body.username !== 'superadmin') {
      return res.status(400).json({ success: false, message: 'Username Super Admin tidak boleh diubah.' });
    }

    if (user.username === 'superadmin' && body.aktif === false) {
      return res.status(400).json({ success: false, message: 'Akun Super Admin tidak boleh dinonaktifkan.' });
    }

    const updateData = { ...body };
    // Hash password if it is being updated
    if (body.password) {
      updateData.password = await bcrypt.hash(body.password, 10);
    }

    const { data, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    res.json({ success: true, message: 'User admin berhasil diperbarui.', data });
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

app.delete('/api/users/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const { data: user, error: getError } = await supabase
      .from('users')
      .select('username')
      .eq('id', id)
      .single();

    if (getError) throw getError;

    if (user.username === 'superadmin') {
      return res.status(400).json({ success: false, message: 'Akun Super Admin tidak boleh dihapus.' });
    }

    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.json({ success: true, message: 'User admin berhasil dihapus.' });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`=================================================`);
    console.log(`🚀 Server Desa Digital Telukambulu aktif!`);
    console.log(`Port: http://localhost:${PORT}`);
    console.log(`Menggunakan database Supabase: ${process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'}`);
    console.log(`=================================================`);
  });
}

module.exports = app;
