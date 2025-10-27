const express = require('express');
const AuthController = require('../controllers/auth.controller');

const router = express.Router();

// POST /auth/register
router.post('/register', AuthController.register);

// POST /auth/login
router.post('/login', AuthController.login);

module.exports = router;