const prisma = require('../config/prisma');

const getOverview = async (userId) => {
    // 1. Run all database queries concurrently using Promise.all
    const [
        totalProjects,
        totalMonitors,
        activeIncidents,
        resolvedIncidents,
        totalChecks,
        projectsData
    ] = await Promise.all([
        prisma.project.count({ where: { userId } }),
        prisma.monitor.count({ where: { project: { userId } } }),
        prisma.incident.count({ where: { status: 'OPEN', monitor: { project: { userId } } } }),
        prisma.incident.count({ where: { status: 'RESOLVED', monitor: { project: { userId } } } }),
        prisma.checkResult.count({ where: { monitor: { project: { userId } } } }),
        prisma.project.findMany({
            where: { userId },
            include: {
                _count: {
                    select: { monitors: true } // Sub-count optimization
                }
            },
            orderBy: { createdAt: "desc" }
        })
    ]);

    // 2. Map structural database results for the frontend grid matrix
    const projects = projectsData.map(project => ({
        id: project.id,
        name: project.name,
        description: project.description,
        createdAt: project.createdAt,
        monitorCount: project._count.monitors,
        status: project._count.monitors > 0 ? "Active" : "Draft"
    }));

    // 3. Return the payload contract structured for the frontend
    return {
        stats: {
            totalProjects,
            totalMonitors,
            activeIncidents,
            resolvedIncidents,
            totalChecks
        },
        projects
    };
};

// Exporting using 'getOverview' to align with dashboard.controller.js
module.exports = {
    getOverview
};
