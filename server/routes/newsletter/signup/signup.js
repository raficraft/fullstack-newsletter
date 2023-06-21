const validator = require('validator');
const PRISMA = require('../../../constante.js');
const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

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

router.post('/', async (req, res) => {
  const { email } = req.body;

  if (!email && !validator.isEmail(email)) {
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
    if (
      error.code === PRISMA.UNIQUE_CONSTRAINT_ERROR &&
      error.meta?.target?.includes('email')
    ) {
      return res.status(400).json({ error: 'This email is already in use' });
    }

    console.error(error);
    return res.status(500).json({ error: 'Something went wrong' });
  }
});

module.exports = router;
