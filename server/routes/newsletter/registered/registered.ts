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
 *         name: id
 *         description: Parameter to sort the list by id.
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *       - in: query
 *         name: email
 *         description: Parameter to sort the list by email.
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *       - in: query
 *         name: createdAt
 *         description: Parameter to sort the list by createdAt.
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *       - in: query
 *         name: updatedAt
 *         description: Parameter to sort the list by updatedAt.
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
    const { id, email, createdAt, updatedAt, active } = req.query;

    const sortOptions = ['asc', 'desc'];

    const sortParams: any = {};
    const filterParams: any = {};

    if (id && sortOptions.includes(id as string)) {
      sortParams.id = id;
    }

    if (email && sortOptions.includes(email as string)) {
      sortParams.email = email;
    }

    if (createdAt && sortOptions.includes(createdAt as string)) {
      sortParams.createdAt = createdAt;
    }

    if (updatedAt && sortOptions.includes(updatedAt as string)) {
      sortParams.updatedAt = updatedAt;
    }

    if (active !== undefined && (active === 'true' || active === 'false')) {
      filterParams.active = active === 'true';
    }

    // If no valid sort params provided, return error
    // if (!Object.keys(sortParams).length) {
    //   return res.status(400).json({ error: 'Invalid sort parameters.' });
    // }

    try {
      const registeredUsers = await prisma.newsletter.findMany({
        orderBy: sortParams,
        where: filterParams,
      });

      return res.json(registeredUsers);
    } catch (error) {
      return res.status(500).json({ error: 'Something went wrong.' });
    }
  });

  return router;
}
