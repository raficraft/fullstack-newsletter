import express, { Request, Response } from 'express';
import { PrismaClient, Prisma } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

/**
 * @swagger
 * /newsletter/registered:
 *   get:
 *     tags:
 *       - Newsletter
 *     summary: Lists users subscribed to the newsletter
 *     parameters:
 *       - in: query
 *         name: sort
 *         description: Parameter to sort the list.
 *         schema:
 *           type: string
 *           enum: [idAsc, idDesc, emailAsc, emailDesc, createdAtAsc, createdAtDesc, updatedAtAsc, updatedAtDesc]
 *       - in: query
 *         name: active
 *         description: Filter users by active status.
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: The list of users registered for the newsletter.
 *       500:
 *         description: Something went wrong.
 */

export default function (prisma: PrismaClient) {
  const router = express.Router();

  router.get('/', async (req: Request, res: Response) => {
    const sort: any = req.query.sort;
    const active: any = req.query.active;

    const sortOptions = [
      'idAsc',
      'idDesc',
      'emailAsc',
      'emailDesc',
      'createdAtAsc',
      'createdAtDesc',
      'updatedAtAsc',
      'updatedAtDesc',
    ];

    // Vérification de la validité du paramètre sort
    if (sort && !sortOptions.includes(sort)) {
      return res.status(400).json({ error: 'Invalid sort parameter.' });
    }

    // Vérification de la validité du paramètre active
    if (active !== undefined && active !== 'true' && active !== 'false') {
      return res.status(400).json({ error: 'Invalid active parameter.' });
    }

    let sortParams: any;
    switch (sort) {
      case 'idAsc':
        sortParams = { id: 'asc' };
        break;
      case 'idDesc':
        sortParams = { id: 'desc' };
        break;
      case 'emailAsc':
        sortParams = { email: 'asc' };
        break;
      case 'emailDesc':
        sortParams = { email: 'desc' };
        break;
      case 'createdAtAsc':
        sortParams = { createdAt: 'asc' };
        break;
      case 'createdAtDesc':
        sortParams = { createdAt: 'desc' };
        break;
      case 'updatedAtAsc':
        sortParams = { updatedAt: 'asc' };
        break;
      case 'updatedAtDesc':
        sortParams = { updatedAt: 'desc' };
        break;
      default:
        break;
    }

    let filterParams: any = {};
    if (active !== undefined) {
      filterParams.active = active === 'true';
    }

    try {
      const registeredUsers = await prisma.newsletter.findMany({
        orderBy: sortParams,
        where: filterParams,
      });

      return res.json(registeredUsers);
    } catch (error) {
      return res.status(500).json({ error: 'Something went wrong' });
    }
  });

  return router;
}
