import dotenv from 'dotenv';
import express, { Express } from 'express';
import {
  serve as swaggerUiServe,
  setup as swaggerUiSetup,
} from 'swagger-ui-express';
import { swaggerDocs } from './swagger';
import cors from 'cors';

import newsletterRoutes from '@newsletter/index';

dotenv.config();

const app: Express = express();

app.use(express.json());
app.use(cors());

const PORT: string | number = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

newsletterRoutes(app);
app.use('/api-docs', swaggerUiServe, swaggerUiSetup(swaggerDocs));
