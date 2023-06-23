import express, { Request, Response, Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router: Router = express.Router();
const prisma: PrismaClient = new PrismaClient();

/**
 * @swagger
 * /newsletter/delete/{id}:
 *   delete:
 *     tags:
 *       - Newsletter
 *     summary: Delete a email from the BDD
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully deleted email
 *         schema:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *             email:
 *               type: string
 *             active:
 *               type: boolean
 *       404:
 *         description: Email not found
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

  router.delete(
    '/:id',
    async (req: Request, res: Response): Promise<Response> => {
      const { id } = req.params;

      try {
        // Vérifier si l'utilisateur existe
        const user = await prisma.newsletter.findUnique({
          where: { id: parseInt(id, 10) },
        });

        // Si l'utilisateur n'existe pas, renvoyer une erreur 404
        if (!user) {
          return res.status(404).json({ error: 'Email not found' });
        }

        // Si l'utilisateur existe, le supprimer
        const deletedUser = await prisma.newsletter.delete({
          where: { id: parseInt(id, 10) },
        });

        return res.json(deletedUser);
      } catch (error) {
        return res.status(500).json({ error: 'Something went wrong' });
      }
    }
  );

  return router;
}
