const swaggerJsDoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',

        info: {
            title: 'API Monitoring Platform API',
            version: '1.0.0',
            description: 'API documentation for the monitoring platform'
        },

        servers: [
            {
                url: 'http://localhost:3000/api/v1'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            }
        }
    },
    apis: ['./src/docs/*.js']
};

const swaggerSpec = swaggerJsDoc(options);

module.exports = swaggerSpec;