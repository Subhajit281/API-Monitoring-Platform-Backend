const incidentService =
require('../services/incident.service');

const getIncidents = async(req,res,next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    try{

        const incidents =
        await incidentService.getIncidents(
            req.user.id,
            page,
            limit
        );

        res.status(200).json({
            success:true,
            data:incidents
        });

    }catch(error){
        next(error);
    }

};

const getIncidentById = async(req,res,next) => {

    try{

        const incident =
        await incidentService.getIncidentById(
            req.user.id,
            req.params.id
        );

        res.status(200).json({
            success:true,
            data:incident
        });

    }catch(error){
        next(error);
    }

};

module.exports = {
    getIncidents,
    getIncidentById
};