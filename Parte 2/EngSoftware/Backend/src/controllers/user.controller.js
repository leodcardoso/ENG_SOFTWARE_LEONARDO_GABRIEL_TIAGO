const User = require('../models/user.model');

class UserController {
  static async getProfile(req, res) {
    try {
      const user = await User.findById(req.userId);
      if (!user) return res.status(404).json({ success: false, message: 'Usuário não encontrado' });
      return res.json({ success: true, data: user });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  static async updateProfile(req, res) {
    try {
      const updated = await User.update(req.userId, req.body);
      return res.json({ success: true, data: updated });
    } catch (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
  }

  static async friends(req, res) {
    try {
      const friends = await User.getFriends(req.userId);
      return res.json({ success: true, data: friends });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  static async allHabits(req, res) {
    try {
      const habits = await User.getAllHabits(req.userId);
      return res.json({ success: true, data: habits });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  static async allChallenges(req, res) {
    try {
      const challenges = await User.getAllChallenges(req.userId);
      return res.json({ success: true, data: challenges });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  static async notifications(req, res) {
    try {
      const notifications = await User.getNotifications(req.userId);
      return res.json({ success: true, data: notifications });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  static async search(req, res) {
    try {
      const { name } = req.body;
      if (!name) return res.status(400).json({ success: false, message: 'Campo name é obrigatório' });
      const results = await User.searchByName(name, req.userId);
      return res.json({ success: true, data: results });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }
}

module.exports = UserController;