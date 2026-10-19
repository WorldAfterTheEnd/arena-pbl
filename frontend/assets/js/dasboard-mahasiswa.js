/* =====================================================================
   mahasiswa.js - wizard "Ajukan Peminjaman" (5 langkah) + riwayat
   Urutan frame Figma yang diwakili:
   Dashboard Mahasiswa -> Data Kegiatan -> Ruang & jadwal -> (Audit 1/2 = dropdown)
   -> Upload Proposal 1/2 -> Konfirmasi
   ===================================================================== */
(function () {
  'use strict';

  const user = Auth.requireRole(['bem', 'hmj', 'ukm']);       // hanya BEM/HMJ/UKM
  if (!user) return;
  Shell.mount({ title: 'Ajukan Peminjaman' });

  /* ---- Templat proposal dinamis sesuai role (proposal bagian fitur mahasiswa) ---- */
  const tplName = { bem: 'BEM', hmj: user.cabang || 'HMJ', ukm: user.cabang || 'UKM' }[user.role];
  document.getElementById('tpl-title').textContent = `Template Proposal Peminjaman Tempat - ${tplName.split(' - ')[0]}`;
  document.getElementById('f-org').value = user.cabang || 'Badan Eksekutif Mahasiswa (BEM)';

  /* ---- State wizard ---- */
  const STEPS = ['Unduh Template Proposal', 'Data Kegiatan', 'Ruang & Jadwal', 'Upload Proposal', 'Konfirmasi'];
  const form = { tempat: '', file: null };    // data yang dikumpulkan lintas langkah
  let step = 1;

  /* Render stepper: lingkaran + garis penghubung */
  const stepperEl = document.getElementById('stepper');
  stepperEl.innerHTML = STEPS.map((s, i) =>
    `<div class="step" data-i="${i + 1}"><div class="circle">${i + 1}</div><span>${s}</span></div>` +
    (i < STEPS.length - 1 ? '<div class="step-line"></div>' : '')).join('');

  /* Tampilkan langkah n: update stepper + panel dengan animasi */
  function go(n) {
    step = n;
    stepperEl.querySelectorAll('.step').forEach(el => {
      const i = +el.dataset.i;
      el.classList.toggle('done', i < n); el.classList.toggle('active', i === n);
    });
    stepperEl.querySelectorAll('.step-line').forEach((ln, i) => ln.classList.toggle('filled', i + 1 < n)); // garis terisi
    document.querySelectorAll('.step-panel').forEach(p => p.classList.toggle('active', +p.dataset.step === n));
    document.getElementById('btn-back').style.visibility = n === 1 ? 'hidden' : 'visible';
    document.getElementById('btn-next').textContent = n === 5 ? 'Konfirmasi >' : 'Lanjut >';
    if (n === 5) renderConfirm();
  }

  /* ---- Validasi per langkah: return pesan error atau '' ---- */
  function validate(n) {
    if (n === 2) {
      if (!val('f-nama')) return 'Nama kegiatan wajib diisi.';
      if (!val('f-peserta')) return 'Perkiraan peserta wajib diisi.';
    }
    if (n === 3) {
      if (!form.tempat) return 'Pilih tempat terlebih dahulu.';
      if (!val('f-tgl') || !val('f-mulai') || !val('f-selesai')) return 'Lengkapi tanggal dan jam.';
      if (val('f-selesai') <= val('f-mulai')) return 'Jam selesai harus setelah jam mulai.';
      const clash = cekBentrok();
      if (clash) return `Jadwal bentrok dengan "${clash.acara}" (${clash.waktu}).`;
    }
    if (n === 4 && !form.file) return 'Unggah file proposal PDF dulu.';
    return '';
  }
  const val = (id) => document.getElementById(id).value.trim();

  /* Simulasi validasi bentrok: bandingkan dengan jadwal dummy (tanggal 2026-10-02) */
  function cekBentrok() {
    if (val('f-tgl') !== '2026-10-02') return null;
    const toMin = (t) => { const [h, m] = t.split(':'); return +h * 60 + +m; };
    const a = toMin(val('f-mulai')), b = toMin(val('f-selesai'));
    return DATA.jadwal.find(j => {
      const [s, e] = j.waktu.split('-').map(x => x.replace('.', ':'));
      return form.tempat.startsWith(j.ruang.split(' ')[0]) && a < toMin(e) && b > toMin(s);
    }) || null;
  }

  /* ---- Tombol navigasi ---- */
  document.getElementById('btn-next').onclick = () => {
    const err = validate(step);
    if (err) { UI.toast(err, 'bad'); shake(); return; }
    if (step === 5) return submit();
    go(step + 1);
  };
  document.getElementById('btn-back').onclick = () => go(step - 1);
  function shake() { const c = document.getElementById('wizard'); c.classList.remove('shake'); void c.offsetWidth; c.classList.add('shake'); }

  /* Langkah 1: unduh templat (simulasi) */
  document.getElementById('btn-unduh').onclick = () => UI.toast(`Mengunduh template ${tplName}.docx ...`, 'ok');

  /* Langkah 3: dropdown tempat custom (frame Audit 1 -> Audit 2) */
  document.getElementById('dd-tempat').appendChild(
    UI.dropdown({ label: 'Pilih Tempat', items: DATA.tempat, onSelect: (v) => { form.tempat = v; } }));

  /* Langkah 4: dropzone (klik atau seret file) -> chip nama file muncul dengan animasi */
  const dz = document.getElementById('dropzone'), fileEl = document.getElementById('f-file');
  function setFile(f) {
    if (!f) return;
    if (f.type !== 'application/pdf') return UI.toast('File harus berformat PDF.', 'bad');
    form.file = f;
    dz.innerHTML = `<span class="file-chip">${f.name}</span>`;      // frame "Upload Proposal 2"
  }
  fileEl.onchange = () => setFile(fileEl.files[0]);
  ['dragenter', 'dragover'].forEach(ev => dz.addEventListener(ev, (e) => { e.preventDefault(); dz.classList.add('over'); }));
  ['dragleave', 'drop'].forEach(ev => dz.addEventListener(ev, (e) => { e.preventDefault(); dz.classList.remove('over'); }));
  dz.addEventListener('drop', (e) => setFile(e.dataTransfer.files[0]));

  /* Langkah 5: ringkasan + kirim */
  function renderConfirm() {
    document.getElementById('confirm-box').innerHTML =
      `Periksa kembali data sebelum mengirim. Setelah dikirim pengajuan masuk ke antrean review Dosen Pembina - tahap 1 dari 4 approval berjenjang.
       <dl><dt>Kegiatan</dt><dd>${val('f-nama')}</dd><dt>Organisasi</dt><dd>${val('f-org')}</dd>
       <dt>Tempat</dt><dd>${form.tempat}</dd><dt>Waktu</dt><dd>${val('f-tgl')} - ${val('f-mulai')} s/d ${val('f-selesai')}</dd>
       <dt>Proposal</dt><dd>${form.file ? form.file.name : '-'}</dd></dl>`;
  }
  function submit() {
    UI.toast('Pengajuan terkirim! Menunggu review Dosen Pembina.', 'ok');
    // TODO backend: POST /reservasi lalu reset form
    setTimeout(() => location.reload(), 1400);
  }

  /* ---- Riwayat peminjaman ---- */
  document.getElementById('tbl-riwayat').innerHTML =
    '<thead><tr><th>Waktu</th><th>Ruangan</th><th>Peminjam</th><th>Tanggal</th><th>Acara</th></tr></thead><tbody>' +
    DATA.jadwal.map(j => `<tr><td>${j.waktu}</td><td>${j.ruang}</td><td>${j.peminjam}</td><td>${j.tanggal}</td><td>${j.acara}</td></tr>`).join('') + '</tbody>';

  go(1);
})();
