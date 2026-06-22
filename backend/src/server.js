const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;
const DB_PATH = path.join(__dirname, '../data/db.json');

app.use(cors());
app.use(express.json());

// Helper function to read database
const readDB = () => {
  try {
    const data = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading database:', error);
    return {};
  }
};

// Helper function to write database
const writeDB = (data) => {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing database:', error);
    return false;
  }
};

// Logger middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// ==================== AUTH API ====================
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  const db = readDB();
  const user = db.users.find(u => u.username === username && u.password === password);

  if (!user) {
    return res.status(401).json({ success: false, message: 'Username atau password salah.' });
  }

  if (!user.aktif) {
    return res.status(403).json({ success: false, message: 'Akun Anda telah dinonaktifkan oleh Super Admin.' });
  }

  // Send simplified user data (excluding password for security)
  const userData = {
    id: user.id,
    username: user.username,
    nama: user.nama,
    role: user.role,
    aktif: user.aktif
  };

  res.json({ success: true, message: 'Login berhasil.', user: userData });
});

// ==================== PROFIL & KONTAK API ====================
app.get('/api/profil', (req, res) => {
  const db = readDB();
  res.json(db.profil);
});

app.put('/api/profil', (req, res) => {
  const db = readDB();
  db.profil = { ...db.profil, ...req.body };
  writeDB(db);
  res.json({ success: true, message: 'Profil desa berhasil diperbarui.', data: db.profil });
});

app.get('/api/statistik', (req, res) => {
  const db = readDB();
  res.json(db.statistik);
});

app.get('/api/perangkat', (req, res) => {
  const db = readDB();
  res.json(db.perangkat);
});

// Manage Perangkat Desa
app.post('/api/perangkat', (req, res) => {
  const db = readDB();
  const newPerangkat = {
    id: db.perangkat.length > 0 ? Math.max(...db.perangkat.map(p => p.id)) + 1 : 1,
    ...req.body
  };
  db.perangkat.push(newPerangkat);
  writeDB(db);
  res.status(201).json({ success: true, message: 'Perangkat desa berhasil ditambahkan.', data: newPerangkat });
});

app.put('/api/perangkat/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const db = readDB();
  const index = db.perangkat.findIndex(p => p.id === id);
  if (index === -1) return res.status(404).json({ message: 'Data perangkat tidak ditemukan' });

  db.perangkat[index] = { ...db.perangkat[index], ...req.body };
  writeDB(db);
  res.json({ success: true, message: 'Data perangkat berhasil diperbarui.', data: db.perangkat[index] });
});

app.delete('/api/perangkat/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const db = readDB();
  db.perangkat = db.perangkat.filter(p => p.id !== id);
  writeDB(db);
  res.json({ success: true, message: 'Data perangkat berhasil dihapus.' });
});

// Demografi
app.get('/api/demografi', (req, res) => {
  const db = readDB();
  res.json(db.demografi);
});

app.put('/api/demografi', (req, res) => {
  const db = readDB();
  db.demografi = req.body;
  writeDB(db);
  res.json({ success: true, message: 'Data demografi berhasil diperbarui.', data: db.demografi });
});

// ==================== PENGUMUMAN API ====================
app.get('/api/pengumuman', (req, res) => {
  const db = readDB();
  res.json(db.pengumuman);
});

app.get('/api/pengumuman/:id', (req, res) => {
  const db = readDB();
  const peng = db.pengumuman.find(p => p.id === parseInt(req.params.id));
  if (!peng) return res.status(404).json({ message: 'Pengumuman tidak ditemukan.' });
  res.json(peng);
});

app.post('/api/pengumuman', (req, res) => {
  const db = readDB();
  const newPeng = {
    id: db.pengumuman.length > 0 ? Math.max(...db.pengumuman.map(p => p.id)) + 1 : 1,
    views: 0,
    ...req.body
  };
  db.pengumuman.push(newPeng);
  db.statistik.pengumuman = db.pengumuman.length;
  writeDB(db);
  res.status(201).json({ success: true, message: 'Pengumuman berhasil ditambahkan.', data: newPeng });
});

app.put('/api/pengumuman/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const db = readDB();
  const index = db.pengumuman.findIndex(p => p.id === id);
  if (index === -1) return res.status(404).json({ message: 'Pengumuman tidak ditemukan.' });

  db.pengumuman[index] = { ...db.pengumuman[index], ...req.body };
  writeDB(db);
  res.json({ success: true, message: 'Pengumuman berhasil diperbarui.', data: db.pengumuman[index] });
});

app.delete('/api/pengumuman/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const db = readDB();
  db.pengumuman = db.pengumuman.filter(p => p.id !== id);
  db.statistik.pengumuman = db.pengumuman.length;
  writeDB(db);
  res.json({ success: true, message: 'Pengumuman berhasil dihapus.' });
});

