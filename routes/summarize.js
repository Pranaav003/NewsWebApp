// routes/summarize.js
const express = require('express');
const router = express.Router();
const summarizeController = require('../controllers/summarizeController');

// POST /summarize
router.post('/', summarizeController.summarizeText);

module.exports = router;
