const express = require('express');
const CommentController = require('../controllers/commentController'); // Import CommentController
const authenticateJWT = require('../middleware/authMiddleware'); // Middleware for JWT authentication

const router = express.Router();

// Rute untuk menambahkan komentar pada produk
router.post('/', authenticateJWT, CommentController.addComment);

// Rute untuk mendapatkan semua komentar pada produk
router.get('/:productId', CommentController.getComments);

module.exports = router;
