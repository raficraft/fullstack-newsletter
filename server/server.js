require('dotenv').config();
const express = require('express');
const { swaggerUi, swaggerDocs } = require('./swagger');
const newsletterRoutes = require('./routes/newsletter');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.json({ message: 'Hello, world!' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.use('/newsletter', newsletterRoutes);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
