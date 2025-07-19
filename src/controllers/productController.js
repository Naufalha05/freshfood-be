const ProductService = require('../services/productService');
const path = require('path');

class ProductController {
// Get all products (Available to all users)
async getProducts(req, res) {
try {
const products = await ProductService.getProducts();
res.json(products);
} catch (error) {
res.status(400).json({ message: error.message });
}
}

// Add a new product (Admin only)
async addProduct(req, res) {
const { name, description, price, categoryId } = req.body;
const { userId } = req.user;
let imageUrl = null;

php
Salin
Edit
if (req.file) {
  imageUrl = path.join('uploads', req.file.filename);
}

// categoryId must be an integer
const parsedCategoryId = parseInt(categoryId);

if (isNaN(parsedCategoryId)) {
  return res.status(400).json({
    message: 'Kategori ID harus berupa angka',
  });
}

try {
  const newProduct = await ProductService.addProduct({
    name,
    description,
    price, // Keep as string
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

// Update an existing product (Admin only)
async updateProduct(req, res) {
const { id } = req.params;
const { name, description, price, categoryId } = req.body;
let imageUrl = null;

php
Salin
Edit
if (req.file) {
  imageUrl = path.join('uploads', req.file.filename);
}

const parsedCategoryId = parseInt(categoryId);

if (isNaN(parsedCategoryId)) {
  return res.status(400).json({
    message: 'Kategori ID harus berupa angka',
  });
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

// Delete a product (Admin only)
async deleteProduct(req, res) {
const { id } = req.params;

php
Salin
Edit
try {
  await ProductService.deleteProduct(id);
  res.json({ message: 'Product deleted successfully' });
} catch (error) {
  res.status(400).json({ message: error.message });
}
}
}

module.exports = new ProductController();