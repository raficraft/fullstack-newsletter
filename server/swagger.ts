import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: 'Newsletter API',
      description: 'Newsletter API Information',
      contact: {
        name: 'parodi.dev@gmail.com',
      },
      servers: ['http://localhost:4000'],
      version: '1.0.0', // Ajoutez une version ici
    },
  },
  apis: ['./routes/**/*.ts'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

export { swaggerUi, swaggerDocs };
