const ProductService = require('../services/productService'); // Import ProductService
const path = require('path'); // Module to handle file paths

class ProductController {
  // Get all products (Available to all users)
  async getProducts(req, res) {
    try {
      const products = await ProductService.getProducts(); // Get products from service
      res.json(products);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  // Add a new product (Admin only)
  async addProduct(req, res) {
    const { name, description, price, categoryId } = req.body; // 'categoryId' is required
    const { userId } = req.user; // Get userId from JWT token
    let imageUrl = null;

    // Check if image is uploaded and set image URL
    if (req.file) {
      imageUrl = path.join('uploads', req.file.filename); // Save image with relative path
    }

    try {
      const newProduct = await ProductService.addProduct({
        name,
        description,
        price,  // Price remains as string
        categoryId,  // Associate the product with a category
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

  // Update an existing product (Admin only)
  async updateProduct(req, res) {
    const { id } = req.params;
    const { name, description, price, categoryId } = req.body;
    let imageUrl = null;

    // Check if image is uploaded and set image URL
    if (req.file) {
      imageUrl = path.join('uploads', req.file.filename); // Save image with relative path
    }

    try {
      const updatedProduct = await ProductService.updateProduct(id, {
        name,
        description,
        price,  // Price remains as string
        categoryId,  // Updating category
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

  // Delete a product (Admin only)
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

module.exports = new ProductController(); // Export the controller to be used in routes
