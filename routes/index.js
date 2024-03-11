const express = require('express');

const router = express.Router();

// Import the AppController methods
const AppController = require('../controllers/AppController');

// Define endpoints
router.get('/status', AppController.getStatus);
router.get('/stats', AppController.getStats);

module.exports = router;
