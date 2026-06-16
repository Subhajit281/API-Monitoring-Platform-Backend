const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/auth.middleware');

const {getOverview} = require('../controllers/dashboard.controller');

router.get(
    '/dashboard/overview',
    authMiddleware,
    getOverview
);

module.exports = router;