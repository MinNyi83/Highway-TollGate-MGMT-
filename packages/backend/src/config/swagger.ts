import swaggerJsdoc from 'swagger-jsdoc';
import { Express, Request, Response } from 'express';
import swaggerUi from 'swagger-ui-express';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'TollGate RFID Pass API',
      version: '1.0.0',
      description: 'Highway Tollgate Management System API with RFID + ANPR integration',
      contact: {
        name: 'TollGate Development Team',
        email: 'dev@tollgate.com',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
      {
        url: 'http://192.168.100.101',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token',
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            error: {
              type: 'string',
            },
            code: {
              type: 'string',
            },
          },
        },
        Vehicle: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            plateNumber: { type: 'string' },
            make: { type: 'string' },
            model: { type: 'string' },
            year: { type: 'integer' },
            color: { type: 'string' },
            vehicleClass: {
              type: 'string',
              enum: ['MOTORCYCLE', 'SEDAN', 'SUV', 'TRUCK', 'BUS'],
            },
            status: {
              type: 'string',
              enum: ['ACTIVE', 'INACTIVE', 'SUSPENDED'],
            },
            approvalStatus: {
              type: 'string',
              enum: ['PENDING', 'APPROVED', 'REJECTED'],
            },
          },
        },
        TollEvent: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            vehicleId: { type: 'string', format: 'uuid' },
            plazaId: { type: 'string', format: 'uuid' },
            entryTime: { type: 'string', format: 'date-time' },
            exitTime: { type: 'string', format: 'date-time' },
            status: {
              type: 'string',
              enum: ['ENTRY', 'EXIT', 'COMPLETED'],
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/modules/**/*.routes.ts'],
};

const specs = swaggerJsdoc(options);

export function setupSwagger(app: Express) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'TollGate API Documentation',
  }));
  
  app.get('/api-docs.json', (req: Request, res: Response) => {
    res.json(specs);
  });
}
