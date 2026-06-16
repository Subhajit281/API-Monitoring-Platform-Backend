const AppError = require("../utils/AppError");
const prisma = require('../config/prisma');

const createProject = async(userId, projectData) => {

    const existingProject = await prisma.project.findFirst({
        where : {
            userId,
            name:projectData.name
        }
    });
    if(existingProject) throw new AppError(`Project with the name ${projectData.name} already exists`,409);

    const project = await prisma.project.create({
        data:{
            ...projectData,
            userId
        }
    });

    
    return {
        id: project.id,
        name: project.name,
        description: project.description,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt
    };
}

const updateProject = async(userId, projectId, updateData) =>{
    const project = await prisma.project.findFirst({
        where:{
            id : projectId,
            userId
        }
    });
    if(!project) throw new AppError('Project not Found !',404);

     if (updateData.name) {
        const existingProject = await prisma.project.findFirst({
            where: {
                userId,
                name: updateData.name,
                NOT: {
                    id: projectId
                }
            }
        });

        if (existingProject) {
            throw new AppError(
                `Project with the name ${updateData.name} already exists`,
                409
            );
        }
    }
    return await prisma.project.update({
        where:{
            id:projectId
        },
        data:updateData,
        select: {
            id: true,
            name: true,
            description: true,
            createdAt: true,
            updatedAt: true
        }
    });
};

const getProjects = async(userId) => {
    const projects =  await prisma.project.findMany({
        where:{
            userId
        },
        select: {
            id: true,
            name: true,
            description: true,
            createdAt: true,
            updatedAt: true
        },
        orderBy:{
            createdAt : "desc"
        }
    });
    return projects;
};

const getProjectById = async(userId,projectId) => {
    const project = await prisma.project.findFirst({
        where:{
            id: projectId,
            userId
        },
        select: {
            id: true,
            name: true,
            description: true,
            createdAt: true,
            updatedAt: true
        }
    });
    if(!project) throw new AppError('Project not found !',404);

    return project; 
}

const deleteProject = async(userId,projectId) => {

    const project = await prisma.project.findFirst({
        where : {
            id : projectId,
            userId
        }
    });
    if(!project) throw new AppError('Project Not Found !',404);

    await prisma.project.delete({
        where:{
            id:projectId
        }
    });

    return;
}

module.exports = {
    createProject,
    getProjects,
    getProjectById,
    updateProject,
    deleteProject
};