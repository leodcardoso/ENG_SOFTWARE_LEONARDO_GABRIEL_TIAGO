const AuthService = require('../services/auth.service');
const User = require('../models/user.model');

async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'Token não fornecido'
      });
    }

    const [, token] = authHeader.split(' '); // Bearer <token>

    const decoded = AuthService.verifyToken(token);
    
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    req.userId = decoded.userId;
    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error.message
    });
  }
}

module.exports = authMiddleware;