import dotenv from 'dotenv';
import express, { Express, Request, Response } from 'express';
import {
  serve as swaggerUiServe,
  setup as swaggerUiSetup,
} from 'swagger-ui-express';
import { swaggerDocs } from './swagger';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

import signupRouter from './routes/newsletter/signup/signup';
import searchRouter from './routes/newsletter/search/search';
import registeredRouter from './routes/newsletter/registered/registered';
import editRouter from './routes/newsletter/edit/edit';
import deleteRouter from './routes/newsletter/delete/delete';
import unsubscribeRouter from './routes/newsletter/unsubscribe/unsubscribe';

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

app.use('/newsletter/search', searchRouter(prisma));
app.use('/newsletter/signup', signupRouter(prisma));
app.use('/newsletter/registered', registeredRouter(prisma));
app.use('/newsletter/edit', editRouter(prisma));
app.use('/newsletter/delete', deleteRouter(prisma));
app.use('/newsletter/unsubscribe', unsubscribeRouter(prisma));
app.use('/api-docs', swaggerUiServe, swaggerUiSetup(swaggerDocs));
