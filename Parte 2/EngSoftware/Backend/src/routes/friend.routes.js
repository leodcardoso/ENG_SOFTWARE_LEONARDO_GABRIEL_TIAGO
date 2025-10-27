const express = require('express');
const router = express.Router();
const FriendController = require('../controllers/friend.controller');
const authMiddleware = require('../middleware/auth');

// Todas as rotas requerem autenticação
router.use(authMiddleware);

// POST /friend/invit/:targetUser - Enviar convite de amizade
router.post('/invit/:targetUser', FriendController.sendInvite);

// POST /friend/status/:requestId - Responder a um convite
router.post('/status/:requestId', FriendController.respondToInvite);

module.exports = router;
