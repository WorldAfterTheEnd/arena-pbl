/* approver.js - dashboard approver (Dosen Pembina / Pres BEM / Kajur / Wadir)
   Satu halaman, tahap approver ditentukan role (roleMeta.tahap). */
(function () {
  'use strict';
  const user = Auth.requireRole(['dosen_pembina', 'pres_bem', 'kajur', 'wadir']);
  if (!user) return;
  Shell.mount({ title: 'Dashboard' });

  const myTahap = user.roleMeta.tahap;
  let current = null;                                   // pengajuan yang sedang dibuka di modal
  const stats = { Disetujui: 5, Direvisi: 1, Ditolak: 1 };

  /* Mini stepper 4 tahap: done = sudah lewat, now = tahap approver ini */
  const steps = (p) => '<div class="mini-steps">' + DATA.tahapNama.map((n, i) =>
    `<div class="ms ${i + 1 < p.tahap ? 'done' : i + 1 === p.tahap ? 'now' : ''}"><span class="dot">${i + 1}</span>${n}</div>`).join('') + '</div>';

  /* Kartu pengajuan (dipakai di Dashboard & Antrean) */
  const card = (p) => `<div class="card req reveal" style="--i:${p.id}">
    <h3>${p.judul}</h3>${UI.badge(p.status)}
    <div class="meta"><span>Diajukan oleh <b>${p.oleh}</b></span></div>
    <div class="meta"><span>Ruang ${p.ruang}</span><span>${p.tanggal}</span><span>${p.peserta} Peserta</span></div>
    <div class="meta">${p.deskripsi}</div>${steps(p)}
    <div style="display:flex;gap:8px;margin-top:10px">
      <button class="btn" data-review="${p.id}">Tinjau Proposal</button>
      <button class="btn btn-muted" data-pdf="${p.id}">Lihat Berkas PDF</button></div></div>`;

  const statCards = () => Object.entries(stats).map(([k, v]) => `<div class="card stat"><div class="label">${k === 'Direvisi' ? 'Revisi' : k}</div><div class="value">${v}</div></div>`).join('');

  function render() {
    const waiting = DATA.pengajuan.filter(p => p.status === 'Pending');
    document.getElementById('st-masuk').textContent = DATA.pengajuan.length;
    document.getElementById('st-tunggu').textContent = waiting.length;
    document.getElementById('list-dashboard').innerHTML = waiting.slice(0, 2).map(card).join('') || '<div class="card">Tidak ada antrean.</div>';
    document.getElementById('list-antrean').innerHTML = DATA.pengajuan.map(card).join('');
    document.getElementById('stat-riwayat').innerHTML = document.getElementById('stat-arsip').innerHTML = statCards();
    document.getElementById('tbl-arsip').innerHTML = '<thead><tr><th>No</th><th>Nama Kegiatan</th><th>Instansi</th><th>Tanggal</th><th>Status</th></tr></thead><tbody>' +
      DATA.arsip.map(a => `<tr><td>${a.no}</td><td>${a.nama}</td><td>${a.instansi}</td><td>${a.tanggal}</td><td>${UI.badge('Approved')}</td></tr>`).join('') + '</tbody>';
  }

  /* Klik tombol di kartu (event delegation) */
  document.addEventListener('click', (e) => {
    const r = e.target.closest('[data-review]'), p = e.target.closest('[data-pdf]');
    if (r) { current = DATA.pengajuan.find(x => x.id == r.dataset.review); document.getElementById('rv-title').textContent = 'Tinjau: ' + current.judul; document.getElementById('rv-note').value = ''; UI.modal.open('m-review'); }
    if (p) { const x = DATA.pengajuan.find(y => y.id == p.dataset.pdf); document.getElementById('pdf-title').textContent = 'Proposal ' + x.judul; UI.modal.open('m-pdf'); }
  });

  /* Keputusan: Revisi / Disetujui / Ditolak (catatan wajib untuk Revisi & Ditolak) */
  document.querySelectorAll('#m-review [data-act]').forEach(b => b.onclick = () => {
    const act = b.dataset.act, note = document.getElementById('rv-note').value.trim();
    if (act !== 'Disetujui' && !note) return UI.toast('Catatan wajib diisi.', 'bad');
    current.status = act; stats[act]++;
    if (act === 'Disetujui') current.tahap = Math.min(4, myTahap + 1);   // lanjut ke approver berikutnya
    // TODO backend: POST /approval {reservasi_id, tahap_ke: myTahap, status, catatan}
    UI.modal.close('m-review'); UI.toast(`Pengajuan ${act.toLowerCase()}.`, act === 'Ditolak' ? 'bad' : 'ok'); render();
  });
  render();
})();
