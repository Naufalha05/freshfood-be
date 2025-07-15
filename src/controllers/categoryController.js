const CategoryService = require('../services/categoryService'); // Import CategoryService

class CategoryController {
  // Mendapatkan semua kategori (untuk semua pengguna)
  async getAllCategories(req, res) {
    try {
      const categories = await CategoryService.getAllCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Menambahkan kategori (hanya admin yang bisa)
  async addCategory(req, res) {
    const { name, description } = req.body;

    if (!name || !description) {
      return res.status(400).json({ message: 'Name and description are required' });
    }

    try {
      const category = await CategoryService.addCategory({ name, description });
      res.status(201).json(category);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Memperbarui kategori (hanya admin yang bisa)
  async updateCategory(req, res) {
    const { id } = req.params;
    const { name, description } = req.body;

    try {
      const updatedCategory = await CategoryService.updateCategory(id, { name, description });
      res.json(updatedCategory);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Menghapus kategori (hanya admin yang bisa)
  async deleteCategory(req, res) {
    const { id } = req.params;

    try {
      await CategoryService.deleteCategory(id);
      res.json({ message: 'Category deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new CategoryController();
