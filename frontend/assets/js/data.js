/* =====================================================================
   ARENA - data.js
   Data dummy bersama (mengikuti isi mockup). Ganti dengan fetch API nanti.
   Entitas mengikuti ERD proposal: User, Gedung_Fasilitas, Reservasi, Approval.
   ===================================================================== */
window.DATA = {
  // Reservasi/jadwal (dipakai riwayat mahasiswa & dashboard Satpam)
  jadwal: [
    { waktu: '09.00-13.00', ruang: 'Auditorium TI', peminjam: 'Himpunan Mahasiswa Teknologi Informasi', tanggal: '02 Oktober 2026', acara: 'Seminar Nasional HMTI', status: 'Selesai' },
    { waktu: '10.00-11.00', ruang: 'RT 07',         peminjam: 'Himpunan Mahasiswa Teknologi Informasi', tanggal: '02 Oktober 2026', acara: 'Dies Natalis JTI',      status: 'Sedang Berlangsung' },
    { waktu: '12.00-17.00', ruang: 'LSI 1, 2, 3',   peminjam: 'Himpunan Mahasiswa Teknologi Informasi', tanggal: '02 Oktober 2026', acara: 'Dialog Dosen Mahasiswa JTI', status: 'Akan Datang' },
  ],
  // Master ruang (Staf TU) - pos = kategori Pos Depan/Tengah/Belakang
  ruang: [
    { nama: 'Aula Utama', gedung: 'Gedung Teknik Sipil', pos: 'Pos Depan',   status: 'Blocked' },
    { nama: 'Aula Utama', gedung: 'Gedung Teknik Sipil', pos: 'Pos Depan',   status: 'Available' },
    { nama: 'Aula Utama', gedung: 'Gedung AX',           pos: 'Pos Tengah',  status: 'Pending' },
    { nama: 'Aula Utama', gedung: 'Gedung Teknik Mesin', pos: 'Pos Belakang', status: 'Available' },
    { nama: 'Aula Utama', gedung: 'Parkir Climbing',     pos: 'Pos Belakang', status: 'Pending' },
    { nama: 'Aula Utama', gedung: 'Gedung Teknik Sipil', pos: 'Pos Depan',   status: 'Pending' },
  ],
  // Pengajuan yang menunggu approver; tahap 1-4 = Dosen Pembina, Pres BEM, Kajur, Wadir
  pengajuan: [
    { id: 1, judul: 'Kuliah Tamu Praktisi IT', oleh: 'Himpunan Mahasiswa Teknologi Informasi', ruang: 'Auditorium', tanggal: '02 Oktober 2026', peserta: 120, deskripsi: 'Proposal kuliah tamu bersama praktisi Industri IT yang akan membahas arsitektur cloud', tahap: 2, status: 'Pending' },
    { id: 2, judul: 'Kuliah Tamu Praktisi IT', oleh: 'Himpunan Mahasiswa Teknologi Informasi', ruang: 'Auditorium', tanggal: '02 Oktober 2026', peserta: 120, deskripsi: 'Proposal kuliah tamu bersama praktisi Industri IT yang akan membahas arsitektur cloud', tahap: 2, status: 'Pending' },
    { id: 3, judul: 'Kuliah Tamu Praktisi IT', oleh: 'Himpunan Mahasiswa Teknologi Informasi', ruang: 'Auditorium', tanggal: '02 Oktober 2026', peserta: 120, deskripsi: 'Proposal kuliah tamu bersama praktisi Industri IT yang akan membahas arsitektur cloud', tahap: 2, status: 'Pending' },
  ],
  arsip: Array.from({ length: 7 }, (_, i) => ({ no: i + 1, nama: 'Dies Natalis Jurusan Teknologi Informasi', instansi: 'Himpunan Mahasiswa Teknologi Informasi', tanggal: '02 Oktober 2026', status: 'Approved' })),
  tahapNama: ['Dosen Pembina', 'Presiden BEM', 'Ketua Jurusan', 'Wakil Direktur'],  // urutan sesuai proposal
  tempat: ['Auditorium, Gedung Teknik Sipil', 'RT 05, Gedung Teknik Sipil', 'Aula Mesin, Gedung Teknik Mesin', 'Parkir motor, Gedung AS'],
};
