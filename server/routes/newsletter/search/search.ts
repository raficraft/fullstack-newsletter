import express, { Request, Response } from 'express';
import { PrismaClient, Prisma } from '@prisma/client';

export default function (prisma: PrismaClient) {
  const router = express.Router();

  router.get('/', async (req: Request, res: Response) => {
    const query = req.query.query as string;

    if (!query) {
      return res.status(400).json({ error: 'Query parameter is missing' });
    }

    try {
      const results = await prisma.newsletter.findMany({
        where: {
          email: {
            contains: query,
          },
        },
      });

      return res.json(results);
    } catch (error) {
      const prismaError = error as Prisma.PrismaClientKnownRequestError;
      return res.status(500).json({ error: 'Something went wrong' });
    }
  });
  return router;
}
