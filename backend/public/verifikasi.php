<?php
require_once '../config/koneksi.php';

// 1. Menangkap parameter 'id' dari URL (contoh: verifikasi.php?id=1234-5678)
$id_reservasi = $_GET['id'] ?? '';
$data = null;
$pesan_error = "";

// 2. Jika ID kosong, kirim response error
if (empty($id_reservasi)) {
    $pesan_error = "ID Reservasi tidak valid.";
// Jika ID tidak kosong, lanjutkan untuk cek ke database
} else {
    // 3. Cek ke database apakah ID reservasi ada dan status_akhir-nya 'Approved'
    try {
        // 3a. Query untuk ambil data reservasi berdasarkan ID
        $sql = "SELECT r.id_reservasi, u.nama_lengkap AS nama_peminjam, g.nama_gedung, 
                       r.nama_acara, r.tgl_acara, r.jam_mulai, r.jam_selesai, r.status_akhir 
                FROM reservasi r
                JOIN users u ON r.id_user = u.id_user
                JOIN gedung_fasilitas g ON r.id_gedung = g.id_gedung
                WHERE r.id_reservasi = :id_reservasi";
        // 3b. Eksekusi query dan ambil hasilnya
        $stmt = $pdo->prepare($sql);
        $stmt->execute([':id_reservasi' => $id_reservasi]);
        $data = $stmt->fetch(PDO::FETCH_ASSOC);
        // 3c. Jika data tidak ditemukan atau status_akhir bukan 'Approved', beri pesan error
        if (!$data || $data['status_akhir'] !== 'Approved') {
            $pesan_error = "DOKUMEN TIDAK VALID ATAU BELUM DISETUJUI SEPENUHNYA.";
        }

    // 4. Tangani error database jika terjadi 
    } catch (PDOException $e) {
        $pesan_error = "Terjadi kesalahan sistem.";
    }
}
?>

