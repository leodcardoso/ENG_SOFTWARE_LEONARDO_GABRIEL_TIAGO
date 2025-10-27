const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
// substituir/desambiguar import do JWT_SECRET para permitir fallback ao env
const { JWT_SECRET: JWT_SECRET_FROM_MW } = require('../middleware/auth');
const JWT_SECRET = process.env.JWT_SECRET || JWT_SECRET_FROM_MW;

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    // não loggar corpo inteiro (evita expor senhas)
    console.log("Tentativa de registro recebida");
    const { name, email, password, role } = req.body;

    // validações básicas
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Nome, email e senha são obrigatórios' });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Email inválido' });
    }
    if (password.length < 8) {
      return res.status(400).json({ error: 'Senha deve ter ao menos 8 caracteres' });
    }

    // checar email já existente
    const users = await db.getAll('users');
    if (users.find(u => u.email === email)) {
      return res.status(409).json({ error: 'Email já cadastrado' });
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const newUser = {
      name,
      email,
      passwordHash,
      role: role || 'developer',
      createdAt: new Date().toISOString(),
      profile: {},
      settings: {},
      friends: [],
      stats: { points: 0, level: 1 }
    };

    const createdUser = await db.create('users', newUser);
    delete createdUser.passwordHash;
    
    res.status(201).json(createdUser);

  } catch (err) {
    console.error("Erro no registro:", err);
    res.status(500).json({ error: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    const users = await db.getAll('users');
    const user = users.find(u => u.email === email);

    if (!user || !user.passwordHash) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role
    };
    const options = { expiresIn: '1h' };
    const token = jwt.sign(payload, JWT_SECRET, options);

    res.status(200).json({ token: token });

  } catch (err) {
    console.error("Erro no login:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
