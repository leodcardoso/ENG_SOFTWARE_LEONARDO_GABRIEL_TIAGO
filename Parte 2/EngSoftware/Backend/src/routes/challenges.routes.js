const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const ChallengeController = require('../controllers/challenge.controller');

// Todas as rotas requerem autenticação
router.use(authMiddleware);

// CRUD
router.post('/', ChallengeController.create);
router.get('/', ChallengeController.getAll);
router.get('/:id', ChallengeController.getById);

// Convites
router.post('/invit', ChallengeController.inviteUsers);

// PUT /challenges/invite/:inviteId/status -> aceitar/rejeitar convite
router.put('/invite/:inviteId/status', ChallengeController.updateInviteStatus);

// Check-in
router.post('/:challengeId/checkin', ChallengeController.checkin);

// Ranking
router.get('/:challengeId/allUsers', ChallengeController.getRanking);

module.exports = router;
