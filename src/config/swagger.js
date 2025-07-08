// swagger.js
const swaggerJSDoc = require('swagger-jsdoc');
const j2s = require('joi-to-swagger');
const { userSchema, updateUserSchema } = require('../validators/userValidator');

const { swagger: nuevoUsuarioSchema } = j2s(userSchema);
const { swagger: actualizarUsuarioSchema } = j2s(updateUserSchema);


const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'Documentación de API',
        version: '1.0.0',
        description: 'API con rutas autenticadas y protegidas',
    },
    servers: [
        {
            url: 'http://localhost:3000',
            description: 'Servidor local',
        },
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
            }
        },
        schemas: {
            NuevoUsuario: nuevoUsuarioSchema,
            ActualizarUsuario: actualizarUsuarioSchema
        }
    },
    security: [
        {
            bearerAuth: []
        }
    ]
};

const options = {
    swaggerDefinition,
    apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
