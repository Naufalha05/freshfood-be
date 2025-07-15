// src/services/orderService.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class OrderService {
  // Create new order
  async createOrder(userId, productId, weight, condition, paymentMethod) {
    // Fetch the product by its ID
    const product = await prisma.product.findUnique({ where: { id: productId } });

    // Validate if the product exists
    if (!product) throw new Error('Product not found');

    // Parse valid conditions from the product
    const validConditions = JSON.parse(product.conditionOptions);
    if (!validConditions.includes(condition)) {
      throw new Error('Invalid condition selected for this product');
    }

    // Get the price of the product, ensuring it's a valid number
    const pricePerUnit = parseFloat(product.price); // Convert price from string to float
    if (isNaN(pricePerUnit)) {
      throw new Error('Invalid price format for this product');
    }

    // Calculate the total price for the order
    const totalPrice = pricePerUnit * weight;

    // Fetch user's address
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { address: true }, // Only fetch address
    });

    if (!user) throw new Error('User not found');

    // Create a new order in the database
    const newOrder = await prisma.order.create({
      data: {
        userId,
        productId,
        weight,
        condition,
        price: totalPrice,
        paymentMethod,
        address: user.address, // Auto-fill address from the user's profile
      },
    });

    return newOrder;
  }

  // Get order by ID
  async getOrderById(id) {
    return await prisma.order.findUnique({
      where: { id },
    });
  }

  // Update order details
  async updateOrder(id, data) {
    return await prisma.order.update({
      where: { id },
      data,
    });
  }

  // Delete order
  async deleteOrder(id) {
    return await prisma.order.delete({
      where: { id },
    });
  }
}

module.exports = new OrderService();
