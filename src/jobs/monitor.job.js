const cron = require('node-cron');
const prisma = require('../config/prisma');
const monitorCheckerService = require('../services/monitorChecker.service');

const startMonitorJob = () =>{
    cron.schedule('*/30 * * * * *',async()=>{
        try{
            console.log(
                'Running Monitor Checks...',
                new Date().toISOString()
            );

            const monitors = await prisma.monitor.findMany({
                where:{
                    isActive:true
                },
                include:{
                    checkResults:{
                        orderBy:{
                            checkedAt:'desc'
                        },
                        take:1
                    }
                }
            });

            for(const monitor of monitors){
                const lastCheck = monitor.checkResults[0];
                    if(lastCheck){

                    const secondsSinceLastCheck =
                        (Date.now() -
                        new Date(lastCheck.checkedAt))
                        / 1000;

                    if( secondsSinceLastCheck < monitor.interval){
                        continue;
                    }
                }
                await monitorCheckerService
                .checkMonitor(monitor.id);
            }
        }catch(error){
            console.error('Monitor Cron Error: ',error);
        }
    });
};

module.exports = {
    startMonitorJob
}