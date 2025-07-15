const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const UserService = require('../services/userService'); // Import UserService
const dotenv = require('dotenv');
dotenv.config();

class AuthController {
  // User registration
  async register(req, res) {
    const { name, phoneNumber, address, password, confirmPassword, role } = req.body;

    // Validate input
    if (!name || !phoneNumber || !address || !password || !confirmPassword) {
      return res.status(400).json({ message: 'All fields must be filled' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    try {
      // Check if the user with this phone number already exists
      const existingUser = await UserService.getUserByPhoneNumber(phoneNumber);
      if (existingUser) {
        return res.status(400).json({ message: 'User with this phone number already exists' });
      }

      // Encrypt password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Set the user role
      const newUserRole = role === 'ADMIN' ? 'ADMIN' : 'USER'; // Validate role

      // Create a new user
      const newUser = await UserService.createUser({
        name,
        phoneNumber,
        address,
        password: hashedPassword,
        role: newUserRole,
      });

      // Generate JWT token after registration
      const token = jwt.sign(
        { userId: newUser.id, role: newUser.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      // Respond with token and user data
      res.status(201).json({
        message: 'Registration successful',
        token,
        user: {
          id: newUser.id,
          name: newUser.name,
          phoneNumber: newUser.phoneNumber,
          address: newUser.address,
          role: newUser.role,
        }
      });
    } catch (error) {
      console.error("Error during registration:", error);
      res.status(500).json({
        message: 'Server error during registration',
        error: error.message
      });
    }
  }

  // User login
  async login(req, res) {
    const { phoneNumber, password, rememberMe } = req.body;

    if (!phoneNumber || !password) {
      return res.status(400).json({ message: 'Phone number and password are required' });
    }

    try {
      const user = await UserService.getUserByPhoneNumber(phoneNumber);
      if (!user) return res.status(400).json({ message: 'User not found' });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

      // Set expiration based on "Remember Me"
      const expiresIn = rememberMe ? '7d' : '1h'; // 7 days or 1 hour expiration
      const token = jwt.sign(
        { userId: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn }
      );

      // Set the JWT token in a HttpOnly cookie
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Ensure it's sent over HTTPS in production
        maxAge: rememberMe ? 7 * 24 * 60 * 60 * 1000 : 60 * 60 * 1000, // 7 days or 1 hour
      });

      res.json({
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          name: user.name,
          phoneNumber: user.phoneNumber,
          address: user.address,
          role: user.role,
        }
      });
    } catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({
        message: 'Server error during login',
        error: error.message
      });
    }
  }
}

module.exports = new AuthController();
