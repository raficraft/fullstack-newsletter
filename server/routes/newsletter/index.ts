import { PrismaClient } from '@prisma/client';
import deleteRouter from '../../controller/newsletter/delete/delete';
import editRouter from '../../controller/newsletter/edit/edit';
import registeredRouter from '../../controller/newsletter/registered/registered';
import searchRouter from '../../controller/newsletter/search/search';
import signupRouter from '../../controller/newsletter/subscribe/subscribe';
import unsubscribeRouter from '../../controller/newsletter/unsubscribe/unsubscribe';
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
