const ProductService = require('../services/productService');

class ProductController {
  async getProducts(req, res) {
    try {
      const products = await ProductService.getProducts();
      res.json(products);
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ message: error.message });
    }
  }

  async getProductById(req, res) {
    try {
      const { id } = req.params;
      const product = await ProductService.getProductById(id);
      
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      
      res.json(product);
    } catch (error) {
      console.error('Error fetching product:', error);
      res.status(500).json({ message: error.message });
    }
  }

  async addProduct(req, res) {
    const { name, description, price, categoryId } = req.body;
    const { userId } = req.user;
    let imageUrl = null;

    if (req.file) {
      imageUrl = req.file.path; // URL dari Cloudinary
    }

    // Validation
    if (!name || !description || !price || !categoryId) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const parsedCategoryId = parseInt(categoryId);
    if (isNaN(parsedCategoryId)) {
      return res.status(400).json({ message: 'Kategori ID harus berupa angka' });
    }

    try {
      const newProduct = await ProductService.addProduct({
        name,
        description,
        price: parseFloat(price),
        categoryId: parsedCategoryId,
        imageUrl,
        userId,
      });

      res.status(201).json({
        message: 'Product added successfully',
        product: newProduct,
      });
    } catch (error) {
      console.error('Error creating product:', error);
      res.status(500).json({ message: error.message });
    }
  }

  async updateProduct(req, res) {
    const { id } = req.params;
    const { name, description, price, categoryId } = req.body;
    let imageUrl = null;

    if (req.file) {
      imageUrl = req.file.path; // URL dari Cloudinary
    }

    // Validation
    if (!name || !description || !price || !categoryId) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const parsedCategoryId = parseInt(categoryId);
    if (isNaN(parsedCategoryId)) {
      return res.status(400).json({ message: 'Kategori ID harus berupa angka' });
    }

    try {
      const updateData = {
        name,
        description,
        price: parseFloat(price),
        categoryId: parsedCategoryId
      };

      if (imageUrl) {
        updateData.imageUrl = imageUrl;
      }

      const updatedProduct = await ProductService.updateProduct(id, updateData);

      res.json({
        message: 'Product updated successfully',
        product: updatedProduct,
      });
    } catch (error) {
      console.error('Error updating product:', error);
      if (error.message.includes('not found')) {
        return res.status(404).json({ message: error.message });
      }
      res.status(500).json({ message: error.message });
    }
  }

  async deleteProduct(req, res) {
    const { id } = req.params;

    try {
      await ProductService.deleteProduct(id);
      res.json({ message: 'Product deleted successfully' });
    } catch (error) {
      console.error('Error deleting product:', error);
      
      if (error.message.includes('not found')) {
        return res.status(404).json({ message: 'Product not found' });
      }
      if (error.message.includes('referenced')) {
        return res.status(409).json({ message: error.message });
      }
      
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new ProductController();
