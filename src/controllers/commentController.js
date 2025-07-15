const CommentService = require('../services/commentService'); // Import CommentService

class CommentController {
  // Menambahkan komentar pada produk
  async addComment(req, res) {
    const { productId, rating, text } = req.body;
    const { userId } = req.user; // Get userId from JWT

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    if (!text) {
      return res.status(400).json({ message: 'Comment text is required' });
    }

    try {
      // Add the comment to the database
      const newComment = await CommentService.createComment({
        userId,
        productId,
        rating,
        text,
      });

      res.status(201).json({
        message: 'Comment added successfully',
        comment: newComment,
      });
    } catch (error) {
      res.status(500).json({ message: 'Error adding comment', error: error.message });
    }
  }

  // Mendapatkan komentar untuk produk
  async getComments(req, res) {
    const { productId } = req.params;

    try {
      // Retrieve all comments for the specified product
      const comments = await CommentService.getCommentsByProductId(productId);

      if (!comments.length) {
        return res.status(404).json({ message: 'No comments found for this product' });
      }

      res.status(200).json({ comments });
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving comments', error: error.message });
    }
  }
}

module.exports = new CommentController();
