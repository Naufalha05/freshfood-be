// src/models/orderModel.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class OrderModel {
  // Create new order
  async createOrder(data) {
    return await prisma.order.create({
      data,
    });
  }

  // Get order by ID
  async getOrderById(id) {
    return await prisma.order.findUnique({
      where: { id },
    });
  }

  // Update order
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

module.exports = new OrderModel();
