// routes/productRoutes.js
const express = require('express');
const ProductController = require('../controllers/productController');
const authenticateJWT = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

const router = express.Router();

// ✅ Wrapper untuk handle multer errors
const handleMulterUpload = (req, res, next) => {
  const uploadMiddleware = upload.single('image');
  
  uploadMiddleware(req, res, (err) => {
    if (err) {
      console.error('❌ Multer error:', err);
      // Pass error ke global error handler
      return next(err);
    }
    next();
  });
};

// ✅ Routes with proper error handling
router.get('/', ProductController.getProducts);
router.get('/:id', ProductController.getProductById);
router.post('/', authenticateJWT, handleMulterUpload, ProductController.addProduct);
router.put('/:id', authenticateJWT, handleMulterUpload, ProductController.updateProduct);
router.delete('/:id', authenticateJWT, ProductController.deleteProduct);

module.exports = router;
