/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: API endpoints for retrieving monitoring dashboard metrics and overview telemetry
 */

/**
 * @swagger
 * /dashboard/overview:
 *   get:
 *     summary: Get dashboard overview metrics
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard metrics fetched successfully
 *       401:
 *         description: Unauthorized
 */