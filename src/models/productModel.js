const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient(); // Inisialisasi PrismaClient

class ProductModel {
  // Membuat produk baru
  async createProduct(data) {
    return await prisma.product.create({
      data,
    });
  }

  // Mengambil semua produk
  async getAllProducts() {
    return await prisma.product.findMany();
  }

  // Memperbarui produk
  async updateProduct(id, data) {
    return await prisma.product.update({
      where: { id },
      data,
    });
  }

  // Menghapus produk
  async deleteProduct(id) {
    return await prisma.product.delete({
      where: { id },
    });
  }
}

module.exports = new ProductModel(); // Menyediakan instance ProductModel untuk digunakan di ProductService
