const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
require('dotenv').config();

class AuthService {
  static async register({ name, email, password, remindersDefault, bio }) {
    // Validações
    if (!name || !email || !password) {
      throw new Error('Nome, email e senha são obrigatórios');
    }

    // Verificar se email já existe
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      throw new Error('Email já cadastrado');
    }

    // Hash da senha
    const password_hash = await bcrypt.hash(password, 10);

    // Criar usuário
    const user = await User.create({ name, email, password_hash, bio });

    // Criar configurações padrão
    await User.createDefaultSettings(user.id, remindersDefault);

    // Gerar token
    const token = this.generateToken(user.id);

    return {
      token,
      user: {
        userId: user.id,
        name: user.name,
        email: user.email,
        points: user.points,
        level: user.level
      }
    };
  }

  static async login({ email, password }) {
    // Validações
    if (!email || !password) {
      throw new Error('Email e senha são obrigatórios');
    }

    // Buscar usuário
    const user = await User.findByEmail(email);
    if (!user) {
      throw new Error('Credenciais inválidas');
    }

    // Verificar senha
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      throw new Error('Credenciais inválidas');
    }

    // Gerar token
    const token = this.generateToken(user.id);

    return {
      token,
      user: {
        userId: user.id,
        name: user.name,
        email: user.email,
        points: user.points,
        level: user.level
      }
    };
  }

  static generateToken(userId) {
    return jwt.sign(
      { userId },
      process.env.JWT_SECRET || 'seu-segredo-aqui',
      { expiresIn: '7d' }
    );
  }

  static verifyToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET || 'seu-segredo-aqui');
    } catch (error) {
      throw new Error('Token inválido ou expirado');
    }
  }
}

module.exports = AuthService;