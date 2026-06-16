const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');

const {createMonitorSchema, updateMonitorSchema} = require('../validators/monitor.validator.js');
const{
    createMonitor,
    getMonitors,
    getMonitorById,
    updateMonitor,
    deleteMonitor,
    getMonitorResults,
    getMonitorStats
} = require('../controllers/monitor.controller');

router.post('/projects/:projectId/monitors',
    authMiddleware,
    validate(createMonitorSchema),
    createMonitor
);
router.patch('/monitors/:id',
    authMiddleware,
    validate(updateMonitorSchema),
    updateMonitor
);
router.get('/projects/:projectId/monitors',
    authMiddleware,
    getMonitors
);
router.get('/monitors/:id',
    authMiddleware,
    getMonitorById
);
router.delete('/monitors/:id',
    authMiddleware,
    deleteMonitor
);

router.get('/monitors/:id/results',
    authMiddleware,
    getMonitorResults
);

router.get('/:monitorId/stats',
    authMiddleware,
    getMonitorStats
);

module.exports = router;