// ==================== BERITA API ====================
app.get('/api/berita', (req, res) => {
  const db = readDB();
  res.json(db.berita);
});

app.get('/api/berita/:id', (req, res) => {
  const db = readDB();
  const index = db.berita.findIndex(b => b.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ message: 'Berita tidak ditemukan.' });

  // Increment views counter
  db.berita[index].views = (db.berita[index].views || 0) + 1;
  writeDB(db);

  res.json(db.berita[index]);
});

app.post('/api/berita', (req, res) => {
  const db = readDB();
  const newBerita = {
    id: db.berita.length > 0 ? Math.max(...db.berita.map(b => b.id)) + 1 : 1,
    views: 0,
    ...req.body
  };
  db.berita.push(newBerita);
  db.statistik.berita = db.berita.length;
  writeDB(db);
  res.status(201).json({ success: true, message: 'Berita berhasil ditambahkan.', data: newBerita });
});

app.put('/api/berita/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const db = readDB();
  const index = db.berita.findIndex(b => b.id === id);
  if (index === -1) return res.status(404).json({ message: 'Berita tidak ditemukan.' });

  db.berita[index] = { ...db.berita[index], ...req.body };
  writeDB(db);
  res.json({ success: true, message: 'Berita berhasil diperbarui.', data: db.berita[index] });
});

app.delete('/api/berita/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const db = readDB();
  db.berita = db.berita.filter(b => b.id !== id);
  db.statistik.berita = db.berita.length;
  writeDB(db);
  res.json({ success: true, message: 'Berita berhasil dihapus.' });
});

// ==================== SDA API ====================
app.get('/api/sda', (req, res) => {
  const db = readDB();
  res.json(db.sda);
});

app.get('/api/sda/:id', (req, res) => {
  const db = readDB();
  const item = db.sda.find(s => s.id === parseInt(req.params.id));
  if (!item) return res.status(404).json({ message: 'Data SDA tidak ditemukan.' });
  res.json(item);
});

app.post('/api/sda', (req, res) => {
  const db = readDB();
  const newItem = {
    id: db.sda.length > 0 ? Math.max(...db.sda.map(s => s.id)) + 1 : 1,
    ...req.body
  };
  db.sda.push(newItem);
  writeDB(db);
  res.status(201).json({ success: true, message: 'Data SDA berhasil ditambahkan.', data: newItem });
});

app.put('/api/sda/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const db = readDB();
  const index = db.sda.findIndex(s => s.id === id);
  if (index === -1) return res.status(404).json({ message: 'Data SDA tidak ditemukan.' });

  db.sda[index] = { ...db.sda[index], ...req.body };
  writeDB(db);
  res.json({ success: true, message: 'Data SDA berhasil diperbarui.', data: db.sda[index] });
});

app.delete('/api/sda/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const db = readDB();
  db.sda = db.sda.filter(s => s.id !== id);
  writeDB(db);
  res.json({ success: true, message: 'Data SDA berhasil dihapus.' });
});

// ==================== PRODUK API (UMKM) ====================
app.get('/api/produk', (req, res) => {
  const db = readDB();
  res.json(db.produk);
});

app.get('/api/produk/:id', (req, res) => {
  const db = readDB();
  const item = db.produk.find(p => p.id === parseInt(req.params.id));
  if (!item) return res.status(404).json({ message: 'Produk tidak ditemukan.' });
  res.json(item);
});

app.post('/api/produk', (req, res) => {
  const db = readDB();
  const newItem = {
    id: db.produk.length > 0 ? Math.max(...db.produk.map(p => p.id)) + 1 : 1,
    ...req.body
  };
  db.produk.push(newItem);
  db.statistik.umkm = db.produk.length;
  writeDB(db);
  res.status(201).json({ success: true, message: 'Produk berhasil ditambahkan.', data: newItem });
});

app.put('/api/produk/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const db = readDB();
  const index = db.produk.findIndex(p => p.id === id);
  if (index === -1) return res.status(404).json({ message: 'Produk tidak ditemukan.' });

  db.produk[index] = { ...db.produk[index], ...req.body };
  writeDB(db);
  res.json({ success: true, message: 'Produk berhasil diperbarui.', data: db.produk[index] });
});

app.delete('/api/produk/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const db = readDB();
  db.produk = db.produk.filter(p => p.id !== id);
  db.statistik.umkm = db.produk.length;
  writeDB(db);
  res.json({ success: true, message: 'Produk berhasil dihapus.' });
});

// ==================== WISATA API ====================
app.get('/api/wisata', (req, res) => {
  const db = readDB();
  res.json(db.wisata);
});

