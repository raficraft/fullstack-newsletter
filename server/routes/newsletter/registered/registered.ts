import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

/**
 * @swagger
 * /newsletter/registered:
 *   get:
 *     tags:
 *       - Newsletter
 *     summary: Lists users subscribed to the newsletter
 *     parameters:
 *       - in: query
 *         name: sortBy
 *         description: Parameter to sort the list.
 *         schema:
 *           type: string
 *           enum: [email, createdAt, updatedAt]
 *       - in: query
 *         name: order
 *         description: Order to sort the list.
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *       - in: query
 *         name: active
 *         description: Filter users by active status.
 *         schema:
 *           type: string
 *           enum: [true, false]
 *     responses:
 *       200:
 *         description: The list of users registered for the newsletter.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         description: Something went wrong.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */

export default function (prisma: PrismaClient) {
  const router = express.Router();

  router.get('/', async (req: Request, res: Response): Promise<Response> => {
    const { email, createdAt, updatedAt, active } = req.query;

    const sortOptions = ['asc', 'desc'];

    let sortField: string | null = null;
    let sortOrder: 'asc' | 'desc' | null = null;

    switch (true) {
      case email && sortOptions.includes(email as string):
        sortField = 'email';
        sortOrder = email as 'asc' | 'desc';
        break;
      case createdAt && sortOptions.includes(createdAt as string):
        sortField = 'createdAt';
        sortOrder = createdAt as 'asc' | 'desc';
        break;
      case updatedAt && sortOptions.includes(updatedAt as string):
        sortField = 'updatedAt';
        sortOrder = updatedAt as 'asc' | 'desc';
        break;
      default:
        break;
    }

    const filterParams: any = {};
    if (active !== undefined && (active === 'true' || active === 'false')) {
      filterParams.active = active === 'true';
    }

    try {
      const sortParams =
        sortField && sortOrder ? { [sortField]: sortOrder } : {};

      const registeredUsers = await prisma.newsletter.findMany({
        orderBy: sortParams,
        where: filterParams,
      });

      return res.json(registeredUsers);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Something went wrong.' });
    }
  });

  return router;
}
