const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class ProductModel {
  async createProduct(data) {
    try {
      return await prisma.product.create({ data });
    } catch (error) {
      throw new Error(`Database error: ${error.message}`);
    }
  }

  async getAllProducts() {
    try {
      return await prisma.product.findMany({
        include: {
          category: true // Include category information
        }
      });
    } catch (error) {
      throw new Error(`Database error: ${error.message}`);
    }
  }

  async getProductById(id) {
    try {
      const productId = parseInt(id);
      if (isNaN(productId)) {
        throw new Error('Invalid product ID');
      }

      return await prisma.product.findUnique({
        where: { id: productId },
        include: {
          category: true
        }
      });
    } catch (error) {
      throw new Error(`Database error: ${error.message}`);
    }
  }

  async updateProduct(id, data) {
    try {
      const productId = parseInt(id);
      if (isNaN(productId)) {
        throw new Error('Invalid product ID');
      }

      return await prisma.product.update({
        where: { id: productId },
        data,
        include: {
          category: true
        }
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new Error('Product not found');
      }
      throw new Error(`Database error: ${error.message}`);
    }
  }

  async checkProductDependencies(id) {
    try {
      const productId = parseInt(id);
      if (isNaN(productId)) {
        throw new Error('Invalid product ID');
      }

      // Check if product is referenced in orders
      const orders = await prisma.order.findMany({
        where: { productId: productId }
      });

      return orders;
    } catch (error) {
      throw new Error(`Database error: ${error.message}`);
    }
  }

  async deleteProduct(id) {
    try {
      const productId = parseInt(id);
      if (isNaN(productId)) {
        throw new Error('Invalid product ID');
      }

      return await prisma.product.delete({
        where: { id: productId }
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new Error('Product not found');
      }
      if (error.code === 'P2003') {
        throw new Error('Cannot delete product: Product is still referenced by other records');
      }
      throw new Error(`Database error: ${error.message}`);
    }
  }
}

module.exports = new ProductModel();
