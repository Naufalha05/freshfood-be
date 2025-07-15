const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class CategoryModel {
  // Mendapatkan semua kategori
  async getAllCategories() {
    return await prisma.category.findMany();
  }

  // Menambahkan kategori baru
  async addCategory(data) {
    return await prisma.category.create({ data });
  }

  // Memperbarui kategori
  async updateCategory(id, data) {
    return await prisma.category.update({
      where: { id },
      data,
    });
  }

  // Menghapus kategori
  async deleteCategory(id) {
    return await prisma.category.delete({
      where: { id },
    });
  }
}

module.exports = new CategoryModel();
