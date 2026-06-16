const prisma  = require('../config/prisma');
const notificationService = require('./notification.service');
const AppError = require("../utils/AppError");

const handleMonitorResult = async(monitorId,success) => {
    //finding open incidents
    const openIncident = await prisma.incident.findFirst({
        where:{
            monitorId,
            status:'OPEN'
        }
    });

    //if success is true and status is still open then close it
    if(success){
        if(openIncident){
            await prisma.incident.update({
                where:{
                    id:openIncident.id
                },
                data:{
                    status:'RESOLVED',
                    resolvedAt:new Date()
                }
            });
            const monitor = await prisma.monitor.findUnique({
                where:{
                    id:monitorId
                },
                include:{
                    project:{
                        include:{
                            user:true
                        }
                    }
                }
            });

            console.log(
                "ABOUT TO SEND EMAIL",
                monitor.project.user.email
            );

            await notificationService
            .sendIncidentResolvedEmail(
                monitor.project.user.email,
                monitor.name
            );
        }
        return;
    }

    // if success is false and incident already created then increment it 
    if(openIncident){
        await prisma.incident.update({
            where:{
                id:openIncident.id
            },
            data:{
                failureCount:{
                    increment:1
                }
            }
        });
        return ;
    }

    // if success is false also no incident created before then create one
    await prisma.incident.create({
        data:{
            monitorId,
            status:'OPEN',
            failureCount:1
        }
    });

    const monitor = await prisma.monitor.findUnique({
        where:{
            id:monitorId
        },
        include:{
            project:{
                include:{
                    user:true
                }
            }
        }
    });
    console.log(
                "ABOUT TO SEND EMAIL",
                monitor.project.user.email
    );
    await notificationService.sendIncidentOpenedEmail(
        monitor.project.user.email,
        monitor.name
    ); 
};

const getIncidents = async(userId,page=1,limit=10) => {
    const skip = (page - 1) * limit;
    return await prisma.incident.findMany({
        where:{
            monitor:{
                project:{
                    userId
                }
            }
        },
        include:{
            monitor:true
        },
        orderBy:{
            startedAt:'desc'
        }
    });
};

const getIncidentById = async(userId, incidentId) => {

    const incident =  await prisma.incident.findFirst({
        where:{
            id:incidentId,
            monitor:{
                project:{
                    userId
                }
            }
        },
        include:{
            monitor:true
        }
    });
    if(!incident) throw new AppError('Incident Not Found !',404);
    return incident;

};




module.exports = {
handleMonitorResult,
getIncidents,
getIncidentById
};