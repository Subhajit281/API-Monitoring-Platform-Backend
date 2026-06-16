const projectService = require('../services/project.service');

const createProject = async(req,res,next) => {
    try{
        const project = await projectService.createProject(
            req.user.id,
            req.body
        );
        res.status(201).json({
            success:true,
            message:'Project created Successfully',
            data:project
        });
    }catch(error){
        next(error);
    }
};

const updateProject = async(req,res,next) => {
    try{
        const project = await projectService.updateProject(
            req.user.id,
            req.params.id,
            req.body
        );
        res.status(200).json({
            success:true,
            message:'Project updated Successfully',
            data : project
        });
    }catch(error){
        next(error);
    }
}

const getProjects = async(req,res,next) => {
    try{
        const projects = await projectService.getProjects(
            req.user.id
        );
        res.status(200).json({
            success:true,
            message:'Projects Fetched Successfully',
            data:projects
        });
    }catch(error){
        next(error);
    }
};

const getProjectById = async(req,res,next) => {
    try{
        const project = await projectService.getProjectById(
            req.user.id,
            req.params.id
        );
        res.status(200).json({
            success:true,
            message:'Project fetched successfully',
            data:project
        });
    }catch(error){
        next(error);
    }
};

const deleteProject = async(req,res,next) => {
    try{
        await projectService.deleteProject(
            req.user.id,
            req.params.id
        );
        res.status(200).json({
            success:true,
            message:'project deleted successfully'
        });
    }catch(error){
        next(error);
    }
};


module.exports = {
    createProject,
    getProjects,
    getProjectById,
    updateProject,
    deleteProject
};