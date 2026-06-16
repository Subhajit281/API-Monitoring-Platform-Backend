const monitorCheckerService = require('../services/monitorChecker.service');

const checkMonitor = async(req,res,next) =>{
    try{
        const result = await monitorCheckerService.checkMonitor(
            req.params.id
        );
        res.status(200).json({
            success:true,
            message:'Monitor Checked Successfully',
            data:result
        });
    }catch(error){
        next(error);
    }
};

module.exports = {
    checkMonitor
};
