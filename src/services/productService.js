const ProductModel = require('../models/productModel'); // Mengimpor ProductModel

class ProductService {
  // Menambah produk baru
  async addProduct(data) {
    return await ProductModel.createProduct(data);
  }

  // Mendapatkan semua produk
  async getProducts() {
    return await ProductModel.getAllProducts();
  }

  // Memperbarui produk
  async updateProduct(id, data) {
    return await ProductModel.updateProduct(id, data);
  }

  // Menghapus produk
  async deleteProduct(id) {
    return await ProductModel.deleteProduct(id);
  }
}

module.exports = new ProductService(); // Menyediakan instance ProductService
