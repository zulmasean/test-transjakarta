# DemoQA Automation Test Transjakarta

Automation test untuk technical test Transjakarta, ditulis dengan **Playwright + TypeScript** dan menerapkan **Page Object Model (POM)**. Test berjalan otomatis di **GitHub Actions** setiap kali ada push.

**Author:** Zulma Irzamsyah — [zulma.sean84@gmail.com](mailto:zulma.sean84@gmail.com)

| No | Soal | URL | File test |
|----|------|-----|-----------|
| 1 | Bulk insert user dari CSV di Web Tables | https://demoqa.com/webtables | `tests/webTables.spec.ts` |
| 2 | Drag and Drop (Droppable) | https://demoqa.com/droppable | `tests/droppable.spec.ts` |
| 3 | Resize elemen menjadi 400 × 200 px | https://demoqa.com/resizable | `tests/resizable.spec.ts` |
| 4 | Student Registration Form | https://demoqa.com/automation-practice-form | `tests/practiceForm.spec.ts` |

---

## Daftar Isi
1. [Prasyarat](#1-prasyarat)
2. [Instalasi](#2-instalasi)
3. [Environment Variable (.env)](#3-environment-variable-env)
4. [Menjalankan Test](#4-menjalankan-test)
5. [Struktur Folder](#5-struktur-folder)
6. [Konsep Page Object Model](#6-konsep-page-object-model)
7. [Penjelasan Kode per Soal](#7-penjelasan-kode-per-soal)
8. [Konfigurasi](#8-konfigurasi-playwrightconfigts)
9. [CI/CD (GitHub Actions)](#9-cicd-github-actions)
10. [Troubleshooting](#10-troubleshooting)

---

## 1. Prasyarat
- **Node.js** versi **20.12 atau lebih baru** → cek dengan `node -v` (dibutuhkan untuk `process.loadEnvFile` yang membaca file `.env`)
- **npm** (otomatis terpasang bersama Node.js) → cek dengan `npm -v`
- Koneksi internet (untuk membuka demoqa.com)

## 2. Instalasi
Jalankan perintah ini di folder project:

```bash
# 1. Install dependency (Playwright test runner)
npm install

# 2. Install browser Chromium yang dipakai Playwright
npx playwright install chromium

# 3. Buat file .env dari template, lalu isi nilainya (lihat bagian 3)
cp .env.example .env
```

## 3. Environment Variable (`.env`)

URL dan data pribadi student **tidak ditulis di kode**, melainkan dibaca dari environment variable.

| Variable | Contoh nilai | Dipakai di |
|----------|--------------|-----------|
| `BASE_URL` | `https://demoqa.com` | `playwright.config.ts` (`baseURL`) |
| `STUDENT_FIRST_NAME` | `Andi` | Soal 4 |
| `STUDENT_LAST_NAME` | `Wijaya` | Soal 4 |
| `STUDENT_EMAIL` | `andi.wijaya@test.com` | Soal 4 |
| `STUDENT_MOBILE` | `0812345678` (**harus tepat 10 digit angka**, divalidasi) | Soal 4 |
| `STUDENT_ADDRESS` | `Jl. Sudirman No. 1, Jakarta` | Soal 4 |

- **`.env`** — berisi nilai asli, **tidak di-commit** (sudah ada di `.gitignore`).
- **`.env.example`** — template kosong yang di-commit sebagai contoh.
- **`config/env.ts`** — memuat `.env` (jika ada) dengan `process.loadEnvFile` bawaan Node (tanpa library tambahan). Fungsi `requireEnv('NAMA')` mengambil nilainya, dan **menghentikan test dengan pesan jelas** jika variable belum diisi:
  ```
  Error: Environment variable "BASE_URL" belum diisi. Cek file .env atau GitHub Variables.
  ```
- Di CI tidak ada file `.env`; nilainya diambil dari **GitHub Variables** (lihat [bagian 9](#9-cicd-github-actions)).

## 4. Menjalankan Test

| Perintah | Fungsi |
|----------|--------|
| `npm test` | Jalankan **semua** test (headless / tanpa tampilan browser) |
| `npm run test:headed` | Jalankan semua test **dengan browser terlihat** |
| `npm run test:webtables` | Jalankan Soal 1 saja |
| `npm run test:droppable` | Jalankan Soal 2 saja |
| `npm run test:resizable` | Jalankan Soal 3 saja |
| `npm run test:form` | Jalankan Soal 4 saja |
| `npm run report` | Buka laporan HTML hasil test terakhir |

Perintah Playwright lain yang berguna:

```bash
npx playwright test --ui                        # mode UI interaktif (lihat tiap langkah)
npx playwright test --debug                     # jalankan langkah demi langkah (debugger)
npx playwright codegen demoqa.com               # rekam aksi di browser → jadi kode
npx playwright test --retries=0 --repeat-each=3 # cek stabilitas (deteksi test flaky)
```

Contoh output sukses:
```
  ✓  1 [chromium] › droppable.spec.ts › Soal 2 - Drag and drop elemen ke area target
  ✓  2 [chromium] › practiceForm.spec.ts › Soal 4 - Isi dan submit Student Registration Form
  ✓  3 [chromium] › resizable.spec.ts › Soal 3 - Resize elemen menjadi 400 x 200 piksel
  ✓  4 [chromium] › webTables.spec.ts › Soal 1 - Bulk insert user dari CSV ke Web Tables
  4 passed
```

## 5. Struktur Folder

```
demoqa-playwright/
├── .github/workflows/
│   └── playwright.yml             ← PIPELINE CI/CD (GitHub Actions)
├── config/
│   └── env.ts                     ← pemuat .env + fungsi requireEnv()
├── tests/                         ← SKENARIO TEST (apa yang dites + verifikasi)
│   ├── webTables.spec.ts
│   ├── droppable.spec.ts
│   ├── resizable.spec.ts
│   └── practiceForm.spec.ts
├── pages/                         ← CLASS PER HALAMAN (aksi / method)
│   ├── BasePage.ts                   (class induk: buka URL + blokir iklan + tunggu load)
│   ├── WebTablesPage.ts
│   ├── DroppablePage.ts
│   ├── ResizablePage.ts
│   └── PracticeFormPage.ts
├── locators/                      ← SELECTOR ELEMEN PER HALAMAN
│   ├── webTables.locators.ts
│   ├── droppable.locators.ts
│   ├── resizable.locators.ts
│   └── practiceForm.locators.ts
├── data/                          ← DATA TEST
│   ├── users.csv                     (data user Soal 1)
│   ├── csvReader.ts                  (fungsi pembaca CSV)
│   ├── student.json                  (data form Soal 4 yang non-pribadi)
│   ├── student.ts                    (gabungan student.json + data pribadi dari .env)
│   └── profile.png                   (gambar untuk upload di Soal 4)
├── .env                           ← nilai environment variable (TIDAK di-commit)
├── .env.example                   ← template .env
├── playwright.config.ts           ← konfigurasi Playwright
├── tsconfig.json                  ← konfigurasi TypeScript
└── package.json                   ← dependency & script npm
```

## 6. Konsep Page Object Model

POM memisahkan kode supaya **rapi, mudah dibaca, dan mudah dirawat**. Alurnya:

```
tests  ──memanggil──▶  pages  ──memakai──▶  locators
  │
  └──────────membaca──────────▶  data  ◀── .env (data pribadi)
```

| Bagian | Isi | Contoh |
|--------|-----|--------|
| **locators** | Hanya selector (alamat elemen). Tidak ada logika. | `firstName: '#firstName'` |
| **pages** | Aksi yang bisa dilakukan di halaman. | `addUser(user)`, `dragToTarget()` |
| **data** | Data input test, terpisah dari kode. | `users.csv`, `student.json`, `student.ts` |
| **tests** | Skenario + verifikasi (`expect`). Dibaca seperti cerita. | buka halaman → isi → cek hasil |

**Keuntungannya:** kalau selector di website berubah, cukup ubah 1 baris di folder `locators` — semua test otomatis ikut. Kalau data berubah, cukup edit file di `data` atau `.env` tanpa menyentuh kode.

### BasePage (class induk)
Semua page `extends BasePage`, sehingga otomatis punya method `open(url)` yang:
1. **Memblokir iklan** (`page.route(...)` → `route.abort()`) — iklan di demoqa sering menutupi tombol dan membuat test gagal.
2. Membuka URL (`page.goto`). URL cukup ditulis `/webtables` karena `baseURL` sudah diatur di config (dari `BASE_URL`).
3. **Menunggu halaman selesai load** (`waitForLoadState('load')`) — tanpa ini, React / jQuery UI belum aktif sehingga drag dan resize tidak berefek.
4. Menghapus banner `#fixedban` & `footer` yang bisa menutupi tombol Submit.

---

## 7. Penjelasan Kode per Soal

### Soal 1 — Bulk Insert User (Web Tables)

**Data** `data/users.csv` (7 user):
```csv
firstName,lastName,email,age,salary,department
Andi,Wijaya,andi@test.com,25,5000000,IT
...
```

**`data/csvReader.ts`** — fungsi `readCsv('users.csv')` mengubah CSV menjadi array object:
```ts
[{ firstName: 'Andi', lastName: 'Wijaya', email: 'andi@test.com', age: '25', ... }, ...]
```
Caranya: baca file → pecah per baris → baris pertama dijadikan key (header) → baris lainnya dijadikan value.

**`pages/WebTablesPage.ts`**
| Method | Fungsi |
|--------|--------|
| `goto()` | Buka `/webtables` |
| `addUser(user)` | Klik **Add** → isi 6 field → klik **Submit** |
| `getRowByEmail(email)` | Ambil baris tabel yang mengandung email tersebut |

**Alur test:**
1. Loop semua user di CSV → `addUser(user)`.
2. Loop lagi → untuk setiap user, cari barisnya berdasarkan email (email unik), lalu pastikan baris terlihat dan berisi firstName, lastName, age, salary, department.

> Catatan: tabel menampilkan 10 baris per halaman. Data bawaan (3) + CSV (7) = 10, jadi semua muat di halaman pertama.

### Soal 2 — Drag and Drop (Droppable)

**`pages/DroppablePage.ts`** → `dragToTarget()`:
```ts
// tunggu jQuery UI aktif (kelas "ui-droppable" baru ditambahkan setelah inisialisasi)
await this.page.waitForSelector(`${L.dropBox}.ui-droppable`);
await this.page.locator(L.dragBox).dragTo(this.dropBox);
```
Tanpa menunggu kelas `ui-droppable`, drag bisa terjadi sebelum jQuery UI siap sehingga tidak berefek.

Selector diawali `#simpleDropContainer` karena di halaman ini ada beberapa tab dengan id `#droppable` yang sama — kita pilih yang ada di tab **Simple**.

**Verifikasi:** teks kotak target berubah dari `Drop Here` menjadi `Dropped!`.

### Soal 3 — Resize Elemen (Resizable)

Kotak yang dipakai adalah **"Resizable box, starting at 200x200"** (`#resizableBoxWithRestriction`, batas min 150×150 dan maks 500×300 — target 400×200 masih di dalam batas).

**`pages/ResizablePage.ts`** → `resizeTo(400, 200)` bekerja dengan **koreksi otomatis** (maksimal 3 percobaan):
1. Ukur posisi & ukuran kotak serta **handle** (segitiga di pojok kanan bawah) dengan `boundingBox()`.
2. Hitung selisih ke ukuran target (mis. 400−200 = **+200** ke kanan, 200−200 = **0** ke bawah). Jika sudah pas → selesai.
3. Simulasi mouse: `mouse.down()` di handle → geser sejauh selisihnya (20 langkah) → `mouse.up()`.
4. Ulangi dari langkah 1 untuk mengoreksi jika ukurannya meleset (misalnya karena layout bergeser saat drag).

**Verifikasi:**
```ts
await expect(resizable.box).toHaveCSS('width', '400px');
await expect(resizable.box).toHaveCSS('height', '200px');
```

### Soal 4 — Student Registration Form

**Data** berasal dari dua sumber, digabung di **`data/student.ts`**:
- `data/student.json` → data non-pribadi: gender, tanggal lahir, subject, hobby, picture, state, city, dan nilai yang diharapkan di popup (`expectedDateOfBirth`, karena format tampilannya berbeda dengan format input).
- `.env` → data pribadi: nama, email, mobile, address (lihat [bagian 3](#3-environment-variable-env)).

**`pages/PracticeFormPage.ts`** → `fillAndSubmit(student)` mengisi:

| Field | Cara mengisi |
|-------|--------------|
| First/Last Name, Email, Mobile, Address | `fill()` biasa |
| Gender, Hobbies | klik teks label (`getByText('Male', { exact: true })`) — `exact` penting agar "Male" tidak tertukar dengan "Female" |
| Date of Birth | klik → `Ctrl/Cmd + A` (blok isi lama) → ketik `15 Jan 2000` → Enter |
| Subjects, State, City | helper `selectOption()`: ketik teks → **tunggu opsi dropdown muncul** → klik opsi tersebut |
| Picture | `setInputFiles()` dengan file `data/profile.png` |

> Kenapa tidak langsung tekan **Enter** di dropdown autocomplete? Jika opsi belum muncul, Enter akan **men-submit form lebih awal** sehingga popup menutupi field lain dan test menjadi flaky. Opsi dropdown dicari dengan locator `autocompleteOption` (`[id^="react-select"][id*="-option-"]`).

Method `getModalValue('Student Name')` mengambil kolom ke-2 (nilai) di baris popup yang labelnya cocok.

**Verifikasi:** judul popup = `Thanks for submitting the form`, lalu 10 baris data dicek satu per satu memakai loop:

| Label di popup | Nilai yang diharapkan |
|----------------|----------------------|
| Student Name | `STUDENT_FIRST_NAME` + `STUDENT_LAST_NAME` |
| Student Email | `STUDENT_EMAIL` |
| Gender | Male |
| Mobile | `STUDENT_MOBILE` |
| Date of Birth | 15 January,2000 |
| Subjects | Maths |
| Hobbies | Sports |
| Picture | profile.png |
| Address | `STUDENT_ADDRESS` |
| State and City | NCR Delhi |

Untuk mencoba data lain, ubah `.env` (data pribadi) atau `data/student.json` (pilihan State/City yang valid di demoqa: NCR, Uttar Pradesh, Haryana, Rajasthan).

---

## 8. Konfigurasi (`playwright.config.ts`)

| Opsi | Nilai | Arti |
|------|-------|------|
| `testDir` | `./tests` | Folder tempat file test |
| `workers` | `1` | Test dijalankan satu per satu |
| `timeout` | `60_000` | Batas waktu 1 test = 60 detik |
| `retries` | `1` | Test yang gagal diulang 1x (demoqa kadang lambat) |
| `baseURL` | `requireEnv('BASE_URL')` | Diambil dari environment variable, jadi cukup tulis `/webtables` |
| `headless` | `true` | Browser tidak tampil (ubah ke `false` atau pakai `--headed`) |
| `screenshot` | `only-on-failure` | Screenshot otomatis saat gagal |
| `trace` | `retain-on-failure` | Rekaman langkah saat gagal (buka lewat `npm run report`) |
| `reporter` | `list` + `html` | Hasil di terminal + laporan HTML di `playwright-report/` |

## 9. CI/CD (GitHub Actions)

Pipeline ada di **`.github/workflows/playwright.yml`** dan berjalan otomatis saat:
- **push** ke branch mana pun,
- **pull request**,
- dijalankan manual dari tab **Actions** → **Run workflow**.

**Langkah pipeline:**
1. Checkout kode
2. Setup Node.js 22 (dengan cache npm)
3. `npm ci` — install dependency sesuai `package-lock.json`
4. `npx playwright install --with-deps chromium` — install browser + library sistem
5. `npm test` — jalankan semua test, dengan environment variable dari **GitHub Variables**
6. Upload artifact **playwright-report** (laporan HTML, selalu di-upload, disimpan 14 hari)
7. Upload artifact **test-results** (screenshot & trace, hanya jika ada test gagal)

### Mengisi GitHub Variables
Karena file `.env` tidak di-commit, isi nilainya di GitHub sebelum pipeline dijalankan:

1. Buka repo → **Settings** → **Secrets and variables** → **Actions** → tab **Variables**.
2. Klik **New repository variable** dan tambahkan keenam variable berikut (nilai sama seperti di `.env`):
   `BASE_URL`, `STUDENT_FIRST_NAME`, `STUDENT_LAST_NAME`, `STUDENT_EMAIL`, `STUDENT_MOBILE`, `STUDENT_ADDRESS`.
3. Jalankan ulang pipeline: tab **Actions** → pilih run → **Re-run jobs**.

> Untuk data yang benar-benar rahasia (password, token), simpan di tab **Secrets** dan ganti `vars.X` menjadi `secrets.X` di workflow — nilai secret disamarkan (`***`) di log CI.

### Melihat hasil
Tab **Actions** → pilih run → bagian **Artifacts** → download `playwright-report`, ekstrak, lalu jalankan:
```bash
npx playwright show-report <folder-hasil-ekstrak>
```

## 10. Troubleshooting

| Masalah | Solusi |
|---------|--------|
| `Environment variable "X" belum diisi` | Lokal: buat/isi file `.env` (`cp .env.example .env`). CI: tambahkan variable `X` di GitHub Variables. |
| `STUDENT_MOBILE harus tepat 10 digit angka` | Kolom Mobile di demoqa hanya menerima 10 digit (`maxlength="10"`); nilai lebih panjang akan terpotong. Perbaiki nilainya di `.env` / GitHub Variables. |
| `process.loadEnvFile is not a function` | Versi Node terlalu lama — upgrade ke Node 20.12 atau lebih baru. |
| `browserType.launch: Executable doesn't exist` | Jalankan `npx playwright install chromium` |
| Test timeout / halaman lambat | Coba lagi, atau naikkan `timeout` di config. demoqa memang kadang lambat. |
| Klik tidak terjadi / elemen tertutup | Biasanya karena iklan; sudah ditangani di `BasePage`. Jalankan `--headed` untuk melihat langsung. |
| Test kadang lulus kadang gagal (flaky) | Jalankan `npx playwright test --retries=0 --repeat-each=3` untuk mendeteksi, lalu buka trace test yang gagal. |
| Ingin melihat langkah yang gagal | `npm run report` → klik test yang gagal → buka **Trace** |
| Selector tidak ditemukan | Website mungkin berubah. Cek ulang elemen dengan DevTools (F12) dan perbarui file di folder `locators`. |
