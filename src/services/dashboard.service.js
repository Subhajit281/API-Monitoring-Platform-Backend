const prisma = require('../config/prisma');
const AppError = require("../utils/AppError");

const getOverview = async(userId) => {

    const totalProjects =
    await prisma.project.count({
        where:{
            userId
        }
    });

    const totalMonitors =
    await prisma.monitor.count({
        where:{
            project:{
                userId
            }
        }
    });

    const activeIncidents =
    await prisma.incident.count({
        where:{
            status:'OPEN',
            monitor:{
                project:{
                    userId
                }
            }
        }
    });

    const resolvedIncidents =
    await prisma.incident.count({
        where:{
            status:'RESOLVED',
            monitor:{
                project:{
                    userId
                }
            }
        }
    });

    const totalChecks =
    await prisma.checkResult.count({
        where:{
            monitor:{
                project:{
                    userId
                }
            }
        }
    });

    const projectsData =
    await prisma.project.findMany({
        where:{
            userId
        },
        include:{
            _count:{
                select:{
                    monitors:true
                }
            }
        },
        orderBy:{
            createdAt:"desc"
        }
    });

    const projects = projectsData.map(project => ({
        id: project.id,
        name: project.name,
        description: project.description,
        createdAt: project.createdAt,
        monitorCount: project._count.monitors,
        status: project._count.monitors > 0 ? "Active" : "Draft"
    }));

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
