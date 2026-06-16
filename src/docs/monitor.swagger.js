/**
 * @swagger
 * tags:
 *   name: Monitors
 *   description: API endpoints for managing uptime and performance monitors
 */

/**
 * @swagger
 * /projects/{projectId}/monitors:
 *   post:
 *     summary: Create a new monitor for a project
 *     tags: [Monitors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the project
 *     responses:
 *       201:
 *         description: Monitor created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *
 *   get:
 *     summary: Get all monitors for a project
 *     tags: [Monitors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the project
 *     responses:
 *       200:
 *         description: Monitors fetched successfully
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /monitors/{id}:
 *   get:
 *     summary: Get a monitor by ID
 *     tags: [Monitors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the monitor
 *     responses:
 *       200:
 *         description: Monitor details fetched successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Monitor not found
 *
 *   patch:
 *     summary: Update a monitor
 *     tags: [Monitors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the monitor
 *     responses:
 *       200:
 *         description: Monitor updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Monitor not found
 *
 *   delete:
 *     summary: Delete a monitor
 *     tags: [Monitors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the monitor
 *     responses:
 *       200:
 *         description: Monitor deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Monitor not found
 */

/**
 * @swagger
 * /monitors/{id}/results:
 *   get:
 *     summary: Get check results for a specific monitor
 *     tags: [Monitors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the monitor
 *     responses:
 *       200:
 *         description: Monitor results fetched successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Monitor not found
 */

/**
 * @swagger
 * /monitors/{id}/check:
 *   post:
 *     summary: Manually trigger a monitor check
 *     tags: [Monitor Checker]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique ID of the monitor to check
 *     responses:
 *       200:
 *         description: Monitor check executed successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Monitor not found
 */

/**
 * @swagger
 * /monitors/{monitorId}/stats:
 *   get:
 *     summary: Get statistics for a monitor
 *     tags: [Monitors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: monitorId
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique ID of the monitor
 *     responses:
 *       200:
 *         description: Monitor statistics fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalChecks:
 *                       type: integer
 *                       example: 277
 *                     successfulChecks:
 *                       type: integer
 *                       example: 241
 *                     failedChecks:
 *                       type: integer
 *                       example: 36
 *                     uptimePercentage:
 *                       type: number
 *                       example: 87.0
 *                     averageResponseTime:
 *                       type: integer
 *                       example: 1843
 *                     incidentCount:
 *                       type: integer
 *                       example: 4
 *                     lastCheckedAt:
 *                       type: string
 *                       format: date-time
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Monitor not found
 */