import express, { Request, Response } from 'express';
import { PrismaClient, Prisma } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// ...

router.get('/', async (req: Request, res: Response) => {
  const query = req.query.query as string;

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
    console.error(prismaError);
    return res.status(500).json({ error: 'Something went wrong' });
  }
});

export default router;
