const telemetryService = require('../services/telemetry.service');

const getProjectOverview = async(
    req,
    res,
    next
)=>{
    try{
        const overview = await telemetryService.getProjectOverview(
            req.user.id,
            req.params.projectId,
            req.query.range || '24H'
        );
        res.status(200).json({
            success:true,
            data:overview
        });

    }
    catch(error){
        next(error);
    }
};

const recordVisit = async(
    req,
    res,
    next
)=>{
    try{
        const { projectId } = req.params;
        const { sessionId } = req.body;

        if (!sessionId) {
            return res.status(400).json({ 
                success: false, 
                message: 'Session ID is required' 
            });
        }

        await telemetryService.logVisit(projectId, sessionId);

        res.status(200).json({ 
            success: true, 
            message: 'Visit recorded successfully' 
        });
    }
    catch(error){
        next(error);
    }
};

module.exports = {
    getProjectOverview,
    recordVisit
};