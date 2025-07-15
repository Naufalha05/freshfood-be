// src/routes/orderRoutes.js
const express = require('express');
const OrderController = require('../controllers/orderController');
const authenticateJWT = require('../middleware/authMiddleware'); // Middleware for JWT authentication

const router = express.Router();

// Route for creating new orders
router.post('/', authenticateJWT, OrderController.createOrder);

// Route for updating orders by users (Only the user who created the order can update it)
router.put('/:orderId', authenticateJWT, OrderController.updateOrder);

// Route for deleting orders by users (Only the user who created the order can delete it)
router.delete('/:orderId', authenticateJWT, OrderController.deleteOrder);

module.exports = router;
