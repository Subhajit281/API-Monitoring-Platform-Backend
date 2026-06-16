const authService = require('../services/auth.service');
//const jwt = require('jsonwebtoken');

const registerUser = async(req,res,next)=>{
    try{
        const user = await authService.registerUser(req.body);

        res.status(201).json({
            success:true,
            message:'Registered Successfully',
            data:user
        });
    }
    catch(error){
        next(error);
    }
};

const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const data = await authService.loginUser(
            email,
            password
        );

        res.status(200).json({
            success: true,
            message: 'Login Successful',
            data
        });

    } catch (error) {
        next(error);
    }
};

const getProfile = async(req,res) =>{
    res.status(200).json({
        success:true,
        message:'Profile Fetched',
        user : req.user
    });
}

const updateUser = async(req,res,next) => {
    
    try{
        const user = await authService.updateUser(req.user.id , req.body);
        res.status(200).json({
            success: true,
            message:'Profile Updated Successfully',
            data:user
        });
    }
    catch(error){
        next(error);
    }
}

const deleteUser = async(req,res,next) => {
    try{
        const user = await authService.deleteUser(req.user.id);
        res.status(200).json({
            success: true,
            message: 'Deleted Successfully'
        });
    }
    catch(error){
        next(error);
    }
}


module.exports = {
    registerUser,
    loginUser,
    getProfile,
    updateUser,
    deleteUser
};