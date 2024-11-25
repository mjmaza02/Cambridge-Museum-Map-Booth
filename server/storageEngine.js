const multer = require('multer')
const path = require('path')
const fs = require('fs')

// Storage Engine to save files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = './media';
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir); // Save to the uploads directory
  },
  filename: function (req, file, cb) {
    // Save the file with its original name
    cb(null, Date.now() + path.extname(file.originalname)); // Filename will include the timestamp to avoid conflicts
  }
});


export const upload = multer({ storage: storage });