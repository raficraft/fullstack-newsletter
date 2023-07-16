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
      servers: [process.env.NEXT_PUBLIC_API_URL],
      version: '1.0.0',
    },
  },
  apis: ['./controller/**/*.ts'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

export { swaggerDocs, swaggerUi };
