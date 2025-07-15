const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class CommentModel {
  // Membuat komentar baru
  async createComment(data) {
    return await prisma.comment.create({
      data, // Insert comment data into the database
    });
  }

  // Mendapatkan komentar berdasarkan ID produk
  async getCommentsByProductId(productId) {
    return await prisma.comment.findMany({
      where: { productId },
      orderBy: { timestamp: 'desc' }, // Order by timestamp, latest first
    });
  }
}

module.exports = new CommentModel();
