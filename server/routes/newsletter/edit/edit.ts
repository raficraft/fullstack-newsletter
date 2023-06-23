import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

/**
 * @swagger
 * /newsletter/edit/{id}:
 *   put:
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

  router.put('/:id', async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    const { email } = req.body;

    if (email === undefined || typeof email !== 'string') {
      return res
        .status(400)
        .json({ error: 'Invalid value for "email". Expected a string.' });
    }

    try {
      const user = await prisma.newsletter.update({
        where: { id: Number(id) },
        data: { email },
      });

      return res.json(user);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: 'Something went wrong' });
    }
  });

  return router;
}
