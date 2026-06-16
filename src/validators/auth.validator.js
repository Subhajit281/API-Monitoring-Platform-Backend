    const joi = require('joi');

    const registerSchema = joi.object({
        name:joi.string().min(3).max(50).required(),
        email:joi.string().email().required(),
        password:joi.string().min(8).required()
    });

    const loginSchema = joi.object({
        email:joi.string().email().required(),
        password:joi.string().min(8).required()
    });

    const updateProfileSchema = joi.object({
        email:joi.string().email(),
        name:joi.string().min(3).max(50)
    }).min(1).unknown(false);


    module.exports ={
        registerSchema,
        loginSchema,
        updateProfileSchema
    }