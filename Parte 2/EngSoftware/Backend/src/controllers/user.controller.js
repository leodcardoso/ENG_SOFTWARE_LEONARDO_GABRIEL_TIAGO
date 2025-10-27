const userService = require('../services/user.service');

class UserController {
  static async getProfile(req, res) {
    try {
      const user = await userService.getProfile(req.userId);
      return res.json({ success: true, data: user });
    } catch (err) {
      const status = err.message === 'Usuário não encontrado' ? 404 : 500;
      return res.status(status).json({ success: false, message: err.message });
    }
  }

  static async updateProfile(req, res) {
    try {
      const updated = await userService.updateProfile(req.userId, req.body);
      return res.json({ success: true, data: updated });
    } catch (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
  }

  static async friends(req, res) {
    try {
      const friends = await userService.getFriends(req.userId);
      return res.json({ success: true, data: friends });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  static async allHabits(req, res) {
    try {
      const habits = await userService.getAllHabits(req.userId);
      return res.json({ success: true, data: habits });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  static async allChallenges(req, res) {
    try {
      const challenges = await userService.getAllChallenges(req.userId);
      return res.json({ success: true, data: challenges });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  static async notifications(req, res) {
    try {
      const notifications = await userService.getNotifications(req.userId);
      return res.json({ success: true, data: notifications });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  static async search(req, res) {
    try {
      const { name } = req.body;
      const results = await userService.searchUsers(name, req.userId);
      return res.json({ success: true, data: results });
    } catch (err) {
      const status = err.message.includes('obrigatório') ? 400 : 500;
      return res.status(status).json({ success: false, message: err.message });
    }
  }
}

module.exports = UserController;