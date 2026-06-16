const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.route");
const projectRoutes = require("./routes/project.route");
const monitorRoutes = require("./routes/monitor.route");
const monitorCheckerRoutes =require('./routes/monitorChecker.route');
const incidentRoutes = require('./routes/incident.route');
const dashboardRoutes = require('./routes/dashboard.route');

const errorMiddleware = require("./middleware/error.middleware");
const apiLimiter = require('./middleware/rateLimiter');
const authLimiter  = require('./middleware/authLimiter');
const helmet = require('helmet');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());

//Rate Limiters
app.use('/api', apiLimiter);
app.use('/api/v1/auth/login',authLimiter);
app.use('/api/v1/auth/register',authLimiter);

// Health Check
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "API is running",
    });
});

app.use('/api-docs',swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/projects",projectRoutes);
app.use("/api/v1",monitorRoutes);
app.use('/api/v1', monitorCheckerRoutes);
app.use('/api/v1', incidentRoutes);
app.use('/api/v1',dashboardRoutes);


// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found",
    });
});

// Global Error Handler
app.use(errorMiddleware);

module.exports = app;