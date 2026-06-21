const prisma = require('../config/prisma');
const AppError = require("../utils/AppError");

const getOverview = async (userId) => {
    // 1. Run all database metrics and relational queries concurrently using Promise.all
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
                    select: { monitors: true } // Native Prisma count optimization to prevent N+1 query overhead
                }
            },
            orderBy: { createdAt: "desc" }
        })
    ]);

    // 2. Format database results into clean items for your React layout components
    const projects = projectsData.map(project => ({
        id: project.id,
        name: project.name,
        description: project.description,
        createdAt: project.createdAt,
        monitorCount: project._count.monitors,
        status: project._count.monitors > 0 ? "Active" : "Draft"
    }));

    // 3. Return the exact unified payload contract your frontend Dashboard expects
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

module.exports = {
    getOverview
};
