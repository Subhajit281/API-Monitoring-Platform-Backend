const bcrypt = require('bcrypt');
const prisma = require('../config/prisma');
const jwt = require('jsonwebtoken');
const AppError = require("../utils/AppError");

const registerUser = async(userData) => {
    //console.log('A');
    const existingUser = await prisma.user.findUnique({
        where: {
            email: userData.email
        }
    });

    if(existingUser) throw new AppError('User Already Exists', 409);

    //console.log('B');

    const hashedPassword = await bcrypt.hash(userData.password,10);

    //console.log('C');

    const user = await prisma.user.create({
        data: {
            name: userData.name,
            email: userData.email,
            password: hashedPassword
        }
    });
    return {
    id: user.id,
    name: user.name,
    email: user.email
    };
}

const loginUser = async (email, password) => {

    const user = await prisma.user.findUnique({
        where: {
            email
        }
    });
    if (!user) {
        throw new AppError('Invalid Credentials', 401);
    }

    const isMatch = await bcrypt.compare(
        password,
        user.password
    );

    if (!isMatch) {
        throw new AppError('Invalid Credentials', 401);
    }

    const token = jwt.sign(
        { id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' }
    );

    return {
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email
        }
    };
};

const updateUser = async(userId , updateData) =>{
    const { password, ...safeUpdateData } = updateData;
    const user = await prisma.user.update({
        where: {
            id: userId
        },
        data: safeUpdateData
    });
    return {
    id: user.id,
    name: user.name,
    email: user.email
    };
}

const deleteUser = async(userId) =>{
    const user = await prisma.user.delete({
        where: {
            id: userId
        }
    });

  //  if(!user) throw new AppError('User Not Found', 404);

    return {
    id: user.id,
    name: user.name
    };
}

module.exports = {
    registerUser,
    loginUser,
    updateUser,
    deleteUser
};