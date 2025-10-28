const Notification = require('../models/notification.model.js');
const User = require('../models/user.model.js');

class UserService {
  async getProfile(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('Usuário não encontrado');
    }
    return user;
  }

  async updateProfile(userId, data) {
    // Validações de negócio aqui
    if (data.email) {
      const existing = await User.findByEmail(data.email);
      if (existing && existing.id !== userId) {
        throw new Error('Email já está em uso');
      }
    }
    return await User.update(userId, data);
  }

  async getFriends(userId) {
    return await User.getFriends(userId);
  }

  async getAllHabits(userId) {
    return await User.getAllHabits(userId);
  }

  async getAllChallenges(userId) {
    return await User.getAllChallenges(userId);
  }

  async getNotifications(userId, limit) {
    return await User.getNotifications(userId, limit);
  }

  async markNotificationAsRead(notificationId, userId) {
    return await Notification.markAsRead(notificationId, userId);
  }

  async getUserById(userId) {
    const user = await User.findBasicInfoById(userId);
    if (!user) {
      throw new Error('Usuário não encontrado');
    }
    return user;
  }

  async searchUsers(name, requesterId) {
    if (!name || name.trim().length === 0) {
      throw new Error("Nome de busca é obrigatório");
    }
    return await User.searchUserByName(name, requesterId);
  }
}

module.exports = new UserService();