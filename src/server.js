const express = require('express');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const cors = require('cors'); // <-- Tambahkan ini
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const commentRoutes = require('./routes/commentRoutes');
const categoryRoutes = require('./routes/categoryRoutes'); // Import category routes
const authenticateJWT = require('./middleware/authMiddleware'); // Middleware for JWT authentication

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Tambahkan middleware CORS DI SINI
app.use(cors({
  origin: ["http://localhost:5173"], // ganti dengan frontend kamu ["http://localhost:5173","https://your-frontend-domain.com"]
  credentials: true
}));

app.use(express.json());
app.use(cookieParser()); // Add cookie-parser middleware to handle cookies

// Routes for authentication (login and registration)
app.use('/api/auth', authRoutes);

// Routes for users, products, comments, orders, and categories with authentication middleware
app.use('/api/users', authenticateJWT, userRoutes);
app.use('/api/products', authenticateJWT, productRoutes);
app.use('/api/comments', authenticateJWT, commentRoutes);
app.use('/api/orders', authenticateJWT, orderRoutes);
app.use('/api/categories', authenticateJWT, categoryRoutes); // Add routes for categories

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
