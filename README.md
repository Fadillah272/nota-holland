# 🧾 Receipt Generator (Bakery Edition)

Aplikasi web satu halaman (*single page application*) modern, cepat, dan ringan untuk membuat serta mencetak struk belanja toko roti/bakery ke printer struk thermal (58mm dan 80mm).

Aplikasi ini dibangun tanpa database dan tanpa login (semua data tersimpan di memori browser / React state dan otomatis kembali ke data awal saat refresh halaman).

---

## 🚀 Fitur Utama

- **Live Real-Time Preview**: Pratinjau struk langsung ter-update seketika saat Anda mengetik data pada formulir.
- **Dukungan Printer Thermal 58mm & 80mm**: Ukuran kertas dapat diubah secara instan dengan CSS `@media print` presisi.
- **Kalkulasi Otomatis & Akurat**:
  - Perhitungan Total Item (jumlah pcs seluruh barang).
  - Grand Total belanja.
  - Perhitungan **DPP** dan **PPN** (default 11%, include tax / sudah termasuk PPN).
  - Perhitungan **Kembalian Tunai** dengan tombol nominal cepat (*quick cash*).
- **Logo Struk Thermal**: Pilihan logo default Kincir Angin khas bakery atau upload gambar logo sendiri (otomatis diubah menjadi grayscale berdaya kontras tinggi untuk printer thermal).
- **QR Code Vector Standar**: Dibuat secara native tanpa dependensi eksternal berat, tajam dan tidak pecah saat dicetak.
- **Data Contoh Otentik**: Dilengkapi dengan data contoh Holland Bakery (Chocolate John, Cheese John, Soft Cheese Cake, Danish Coklat Belepotan, Soes Cream Keju, Singapore Kaya Toast, Paperbag).
- **Tombol Reset**: Reset cepat dengan dialog konfirmasi (pilihan kembali ke data contoh atau mengosongkan seluruh formulir).

---

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons & QR**: Native SVG Vector Icons & Standalone QR Matrix Generator
- **Deployment Target**: Vercel (Zero Configuration)

---

## 💻 Menjalankan Secara Lokal

1. **Clone repository ini** (atau ekstrak folder proyek):
   ```bash
   cd nota-holland
   ```

2. **Install dependensi**:
   ```bash
   npm install
   ```

3. **Jalankan development server**:
   ```bash
   npm run dev
   ```

4. Buka browser di [http://localhost:3000](http://localhost:3000).

5. **Uji coba build produksi**:
   ```bash
   npm run build
   ```

---

## 🌐 Panduan Deploy ke Vercel

Aplikasi ini siap di-deploy langsung ke **Vercel** tanpa konfigurasi tambahan apapun (`npm run build` berjalan 100% mulus).

### Langkah 1: Push ke GitHub
Jika belum diinisialisasi git:
```bash
git init
git add .
git commit -m "feat: initial commit receipt generator"
git branch -M main
git remote add origin https://github.com/<username-anda>/<nama-repo>.git
git push -u origin main
```

### Langkah 2: Import ke Vercel
1. Buka [vercel.com](https://vercel.com) dan login dengan akun GitHub Anda.
2. Klik tombol **"Add New..."** lalu pilih **"Project"**.
3. Temukan repository GitHub yang baru saja Anda push, lalu klik **"Import"**.

### Langkah 3: Deploy
1. Pada halaman konfigurasi project, biarkan semua pengaturan default:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
2. Klik tombol **"Deploy"**.
3. Tunggu sekitar 1 menit hingga proses build selesai. Aplikasi Anda sekarang sudah live di domain `*.vercel.app`!

---

## 🖨️ Tips Pengaturan Cetak Printer Thermal

Saat Anda menekan tombol **"Cetak Struk"** atau `Ctrl + P`, browser akan menampilkan dialog cetak:

1. **Destination / Printer**: Pilih printer thermal Anda (contoh: *POS-58*, *POS-80*, *Epson TM-T82*, *Xprinter*, dll).
2. **Paper Size**: Pilih ukuran kertas yang sesuai (58mm / 80mm / Receipt Roll).
3. **Margins**: Atur ke **"None"** atau **"Tidak Ada"**.
4. **Options / Pengaturan Tambahan**:
   - **Nonaktifkan** centang *"Headers and footers"* (agar tanggal, URL, dan nomor halaman browser tidak tercetak di struk).
   - Centang *"Background graphics"* bila diperlukan.
