const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class OrderModel {
// Membuat pesanan baru
async createOrder(data) {
return await prisma.order.create({
data,
include: {
product: true,
user: true,
},
});
}

// Mendapatkan semua pesanan (admin)
async getAllOrders() {
return await prisma.order.findMany({
include: {
user: true,
product: true,
},
orderBy: {
createdAt: 'desc',
},
});
}

// Mendapatkan semua pesanan berdasarkan userId (user)
async getOrdersByUserId(userId) {
return await prisma.order.findMany({
where: { userId },
include: {
product: true,
},
orderBy: {
createdAt: 'desc',
},
});
}

// Mendapatkan detail pesanan berdasarkan ID
async getOrderById(id) {
return await prisma.order.findUnique({
where: { id },
include: {
user: true,
product: true,
},
});
}

// Memperbarui pesanan
async updateOrder(id, data) {
return await prisma.order.update({
where: { id },
data,
include: {
product: true,
user: true,
},
});
}

// Menghapus pesanan
async deleteOrder(id) {
return await prisma.order.delete({
where: { id },
});
}
}

module.exports = new OrderModel();