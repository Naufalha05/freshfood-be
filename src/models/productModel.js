const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class ProductModel {
  async createProduct(data) {
    return await prisma.product.create({ data });
  }

  async getAllProducts() {
    return await prisma.product.findMany();
  }

  async updateProduct(id, data) {
    return await prisma.product.update({
      where: { id },
      data,
    });
  }

  async deleteProduct(id) {
    return await prisma.product.delete({
      where: { id },
    });
  }
}

module.exports = new ProductModel();
