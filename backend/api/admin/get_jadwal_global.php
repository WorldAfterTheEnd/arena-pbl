<?php
session_start();
header('Content-Type: application/json');
require_once '../../config/koneksi.php';

// 1. Gerbang keamanan: hanya admin tu yg boleh mengakses halaman ini
if (!isset($_SESSION['id_user']) || $_SESSION['role'] !== 'AdminTU') {
    http_response_code(403);
    echo json_encode(["status" => "error", "message" => "Akses Ditolak! Khusus Administrator."]);
    exit;
}

try {
    // 2. Ambil daftar reservasi yang sudah di-ACC sepenuhnya, urutkan berdasarkan tanggal acara dan jam mulai
    $sql = "SELECT r.id_reservasi, r.tgl_acara, r.jam_mulai, r.jam_selesai, r.nama_acara, 
                   u.nama_lengkap AS penyelenggara, g.nama_gedung 
            FROM reservasi r
            JOIN users u ON r.id_user = u.id_user
            JOIN gedung_fasilitas g ON r.id_gedung = g.id_gedung
            WHERE r.status_akhir = 'Approved'
            ORDER BY r.tgl_acara ASC, r.jam_mulai ASC";
            
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $data_jadwal = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "status" => "success",
        "data" => $data_jadwal
    ]);
} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => "Gagal mengambil jadwal global. Detail: " . $e->getMessage()]);
}
?>