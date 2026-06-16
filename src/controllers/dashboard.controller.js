const dashboardService =require('../services/dashboard.service');

const getOverview = async(req,res,next) => {

    try{

        const overview =
        await dashboardService.getOverview(
            req.user.id
        );

        res.status(200).json({
            success:true,
            data:overview
        });

    }catch(error){
        next(error);
    }

};

module.exports = {
    getOverview
};