const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs'); // Import bcrypt for password hashing

class UserModel {
  // Create a new user
  async createUser(data) {
    if (!data) {
      throw new Error("User data is required");
    }
    return await prisma.user.create({ data });
  }

  // Get user by phone number
  async getUserByPhoneNumber(phoneNumber) {
    if (!phoneNumber) {
      throw new Error("Phone number is required");
    }
    return await prisma.user.findUnique({
      where: { phoneNumber },
    });
  }

  // Get all users
  async getAllUsers() {
    return await prisma.user.findMany();
  }

  // Get user by ID
  async getUserById(id) {
    if (!id) {
      throw new Error("User ID is required");
    }
    return await prisma.user.findUnique({
      where: { id },
    });
  }

  // Update user data (including password or profile data)
  async updateUser(id, data) {
    if (!id) {
      throw new Error("User ID is required");
    }
    if (!data || Object.keys(data).length === 0) {
      throw new Error("Data is required for update");
    }

    return await prisma.user.update({
      where: { id },
      data,
    });
  }

  // Update user profile picture
  async updateUserProfilePicture(id, profilePicture) {
    if (!id || !profilePicture) {
      throw new Error("User ID and profile picture are required");
    }
    return await prisma.user.update({
      where: { id },
      data: { profilePicture },
    });
  }

  // Update user password (hashing the new password)
  async updateUserPassword(id, oldPassword, newPassword) {
    if (!id || !oldPassword || !newPassword) {
      throw new Error("User ID, old password, and new password are required");
    }

    // Fetch the user
    const user = await prisma.user.findUnique({
      where: { id },
    });

    // Check if user exists
    if (!user) {
      throw new Error('User not found');
    }

    // Check if the old password matches the stored password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      throw new Error('Old password is incorrect');
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the password in the database
    return await prisma.user.update({
      where: { id },
      data: { password: hashedPassword },
    });
  }

  // Delete a user
  async deleteUser(id) {
    if (!id) {
      throw new Error("User ID is required");
    }
    return await prisma.user.delete({
      where: { id },
    });
  }
}

module.exports = new UserModel();
