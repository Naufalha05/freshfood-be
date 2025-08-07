const ProductModel = require('../models/productModel');

class ProductService {
  async addProduct(data) {
    try {
      return await ProductModel.createProduct(data);
    } catch (error) {
      throw new Error(`Failed to create product: ${error.message}`);
    }
  }

  async getProducts() {
    try {
      return await ProductModel.getAllProducts();
    } catch (error) {
      throw new Error(`Failed to fetch products: ${error.message}`);
    }
  }

  async updateProduct(id, data) {
    try {
      const existingProduct = await ProductModel.getProductById(id);
      if (!existingProduct) {
        throw new Error('Product not found');
      }
      return await ProductModel.updateProduct(id, data);
    } catch (error) {
      throw new Error(`Failed to update product: ${error.message}`);
    }
  }

  async deleteProduct(id) {
    try {
      const existingProduct = await ProductModel.getProductById(id);
      if (!existingProduct) {
        throw new Error('Product not found');
      }

      // ✅ Check for active orders using new method
      const activeOrders = await ProductModel.getActiveOrders(id);
      
      if (activeOrders.length > 0) {
        const ordersList = activeOrders.map(order => 
          `#${order.id} (${order.user.name})`
        ).join(', ');
        
        throw new Error(
          `Cannot delete product: Product has ${activeOrders.length} active order(s): ${ordersList}. ` +
          `Please complete or cancel these orders first.`
        );
      }

      // Check for completed orders (for audit trail warning)
      const allOrders = await ProductModel.checkProductDependencies(id);
      const completedOrders = allOrders.filter(order => 
        order.status === 'COMPLETED'
      );

      if (completedOrders.length > 0) {
        // Allow deletion but give warning
        console.warn(`Deleting product with ${completedOrders.length} completed orders`);
      }

      return await ProductModel.deleteProduct(id);
      
    } catch (error) {
      if (error.code === 'P2003') {
        throw new Error('Cannot delete product: Product is still referenced by existing orders');
      }
      throw error;
    }
  }

  async getProductById(id) {
    try {
      return await ProductModel.getProductById(id);
    } catch (error) {
      throw new Error(`Failed to fetch product: ${error.message}`);
    }
  }
}

module.exports = new ProductService();
