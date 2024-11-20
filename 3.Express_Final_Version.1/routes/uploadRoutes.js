const express = require('express');
const multer = require('multer');
const path = require('path');
const { uploadTemplate } = require('../controllers/uploadController');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../templates')),
  filename: (req, file, cb) => cb(null, file.originalname),
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (path.extname(file.originalname) !== '.mrt') {
      return cb(new Error('Hanya file .mrt yang diizinkan!'));
    }
    cb(null, true);
  },
});

router.post('/', upload.single('template'), uploadTemplate);

module.exports = router;
