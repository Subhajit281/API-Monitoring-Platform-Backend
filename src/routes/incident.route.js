const express = require('express');
const router = express.Router();

const authMiddleware =
require('../middleware/auth.middleware');

const {
    getIncidents,
    getIncidentById
} = require('../controllers/incident.controller');

router.get(
    '/incidents',
    authMiddleware,
    getIncidents
);

router.get(
    '/incidents/:id',
    authMiddleware,
    getIncidentById
);

module.exports = router;