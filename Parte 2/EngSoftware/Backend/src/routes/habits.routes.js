const express = require('express');
const db = require('../config/db');
// changed code
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.get('/visible', authMiddleware, async (req, res) => {
  const viewerId = req.user.userId;
  try {
    console.log("ViewId:", viewerId);
    const list = await db.filterHabitsForViewer(viewerId);
    console.table(list);
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const page = Math.max(1, Number(req.query.page) || 1);
    const perPage = Math.min(100, Number(req.query.perPage) || 20);

    const { items, total } = await db.findByUser('habits', userId, { page, perPage });
    
    return res.json({
      items,
      meta: { page, perPage, total, totalPages: Math.max(1, Math.ceil(total / perPage)) }
    });
  } catch (err) {
    console.error(`Erro ao listar hábitos:`, err);
    res.status(500).json({ error: "Erro interno" });
  }
});

module.exports = router;
