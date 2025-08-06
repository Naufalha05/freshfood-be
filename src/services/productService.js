const ProductModel = require('../models/productModel');

class ProductService {
  async addProduct(data) {
    return await ProductModel.createProduct(data);
  }

  async getProducts() {
    return await ProductModel.getAllProducts();
  }

  async updateProduct(id, data) {
    return await ProductModel.updateProduct(id, data);
  }

  async deleteProduct(id) {
    return await ProductModel.deleteProduct(id);
  }
}

module.exports = new ProductService();
