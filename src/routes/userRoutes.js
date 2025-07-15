const express = require('express');
const UserController = require('../controllers/userController');
const authenticateJWT = require('../middleware/authMiddleware'); // Middleware for JWT authentication
const upload = require('../middleware/upload');
const router = express.Router();

// Route to display user profile
router.get('/profile', authenticateJWT, UserController.getProfile);

// Route to update user's profile picture
router.put('/profile/picture', authenticateJWT, upload.single('profilePicture'), UserController.updateProfilePicture);

// Route to update password
router.put('/profile/password', authenticateJWT, UserController.updatePassword);

// Route to get all users (Admin only)
router.get('/', authenticateJWT, UserController.getAllUsers);

// Route to get user by ID
router.get('/:id', authenticateJWT, UserController.getUserById);

// Route to update user data (Admin only)
router.put('/:id', authenticateJWT, UserController.updateUser);

// Route to delete user (Admin only)
router.delete('/:id', authenticateJWT, UserController.deleteUser);

module.exports = router;
