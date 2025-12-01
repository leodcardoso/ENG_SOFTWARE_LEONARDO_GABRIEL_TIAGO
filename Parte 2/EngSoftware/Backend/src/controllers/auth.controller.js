const AuthService = require('../services/auth.service');
const { validateStrongPassword } = require('../utils/passwordValidator');

class AuthController {
  static async register(req, res) {
  try {
    const { name, email, password, remindersDefault, bio } = req.body;

    const passwordCheck = validateStrongPassword(password);
    if(!passwordCheck.isValid) {
      throw new Error(passwordCheck.errors[0])
    }

    const result = await AuthService.register({
      name,
      email,
      password,
      remindersDefault,
      bio
    });

    return res.status(201).json({
      success: true,
      message: 'Usuário registrado com sucesso',
      data: result
    });
  } catch (error) {
    let statusCode = 400;
    
    if (error.message.includes('já cadastrado') || error.message.includes('já existe')) {
      statusCode = 409;
    } else if (error.message.includes('erro de conexao') || error.message.includes('connect')){
      statusCode = 500;
    }

    console.error(`[AuthRegister Error]: ${error.message}`);

    return res.status(statusCode).json({
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