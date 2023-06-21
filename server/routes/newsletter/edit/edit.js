const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

/**
 * @swagger
 * /newsletter/edit/{id}:
 *   put:
 *     tags:
 *       - Newsletter
 *     summary: Edit email or active field on BDD
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
 *             column:
 *               type: string
 *               enum: ['email', 'active']
 *             value:
 *               type: string
 *     responses:
 *       200:
 *         description: Successfully edit email or active field
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
 *         description: Invalid column, value, or id
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

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { column, value } = req.body;

  const updatableColumns = ['active', 'email'];

  if (!column || value === undefined || !updatableColumns.includes(column)) {
    return res.status(400).json({ error: 'Invalid column or value' });
  }

  if (column === 'active' && typeof value !== 'boolean') {
    return res
      .status(400)
      .json({ error: 'Invalid value for "active". Expected a boolean.' });
  }

  if (column === 'email' && typeof value !== 'string') {
    return res
      .status(400)
      .json({ error: 'Invalid value for "email". Expected a string.' });
  }

  try {
    const user = await prisma.newsletter.update({
      where: { id: Number(id) },
      data: { [column]: value },
    });

    return res.json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Something went wrong' });
  }
});

module.exports = router;
