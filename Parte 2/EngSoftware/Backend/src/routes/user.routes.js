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

// GET /user/allHabits
router.get('/allHabits', auth, UserController.allHabits);

// GET /user/allChallenges
router.get('/allChallenges', auth, UserController.allChallenges);

// GET /user/notifications
router.get('/notifications', auth, UserController.notifications);

// POST /user/search
router.post('/search', auth, UserController.search);

module.exports = router;