app.get('/api/wisata/:id', (req, res) => {
  const db = readDB();
  const item = db.wisata.find(w => w.id === parseInt(req.params.id));
  if (!item) return res.status(404).json({ message: 'Destinasi wisata tidak ditemukan.' });
  res.json(item);
});

app.post('/api/wisata', (req, res) => {
  const db = readDB();
  const newItem = {
    id: db.wisata.length > 0 ? Math.max(...db.wisata.map(w => w.id)) + 1 : 1,
    galeri: req.body.galeri || [req.body.foto],
    ...req.body
  };
  db.wisata.push(newItem);
  db.statistik.wisata = db.wisata.length;
  writeDB(db);
  res.status(201).json({ success: true, message: 'Destinasi wisata berhasil ditambahkan.', data: newItem });
});

app.put('/api/wisata/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const db = readDB();
  const index = db.wisata.findIndex(w => w.id === id);
  if (index === -1) return res.status(404).json({ message: 'Destinasi wisata tidak ditemukan.' });

  db.wisata[index] = { ...db.wisata[index], ...req.body };
  writeDB(db);
  res.json({ success: true, message: 'Destinasi wisata berhasil diperbarui.', data: db.wisata[index] });
});

app.delete('/api/wisata/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const db = readDB();
  db.wisata = db.wisata.filter(w => w.id !== id);
  db.statistik.wisata = db.wisata.length;
  writeDB(db);
  res.json({ success: true, message: 'Destinasi wisata berhasil dihapus.' });
});

// ==================== PENGADUAN API ====================
app.get('/api/pengaduan', (req, res) => {
  const db = readDB();
  res.json(db.pengaduan);
});

app.get('/api/pengaduan/status/:ticket', (req, res) => {
  const db = readDB();
  const adu = db.pengaduan.find(a => a.tiket.toLowerCase() === req.params.ticket.toLowerCase());
  if (!adu) return res.status(404).json({ message: 'Nomor tiket pengaduan tidak ditemukan.' });
  res.json(adu);
});

// Submit Complaint
app.post('/api/pengaduan', (req, res) => {
  const db = readDB();
  
  // Generate ticket number: ADU-2026-0003, etc.
  const year = new Date().getFullYear();
  const currentComplaints = db.pengaduan;
  
  let nextNum = 1;
  if (currentComplaints.length > 0) {
    const ticketNums = currentComplaints
      .map(c => {
        const parts = c.tiket.split('-');
        return parts.length === 3 ? parseInt(parts[2]) : 0;
      })
      .filter(num => !isNaN(num));
    if (ticketNums.length > 0) {
      nextNum = Math.max(...ticketNums) + 1;
    }
  }
  
  const paddedNum = String(nextNum).padStart(4, '0');
  const ticketCode = `ADU-${year}-${paddedNum}`;

  const newAdu = {
    id: db.pengaduan.length > 0 ? Math.max(...db.pengaduan.map(a => a.id)) + 1 : 1,
    tiket: ticketCode,
    status: 'Menunggu',
    tanggal: new Date().toISOString().split('T')[0],
    catatanAdmin: '',
    timeline: [
      {
        tanggal: new Date().toISOString().split('T')[0],
        status: 'Menunggu',
        keterangan: 'Aduan berhasil dikirim oleh warga dan menunggu verifikasi.'
      }
    ],
    ...req.body
  };

  db.pengaduan.push(newAdu);
  writeDB(db);
  res.status(201).json({ success: true, message: 'Pengaduan berhasil diajukan.', tiket: ticketCode, data: newAdu });
});

// Update Complaint Status & Notes
app.put('/api/pengaduan/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { status, catatanAdmin, keteranganTimeline } = req.body;
  const db = readDB();
  const index = db.pengaduan.findIndex(a => a.id === id);
  if (index === -1) return res.status(404).json({ message: 'Data pengaduan tidak ditemukan.' });

  const oldStatus = db.pengaduan[index].status;
  
  db.pengaduan[index].status = status || db.pengaduan[index].status;
  db.pengaduan[index].catatanAdmin = catatanAdmin !== undefined ? catatanAdmin : db.pengaduan[index].catatanAdmin;

  // Add timeline step if status changed or a description is provided
  if (status !== oldStatus || keteranganTimeline) {
    db.pengaduan[index].timeline.push({
      tanggal: new Date().toISOString().split('T')[0],
      status: status || oldStatus,
      keterangan: keteranganTimeline || `Status pengaduan diubah menjadi ${status}.`
    });
  }

  // Update statistics for completed complaints
  const completedCount = db.pengaduan.filter(a => a.status === 'Selesai').length;
  db.statistik.pengaduanSelesai = completedCount;

  writeDB(db);
  res.json({ success: true, message: 'Status pengaduan berhasil diperbarui.', data: db.pengaduan[index] });
});

