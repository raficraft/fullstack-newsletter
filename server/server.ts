import dotenv from 'dotenv';
import express, { Express } from 'express';
import {
  serve as swaggerUiServe,
  setup as swaggerUiSetup,
} from 'swagger-ui-express';
import { swaggerDocs } from './swagger';
import cors from 'cors';
if (process.env.CLEARDB_DATABASE_URL)
  process.env.DATABASE_URL = process.env.CLEARDB_DATABASE_URL;
import newsletterRoutes from './routes/newsletter/index';

dotenv.config();

const app: Express = express();

app.use(express.json());
app.use(
  cors({
    origin: 'https://fullstack-newsletter-knlv.vercel.app',
  })
);

const PORT: string | number = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
app.get('/', (req, res) => {
  res.send('Server is up and running!');
});

newsletterRoutes(app);
app.use('/api-docs', swaggerUiServe, swaggerUiSetup(swaggerDocs));
