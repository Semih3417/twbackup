const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Sicherstellen, dass der Ordner existiert
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}

// Speicher-Strategie
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); // Zielordner
  },
  filename: function (req, file, cb) {
    // Generiere einzigartigen Namen: image-TIMESTAMP-ZUFALL.jpg
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Filter (Nur Bilder erlauben)
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Nur Bilddateien sind erlaubt!'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // Max 5MB pro Bild
});

module.exports = upload;