const UserModel = require('../models/userModel'); // Import UserModel for database
const bcrypt = require('bcryptjs'); // For hashing passwords

class UserService {
  // Create a new user
  async createUser(data) {
    return await UserModel.createUser(data);
  }

  // Get user by phone number
  async getUserByPhoneNumber(phoneNumber) {
    return await UserModel.getUserByPhoneNumber(phoneNumber);
  }

  // Get all users (Admin)
  async getAllUsers() {
    return await UserModel.getAllUsers();
  }

  // Get a specific user by ID
  async getUserById(id) {
    return await UserModel.getUserById(id);
  }

  // Update user data (including profile picture)
  async updateUser(id, data) {
    return await UserModel.updateUser(id, data);
  }

  // Update user profile picture
  async updateUserProfilePicture(id, profilePicture) {
    return await UserModel.updateUser(id, { profilePicture });
  }

  // Update user password (hashing the new password)
  async updateUserPassword(id, oldPassword, newPassword) {
    const user = await UserModel.getUserById(id);

    // Verify if the user exists
    if (!user) {
      throw new Error('User not found');
    }

    // Check if the old password is correct
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      throw new Error('Old password is incorrect');
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password in the database
    return await UserModel.updateUser(id, { password: hashedPassword });
  }

  // Delete user
  async deleteUser(id) {
    return await UserModel.deleteUser(id);
  }
}

module.exports = new UserService();
