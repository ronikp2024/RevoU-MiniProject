# Kebun & Ternak Manager

Aplikasi web sederhana untuk mengelola ternak ayam, ikan, dan kebun kecil di rumah. Dibangun bertahap — versi ini adalah **Tahap 1 (fondasi)**: mencatat data pokok, log harian, jadwal/pengingat, keuangan sederhana, dan siklus bertelur-mengeram-menetas-panen untuk ternak.

## Teknologi

- Node.js + Express (server, render halaman dengan EJS)
- SQLite (`better-sqlite3`) — database file lokal, tidak perlu setup server database
- Bootstrap 5 (CDN) — tampilan

## Menjalankan

```bash
npm install
npm start
```

Buka `http://localhost:3000`. Database otomatis dibuat di `data/farm.sqlite` saat pertama kali dijalankan (folder ini tidak ikut di-commit ke git).

Untuk pengembangan dengan auto-restart saat file berubah:

```bash
npm run dev
```

## Fitur Tahap 1

- **Ternak (Ayam & Ikan)** — catat kelompok/kandang/kolam: jenis, jumlah, tanggal mulai, status.
- **Kebun** — catat tanaman: varietas, jumlah/luas, tanggal tanam, status.
- **Log harian** — per ternak atau tanaman: pakan, kondisi, panen, kematian (ternak) / siram, pupuk, panen, hama (kebun).
- **Siklus bertelur → mengeram → menetas → panen** — khusus ternak: jumlah telur, tanggal mulai mengeram, perkiraan & tanggal menetas, jumlah menetas, hingga jumlah yang dipanen.
- **Pengingat/Jadwal** — bisa dikaitkan ke ternak/kebun tertentu atau umum, bisa berulang tiap N hari (misal jadwal pakan, vaksin, pemupukan) — otomatis membuat jadwal berikutnya saat ditandai selesai.
- **Keuangan** — catat pengeluaran & pemasukan, per item atau umum, dengan ringkasan bulanan.
- **Dashboard** — ringkasan jumlah ternak aktif, tanaman tumbuh, keuangan bulan ini, pengingat terdekat, dan siklus bertelur/mengeram yang aktif.

## Struktur Proyek

```
server.js              entry point Express
src/
  db.js                koneksi SQLite + migrasi skema otomatis
  schema.sql            definisi tabel
  helpers.js            util bersama (format tanggal/uang, dsb)
  routes/                route handler per modul
  views/                 template EJS
public/css/style.css     styling tambahan
```

## Roadmap ke Versi Komprehensif

Tahap berikutnya yang bisa ditambahkan:

- Login/multi-user (misal beberapa anggota keluarga bisa akses)
- Upload foto per ternak/tanaman/log
- Grafik/analitik (tren berat badan, hasil panen per periode, biaya vs hasil)
- Notifikasi (email/WhatsApp) untuk pengingat yang jatuh tempo
- Laporan/export (PDF/Excel) bulanan
- Manajemen stok pakan/pupuk terpisah dengan pengurangan otomatis saat log dicatat
- Versi mobile (PWA) agar gampang dipakai langsung di kandang/kebun
- Deploy ke server/cloud agar bisa diakses dari mana saja
