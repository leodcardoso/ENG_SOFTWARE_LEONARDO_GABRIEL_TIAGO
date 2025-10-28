const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // usa o middleware existente
const UserController = require('../controllers/user.controller');

// GET /user -> perfil do usuário autenticado
router.get('/', auth, UserController.getProfile);

// PUT /user -> atualizar perfil
router.put('/', auth, UserController.updateProfile);

// GET /user/friends
router.get('/friends', auth, UserController.friends);

// GET /user/notifications
router.get('/notifications', auth, UserController.notifications);

// PUT /user/notifications/:notificationId/read -> marcar notificação como lida
router.put('/notifications/:notificationId/read', auth, UserController.markNotificationAsRead);

// POST /user/search
router.post('/search', auth, UserController.search);

// GET /user/:userId -> informações básicas de um usuário específico
router.get('/:userId', auth, UserController.getUserById);

module.exports = router;