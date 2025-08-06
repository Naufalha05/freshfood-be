const OrderModel = require('../models/orderModel');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class OrderService {
// Membuat pesanan baru
async createOrder(userId, productId, weight, condition, paymentMethod) {
// Ambil data produk
const product = await prisma.product.findUnique({
where: { id: productId },
});
if (!product) throw new Error('Produk tidak ditemukan');

// Jika produk memiliki opsi kondisi, validasi kondisi
if (product.conditionOptions) {
  let validConditions;
  try {
    validConditions = JSON.parse(product.conditionOptions);
  } catch (e) {
    throw new Error('Format kondisi produk tidak valid');
  }

  if (!validConditions.includes(condition)) {
    throw new Error('Kondisi tidak tersedia untuk produk ini');
  }
}

const pricePerUnit = parseFloat(product.price);
if (isNaN(pricePerUnit)) throw new Error('Format harga produk tidak valid');

const totalPrice = pricePerUnit * weight;

// Ambil data user untuk alamat
const user = await prisma.user.findUnique({
  where: { id: userId },
  select: { address: true },
});

if (!user) throw new Error('Pengguna tidak ditemukan');

// Buat pesanan melalui model
return await OrderModel.createOrder({
  userId,
  productId,
  weight,
  condition,
  price: totalPrice,
  paymentMethod,
  address: user.address,
});
}

// Ambil semua pesanan (admin)
async getAllOrders() {
return await OrderModel.getAllOrders();
}

// Ambil semua pesanan milik user tertentu
async getOrdersByUser(userId) {
return await OrderModel.getOrdersByUserId(userId);
}

// Ambil satu pesanan berdasarkan ID
async getOrderById(id) {
return await OrderModel.getOrderById(id);
}

// Perbarui pesanan
async updateOrder(id, data) {
return await OrderModel.updateOrder(id, data);
}

// Hapus pesanan
async deleteOrder(id) {
return await OrderModel.deleteOrder(id);
}
}
module.exports = new OrderService();
