const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: 'Newsletter API',
      description: 'Newsletter API Information',
      contact: {
        name: 'parodi.dev@gmail.com',
      },
      servers: ['http://localhost:4000'],
    },
  },
  apis: ['./routes/**/*.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = {
  swaggerUi,
  swaggerDocs,
};
