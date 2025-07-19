const express = require('express');
const OrderController = require('../controllers/orderController');
const authenticateJWT = require('../middleware/authMiddleware');

const router = express.Router();

// Buat pesanan baru (untuk user)
router.post('/', authenticateJWT, OrderController.createOrder);

// Ambil semua pesanan (khusus admin)
router.get('/', authenticateJWT, OrderController.getAllOrders);

// Ambil pesanan milik user yang sedang login
router.get('/my', authenticateJWT, OrderController.getMyOrders);

// Perbarui pesanan (hanya pemilik pesanan)
router.put('/:id', authenticateJWT, OrderController.updateOrder);

// Hapus pesanan (hanya pemilik pesanan)
router.delete('/:id', authenticateJWT, OrderController.deleteOrder);

module.exports = router;