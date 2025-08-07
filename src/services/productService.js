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
      // Check if product exists first
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
      // Check if product exists first
      const existingProduct = await ProductModel.getProductById(id);
      if (!existingProduct) {
        throw new Error('Product not found');
      }

      // Check for dependent records (orders, etc.)
      const dependentOrders = await ProductModel.checkProductDependencies(id);
      if (dependentOrders && dependentOrders.length > 0) {
        throw new Error('Cannot delete product: Product is referenced in existing orders');
      }

      return await ProductModel.deleteProduct(id);
    } catch (error) {
      throw new Error(`Failed to delete product: ${error.message}`);
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
