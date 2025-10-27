const Habit = require('../models/habit.model');
const Notification = require('../models/notification.model');

class HabitService {
  static async createHabit({ userId, title, description, category, expirationDate }) {
    if (!title || title.trim() === '') {
      throw new Error('Título é obrigatório');
    }

    const habit = await Habit.create({
      userId,
      title,
      description,
      category,
      expirationDate
    });

    return habit;
  }

  static async getHabits(userId, habitId = null) {
    if (habitId) {
      const habit = await Habit.findById(habitId, userId);
      if (!habit) {
        throw new Error('Hábito não encontrado');
      }
      return this._checkExpiration(habit);
    }

    const habits = await Habit.findByUserId(userId);
    return habits.map(habit => this._checkExpiration(habit));
  }

  static async checkin(habitId, userId) {
    const habit = await Habit.findById(habitId, userId);
    
    if (!habit) {
      throw new Error('Hábito não encontrado');
    }

    if (!habit.active) {
      throw new Error('Hábito não está ativo');
    }

    // Verifica se já fez check-in hoje
    const today = new Date().toISOString().split('T')[0];
    if (habit.last_check_in === today) {
      throw new Error('Check-in já realizado hoje');
    }

    // Verifica se está expirado
    if (habit.expiration_date && new Date(habit.expiration_date) < new Date()) {
      throw new Error('Hábito expirado');
    }

    // Atualiza o hábito
    const updatedHabit = await Habit.checkin(habitId, userId);

    // Atualiza pontos do usuário
    const userStats = await Habit.updateUserPoints(userId, 1);

    // Cria notificação
    await Notification.create({
      recipientUserId: userId,
      actorUserId: userId,
      type: 'HABIT_REMINDER',
      habitId: habitId,
      data: {
        message: `Check-in realizado no hábito "${updatedHabit.title}"`,
        points: 1
      }
    });

    return {
      habit: updatedHabit,
      userStats
    };
  }

  static _checkExpiration(habit) {
    const isExpired = habit.expiration_date && 
                      new Date(habit.expiration_date) < new Date();
    
    return {
      ...habit,
      is_expired: isExpired
    };
  }
}

module.exports = HabitService;
