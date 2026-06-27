const authService = require('../services/auth.service');
const jwt = require('jsonwebtoken');
const { sendOtpEmail } = require('../services/notification.service');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

// --- STEP 1: Send Registration OTP ---
const sendRegistrationOtp = async (req, res, next) => {
    try {
        const { email } = req.body;
        
        let user = await prisma.user.findUnique({ where: { email } });

        // If user exists and is already verified, block them
        if (user && user.isVerified) {
            return res.status(400).json({ 
                success: false, 
                message: "Email is already registered. Please sign in." 
            });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpire = new Date(Date.now() + 10 * 60 * 1000);

        if (user) {
            // Update the OTP for an existing unverified user
            await prisma.user.update({
                where: { email },
                data: { otp, otpExpire }
            });
        } else {
            // Create a temporary unverified user 
            await prisma.user.create({
                data: {
                    email,
                    name: "Pending User", // Placeholder until step 3
                    password: "PENDING_PASSWORD", // Placeholder until step 3
                    isVerified: false,
                    otp: otp,
                    otpExpire: otpExpire
                }
            });
        }

        await sendOtpEmail(email, otp); // Using your existing notification service
        
        res.status(200).json({ success: true, message: "Verification code sent" });

    } catch (error) {
        console.error("Send Reg OTP Error:", error);
        res.status(500).json({ success: false, message: "Failed to send OTP" });
    }
};

// --- STEP 2: Verify Registration OTP ---
const verifyRegistrationOtp = async (req, res, next) => {
    try {
        const { email, otp } = req.body;

        const user = await prisma.user.findFirst({
            where: {
                email: email,
                otp: otp,
                otpExpire: { gt: new Date() }
            }
        });

        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid or expired code" });
        }

        // Clear the OTP, but do NOT set isVerified to true yet!
        // We wait for them to set their password in step 3.
        await prisma.user.update({
            where: { email },
            data: {
                otp: null,
                otpExpire: null
            }
        });

        res.status(200).json({ success: true, message: "Email verified" });

    } catch (error) {
        console.error("Verify Reg OTP Error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// --- STEP 3: Final Registration (Overwrites previous registerUser) ---
const registerUser = async (req, res, next) => {
    try {
        const { email, name, password } = req.body;

        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            return res.status(404).json({ success: false, message: "Verification session lost. Try again." });
        }

        if (user.isVerified) {
            return res.status(400).json({ success: false, message: "User is already registered" });
        }

        // Hash their actual password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Finalize the account: update name, password, and flip isVerified to true
        const finalizedUser = await prisma.user.update({
            where: { email },
            data: {
                name: name,
                password: hashedPassword,
                isVerified: true 
            }
        });

        // Don't send the password back to the client
        finalizedUser.password = undefined;

        res.status(201).json({
            success: true,
            message: 'Registered Successfully',
            data: finalizedUser
        });
    } catch (error) {
        console.error("Final Register Error:", error);
        res.status(500).json({ success: false, message: "Registration failed" });
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

const getProfile = async (req, res, next) => {
    try {
        
        const profileData = await authService.getUserProfile(req.user.id);
        
        res.status(200).json({
            success: true,
            message: 'Profile Fetched',
            data: profileData 
        });
    } catch (error) {
        next(error);
    }
};

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

const changePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Please provide both current and new passwords"
            });
        }

        await authService.changePassword(req.user.id, currentPassword, newPassword);

        res.status(200).json({
            success: true,
            message: 'Password changed successfully'
        });
    } catch (error) {
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

const requestOtp = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ 
                success: false, 
                message: "Email and password are required" 
            });
        }
        
        const user = await prisma.user.findUnique({
            where: { email }
        });
        
        if (!user) {
            return res.status(401).json({ 
                success: false, 
                message: "Invalid credentials" 
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        
        if (!isMatch) {
            return res.status(401).json({ 
                success: false, 
                message: "Invalid credentials" 
            });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        await prisma.user.update({
            where: { email },
            data: {
                otp: otp,
                otpExpire: new Date(Date.now() + 10 * 60 * 1000)
            }
        });
        
        await sendOtpEmail(user.email, otp);
        
        res.status(200).json({ success: true, message: "OTP sent to email" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error processing OTP request" });
    }
};

const verifyOtp = async (req, res, next) => {
    try {
        const { email, otp } = req.body;
        
        const user = await prisma.user.findFirst({ 
            where: {
                email: email,
                otp: otp,
                otpExpire: {
                    gt: new Date()
                }
            }
        });

        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
        }

        await prisma.user.update({
            where: { email },
            data: {
                otp: null,
                otpExpire: null
            }
        });

        const token = jwt.sign(
            { id: user.id }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1d' }
        );
        
        res.status(200).json({ 
            success: true, 
            message: "Login Successful",
            data: { 
                token, 
                user: { id: user.id, email: user.email } 
            } 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getProfile,
    updateUser,
    deleteUser,
    changePassword,
    requestOtp, 
    verifyOtp,
    sendRegistrationOtp,
    verifyRegistrationOtp
};