# Sistem Pendukung Keputusan menggunakan Metode MAUT

Proyek Sistem Pendukung Keputusan yang dibangun menggunakan metode MAUT (Multi-Attribute Utility Theory). Proyek ini dikembangkan dengan menggunakan ReactJS, Firebase, XLSX, dan Tailwind CSS.

![Screenshot](https://raw.githubusercontent.com/AkhmadRamadani/SPK-MAUT/main/src/assets/ss.png)

## Deskripsi

Proyek ini bertujuan untuk menyediakan sistem yang memungkinkan pengguna membuat keputusan berdasarkan sejumlah atribut dengan menggunakan metode MAUT. Metode MAUT adalah pendekatan yang digunakan untuk memilih alternatif terbaik dalam keadaan di mana ada banyak atribut yang harus dipertimbangkan.

Pengguna dapat memasukkan atribut dan bobotnya, serta menilai alternatif pada setiap atribut. Sistem akan mengolah data ini dan memberikan hasil berdasarkan perhitungan metode MAUT.

## Fitur

-   Pengguna dapat menambahkan atribut dan bobotnya.
-   Pengguna dapat menilai alternatif pada setiap atribut.
-   Sistem akan melakukan perhitungan berdasarkan metode MAUT.
-   Sistem akan memberikan hasil berupa rangking alternatif terbaik.
-   Pengguna dapat mengimpor perhitungan dari file format Excel (XLSX).

## Instalasi

1.  Clone repositori ini ke direktori lokal Anda.
2.  Buka terminal dan arahkan ke direktori proyek.
3.  Jalankan perintah berikut untuk menginstal dependensi:

Copy code

`npm install` 

## Konfigurasi Firebase

1.  Buka proyek Firebase Anda atau buat proyek baru di [https://console.firebase.google.com/](https://console.firebase.google.com/).
2.  Salin konfigurasi Firebase SDK dari Firebase Console
3.  Edit pada file `firebase/firebase_config.js`

## Menjalankan Aplikasi
1.  Jalankan perintah berikut di terminal untuk menjalankan aplikasi:


`npm start` 

2.  Buka browser dan akses `http://localhost:3000` untuk melihat aplikasi berjalan.
