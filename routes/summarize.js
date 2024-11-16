// routes/summarize.js
const express = require('express');
const router = express.Router();
const summarizeController = require('../app/controllers/summarizeController'); // Correct path

router.post('/', summarizeController.summarizeText);

module.exports = router;