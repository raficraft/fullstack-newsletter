const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

/**
 * @swagger
 * /newsletter/search:
 *   get:
 *     tags:
 *       - Newsletter
 *     summary: Search for a user email in the BDD
 *     parameters:
 *       - in: query
 *         name: query
 *         description: The part of the email to search for.
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully found the user
 *         schema:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               email:
 *                 type: string
 *               active:
 *                 type: boolean
 *       404:
 *         description: User not found
 *       500:
 *         description: Something went wrong
 *         schema:
 *           type: object
 *           properties:
 *             error:
 *               type: string
 */

// Route de recherche qui accepte une requête GET avec un paramètre de requête "query"
// Exemple d'utilisation :
//   Pour rechercher les enregistrements de la newsletter avec un email contenant "gmail",
//   faire une requête GET à "http://localhost:4000/search?query=gmail"

router.get('/search', async (req, res) => {
  const { query } = req.query;

  try {
    const results = await prisma.newsletter.findMany({
      where: {
        email: {
          contains: query,
          mode: 'insensitive', // Recherche insensible à la casse
        },
      },
    });

    if (results.length === 0) {
      return res
        .status(404)
        .json({ error: 'No user found with the provided email' });
    }

    return res.json(results);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Something went wrong' });
  }
});

module.exports = router;
