# File Uploader

Aplikasi sederhana untuk upload file berbasis **Node.js** dan **Express**. Mendukung upload file tunggal maupun banyak file sekaligus, dengan validasi tipe dan ukuran file.

## ✨ Fitur

- Upload single file & multiple file
- Validasi tipe file (ekstensi/MIME type)
- Validasi ukuran maksimal file
- Penyimpanan file lokal (folder `uploads/`)
- Endpoint API untuk upload, list, dan download file

## 🛠️ Teknologi

- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [Multer](https://www.npmjs.com/package/multer) — middleware untuk handle `multipart/form-data`

## 📦 Instalasi

1. Clone repository ini
   ```bash
   git clone https://github.com/username/nama-repo.git
   cd nama-repo
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Buat file `.env` (opsional, sesuaikan kebutuhan)
   ```env
   PORT=3000
   MAX_FILE_SIZE=5000000
   ```

4. Jalankan server
   ```bash
   npm start
   ```
   atau untuk mode development dengan auto-reload:
   ```bash
   npm run dev
   ```

Server akan berjalan di `http://localhost:3000`.

## 📁 Struktur Folder

```
.
├── uploads/          # Folder penyimpanan file yang diupload
├── routes/           # Routing endpoint
├── controllers/      # Logic handling upload
├── middlewares/       # Validasi & konfigurasi multer
├── app.js            # Entry point aplikasi
├── package.json
└── README.md
```

## 🚀 Cara Pakai (API)

### Upload single file
```http
POST /upload
Content-Type: multipart/form-data

Body:
- file: (pilih file)
```

**Contoh dengan cURL:**
```bash
curl -X POST http://localhost:3000/upload \
  -F "file=@/path/ke/file.jpg"
```

### Upload multiple file
```http
POST /upload/multiple
Content-Type: multipart/form-data

Body:
- files: (pilih beberapa file)
```

### Response contoh
```json
{
  "success": true,
  "message": "File berhasil diupload",
  "data": {
    "filename": "1234567890-file.jpg",
    "path": "/uploads/1234567890-file.jpg",
    "size": 204800
  }
}
```

## ⚙️ Konfigurasi

| Variabel        | Deskripsi                          | Default |
|-----------------|-------------------------------------|---------|
| `PORT`          | Port server                        | `3000`  |
| `MAX_FILE_SIZE` | Ukuran maksimal file (dalam byte)  | `5MB`   |

## 🧪 Testing

```bash
npm test
```

## 🤝 Kontribusi

Pull request sangat diterima! Untuk perubahan besar, buka issue terlebih dahulu untuk diskusi apa yang ingin diubah.

## 📄 Lisensi

Project ini menggunakan lisensi [MIT](LICENSE).
