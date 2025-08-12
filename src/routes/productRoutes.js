const express = require('express');
const ProductController = require('../controllers/productController');
const authenticateJWT = require('../middleware/authMiddleware');
const upload = require('../middleware/upload'); // menggunakan Cloudinary


const router = express.Router();


router.get('/', ProductController.getProducts);
router.get('/:id', ProductController.getProductById); // ✅ Route baru untuk get by ID
router.post('/', authenticateJWT, upload.single('image'), ProductController.addProduct);
router.put('/:id', authenticateJWT, upload.single('image'), ProductController.updateProduct);
router.delete('/:id', authenticateJWT, ProductController.deleteProduct);


module.exports = router; 
