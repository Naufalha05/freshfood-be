const ProductService = require('../services/productService');

class ProductController {
  async getProducts(req, res) {
    try {
      const products = await ProductService.getProducts();
      res.json(products);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async addProduct(req, res) {
    const { name, description, price, categoryId } = req.body;
    const { userId } = req.user;
    let imageUrl = null;

    if (req.file) {
      imageUrl = req.file.path; // URL dari Cloudinary
    }

    const parsedCategoryId = parseInt(categoryId);
    if (isNaN(parsedCategoryId)) {
      return res.status(400).json({ message: 'Kategori ID harus berupa angka' });
    }

    try {
      const newProduct = await ProductService.addProduct({
        name,
        description,
        price,
        categoryId: parsedCategoryId,
        imageUrl,
        userId,
      });

      res.status(201).json({
        message: 'Product added successfully',
        product: newProduct,
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async updateProduct(req, res) {
    const { id } = req.params;
    const { name, description, price, categoryId } = req.body;
    let imageUrl = null;

    if (req.file) {
      imageUrl = req.file.path; // URL dari Cloudinary
    }

    const parsedCategoryId = parseInt(categoryId);
    if (isNaN(parsedCategoryId)) {
      return res.status(400).json({ message: 'Kategori ID harus berupa angka' });
    }

    try {
      const updatedProduct = await ProductService.updateProduct(id, {
        name,
        description,
        price,
        categoryId: parsedCategoryId,
        imageUrl,
      });

      res.json({
        message: 'Product updated successfully',
        product: updatedProduct,
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async deleteProduct(req, res) {
    const { id } = req.params;

    try {
      await ProductService.deleteProduct(id);
      res.json({ message: 'Product deleted successfully' });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}

module.exports = new ProductController();
