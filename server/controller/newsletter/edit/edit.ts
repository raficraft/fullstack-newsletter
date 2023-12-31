import { Prisma, PrismaClient } from '@prisma/client';
import express, { Request, Response } from 'express';
import validator from 'validator';

/**
 * @swagger
 * /newsletter/{id}:
 *   patch:
 *     tags:
 *       - Newsletter
 *     summary: Edit email field on BDD
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
 *             email:
 *               type: string
 *     responses:
 *       200:
 *         description: Successfully edit email field
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

  router.patch('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const { email } = req.body;

    if (email === undefined || typeof email !== 'string') {
      return res.status(400).json({ error: 'Valid email is required' });
    }

    if (!email || !validator.isEmail(email)) {
      return res.status(400).json({ error: 'Valid email is required' });
    }

    try {
      const user = await prisma.newsletter.update({
        where: { id: Number(id) },
        data: { email },
      });

      return res.json(user);
    } catch (error) {
      const prismaError = error as Prisma.PrismaClientKnownRequestError;

      if (prismaError.code === 'P2002') {
        res.status(400).json({ error: 'This email is already in use' });
      } else {
        res.status(500).json({ error: 'Something went wrong' });
      }
    }
  });

  return router;
}
