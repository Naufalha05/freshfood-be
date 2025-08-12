// server.js - FIXED untuk Express v5
const express = require('express');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const commentRoutes = require('./routes/commentRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const authenticateJWT = require('./middleware/authMiddleware');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ CORS Configuration
app.use(cors({
  origin: ["http://localhost:5173"],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// ✅ Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', authenticateJWT, userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/comments', authenticateJWT, commentRoutes);
app.use('/api/orders', authenticateJWT, orderRoutes);
app.use('/api/categories', categoryRoutes);

// ✅ FIXED: 404 Handler untuk Express v5 - Gunakan named wildcard
app.use('/*catchAll', (req, res) => {
  console.log(`404 - Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
    code: 'ROUTE_NOT_FOUND'
  });
});

// ✅ CRITICAL: Custom Error Handler - SELALU Return JSON
app.use((err, req, res, next) => {
  console.error('❌ Global Error Handler:', {
    message: err.message,
    code: err.code,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    url: req.originalUrl,
    method: req.method
  });

  // ✅ PASTIKAN Response Header JSON
  res.setHeader('Content-Type', 'application/json');

  // Handle Multer errors
  if (err.name === 'MulterError') {
    switch (err.code) {
      case 'LIMIT_FILE_SIZE':
        return res.status(400).json({
          success: false,
          message: 'File too large. Maximum size is 5MB.',
          code: 'FILE_TOO_LARGE'
        });
      case 'LIMIT_FILE_COUNT':  
        return res.status(400).json({
          success: false,
          message: 'Too many files uploaded.',
          code: 'TOO_MANY_FILES'
        });
      case 'LIMIT_UNEXPECTED_FILE':
        return res.status(400).json({
          success: false,
          message: 'Unexpected field name for file upload.',
          code: 'UNEXPECTED_FIELD'
        });
      default:
        return res.status(400).json({
          success: false,
          message: `Upload error: ${err.message}`,
          code: 'MULTER_ERROR'
        });
    }
  }

  // Handle Prisma errors
  if (err.code && err.code.startsWith('P')) {
    let message = 'Database error occurred';
    let statusCode = 500;
    
    switch (err.code) {
      case 'P2002':
        message = 'Data already exists (duplicate entry)';
        statusCode = 409;
        break;
      case 'P2003':
        message = 'Invalid reference - related record not found';
        statusCode = 400;
        break;
      case 'P2025':
        message = 'Record not found';
        statusCode = 404;
        break;
      default:
        message = 'Database operation failed';
    }
    
    return res.status(statusCode).json({
      success: false,
      message: message,
      code: err.code
    });
  }

  // Generic server error - SELALU return JSON
  const statusCode = err.status || err.statusCode || 500;
  
  return res.status(statusCode).json({
    success: false,
    message: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message || 'Unknown error occurred',
    code: 'INTERNAL_SERVER_ERROR',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
