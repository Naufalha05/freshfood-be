// controllers/productController.js
const ProductService = require('../services/productService');

class ProductController {
  async getProducts(req, res, next) {
    try {
      const products = await ProductService.getProducts();
      res.json({
        success: true,
        data: products
      });
    } catch (error) {
      console.error('Error fetching products:', error);
      next(error); // Pass ke global error handler
    }
  }

  async getProductById(req, res, next) {
    try {
      const { id } = req.params;
      const product = await ProductService.getProductById(id);
      
      if (!product) {
        return res.status(404).json({ 
          success: false,
          message: 'Product not found',
          code: 'PRODUCT_NOT_FOUND'
        });
      }
      
      res.json({
        success: true,
        data: product
      });
    } catch (error) {
      console.error('Error fetching product:', error);
      next(error);
    }
  }

  async addProduct(req, res, next) {
    try {
      const { name, description, price, categoryId } = req.body;
      const { userId } = req.user;
      let imageUrl = null;

      if (req.file) {
        imageUrl = req.file.path;
      }

      console.log('📦 Received product data:', { 
        name, 
        description, 
        price, 
        priceType: typeof price,
        categoryId, 
        categoryIdType: typeof categoryId,
        userId,
        hasImage: !!req.file 
      });

      // ✅ Enhanced validation dengan specific error messages
      if (!name || name.trim().length === 0) {
        const error = new Error('Product name is required and cannot be empty');
        error.status = 400;
        error.code = 'MISSING_NAME';
        throw error;
      }
      
      if (!description || description.trim().length === 0) {
        const error = new Error('Product description is required and cannot be empty');
        error.status = 400;
        error.code = 'MISSING_DESCRIPTION';
        throw error;
      }
      
      if (!price || price.toString().trim() === '') {
        const error = new Error('Product price is required');
        error.status = 400;
        error.code = 'MISSING_PRICE';
        throw error;
      }
      
      if (!categoryId) {
        const error = new Error('Category selection is required');
        error.status = 400;
        error.code = 'MISSING_CATEGORY';
        throw error;
      }

      if (!userId) {
        const error = new Error('User authentication required');
        error.status = 401;
        error.code = 'MISSING_AUTH';
        throw error;
      }

      // ✅ Validate price as string but ensure it's numeric
      const numericPrice = parseFloat(price);
      if (isNaN(numericPrice) || numericPrice <= 0) {
        const error = new Error('Price must be a valid number greater than 0');
        error.status = 400;
        error.code = 'INVALID_PRICE';
        throw error;
      }

      const parsedCategoryId = parseInt(categoryId);
      if (isNaN(parsedCategoryId)) {
        const error = new Error('Invalid category ID format');
        error.status = 400;
        error.code = 'INVALID_CATEGORY_ID';
        throw error;
      }

      console.log('✅ Validation passed, creating product...');

      const newProduct = await ProductService.addProduct({
        name: name.trim(),
        description: description.trim(),
        price: price.toString(), // ✅ SIMPAN SEBAGAI STRING
        categoryId: parsedCategoryId,
        imageUrl,
        userId,
      });

      console.log('✅ Product created successfully:', newProduct.id);

      res.status(201).json({
        success: true,
        message: 'Product added successfully',
        data: newProduct,
      });
    } catch (error) {
      console.error('❌ Error creating product:', {
        message: error.message,
        code: error.code,
        status: error.status
      });
      
      next(error); // Pass ke global error handler
    }
  }

  async updateProduct(req, res, next) {
    try {
      const { id } = req.params;
      const { name, description, price, categoryId } = req.body;
      let imageUrl = null;

      if (req.file) {
        imageUrl = req.file.path;
      }

      // Validation
      if (!name || !description || !price || !categoryId) {
        const error = new Error('All fields are required');
        error.status = 400;
        error.code = 'MISSING_FIELDS';
        throw error;
      }

      const numericPrice = parseFloat(price);
      if (isNaN(numericPrice) || numericPrice <= 0) {
        const error = new Error('Price must be a valid number greater than 0');
        error.status = 400;
        error.code = 'INVALID_PRICE';
        throw error;
      }

      const parsedCategoryId = parseInt(categoryId);
      if (isNaN(parsedCategoryId)) {
        const error = new Error('Invalid category ID');
        error.status = 400;
        error.code = 'INVALID_CATEGORY_ID';
        throw error;
      }

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
        success: true,
        message: 'Product updated successfully',
        data: updatedProduct,
      });
    } catch (error) {
      console.error('Error updating product:', error);
      next(error);
    }
  }

  async deleteProduct(req, res, next) {
    try {
      const { id } = req.params;

      await ProductService.deleteProduct(id);
      res.json({ 
        success: true,
        message: 'Product deleted successfully' 
      });
    } catch (error) {
      console.error('Error deleting product:', error);
      next(error);
    }
  }
}

module.exports = new ProductController();
