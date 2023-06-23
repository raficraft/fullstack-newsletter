import express, { Request, Response } from 'express';
import { PrismaClient, Prisma } from '@prisma/client';

/**
 * @swagger
 * /newsletter/search:
 *   get:
 *     tags:
 *       - Newsletter
 *     summary: Search for newsletter subscribers by email
 *     description: Retrieve a list of subscribers based on the provided email part.
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         description: Part of email to search for.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved the list of matching users.
 *         schema:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: number
 *                 example: 1
 *               email:
 *                 type: string
 *                 example: "john@example.com"
 *               active:
 *                 type: boolean
 *                 example: true
 *               createdAt:
 *                 type: string
 *                 format: date-time
 *                 example: "2023-06-23T00:00:00.000Z"
 *               updatedAt:
 *                 type: string
 *                 format: date-time
 *                 example: "2023-06-23T00:00:00.000Z"
 *       400:
 *         description: Query parameter is missing.
 *         schema:
 *           type: object
 *           properties:
 *             error:
 *               type: string
 *               example: "Query parameter is missing"
 *       500:
 *         description: Something went wrong.
 *         schema:
 *           type: object
 *           properties:
 *             error:
 *               type: string
 *               example: "Something went wrong"
 */

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
