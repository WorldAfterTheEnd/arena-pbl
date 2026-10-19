/* staf-tu.js - Kelola Gedung & Laporan (filter ruang, kunci jadwal, terbit surat) */
(function () {
  'use strict';
  const user = Auth.requireRole(['tu']);
  if (!user) return;
  Shell.mount({ title: 'Kelola Gedung & Laporan' });

  const filter = { tempat: 'Semua Tempat', status: 'Semua Status' };   // state filter (frame Pilih Tempat / Pilih Status)
  const gedungList = ['Semua Tempat', ...new Set(DATA.ruang.map(r => r.gedung))];

  /* Dua dropdown filter, render ulang tabel setiap berubah */
  const f = document.getElementById('filters-dash'); f.style.cssText = 'display:flex;gap:10px;margin-bottom:10px';
  f.append(
    UI.dropdown({ label: 'Semua Tempat', items: gedungList, value: filter.tempat, onSelect: v => { filter.tempat = v; renderRuang(); } }),
    UI.dropdown({ label: 'Semua Status', items: ['Semua Status', 'Blocked', 'Available', 'Pending'], value: filter.status, onSelect: v => { filter.status = v; renderRuang(); } }));

  function renderRuang() {
    const rows = DATA.ruang.filter(r => (filter.tempat === 'Semua Tempat' || r.gedung === filter.tempat) && (filter.status === 'Semua Status' || r.status === filter.status));
    document.getElementById('tbl-ruang-dash').innerHTML = '<thead><tr><th>Ruang</th><th>Gedung</th><th>Pos</th><th>Status</th><th></th></tr></thead><tbody>' +
      (rows.map(r => `<tr><td>${r.nama}</td><td>${r.gedung}</td><td>${r.pos}</td><td>${UI.badge(r.status)}</td><td><button class="btn btn-ghost" data-kelola>Kelola</button></td></tr>`).join('')
        || '<tr><td colspan="5">Tidak ada data.</td></tr>') + '</tbody>';
  }

  /* Tabel Pengajuan: daftar siap terbit surat */
  document.getElementById('tbl-pengajuan').innerHTML = '<thead><tr><th>Ruang</th><th>Tempat/Gedung</th><th>Tanggal</th><th>Peminjam</th><th></th></tr></thead><tbody>' +
    Array.from({ length: 6 }, () => '<tr><td>Aula Utama</td><td>Gedung Teknik Sipil</td><td>02 Oktober 2026</td><td>Himpunan Mahasiswa Teknologi Informasi</td><td><button class="btn" onclick="UI.modal.open(\'m-surat\')">Terbitkan Surat</button></td></tr>').join('') + '</tbody>';

  document.getElementById('log').innerHTML = Array(4).fill('<p style="font-size:11px;margin:10px 0">Kajur Menyetujui <b>Seminar Nasional</b></p>').join('');
  document.addEventListener('click', e => { if (e.target.closest('[data-kelola]')) UI.toast('Modal Kelola ruang - TODO', ''); });
  document.getElementById('btn-terbit').onclick = () => { UI.modal.close('m-surat'); UI.toast('Surat izin terbit & jadwal terkunci (QR dibuat).', 'ok'); }; // TODO backend
  renderRuang();
})();
