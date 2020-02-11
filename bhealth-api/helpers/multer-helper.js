// Require packages for file manipulation (multer) and cloudinary API (cloudinary and cloudinaryStorage variables)
const cloudinary = require('cloudinary');
const cloudinaryStorage = require('multer-storage-cloudinary');
const multer = require('multer');

// Basic cloudinary API configuration, variables obtained from .env file
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET
});


// Cloudinary storage configuration
const storage = cloudinaryStorage({
  cloudinary,
  folder: 'bhealth-api',
  allowedFormats: ['jpg', 'png', 'jpeg', 'pdf'],
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  }
});

module.exports = multer({ storage });