/* satpam.js - dashboard read-only jadwal real-time (per pos) */
(function () {
  'use strict';
  const user = Auth.requireRole(['satpam']);
  if (!user) return;
  Shell.mount({ title: 'Jadwal Acara Real-Time' });

  document.getElementById('pos-tag').textContent = user.pos ? '· ' + user.pos : '';
  const rows = (list) => '<thead><tr><th>Waktu</th><th>Ruangan</th><th>Peminjam</th><th>Tanggal</th><th>Acara</th><th>Status</th></tr></thead><tbody>' +
    list.map(j => `<tr><td>${j.waktu}</td><td>${j.ruang}</td><td>${j.peminjam}</td><td>${j.tanggal}</td><td>${j.acara}</td><td>${UI.badge(j.status)}</td></tr>`).join('') + '</tbody>';
  document.getElementById('tbl-aktif').innerHTML = rows(DATA.jadwal);
  document.getElementById('tbl-semua').innerHTML = rows(DATA.jadwal);

  /* Kalender sederhana Oktober 2026 (1 Okt 2026 = Kamis) */
  const cal = document.getElementById('cal');
  cal.innerHTML = ['MINGGU','SENIN','SELASA','RABU','KAMIS','JUMAT','SABTU'].map(d => `<div class="dow">${d}</div>`).join('');
  const events = { 2: ['Seminar Nasional', 'Dies Natalis'] };           // tanggal -> acara (dummy)
  for (let i = 0; i < 4; i++) cal.insertAdjacentHTML('beforeend', '<div class="cell"></div>');  // offset awal bulan
  for (let d = 1; d <= 31; d++)
    cal.insertAdjacentHTML('beforeend', `<div class="cell"><small style="color:var(--muted)">${d}</small>${(events[d] || []).map(e => `<span class="badge warn">${e}</span>`).join('')}</div>`);
})();
