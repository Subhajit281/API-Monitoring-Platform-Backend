const monitorService = require('../services/monitor.service');

const createMonitor = async(req,res,next) => {
    try{
        const monitor = await monitorService.createMonitor(
            req.user.id,
            req.params.projectId,
            req.body
        );
        res.status(201).json({
            success:true,
            message:'Monitor Created Successfully',
            data:monitor
        });
    }
    catch(error){
        next(error);
    }
};

const updateMonitor = async(req,res,next) => {
    try{
        const monitor = await monitorService.updateMonitor(
            req.user.id,
            req.params.id,
            req.body
        );
        res.status(200).json({
            success:true,
            message:"Monitor updated successfully",
            data:monitor
        });
    }catch(error){
        next(error);
    }
};

const getMonitors = async(req,res,next) => {
    try{
        const monitors = await monitorService.getMonitors(
            req.user.id,
            req.params.projectId
        );
        res.status(200).json({
            success:true,
            message:"Monitors fetched Successfully",
            data:monitors
        });
    }catch(error){
        next(error);
    }
};

const getMonitorById = async(req,res,next) => {
    try{
        const monitor = await monitorService.getMonitorById(
            req.user.id,
            req.params.id
        );
        res.status(200).json({
            success:true,
            message:'Monitor fetched successfully',
            data:monitor
        });
    }catch(error){
        next(error);
    }
};

const deleteMonitor = async(req,res,next) => {
    try{
        await monitorService.deleteMonitor(
            req.user.id,
            req.params.id
        );
        res.status(200).json({
            success:true,
            message:"Monitor deleted successfully"
        });
    }catch(error){
        next(error);
    }
};

const getMonitorResults = async(req,res,next) => {

    try{
        const results =
        await monitorService.getMonitorResults(
            req.user.id,
            req.params.id
        );

        res.status(200).json({
            success:true,
            data:results
        });

    }catch(error){
        next(error);
    }

};


const getMonitorStats = async(req,res)=>{
    const stats =await monitorService.getMonitorStats(
        req.user.id,
        req.params.monitorId
    );

    res.status(200).json({
        success:true,
        data:stats
    });
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