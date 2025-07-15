const CommentModel = require('../models/commentModel'); // Import the CommentModel

class CommentService {
  // Membuat komentar
  async createComment(data) {
    return await CommentModel.createComment(data);
  }

  // Mendapatkan komentar berdasarkan ID produk
  async getCommentsByProductId(productId) {
    return await CommentModel.getCommentsByProductId(productId);
  }
}

module.exports = new CommentService();
