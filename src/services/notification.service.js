const nodemailer = require('nodemailer');
const AppError = require("../utils/AppError");

// Initialize the SMTP transporter (using Gmail)
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true only for port 465
    family: 4,     // Force IPv4
    auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD
    }
});

const sendIncidentOpenedEmail = async (email, monitorName) => {
    try {
        await transporter.sendMail({
            from: `"UpFlow Alerts" <${process.env.SMTP_EMAIL}>`,
            to: email,
            subject: `🚨 ${monitorName} is DOWN`,
            html: `
                <h2>Monitor Down</h2>
                <p><strong>${monitorName}</strong> is currently unavailable.</p>
                <p>Please investigate the issue.</p>
            `
        });

        console.log(`Email sent for monitor: ${monitorName}`);
    } catch (error) {
        console.error('Email sending failed:', error.message);
    }
};

const sendIncidentResolvedEmail = async (email, monitorName) => {
    try {
        await transporter.sendMail({
            from: `"UpFlow Alerts" <${process.env.SMTP_EMAIL}>`,
            to: email,
            subject: `✅ ${monitorName} is RECOVERED`,
            html: `
                <h2>Monitor Recovered</h2>
                <p>
                    <strong>${monitorName}</strong> is healthy again.
                </p>
                <p>
                    Monitoring system detected successful responses.
                </p>
            `
        });

        console.log(`Recovery email sent for ${monitorName}`);
    } catch (error) {
        console.error('Recovery email failed:', error.message);
    }
};

// --- NEW: AUTHENTICATION EMAILS ---

const sendOtpEmail = async (email, otp) => {
    try {
        await transporter.sendMail({
            from: `"UpFlow Auth" <${process.env.SMTP_EMAIL}>`,
            to: email,
            subject: 'Your UpFlow Login Code',
            html: `
                <div style="font-family: sans-serif; text-align: center; padding: 20px;">
                    <h2>Welcome back to UpFlow</h2>
                    <p>Your one-time login code is:</p>
                    <h1 style="letter-spacing: 5px; color: #2563eb;">${otp}</h1>
                    <p>This code will expire in 10 minutes.</p>
                </div>
            `
        });

        console.log(`OTP Email sent to: ${email}`);
    } catch (error) {
        console.error('OTP email failed:', error.message);
        throw new AppError('Failed to send OTP email', 500); 
    }
};

module.exports = {
    sendIncidentOpenedEmail,
    sendIncidentResolvedEmail,
    sendOtpEmail
};