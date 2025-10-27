const HabitService = require('../services/habit.service');

class HabitController {
  static async createHabit(req, res) {
    try {
      const { title, description, category, expirationDate } = req.body;
      const userId = req.userId;

      const habit = await HabitService.createHabit({
        userId,
        title,
        description,
        category,
        expirationDate
      });

      return res.status(201).json({
        success: true,
        message: 'Hábito criado com sucesso',
        data: habit
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  static async getHabits(req, res) {
    try {
      const userId = req.userId;
      const habitId = req.params.id;

      const habits = await HabitService.getHabits(userId, habitId);

      return res.status(200).json({
        success: true,
        data: habits
      });
    } catch (error) {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }

  static async checkin(req, res) {
    try {
      const userId = req.userId;
      const { habitId } = req.params;

      const result = await HabitService.checkin(habitId, userId);

      return res.status(200).json({
        success: true,
        message: 'Check-in realizado com sucesso',
        data: result
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = HabitController;
