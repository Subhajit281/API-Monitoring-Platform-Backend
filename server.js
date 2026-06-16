require("dotenv").config();

const app = require("./src/app");
const prisma = require("./src/config/prisma");
const {startMonitorJob} = require('./src/jobs/monitor.job');
const {startCleanupJob} = require('./src/jobs/cleanup.job');

const PORT = process.env.PORT || 5000;

async function startServer() {
    try {

        await prisma.$connect();

        console.log(" Database Connected");

        startMonitorJob();
        startCleanupJob();

        app.listen(PORT, () => {
            console.log(
                `Server running on http://localhost:${PORT}`
            );
        });

    } catch (error) {
        console.error(
            "Failed to start server:",
            error
        );
        process.exit(1);
    }
}

startServer();
