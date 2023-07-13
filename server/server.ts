import cors from 'cors';
import dotenv from 'dotenv';
import express, { Express } from 'express';
import morgan from 'morgan';
import {
  serve as swaggerUiServe,
  setup as swaggerUiSetup,
} from 'swagger-ui-express';
import newsletterRoutes from './routes/newsletter/index';
import { swaggerDocs } from './swagger';
if (process.env.CLEARDB_DATABASE_URL)
  process.env.DATABASE_URL = process.env.CLEARDB_DATABASE_URL;

dotenv.config();

const app: Express = express();

app.use(express.json());
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms')
);
app.use(cors());

const PORT: string | number = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
app.get('/', (req, res) => {
  res.send('Server is up and running!');
});

newsletterRoutes(app);
app.use('/api-docs', swaggerUiServe, swaggerUiSetup(swaggerDocs));
