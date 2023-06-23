import express, { Request, Response, Router } from 'express';
import { PrismaClient, Prisma } from '@prisma/client';

const router: Router = express.Router();
const prisma: PrismaClient = new PrismaClient();

/**
 * @swagger
 * /newsletter/unsubscribe/{id}:
 *   put:
 *     tags:
 *       - Newsletter
 *     summary: Edit active field on BDD
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: body
 *         name: updateInfo
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             active:
 *               type: boolean
 *     responses:
 *       200:
 *         description: Successfully edit active field
 *         schema:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *             email:
 *               type: string
 *             active:
 *               type: boolean
 *       400:
 *         description: Invalid value, or id
 *         schema:
 *           type: object
 *           properties:
 *             error:
 *               type: string
 *       500:
 *         description: Something went wrong
 *         schema:
 *           type: object
 *           properties:
 *             error:
 *               type: string
 */

export default function (prisma: PrismaClient) {
  const router = express.Router();

  router.put('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const { active } = req.body;

    if (active === undefined || typeof active !== 'boolean') {
      return res
        .status(400)
        .json({ error: 'Invalid value for "active". Expected a boolean.' });
    }

    try {
      const user = await prisma.newsletter.update({
        where: { id: Number(id) },
        data: { active },
      });

      return res.json(user);
    } catch (error) {
      return res.status(500).json({ error: 'Something went wrong' });
    }
  });

  return router;
}
