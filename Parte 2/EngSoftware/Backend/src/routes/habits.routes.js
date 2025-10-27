const express = require('express');
const router = express.Router();
const HabitController = require('../controllers/habit.controller');
const authMiddleware = require('../middleware/auth');

// Todas as rotas requerem autenticação
router.use(authMiddleware);

// POST /habits - criar hábito
router.post('/', HabitController.createHabit);

// GET /habits - buscar todos os hábitos
router.get('/', HabitController.getHabits);

// GET /habits/:id - buscar hábito por ID
router.get('/:id', HabitController.getHabits);

// POST /habits/:habitId/checkin - registrar check-in
router.post('/:habitId/checkin', HabitController.checkin);

module.exports = router;
