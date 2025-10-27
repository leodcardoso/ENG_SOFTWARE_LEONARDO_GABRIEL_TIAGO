const AuthService = require('../services/auth.service');

class AuthController {
  static async register(req, res) {
    try {
      const { name, email, password, remindersDefault } = req.body;

      const result = await AuthService.register({
        name,
        email,
        password,
        remindersDefault
      });

      return res.status(201).json({
        success: true,
        message: 'Usuário registrado com sucesso',
        data: result
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;

      const result = await AuthService.login({ email, password });

      return res.status(200).json({
        success: true,
        message: 'Login realizado com sucesso',
        data: result
      });
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = AuthController;