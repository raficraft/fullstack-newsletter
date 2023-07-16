import deleteRouter from '@controller/delete/delete';
import editRouter from '@controller/edit/edit';
import registeredRouter from '@controller/registered/registered';
import searchRouter from '@controller/search/search';
import signupRouter from '@controller/subscribe/subscribe';
import unsubscribeRouter from '@controller/unsubscribe/unsubscribe';
import { PrismaClient } from '@prisma/client';
import { Express } from 'express';

const prisma = new PrismaClient();

export default function (app: Express) {
  app.use('/newsletter/search', searchRouter(prisma));
  app.use('/newsletter/subscribe', signupRouter(prisma));
  app.use('/newsletter/registered', registeredRouter(prisma));
  app.use('/newsletter/edit', editRouter(prisma));
  app.use('/newsletter/delete', deleteRouter(prisma));
  app.use('/newsletter/subscribe/toggle', unsubscribeRouter(prisma));

  return app;
}
