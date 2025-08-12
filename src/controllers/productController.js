// controllers/productController.js
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
      imageUrl = req.file.path;
    }


    // ✅ Enhanced validation
    if (!name || !description || !price || !categoryId) {
      return res.status(400).json({ message: 'All fields are required' });
    }


    // ✅ Validate price as string but ensure it's numeric
    const numericPrice = parseFloat(price);
    if (isNaN(numericPrice) || numericPrice <= 0) {
      return res.status(400).json({ message: 'Price must be a valid number greater than 0' });
    }


    const parsedCategoryId = parseInt(categoryId);
    if (isNaN(parsedCategoryId)) {
      return res.status(400).json({ message: 'Invalid category ID' });
    }


    try {
      const newProduct = await ProductService.addProduct({
        name: name.trim(),
        description: description.trim(),
        price: price.toString(), // ✅ SIMPAN SEBAGAI STRING
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
      
      if (error.code === 'P2002') {
        return res.status(409).json({ message: 'Product with this name already exists' });
      }
      if (error.code === 'P2003') {
        return res.status(400).json({ message: 'Invalid category ID or user ID' });
      }
      
      res.status(500).json({ 
        message: 'Failed to create product',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }


  async updateProduct(req, res) {
    const { id } = req.params;
    const { name, description, price, categoryId } = req.body;
    let imageUrl = null;


    if (req.file) {
      imageUrl = req.file.path;
    }


    if (!name || !description || !price || !categoryId) {
      return res.status(400).json({ message: 'All fields are required' });
    }


    const numericPrice = parseFloat(price);
    if (isNaN(numericPrice) || numericPrice <= 0) {
      return res.status(400).json({ message: 'Price must be a valid number greater than 0' });
    }


    const parsedCategoryId = parseInt(categoryId);
    if (isNaN(parsedCategoryId)) {
      return res.status(400).json({ message: 'Invalid category ID' });
    }


    try {
      const updateData = {
        name,
        description,
        price: price.toString(), // ✅ SIMPAN SEBAGAI STRING
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
      
      if (error.message.includes('active order') || 
          error.message.includes('referenced') ||
          error.message.includes('complete or cancel')) {
        return res.status(409).json({ 
          message: error.message,
          code: 'PRODUCT_HAS_ACTIVE_ORDERS'
        });
      }
      
      res.status(500).json({ message: error.message });
    }
  }
}


module.exports = new ProductController();
