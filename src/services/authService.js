const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel');

class AuthService {
  async registerUser({ name, phoneNumber, address, password, confirmPassword }) {
    if (password !== confirmPassword) throw new Error("Passwords don't match");

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await UserModel.createUser({
      name,
      phoneNumber,
      address,
      password: hashedPassword,
    });

    return newUser;
  }

  async loginUser({ phoneNumber, password }) {
    const user = await UserModel.findUserByPhone(phoneNumber);
    if (!user) throw new Error('User not found');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error('Invalid credentials');

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    return { token };
  }
}

module.exports = new AuthService();
