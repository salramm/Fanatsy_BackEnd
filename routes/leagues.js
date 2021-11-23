const express = require('express');
const {protect, authorize} = require('../middleware/auth');
const { createLeague, getLeague } = require('../controllers/leagues');

const router = express.Router();

// Creating a router
router.route('/').post(protect, createLeague);
router.route('/').get(protect, getLeague);

module.exports = router