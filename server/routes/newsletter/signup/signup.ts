import validator from 'validator';
import express, { Request, Response } from 'express';
import { PrismaClient, Prisma } from '@prisma/client';

/**
 * @swagger
 * /newsletter/signup:
 *   post:
 *     tags:
 *       - Newsletter
 *     summary: Sign up for the newsletter
 *     description: Sign up for the newsletter with an email address.
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: email
 *         description: The email to register.
 *         schema:
 *           type: object
 *           required:
 *             - email
 *           properties:
 *             email:
 *               type: string
 *               example: "test@example.com"
 *     responses:
 *       200:
 *         description: Successfully registered.
 *         schema:
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *               example: "test@example.com"
 *       400:
 *         description: The email is already registered or invalid.
 *         schema:
 *           type: object
 *           properties:
 *             error:
 *               type: string
 */

export default function (prisma: PrismaClient) {
  const router = express.Router();

  router.post('/', async (req: Request, res: Response) => {
    const { email } = req.body;

    if (!email || !validator.isEmail(email)) {
      return res.status(400).json({ error: 'Valid email is required' });
    }

    try {
      const newUser = await prisma.newsletter.create({
        data: {
          email,
          active: true, // New users are active by default
        },
      });

      return res.json(newUser);
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
