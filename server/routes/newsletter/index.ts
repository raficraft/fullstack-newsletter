import { Express } from 'express';
import signupRouter from './subscribe/subscribe';
import searchRouter from './search/search';
import registeredRouter from './registered/registered';
import editRouter from './edit/edit';
import deleteRouter from './delete/delete';
import unsubscribeRouter from './unsubscribe/unsubscribe';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

export default function (app: Express) {
  app.use('/newsletter/search', searchRouter(prisma));
  app.use('/newsletter/subscribe', signupRouter(prisma));
  app.use('/newsletter/registered', registeredRouter(prisma));
  app.use('/newsletter/edit', editRouter(prisma));
  app.use('/newsletter/delete', deleteRouter(prisma));
  app.use('/newsletter/subscribe/toggle', unsubscribeRouter(prisma));

  return app;
}
