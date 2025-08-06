const OrderService = require('../services/orderService');

class OrderController {
// Buat pesanan baru
async createOrder(req, res) {
const { userId } = req.user;
const { productId, weight, condition, paymentMethod } = req.body;
try {
  const newOrder = await OrderService.createOrder(
    userId,
    parseInt(productId),
    parseFloat(weight),
    condition,
    paymentMethod
  );

  res.status(201).json({
    message: 'Pesanan berhasil dibuat',
    order: newOrder,
  });
} catch (error) {
  res.status(500).json({ message: error.message });
}
}

// Lihat semua pesanan (Admin saja)
async getAllOrders(req, res) {
const { role } = req.user;
if (role !== 'ADMIN') {
  return res.status(403).json({ message: 'Hanya admin yang dapat melihat semua pesanan' });
}

try {
  const orders = await OrderService.getAllOrders();
  res.json(orders);
} catch (error) {
  res.status(500).json({ message: error.message });
}
}

// Lihat pesanan milik pengguna yang sedang login
async getMyOrders(req, res) {
const { userId } = req.user;
try {
  const orders = await OrderService.getOrdersByUser(userId);
  res.json(orders);
} catch (error) {
  res.status(500).json({ message: error.message });
}
}

// Perbarui pesanan milik user
async updateOrder(req, res) {
const { userId } = req.user;
const orderId = parseInt(req.params.id);
const { weight, condition, address, paymentMethod } = req.body;
try {
  const order = await OrderService.getOrderById(orderId);
  if (!order || order.userId !== userId) {
    return res.status(403).json({ message: 'Anda hanya dapat memperbarui pesanan Anda sendiri' });
  }

  const updatedOrder = await OrderService.updateOrder(orderId, {
    weight,
    condition,
    address,
    paymentMethod: paymentMethod.toUpperCase(),
  });

  res.json({
    message: 'Pesanan berhasil diperbarui',
    order: updatedOrder,
  });
} catch (error) {
  res.status(500).json({ message: error.message });
}
}

// Hapus pesanan milik user
async deleteOrder(req, res) {
const { userId } = req.user;
const orderId = parseInt(req.params.id);
try {
  const order = await OrderService.getOrderById(orderId);
  if (!order || order.userId !== userId) {
    return res.status(403).json({ message: 'Anda hanya dapat menghapus pesanan Anda sendiri' });
  }

  await OrderService.deleteOrder(orderId);

  res.json({ message: 'Pesanan berhasil dihapus' });
} catch (error) {
  res.status(500).json({ message: error.message });
}
}
}

module.exports = new OrderController();