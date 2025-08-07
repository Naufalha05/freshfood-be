const ProductModel = require('../models/productModel');

class ProductService {
  async addProduct(data) {
    try {
      // ✅ Validate data before creating
      if (!data.name || !data.description || !data.price || !data.categoryId || !data.userId) {
        throw new Error('Missing required fields');
      }

      // ✅ Validate price is string but represents valid number
      const numericPrice = parseFloat(data.price);
      if (isNaN(numericPrice) || numericPrice <= 0) {
        throw new Error('Price must be a valid number string');
      }

      // ✅ Ensure price is string
      const productData = {
        ...data,
        price: data.price.toString()
      };

      return await ProductModel.createProduct(productData);
    } catch (error) {
      console.error('ProductService.addProduct error:', {
        message: error.message,
        code: error.code,
        data: data
      });
      
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

      // ✅ Ensure price is string if provided
      if (data.price) {
        const numericPrice = parseFloat(data.price);
        if (isNaN(numericPrice) || numericPrice <= 0) {
          throw new Error('Price must be a valid number string');
        }
        data.price = data.price.toString();
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

      // Check for active orders
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
