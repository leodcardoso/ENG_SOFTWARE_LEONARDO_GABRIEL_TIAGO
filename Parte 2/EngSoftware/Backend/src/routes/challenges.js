const express = require('express');
const db = require('../config/db');
const authMiddleware  = require('../middleware/auth');

const router = express.Router();

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, goal, endDate, startDate, privacy, invitedFriendIds } = req.body;
    const creatorId = req.user.userId;

    if (!title || !goal?.checksRequired || !endDate) {
      return res.status(400).json({ error: 'Dados incompletos (título, meta de check-ins, data fim obrigatórios).' });
    }

    const challengeToSave = {
      title,
      goal,
      endDate,
      startDate: startDate || new Date().toISOString().slice(0, 10),
      privacy,
      creatorId: creatorId,
      participantIds: [creatorId],
      createdAt: new Date().toISOString(),
      progress: {
        [creatorId]: 0
      }
    };
    
    const newChallenge = await db.create('challenges', challengeToSave);

    if (Array.isArray(invitedFriendIds) && invitedFriendIds.length > 0) {
      console.log(`Criando ${invitedFriendIds.length} convites para o desafio ${newChallenge.id}...`);
      
      const invitePromises = invitedFriendIds.map(friendId => {
        const newInvite = {
          challengeId: newChallenge.id,
          inviterUserId: creatorId,
          invitedUserId: friendId,
          status: 'pending',
          createdAt: new Date().toISOString()
        };
        return db.create('challengeInvites', newInvite);
      });

      await Promise.all(invitePromises);
    }

    res.status(201).json(newChallenge);

  } catch (err) {
    console.error("Erro ao criar desafio:", err);
    res.status(500).json({ error: err.message || 'Erro interno ao criar desafio.' });
  }
});

module.exports = router;
