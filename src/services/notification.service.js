const { Resend } = require('resend');
const AppError = require("../utils/AppError");

const resend = new Resend(
    process.env.RESEND_API_KEY
);

const sendIncidentOpenedEmail = async(
    email,
    monitorName
) => {

    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: ` ${monitorName} is DOWN`,
            html: `
                <h2> Monitor Down</h2>
                <p>${monitorName} is currently unavailable.</p>
                <p>Please investigate the issue.</p>
            `
        });

        console.log(
            `Email sent for monitor: ${monitorName}`
        );
    } catch (error) {
        console.error(
            'Email sending failed:',
            error.message
        );
    }
};

const sendIncidentResolvedEmail = async(
    email,
    monitorName
) => {

    try{

        await resend.emails.send({
            from:'onboarding@resend.dev',
            to:email,
            subject:`${monitorName} is RECOVERED`,
            html:`
                <h2>Monitor Recovered</h2>

                <p>
                    <strong>${monitorName}</strong>
                    is healthy again.
                </p>

                <p>
                    Monitoring system detected
                    successful responses.
                </p>
            `
        });

        console.log(
            `Recovery email sent for ${monitorName}`
        );

    }catch(error){

        console.error(
            'Recovery email failed:',
            error.message
        );

    }

};

module.exports = {
    sendIncidentOpenedEmail,
    sendIncidentResolvedEmail
};