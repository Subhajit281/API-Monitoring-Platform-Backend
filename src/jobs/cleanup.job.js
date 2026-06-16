const cron = require('node-cron');
const prisma = require('../config/prisma');

const startCleanupJob = () => {

    cron.schedule('0 0 * * *', async () => {

        try {
            const result =
            await prisma.checkResult.deleteMany({
                where:{
                    checkedAt:{
                        lt: new Date(
                            Date.now() -
                            30 * 24 * 60 * 60 * 1000
                        )
                    }
                }
            });

            // console.log(
            //     `Deleted ${result.count} old check results`
            // );

        } catch(error) {

            console.error(
                'Cleanup Job Error:',
                error
            );

        }

    });

};

module.exports = {
    startCleanupJob
};