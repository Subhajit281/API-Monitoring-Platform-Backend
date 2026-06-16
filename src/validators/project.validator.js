const joi = require('joi');

const createProjectSchema = joi.object({
    name:joi.string().trim().min(3).max(100).required(),
    description:joi.string().trim().min(20).max(500).required()
});


const updateProjectSchema = joi.object({
    name:joi.string().trim().min(3).max(100),
    description:joi.string().trim().min(20).max(500),
}).min(1).unknown(false);

module.exports = {
    createProjectSchema,
    updateProjectSchema
};