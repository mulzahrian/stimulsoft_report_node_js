const path = require('path');
const fs = require('fs');

const validateTemplate = (req, res, next) => {
  const filename = req.params.filename;
  req.templatePath = path.join(__dirname, '../templates', filename);

  if (!fs.existsSync(req.templatePath) || path.extname(req.templatePath) !== '.mrt') {
    return res.status(400).send('File template tidak ditemukan atau format tidak valid.');
  }
  next();
};

module.exports = validateTemplate;
