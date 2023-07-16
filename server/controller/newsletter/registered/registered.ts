import { PrismaClient } from '@prisma/client';
import express, { Request, Response } from 'express';

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
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: The user ID.
 *                   email:
 *                     type: string
 *                     description: The user's email.
 *                   active:
 *                     type: boolean
 *                     description: Whether the user is active or not.
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     description: The date the user was created.
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                     description: The date the user was last updated.
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
    const { sortBy, order, active } = req.query;

    const sortOptions = ['asc', 'desc'];
    const fieldOptions = ['email', 'createdAt', 'updatedAt'];

    let sortOrder: 'asc' | 'desc' | null = null;
    let sortField: string | null = null;

    if (order && !sortOptions.includes(order as string)) {
      return res.status(400).json({ error: 'Invalid order parameter.' });
    } else {
      sortOrder = order as 'asc' | 'desc';
    }

    if (sortBy && !fieldOptions.includes(sortBy as string)) {
      return res.status(400).json({ error: 'Invalid sortBy parameter.' });
    } else {
      sortField = sortBy as string;
    }

    const filterParams: any = {};
    if (active !== undefined && (active === 'true' || active === 'false')) {
      filterParams.active = active === 'true';
    } else if (active !== undefined) {
      return res.status(400).json({ error: 'Invalid active parameter.' });
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
      return res.status(500).json({ error: 'Something went wrong' });
    }
  });

  return router;
}
