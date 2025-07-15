const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser'); // Importing cookie-parser to handle cookies

dotenv.config();

// Middleware to authenticate JWT
const authenticateJWT = (req, res, next) => {
  let token = req.header('Authorization')?.split(' ')[1]; // Check if token is in the Authorization header

  // If no token in the header, check cookies
  if (!token) {
    token = req.cookies.token; // Token stored in cookies
  }

  // If no token is found, return an error
  if (!token) {
    return res.status(403).send('Access denied: No token provided');
  }

  // Verify the token with JWT Secret from environment variables
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).send('Access denied: Invalid token');  // If token is invalid
    }

    // Store the user data from the token into the request object
    req.user = user;

    // Proceed to the next middleware or route handler
    next();
  });
};

module.exports = authenticateJWT;
