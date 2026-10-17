<?php
// 1. Memulai sistem Session PHP
session_start();

// 2. Mengatur header agar response berupa JSON (standar API)
header('Content-Type: application/json');

// 3. Memanggil jembatan koneksi database
require_once '../../config/koneksi.php';

// Cek apakah request yang masuk bertipe POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    // Menangkap data JSON yang dikirim oleh Frontend
    $inputJSON = file_get_contents('php://input');
    $input = json_decode($inputJSON, TRUE); 

    $email    = trim($input['email'] ?? '');
    $password = $input['password'] ?? '';

    // Validasi kosong
    if (empty($email) || empty($password)) {
        echo json_encode(["status" => "error", "message" => "Email dan password wajib diisi!"]);
        exit;
    }

    try {
        // 4. Cari user (parameterised query untuk cegah SQL Injection)
        $stmt = $pdo->prepare("SELECT * FROM users WHERE email = :email");
        $stmt->bindParam(':email', $email);
        $stmt->execute();

        $user = $stmt->fetch();

        if ($user) {
            // REVISI: cek password mendukung dua bentuk.
            // a) password_verify() untuk password yang sudah di-hash (password_hash / bcrypt)
            // b) perbandingan aman untuk password lama yang masih teks biasa,
            //    supaya akun yang ada sekarang tetap bisa login selama masa transisi.
            $tersimpan = $user['password'];
            $cocok = password_verify($password, $tersimpan) || hash_equals($tersimpan, $password);

            if ($cocok) {
                // BARU: buat ID sesi baru setelah login untuk mencegah session fixation
                session_regenerate_id(true);

                // 5. Berhasil! Catat identitasnya di Session Server
                $_SESSION['id_user'] = $user['id_user'];
                $_SESSION['role']    = $user['role'];
                $_SESSION['nama']    = $user['nama_lengkap'];
                $_SESSION['email']   = $user['email']; // BARU: dipakai get_session.php

                echo json_encode([
                    "status"  => "success",
                    "message" => "Login berhasil!",
                    "user"    => [
                        "nama" => $user['nama_lengkap'],
                        "role" => $user['role']
                    ]
                ]);
            } else {
                echo json_encode(["status" => "error", "message" => "Password salah!"]);
            }
        } else {
            echo json_encode(["status" => "error", "message" => "Email tidak terdaftar!"]);
        }

    } catch (PDOException $e) {
        error_log("login.php: " . $e->getMessage());
        echo json_encode(["status" => "error", "message" => "Terjadi kesalahan server."]);
    }

} else {
    // Jika ada yang mencoba buka via URL browser biasa (GET)
    echo json_encode(["status" => "error", "message" => "Method tidak diizinkan. Gunakan POST."]);
}
?>