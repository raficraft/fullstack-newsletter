import dotenv from 'dotenv';
import express, { Express, Request, Response } from 'express';
import {
  serve as swaggerUiServe,
  setup as swaggerUiSetup,
} from 'swagger-ui-express';
import { swaggerDocs } from './swagger';
import cors from 'cors';
import signupRouter from './routes/newsletter/signup/signup';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

dotenv.config();

const app: Express = express();

app.use(express.json());
app.use(cors());

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Hello, world!' });
});

const PORT: string | number = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.use('/newsletter/signup', signupRouter(prisma));
app.use('/api-docs', swaggerUiServe, swaggerUiSetup(swaggerDocs));
