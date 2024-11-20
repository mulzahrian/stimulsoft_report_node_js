const uploadTemplate = (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).send('File tidak ditemukan atau format tidak valid.');
      }
      res.status(200).send(`File berhasil diunggah: ${req.file.originalname}`);
    } catch (error) {
      console.error('Error uploading file:', error);
      res.status(500).send('Error uploading file');
    }
  };
  
  module.exports = { uploadTemplate };
  