# Sistem Pendukung Keputusan (SPK-DSS)

Proyek Sistem Pendukung Keputusan (SPK) yang menyediakan berbagai algoritma populer. Proyek ini dikembangkan dengan menggunakan Next.js, Firebase, XLSX, dan Tailwind CSS.

![Screenshot](https://raw.githubusercontent.com/AkhmadRamadani/SPK-MAUT/main/src/assets/ss.png)

## Deskripsi

Proyek ini bertujuan untuk menyediakan sistem yang memungkinkan pengguna membuat keputusan berdasarkan sejumlah atribut atau kriteria dengan menggunakan berbagai metode SPK. Pendekatan ini digunakan untuk mengevaluasi dan memilih alternatif terbaik dalam keadaan di mana ada banyak variabel yang harus dipertimbangkan.

Metode algoritma yang didukung saat ini:
- **MAUT** (Multi-Attribute Utility Theory)
- **SAW** (Simple Additive Weighting)
- **TOPSIS** (Technique for Order of Preference by Similarity to Ideal Solution)
- **WP** (Weighted Product)
- **AHP** (Analytic Hierarchy Process)

Pengguna dapat memasukkan kriteria dan bobotnya (tipe Benefit atau Cost), serta memberikan penilaian untuk setiap alternatif. Sistem akan mengolah data ini secara dinamis dan memberikan breakdown langkah-demi-langkah (matriks, vektor) beserta hasil peringkat akhir.

## Fitur

- Mendukung berbagai algoritma SPK (MAUT, SAW, TOPSIS, WP, AHP).
- Pengguna dapat menambahkan kriteria, bobot, dan tipe atribut secara fleksibel.
- Pengguna dapat menilai alternatif pada setiap kriteria.
- Menampilkan breakdown langkah perhitungan matematis secara transparan.
- Sistem memberikan hasil berupa rangking alternatif terbaik.
- Pengguna dapat mengimpor data awal dari file Excel (XLSX).

## Instalasi

1. Clone repositori ini ke direktori lokal Anda.
2. Buka terminal dan arahkan ke direktori proyek.
3. Jalankan perintah berikut untuk menginstal dependensi:

```bash
npm install
```

## Konfigurasi Firebase

1. Buka proyek Firebase Anda atau buat proyek baru di [https://console.firebase.google.com/](https://console.firebase.google.com/).
2. Salin konfigurasi Firebase SDK dari Firebase Console.
3. Buat file `.env.local` di root proyek dan tambahkan environment variable berikut:
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`
   - `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`

## Menjalankan Aplikasi

Jalankan perintah berikut di terminal untuk menjalankan aplikasi dalam mode *development*:

```bash
npm run dev
```

Buka browser dan akses `http://localhost:3000` untuk melihat aplikasi berjalan.
