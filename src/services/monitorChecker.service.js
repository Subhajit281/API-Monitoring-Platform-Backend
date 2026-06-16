const axios = require('axios');
const prisma = require('../config/prisma');
const AppError = require('../utils/AppError');
const incidentService = require('./incident.service');

const checkMonitor = async(monitorId) => {

    // fetch monitor
    const monitor = await prisma.monitor.findUnique({
        where:{
            id:monitorId
        }
    });

    if(!monitor) throw new AppError('Monitor Not Found !',404);

    try{

        const startTime = Date.now();
        // axios request
        const response = await axios({
            method:monitor.method,
            url:monitor.url,
            timeout:monitor.timeout,
            validateStatus: () => true
        });
        const responseTime = Date.now() - startTime;

        const success = response.status === monitor.expectedStatus;

        // store results
        await prisma.checkResult.create({
            data:{
                monitorId,
                statusCode:response.status,
                responseTime,
                success
            }
        });

        await incidentService.handleMonitorResult(
            monitorId,
            success
        );

        return{
            statusCode:response.status,
            responseTime,
            success
        };
    }
    catch(error){
        await prisma.checkResult.create({
            data:{
                monitorId,
                statusCode: error.response?.status,
                errorMessage: error.message,
                success:false
            }    
        });
        await incidentService.handleMonitorResult(
            monitorId,
            false
        );

        return{
            success:false,
            statusCode: error.response?.status,
            error:error.message
        }
    }
};

module.exports = {
    checkMonitor
};

