/* =====================================================================
   ARENA - auth.js
   Simulasi login (TANPA backend) untuk 9 role sesuai proposal:
   BEM, HMJ, UKM, Dosen Pembina, Presiden BEM, Kajur, Wadir, Staf TU, Satpam.
   Nanti saat backend siap, ganti isi fungsi login() dengan fetch ke API;
   bentuk objek "user" yang dikembalikan sebaiknya tetap sama.
   ===================================================================== */
(function (global) {
  'use strict';

  const SESSION_KEY = 'arena_session';

  /* ---- Metadata tiap role: label, halaman tujuan, menu sidebar ---- */
  // key menu = id section [data-view="..."] di halaman tujuan
  // 'home' relatif dari login.html (project-pbl-arena/)
  const MHS_MENU = [{ key: 'ajukan', label: 'Ajukan Peminjaman' }];
  const APPROVER_MENU = [
    { key: 'dashboard', label: 'Dashboard' },
    { key: 'antrean', label: 'Antrean Persetujuan' },
    { key: 'arsip', label: 'Arsip Kegiatan' },
  ];

  const ROLES = {
    bem:           { label: 'BEM',            sub: 'Mahasiswa',     home: 'pages/dashboard-mahasiswa.html', menu: MHS_MENU },
    hmj:           { label: 'HMJ',            sub: 'Mahasiswa',     home: 'pages/dashboard-mahasiswa.html', menu: MHS_MENU },
    ukm:           { label: 'UKM',            sub: 'Mahasiswa',     home: 'pages/dashboard-mahasiswa.html', menu: MHS_MENU },
    dosen_pembina: { label: 'Dosen Pembina',  sub: 'Approver',      home: 'pages/dashboard-approver.html', menu: APPROVER_MENU, tahap: 1 },
    pres_bem:      { label: 'Presiden BEM',   sub: 'Approver',      home: 'pages/dashboard-approver.html', menu: APPROVER_MENU, tahap: 2 },
    kajur:         { label: 'Ketua Jurusan',  sub: 'Approver',      home: 'pages/dashboard-approver.html', menu: APPROVER_MENU, tahap: 3 },
    wadir:         { label: 'Wakil Direktur', sub: 'Approver',      home: 'pages/dashboard-approver.html', menu: APPROVER_MENU, tahap: 4 },
    tu:            { label: 'Staf TU',        sub: 'Staf TU/Admin', home: 'pages/dashboard-admin.html',
                     menu: [{ key: 'dashboard', label: 'Dashboard' }, { key: 'pengajuan', label: 'Pengajuan' }] },
    satpam:        { label: 'Satpam',         sub: 'Satpam',        home: 'pages/dasboard-satpam.html',
                     menu: [{ key: 'dashboard', label: 'Dashboard' }, { key: 'jadwal', label: 'Jadwal Acara' }] },
  };

  /* ---- Akun dummy (password semua: arena123) ---- */
  // 'cabang' dipakai untuk memilih templat proposal & logo (HMTI/HMTK, Seni/Olahraga)
  const ACCOUNTS = [
    { email: 'bem@arena.ac.id',     password: 'arena123', nama: 'Maulidya',        role: 'bem' },
    { email: 'hmti@arena.ac.id',    password: 'arena123', nama: 'Arkan',           role: 'hmj', cabang: 'HMTI - Himpunan Mahasiswa Teknologi Informasi' },
    { email: 'ukmseni@arena.ac.id', password: 'arena123', nama: 'Panitia UKM Seni', role: 'ukm', cabang: 'UKM Seni' },
    { email: 'pembina@arena.ac.id', password: 'arena123', nama: 'Dosen Pembina',   role: 'dosen_pembina' },
    { email: 'presbem@arena.ac.id', password: 'arena123', nama: 'Presiden BEM',    role: 'pres_bem' },
    { email: 'kajur@arena.ac.id',   password: 'arena123', nama: 'Ketua Jurusan',   role: 'kajur' },
    { email: 'wadir@arena.ac.id',   password: 'arena123', nama: 'Wakil Direktur',  role: 'wadir' },
    { email: 'tu@arena.ac.id',      password: 'arena123', nama: 'Staf TU',         role: 'tu' },
    { email: 'satpam@arena.ac.id',  password: 'arena123', nama: 'Satpam Pos Depan', role: 'satpam', pos: 'Pos Depan' },
  ];

  /* ---- Session (sessionStorage dibungkus try/catch agar aman) ---- */
  function save(user) { try { sessionStorage.setItem(SESSION_KEY, JSON.stringify(user)); } catch (e) { global.__arenaUser = user; } }
  function current() {
    try { return JSON.parse(sessionStorage.getItem(SESSION_KEY)) || null; } catch (e) { return global.__arenaUser || null; }
  }

  /* ---- Login: mengembalikan Promise supaya mirip panggilan API sungguhan ---- */
  function login(email, password) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {                                   // jeda 700ms = simulasi loading server
        const acc = ACCOUNTS.find(a => a.email === String(email).trim().toLowerCase() && a.password === password);
        if (!acc) return reject(new Error('Email atau kata sandi salah.'));
        const { password: _pw, ...user } = acc;            // buang password sebelum disimpan
        user.roleMeta = ROLES[acc.role];
        save(user); resolve(user);
      }, 700);
    });
  }

  function logout() {
    try { sessionStorage.removeItem(SESSION_KEY); } catch (e) {}
    global.__arenaUser = null;
  }

  /* ---- Penjaga halaman: panggil di awal setiap halaman terproteksi ----
     requireRole(['bem','hmj','ukm'])  -> hanya role itu yang boleh masuk
     Default: halaman ada di pages/, login.html ada satu folder di atasnya */
  function requireRole(allowed, loginPath) {
    const u = current();
    if (!u || (allowed && !allowed.includes(u.role))) { global.location.replace(loginPath || '../login.html'); return null; }
    return u;
  }

  global.Auth = { ROLES, ACCOUNTS, login, logout, current, requireRole };
})(window);