const express = require('express');
const { viewReport, downloadReport } = require('../controllers/reportController');
const validateTemplate = require('../middlewares/validateTemplate');

const router = express.Router();

router.post('/view/:filename', validateTemplate, viewReport);
router.post('/download/:format/:filename', validateTemplate, downloadReport);

module.exports = router;
