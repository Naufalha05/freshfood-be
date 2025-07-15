const CategoryModel = require('../models/categoryModel'); // Import CategoryModel

class CategoryService {
  // Mendapatkan semua kategori
  async getAllCategories() {
    return await CategoryModel.getAllCategories();
  }

  // Menambahkan kategori baru
  async addCategory(data) {
    return await CategoryModel.addCategory(data);
  }

  // Memperbarui kategori
  async updateCategory(id, data) {
    return await CategoryModel.updateCategory(id, data);
  }

  // Menghapus kategori
  async deleteCategory(id) {
    return await CategoryModel.deleteCategory(id);
  }
}

module.exports = new CategoryService();
