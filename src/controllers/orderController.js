// src/controllers/orderController.js
const OrderService = require('../services/orderService');

class OrderController {
  // Create new order
  async createOrder(req, res) {
    const { userId } = req.user; // Get userId from JWT
    const { productId, weight, condition, price, address, paymentMethod } = req.body;

    try {
      const newOrder = await OrderService.createOrder({
        userId,
        productId,
        weight,
        condition,
        price,
        address,
        paymentMethod,
      });

      res.status(201).json({
        message: 'Order created successfully',
        order: newOrder,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Edit an order by user (Only users can update their orders)
  async updateOrder(req, res) {
    const { userId } = req.user; // Get userId from JWT
    const { orderId } = req.params;
    const { weight, condition, address, paymentMethod } = req.body;

    try {
      const order = await OrderService.getOrderById(orderId);

      if (order.userId !== userId) {
        return res.status(403).json({ message: 'You can only update your own orders' });
      }

      const updatedOrder = await OrderService.updateOrder(orderId, {
        weight,
        condition,
        address,
        paymentMethod,
      });

      res.json({
        message: 'Order updated successfully',
        order: updatedOrder,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Delete an order by user (Only users can delete their orders)
  async deleteOrder(req, res) {
    const { userId } = req.user; // Get userId from JWT
    const { orderId } = req.params;

    try {
      const order = await OrderService.getOrderById(orderId);

      if (order.userId !== userId) {
        return res.status(403).json({ message: 'You can only delete your own orders' });
      }

      await OrderService.deleteOrder(orderId);

      res.json({
        message: 'Order deleted successfully',
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new OrderController();