app.delete('/api/pengaduan/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const db = readDB();
  db.pengaduan = db.pengaduan.filter(a => a.id !== id);
  writeDB(db);
  res.json({ success: true, message: 'Data pengaduan berhasil dihapus.' });
});

// ==================== GALERI API ====================
app.get('/api/galeri', (req, res) => {
  const db = readDB();
  res.json(db.galeri);
});

app.post('/api/galeri', (req, res) => {
  const db = readDB();
  const newFoto = {
    id: db.galeri.length > 0 ? Math.max(...db.galeri.map(g => g.id)) + 1 : 1,
    ...req.body
  };
  db.galeri.push(newFoto);
  writeDB(db);
  res.status(201).json({ success: true, message: 'Foto berhasil ditambahkan ke galeri.', data: newFoto });
});

app.put('/api/galeri/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const db = readDB();
  const index = db.galeri.findIndex(g => g.id === id);
  if (index === -1) return res.status(404).json({ message: 'Foto galeri tidak ditemukan.' });

  db.galeri[index] = { ...db.galeri[index], ...req.body };
  writeDB(db);
  res.json({ success: true, message: 'Foto galeri berhasil diperbarui.', data: db.galeri[index] });
});

app.delete('/api/galeri/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const db = readDB();
  db.galeri = db.galeri.filter(g => g.id !== id);
  writeDB(db);
  res.json({ success: true, message: 'Foto galeri berhasil dihapus.' });
});

// ==================== KONTAK API ====================
app.get('/api/kontak', (req, res) => {
  const db = readDB();
  res.json(db.kontak);
});

app.put('/api/kontak', (req, res) => {
  const db = readDB();
  db.kontak = { ...db.kontak, ...req.body };
  writeDB(db);
  res.json({ success: true, message: 'Kontak desa berhasil diperbarui.', data: db.kontak });
});

// ==================== USER MANAGEMENT API ====================
app.get('/api/users', (req, res) => {
  const db = readDB();
  // Return users excluding passwords for security (unless needed for management table)
  const safeUsers = db.users.map(u => ({ id: u.id, username: u.username, nama: u.nama, role: u.role, aktif: u.aktif }));
  res.json(safeUsers);
});

// Detail user including password (for edit modal in admin view)
app.get('/api/users/:id', (req, res) => {
  const db = readDB();
  const user = db.users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ message: 'User tidak ditemukan.' });
  res.json(user);
});

app.post('/api/users', (req, res) => {
  const db = readDB();
  const { username } = req.body;
  
  if (db.users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
    return res.status(400).json({ success: false, message: 'Username sudah digunakan.' });
  }

  const newUser = {
    id: db.users.length > 0 ? Math.max(...db.users.map(u => u.id)) + 1 : 1,
    aktif: true,
    ...req.body
  };
  db.users.push(newUser);
  writeDB(db);
  res.status(201).json({ success: true, message: 'User admin berhasil ditambahkan.', data: newUser });
});

app.put('/api/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const db = readDB();
  const index = db.users.findIndex(u => u.id === id);
  if (index === -1) return res.status(404).json({ message: 'User tidak ditemukan.' });

  // Prevent editing the superadmin username or status to preserve master access
  if (db.users[index].username === 'superadmin' && req.body.username !== 'superadmin') {
    return res.status(400).json({ success: false, message: 'Username Super Admin tidak boleh diubah.' });
  }

  if (db.users[index].username === 'superadmin' && req.body.aktif === false) {
    return res.status(400).json({ success: false, message: 'Akun Super Admin tidak boleh dinonaktifkan.' });
  }

  db.users[index] = { ...db.users[index], ...req.body };
  writeDB(db);
  res.json({ success: true, message: 'User admin berhasil diperbarui.', data: db.users[index] });
});

app.delete('/api/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const db = readDB();
  const user = db.users.find(u => u.id === id);
  if (!user) return res.status(404).json({ message: 'User tidak ditemukan.' });

  if (user.username === 'superadmin') {
    return res.status(400).json({ success: false, message: 'Akun Super Admin tidak boleh dihapus.' });
  }

  db.users = db.users.filter(u => u.id !== id);
  writeDB(db);
  res.json({ success: true, message: 'User admin berhasil dihapus.' });
});

// Serve frontend build static files if in production (Optional placeholder)
// app.use(express.static(path.join(__dirname, '../../frontend/dist')));
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, '../../frontend/dist/index.html'));
// });

app.listen(PORT, () => {
  console.log(`=================================================`);
  console.log(`🚀 Server Desa Digital Telukambulu aktif!`);
  console.log(`Port: http://localhost:${PORT}`);
  console.log(`Database Path: ${DB_PATH}`);
  console.log(`=================================================`);
});
