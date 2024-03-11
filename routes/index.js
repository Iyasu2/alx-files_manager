const express = require('express');

const router = express.Router();

// Import the AppController methods
const AppController = require('../controllers/AppController');

// Import the UsersController methods
const UsersController = require('../controllers/UsersController');

// Define endpoints
router.get('/status', AppController.getStatus);
router.get('/stats', AppController.getStats);
router.post('/users', UsersController.postNew);

module.exports = router;
