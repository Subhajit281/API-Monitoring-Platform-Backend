const express = require('express');
const router = express.Router();

const {checkMonitor} = require('../controllers/monitorChecker.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.post('/monitors/:id/check',authMiddleware,checkMonitor);

module.exports = router;
