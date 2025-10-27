const express = require('express');
const router = express.Router();

// Importa rotas específicas
const authRoutes = require('./auth.routes');
const habitsRoutes = require('./habits.routes');
const challengesRoutes = require('./challenges.routes');
const genericRoutes = require('./generic.routes');
const userRoutes = require('./user.routes');
const friendRoutes = require('./friend.routes');
// Usa as rotas
router.use('/auth', authRoutes);
router.use('/habits', habitsRoutes);
router.use('/challenges', challengesRoutes);
router.use('/user', userRoutes);
router.use('/friend', friendRoutes);
// router.use('/', genericRoutes);

module.exports = router;