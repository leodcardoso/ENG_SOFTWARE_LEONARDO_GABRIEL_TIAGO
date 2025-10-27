const express = require('express');
const db = require('../config/db');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

const ALLOWED_COLLECTIONS = ['users','habits','tasks','challenges','achievements','notifications','docs','commands','userAchievements','auditLog'];

router.get('/:collection', async (req, res) => {
  const col = req.params.collection;
  if (!ALLOWED_COLLECTIONS.includes(col)) return res.status(400).json({ error: 'collection not allowed' });
  try {
    res.json(await db.getAll(col));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:collection/:id', async (req, res) => {
  const col = req.params.collection;
  const id = parseInt(req.params.id, 10);
  if (!ALLOWED_COLLECTIONS.includes(col)) return res.status(400).json({ error: 'collection not allowed' });
  try {
    const item = await db.getById(col, id);
    if (!item) return res.status(404).json({ error: 'not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/:collection', authenticateToken, async (req, res) => {
  const col = req.params.collection;

  if (col === 'users') {
    return res.status(403).json({ error: 'Use o endpoint /auth/register para criar usuários.' });
  }
  if (!ALLOWED_COLLECTIONS.includes(col)) {
    return res.status(400).json({ error: 'collection not allowed' });
  }

  try {
    let itemData = { ...req.body };
    if (['habits', 'notifications', 'tasks', 'challenges'].includes(col)) {
      itemData.userId = req.user.userId;
      if (col === 'tasks') itemData.ownerId = req.user.userId;
      if (col === 'challenges') itemData.creatorId = req.user.userId;
    }

    const newItem = await db.create(col, itemData);
    res.status(201).json(newItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:collection/:id', authenticateToken, async (req, res) => {
  const col = req.params.collection;
  const id = parseInt(req.params.id, 10);
  const userIdFromToken = req.user.userId;

  if (!ALLOWED_COLLECTIONS.includes(col)) {
     return res.status(400).json({ error: 'collection not allowed' });
  }

  try {
    const item = await db.getById(col, id);

    if (!item) {
       return res.status(404).json({ error: 'not found' });
    }

    const ownerField = item.userId || item.ownerId || item.creatorId;
    if (ownerField !== userIdFromToken && col !== 'users' && col !== 'achievements') {
        if (col === 'users' && item.id !== userIdFromToken) {
           return res.status(403).json({ error: 'Forbidden: You can only edit your own profile' });
        } else if (col !== 'users') {
           return res.status(403).json({ error: 'Forbidden: You do not own this resource' });
        }
    }

    delete req.body.id;
    delete req.body.userId;
    delete req.body.ownerId;
    delete req.body.creatorId;
    delete req.body.createdAt;
    delete req.body.passwordHash;

    const updated = await db.update(col, id, req.body);
    if (!updated) return res.status(404).json({ error: 'Internal error during update' });
    res.json(updated);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:collection/:id', authenticateToken, async (req, res) => {
   const col = req.params.collection;
   const id = parseInt(req.params.id, 10);
   const userIdFromToken = req.user.userId;

   if (!ALLOWED_COLLECTIONS.includes(col)) {
       return res.status(400).json({ error: 'collection not allowed' });
   }

   if (['users', 'achievements', 'auditLog'].includes(col)) {
      return res.status(403).json({ error: `Deletion of ${col} is not allowed via this endpoint.` });
   }

   try {
     const item = await db.getById(col, id);

     if (!item) {
          return res.status(404).json({ error: 'not found' });
     }

     const ownerField = item.userId || item.ownerId || item.creatorId;
     if (ownerField !== userIdFromToken) {
         return res.status(403).json({ error: 'Forbidden: You do not own this resource' });
     }

     await db.remove(col, id);
     res.json({ ok: true });

   } catch (err) {
     res.status(500).json({ error: err.message });
   }
});

module.exports = router;
