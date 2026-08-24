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
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
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
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
  
  app.get('/api-docs.json', (req: Request, res: Response) => {
    res.json(specs);
  });
}
