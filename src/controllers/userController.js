const bcrypt = require('bcryptjs');
const UserService = require('../services/userService'); // Import UserService
const cloudinary = require('../config/cloudinaryConfig'); // Import Cloudinary configuration
const path = require('path'); // Module to handle file paths

class UserController {
  // Display user profile
  async getProfile(req, res) {
    const { userId } = req.user; // Get userId from JWT

    try {
      // Get user data based on userId
      const user = await UserService.getUserById(userId);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Return user data along with profile picture URL
      res.json({
        id: user.id,
        name: user.name,
        phoneNumber: user.phoneNumber,
        profilePicture: user.profilePicture, // Display profile picture URL
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  // Update user's profile picture
  async updateProfilePicture(req, res) {
    const { userId } = req.user; // Get userId from JWT

    let profilePicture = null;

    // Check if a file is uploaded
    if (req.file) {
      try {
        // Upload the image to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: 'profile_pictures', // Store in 'profile_pictures' folder
          allowed_formats: ['jpg', 'jpeg', 'png'], // Allowed file formats
        });

        // Store the URL of the uploaded image
        profilePicture = result.secure_url; // Secure URL from Cloudinary
      } catch (error) {
        console.error("Cloudinary Upload Error:", error);
        return res.status(500).json({ message: 'Failed to upload image to Cloudinary', error: error.message });
      }
    }

    try {
      // Update user's profile picture in the database
      const updatedUser = await UserService.updateUserProfilePicture(userId, profilePicture);

      // Send response with updated user data
      res.status(200).json({
        message: 'Profile picture updated successfully',
        user: updatedUser,
      });
    } catch (error) {
      console.error("User Update Error:", error);
      res.status(500).json({ message: 'Error updating user profile', error: error.message });
    }
  }

  // Get all users (Accessible by admin only)
  async getAllUsers(req, res) {
    try {
      const users = await UserService.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Get user by ID
  async getUserById(req, res) {
    try {
      const userId = parseInt(req.params.id);
      const user = await UserService.getUserById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Update user data (Accessible by admin only)
  async updateUser(req, res) {
    try {
      const userId = parseInt(req.params.id);
      const { name, phoneNumber, address } = req.body;
      const updatedUser = await UserService.updateUser(userId, { name, phoneNumber, address });
      res.json(updatedUser);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Delete user (Accessible by admin only)
  async deleteUser(req, res) {
    try {
      const userId = parseInt(req.params.id);
      await UserService.deleteUser(userId);
      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Update user's password (Accessible by the user)
  async updatePassword(req, res) {
    const { userId } = req.user; // Get userId from JWT
    const { oldPassword, newPassword, confirmPassword } = req.body;

    if (!oldPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: 'All fields must be filled' });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: 'New password and confirmation do not match' });
    }

    try {
      // Get the current user's data
      const user = await UserService.getUserById(userId);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Check if the old password matches the stored password
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Old password is incorrect' });
      }

      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update the user's password
      const updatedUser = await UserService.updateUser(userId, { password: hashedPassword });

      res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
      console.error('Error updating password:', error);
      res.status(500).json({ message: 'Error updating password', error: error.message });
    }
  }
}

module.exports = new UserController();
