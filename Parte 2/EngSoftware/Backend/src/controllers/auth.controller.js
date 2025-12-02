const AuthService = require('../services/auth.service');
const { validateEmail } = require('../utils/emailValidator');
const { validateStrongPassword } = require('../utils/passwordValidator');

const register = async (req, res) => {
  try {
    const { name, email, password, remindersDefault, bio } = req.body;

    // 🟢 VALIDAÇÃO DE EMAIL (Gabriel)
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      return res.status(400).json({
        success: false,
        message: emailValidation.errors.join(', ')
      });
    }

    // 🟢 VALIDAÇÃO DE SENHA FORTE (Tiago)
    const passwordValidation = validateStrongPassword(password);
    if (!passwordValidation.isValid) {
      return res.status(400).json({
        success: false,
        message: passwordValidation.errors.join(', ')
      });
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
    } else if (error.message.includes('erro de conexao') || error.message.includes('connect') || error.message.includes('ECONNREFUSED')){
      statusCode = 500;
    }

    console.error(`[AuthRegister Error]: ${error.message}`);

    return res.status(statusCode).json({
      success: false,
      message: error.message
    });
  }
};

const login = async (req, res) => {
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
};

module.exports = { register, login };