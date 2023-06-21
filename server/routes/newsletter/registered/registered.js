const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

/**
 * @swagger
 * /newsletter/registered:
 *   get:
 *     tags:
 *       - Newsletter
 *     summary: Lists users subscribed to the newsletter
 *     parameters:
 *       - in: query
 *         name: sort
 *         description: Parameter to sort the list.
 *         schema:
 *           type: string
 *           enum: [idAsc, idDesc, emailAsc, emailDesc, createdAtAsc, createdAtDesc, updatedAtAsc, updatedAtDesc]
 *       - in: query
 *         name: active
 *         description: Filter users by active status.
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: The list of users registered for the newsletter.
 *       500:
 *         description: Something went wrong.
 */

router.get('/', async (req, res) => {
  const { sort, active } = req.query;

  const sortOptions = [
    'idAsc',
    'idDesc',
    'emailAsc',
    'emailDesc',
    'createdAtAsc',
    'createdAtDesc',
    'updatedAtAsc',
    'updatedAtDesc',
  ];

  // Vérification de la validité du paramètre sort
  if (sort && !sortOptions.includes(sort)) {
    return res.status(400).json({ error: 'Invalid sort parameter.' });
  }

  // Vérification de la validité du paramètre active
  if (active !== undefined && active !== 'true' && active !== 'false') {
    return res.status(400).json({ error: 'Invalid active parameter.' });
  }

  let sortParams;
  switch (sort) {
    // e.g., http://localhost:4000/registered?sort=idAsc
    case 'idAsc':
      sortParams = { id: 'asc' };
      break;

    // e.g., http://localhost:4000/registered?sort=idDesc
    case 'idDesc':
      sortParams = { id: 'desc' };
      break;

    // e.g., http://localhost:4000/registered?sort=emailAsc
    case 'emailAsc':
      sortParams = { email: 'asc' };
      break;

    // e.g., http://localhost:4000/registered?sort=emailDesc
    case 'emailDesc':
      sortParams = { email: 'desc' };
      break;

    // e.g., http://localhost:4000/registered?sort=createdAtAsc
    case 'createdAtAsc':
      sortParams = { createdAt: 'asc' };
      break;

    // e.g., http://localhost:4000/registered?sort=createdAtDesc
    case 'createdAtDesc':
      sortParams = { createdAt: 'desc' };
      break;

    // e.g., http://localhost:4000/registered?sort=updatedAtAsc
    case 'updatedAtAsc':
      sortParams = { updatedAt: 'asc' };
      break;

    // e.g., http://localhost:4000/registered?sort=updatedAtDesc
    case 'updatedAtDesc':
      sortParams = { updatedAt: 'desc' };
      break;

    default:
      break;
  }

  let filterParams = {};
  if (active !== undefined) {
    filterParams.active = active === 'true';
  }

  try {
    const registeredUsers = await prisma.newsletter.findMany({
      orderBy: sortParams,
      where: filterParams,
    });

    return res.json(registeredUsers);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Something went wrong' });
  }
});

module.exports = router;
