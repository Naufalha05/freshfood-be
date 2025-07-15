const express = require('express');
const CategoryController = require('../controllers/categoryController');
const authenticateJWT = require('../middleware/authMiddleware'); // Middleware untuk autentikasi JWT

const router = express.Router();

// Rute untuk mendapatkan semua kategori (untuk semua pengguna)
router.get('/', CategoryController.getAllCategories);

// Rute untuk menambah kategori (hanya admin yang bisa)
router.post('/', authenticateJWT, CategoryController.addCategory);

// Rute untuk memperbarui kategori (hanya admin yang bisa)
router.put('/:id', authenticateJWT, CategoryController.updateCategory);

// Rute untuk menghapus kategori (hanya admin yang bisa)
router.delete('/:id', authenticateJWT, CategoryController.deleteCategory);

module.exports = router;
