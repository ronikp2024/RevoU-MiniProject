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

## Deploy di PC Windows

### Cara cepat: `start.bat`

Double-click `start.bat` di folder project. Script ini otomatis `npm install` (kalau `node_modules` belum ada) lalu menjalankan server di `http://localhost:3000`.

Supaya otomatis jalan tiap kali Windows nyala:
1. Klik kanan `start.bat` → **Create shortcut**
2. Tekan `Win + R`, ketik `shell:startup`, Enter — ini membuka folder Startup
3. Pindahkan shortcut tadi ke folder Startup itu

Diakses dari HP di WiFi yang sama: cek IP PC dengan `ipconfig` (lihat `IPv4 Address`), lalu buka `http://<IP-PC>:3000` dari HP. Kalau tidak nyambung, izinkan Node.js lewat **Windows Defender Firewall**.

### Cara lebih tangguh: PM2 (auto-restart kalau crash, jalan di background)

[PM2](https://pm2.keymetrics.io/) menjaga aplikasi tetap jalan, restart otomatis kalau error, dan bisa auto-start saat Windows boot.

```powershell
# 1. Install PM2 dan modul startup-nya (sekali saja)
npm install -g pm2
npm install -g pm2-windows-startup
pm2-startup install

# 2. Masuk ke folder project, lalu jalankan aplikasi lewat PM2
cd C:\path\ke\RevoU-MiniProject
npm install
pm2 start server.js --name farm-manager

# 3. Simpan daftar proses supaya otomatis jalan lagi setelah restart PC
pm2 save
```

Perintah PM2 yang berguna sehari-hari:

```powershell
pm2 list                 # lihat status aplikasi
pm2 logs farm-manager    # lihat log/error
pm2 restart farm-manager # restart manual
pm2 stop farm-manager    # hentikan
pm2 delete farm-manager  # hapus dari daftar PM2
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

## Monitor Induk Mengerami

Halaman mandiri untuk memantau satu atau banyak induk yang sedang mengerami telur: `public/mengerami/index.html` (dibuka di `http://localhost:3000/mengerami/` saat server jalan, atau langsung buka file-nya di browser). Data tersimpan di browser (localStorage), tanpa database.
