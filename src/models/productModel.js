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
          category: true,
          _count: {
            select: {
              orders: true
            }
          }
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
          category: true,
          orders: {
            select: {
              id: true,
              status: true,
              createdAt: true,
              quantity: true,
              price: true,
              user: {
                select: {
                  id: true,
                  name: true
                }
              }
            },
            orderBy: {
              createdAt: 'desc'
            }
          }
        }
      });
    } catch (error) {
      throw new Error(`Database error: ${error.message}`);
    }
  }


  async getActiveOrders(productId) {
    try {
      const id = parseInt(productId);
      if (isNaN(id)) {
        throw new Error('Invalid product ID');
      }


      return await prisma.order.findMany({
        where: { 
          productId: id,
          status: {
            in: ['PENDING', 'IN_PROGRESS', 'SHIPPED']
          }
        },
        include: {
          user: {
            select: {
              name: true,
              phoneNumber: true
            }
          }
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
        throw new Error('Cannot delete product: Product is still referenced by existing orders');
      }
      throw new Error(`Database error: ${error.message}`);
    }
  }
}


module.exports = new ProductModel();