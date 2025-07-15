const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinaryConfig'); // Import your Cloudinary configuration

// Configure Multer to use Cloudinary for image uploads
const storage = new CloudinaryStorage({
  cloudinary: cloudinary, // Passing the Cloudinary instance
  params: {
    folder: 'profile_pictures', // Specify folder name where images will be stored in Cloudinary
    allowed_formats: ['jpg', 'jpeg', 'png'], // Allowed image formats for upload
    transformation: [{ width: 500, height: 500, crop: 'limit' }], // Optionally resize image
  },
});

// Initialize multer with Cloudinary storage configuration
const upload = multer({ storage: storage });

module.exports = upload;
