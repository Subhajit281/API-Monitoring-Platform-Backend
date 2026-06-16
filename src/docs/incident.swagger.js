/**
 * @swagger
 * tags:
 *   name: Incidents
 *   description: API endpoints for viewing and tracking service incidents and downtime logs
 */

/**
 * @swagger
 * /incidents:
 *   get:
 *     summary: Get all incidents
 *     tags: [Incidents]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Incidents fetched successfully
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /incidents/{id}:
 *   get:
 *     summary: Get an incident by ID
 *     tags: [Incidents]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique ID of the incident
 *     responses:
 *       200:
 *         description: Incident details fetched successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Incident not found
 */