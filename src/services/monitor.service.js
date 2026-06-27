const AppError = require('../utils/AppError');
const prisma = require('../config/prisma');

const monitorSelect = {
    id: true,
    name: true,
    url: true,
    method: true,
    expectedStatus: true,
    interval: true,
    timeout: true,
    isActive: true,
    createdAt: true,
    updatedAt: true
};

const createMonitor = async(userId, projectId, monitorData) =>{
    const project = await prisma.project.findFirst({
        where:{
            id:projectId,
            userId
        }
    });

    if(!project) throw new AppError('Project Not Found !',404);

    const existingMonitor = await prisma.monitor.findFirst({
        where:{
            projectId,
            name:monitorData.name
        }
    });
    if(existingMonitor) throw new AppError(`Monitor with name ${monitorData.name} already exists`,409);

    const monitor = await prisma.monitor.create({
        data:{
            ...monitorData,
            projectId
        },
        select:monitorSelect
    });
    return monitor;
}

const updateMonitor = async(
    userId,
    monitorId,
    updateMonitorData
) => {

    const monitor = await prisma.monitor.findFirst({
        where: {
            id: monitorId,
            project: {
                userId
            }
        }
    });

    if(!monitor){
        throw new AppError('Monitor not found',404);
    }

    if(monitor.lastEditedAt) {
        const timeDiff = new Date() - new Date(monitor.lastEditedAt);
        const hoursDiff = timeDiff / (1000 * 60 * 60);
        
        if (hoursDiff < 24) {
            const hoursLeft = Math.ceil(24 - hoursDiff);
            throw new AppError(`Action locked. You can edit this monitor again in ${hoursLeft} hours.`, 403);
        }
    }

    if(updateMonitorData.name){

        const existingMonitor = await prisma.monitor.findFirst({
            where: {
                projectId: monitor.projectId,
                name: updateMonitorData.name,
                NOT: {
                    id: monitorId
                }
            }
        });

        if(existingMonitor){
            throw new AppError(
                `Monitor with name ${updateMonitorData.name} already exists`,
                409
            );
        }
    }

    return await prisma.monitor.update({
        where: {
            id: monitorId
        },
        data: {
            ...updateMonitorData,
            lastEditedAt: new Date()
        },
        select: monitorSelect
    });
};
const getMonitors = async(userId, projectId) => {

    const project = await prisma.project.findFirst({
        where: {
            id: projectId,
            userId
        }
    });

    if(!project){
        throw new AppError('Project not found',404);
    }

    return await prisma.monitor.findMany({
        where: {
            projectId
        },
        select: monitorSelect,
        orderBy: {
            createdAt: 'desc'
        }
    });
};

const getMonitorById = async(userId, monitorId) => {

    const monitor = await prisma.monitor.findFirst({
        where: {
            id: monitorId,
            project: {
                userId
            }
        },
        select: monitorSelect
    });

    if(!monitor){
        throw new AppError('Monitor not found',404);
    }

    return monitor;
};

const deleteMonitor = async(userId, monitorId) => {

    const monitor = await prisma.monitor.findFirst({
        where: {
            id: monitorId,
            project: {
                userId
            }
        }
    });

    if(!monitor){
        throw new AppError('Monitor not found',404);
    }

    await prisma.monitor.delete({
        where: {
            id: monitorId
        }
    });

    return;
};


const getMonitorResults = async(userId,monitorId) =>{
    const monitor = await prisma.monitor.findFirst({
        where:{
            id:monitorId,
            project: {
                userId
            }
        }
    });
    if(!monitor) throw new AppError('Monitor not found !',404);

    return await prisma.checkResult.findMany({
        where:{
            monitorId,
        },
        take:50,
        skip:0,
        orderBy:{
            checkedAt:'desc'
        }
    });
};

const getMonitorStats = async(userId, monitorId) => {

    const monitor = await prisma.monitor.findFirst({
        where:{
            id: monitorId,
            project:{
                userId
            }
        }
    });

    if(!monitor){
        throw new AppError('Monitor not found',404);
    }

    const results = await prisma.checkResult.findMany({
        where:{
            monitorId
        }
    });

    const totalChecks = results.length;

    const successfulChecks = results.filter(
        result => result.success
    ).length;

    const failedChecks = totalChecks - successfulChecks;

    const averageResponseTime =
        totalChecks > 0
        ? Math.round(
            results.reduce(
                (sum,result)=>sum + result.responseTime,
                0
            ) / totalChecks
        )
        : 0;

    const uptimePercentage =
        totalChecks > 0
        ? Number(
            (
                successfulChecks /
                totalChecks
            ) * 100
        ).toFixed(2)
        : 0;

    const incidentCount =
        await prisma.incident.count({
            where:{
                monitorId
            }
        });

    return {
        totalChecks,
        successfulChecks,
        failedChecks,
        uptimePercentage,
        averageResponseTime,
        incidentCount,
        lastCheckedAt:
            results.length > 0
            ? results[0].checkedAt
            : null
    };
};



module.exports = {
    createMonitor,
    getMonitors,
    getMonitorById,
    updateMonitor,
    deleteMonitor,
    getMonitorResults,
    getMonitorStats
};