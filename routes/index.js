const express = require('express');
const AppController = require('../contollers/AppController');
const UsersController = require('../contollers/UsersController');

const router = express.Router();
router.use(express.json());

router.get('/status', AppController.getStatus);
router.get('/stats', AppController.getStats);

router.post('/users', UsersController.postNew);

module.exports = router;
