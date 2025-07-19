const ProductService = require('../services/productService');
const path = require('path');

class ProductController {
// Mendapatkan semua produk (bisa diakses siapa saja)
async getProducts(req, res) {
try {
const products = await ProductService.getProducts();
res.json(products);
} catch (error) {
res.status(400).json({ message: error.message });
}
}

// Menambahkan produk baru (khusus admin)
async addProduct(req, res) {
try {
const { name, description, price, categoryId } = req.body;
const { userId } = req.user;
 // Validasi dan konversi
  const parsedCategoryId = parseInt(categoryId);
  const parsedPrice = parseFloat(price.toString().replace(/[^\d.-]/g, ''));

  if (isNaN(parsedCategoryId) || isNaN(parsedPrice)) {
    return res.status(400).json({ message: 'Kategori ID dan harga harus berupa angka' });
  }

  let imageUrl = null;
  if (req.file) {
    imageUrl = path.join('uploads', req.file.filename);
  }

  const newProduct = await ProductService.addProduct({
    name,
    description,
    price: parsedPrice,
    categoryId: parsedCategoryId,
    imageUrl,
    userId
  });

  res.status(201).json({
    message: 'Produk berhasil ditambahkan',
    product: newProduct
  });
} catch (error) {
  res.status(400).json({ message: error.message });
}
}

// Memperbarui produk (khusus admin)
async updateProduct(req, res) {
try {
const { id } = req.params;
const { name, description, price, categoryId } = req.body;

javascript
Salin
Edit
  const parsedCategoryId = parseInt(categoryId);
  const parsedPrice = parseFloat(price.toString().replace(/[^\d.-]/g, ''));

  if (isNaN(parsedCategoryId) || isNaN(parsedPrice)) {
    return res.status(400).json({ message: 'Kategori ID dan harga harus berupa angka' });
  }

  let imageUrl = null;
  if (req.file) {
    imageUrl = path.join('uploads', req.file.filename);
  }

  const updatedProduct = await ProductService.updateProduct(id, {
    name,
    description,
    price: parsedPrice,
    categoryId: parsedCategoryId,
    imageUrl,
  });

  res.json({
    message: 'Produk berhasil diperbarui',
    product: updatedProduct
  });
} catch (error) {
  res.status(400).json({ message: error.message });
}
}

// Menghapus produk (khusus admin)
async deleteProduct(req, res) {
try {
const { id } = req.params;
await ProductService.deleteProduct(id);
res.json({ message: 'Produk berhasil dihapus' });
} catch (error) {
res.status(400).json({ message: error.message });
}
}
}

module.exports = new ProductController();