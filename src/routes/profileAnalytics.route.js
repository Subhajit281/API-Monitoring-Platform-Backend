const express = require('express');
const router = express.Router();
const { getProfileAnalytics } = require('../controllers/profileAnalytics.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.get('/profile/analytics', authMiddleware, getProfileAnalytics);

module.exports = router;