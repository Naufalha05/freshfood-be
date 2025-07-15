const express = require('express');
const multer = require('multer');
const ProductController = require('../controllers/productController'); // Mengimpor controller produk
const authenticateJWT = require('../middleware/authMiddleware'); // Memasukkan middleware autentikasi JWT

const router = express.Router();

// Konfigurasi penyimpanan Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Menyimpan gambar di folder 'uploads'
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // Menggunakan timestamp sebagai nama file
  }
});

const upload = multer({ storage: storage });

// Rute untuk mendapatkan semua produk (dapat diakses oleh semua pengguna)
router.get('/', ProductController.getProducts);

// Rute untuk menambah produk baru (hanya bisa dilakukan oleh admin)
router.post('/', authenticateJWT, upload.single('image'), ProductController.addProduct);

// Rute untuk memperbarui produk (hanya bisa dilakukan oleh admin)
router.put('/:id', authenticateJWT, upload.single('image'), ProductController.updateProduct);

// Rute untuk menghapus produk (hanya bisa dilakukan oleh admin)
router.delete('/:id', authenticateJWT, ProductController.deleteProduct);

module.exports = router;
