const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/auth.middleware');

const {
    getProjectOverview,
    recordVisit
} = require('../controllers/telemetry.controller');

// Existing route for dashboard data
router.get(
    '/projects/:projectId/overview',
    authMiddleware,
    getProjectOverview
);

// New route for tracking unique session visits
router.post(
    '/projects/:projectId/visit',
    authMiddleware,
    recordVisit
);

module.exports = router;