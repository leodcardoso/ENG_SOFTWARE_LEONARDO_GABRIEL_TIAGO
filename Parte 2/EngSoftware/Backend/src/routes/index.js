const express = require('express');
const router = express.Router();

// Importa rotas específicas
const authRoutes = require('./auth');
const habitsRoutes = require('./habits');
const challengesRoutes = require('./challenges');
const genericRoutes = require('./generic');
const userRoutes = require('./user');
// Usa as rotas
router.use('/auth', authRoutes);
router.use('/habits', habitsRoutes);
router.use('/challenges', challengesRoutes);
router.use('/user', userRoutes);
// router.use('/', genericRoutes);

module.exports = router;