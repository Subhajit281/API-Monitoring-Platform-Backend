const joi = require('joi');

const createMonitorSchema = joi.object({
    name:joi.string().trim().min(3).max(100).required(),
    url: joi.string().uri().required(),
    method:joi.string().valid("GET","POST","PUT","PATCH","DELETE").default("GET"),
    expectedStatus:joi.number().integer().min(100).max(599).default(200),
    interval:joi.number().integer().min(30).max(86400).default(60),
    timeout:joi.number().integer().min(1000).max(30000).default(5000)
}).unknown(false);


const updateMonitorSchema = joi.object({
    name:joi.string().trim().min(3).max(100),
    url: joi.string().uri(),
    method:joi.string().valid("GET","POST","PUT","PATCH","DELETE"),
    expectedStatus:joi.number().integer().min(100).max(599),
    interval:joi.number().integer().min(30).max(86400),
    timeout:joi.number().integer().min(1000).max(30000)
}).min(1).unknown(false);

module.exports ={
    createMonitorSchema,
    updateMonitorSchema
}