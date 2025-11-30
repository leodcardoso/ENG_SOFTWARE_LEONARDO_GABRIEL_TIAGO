/**
 * Valida se uma senha atende aos critérios de segurança
 * @param {string} password - A senha a ser validada
 * @returns {Object} Objeto contendo isValid (boolean) e errors (array de strings)
 */
function validateStrongPassword(password) {
  const errors = [];

  // Verifica se a senha foi fornecida
  if (!password || typeof password !== 'string') {
    return {
      isValid: false,
      errors: ['Senha inválida ou não fornecida']
    };
  }

  // Regra 1: Mínimo de 8 caracteres
  if (password.length < 8) {
    errors.push('A senha deve ter no mínimo 8 caracteres');
  }

  // Regra 2: Deve conter pelo menos um número
  if (!/\d/.test(password)) {
    errors.push('A senha deve conter pelo menos um número');
  }

  // Regra 3: Deve conter pelo menos uma letra maiúscula
  if (!/[A-Z]/.test(password)) {
    errors.push('A senha deve conter pelo menos uma letra maiúscula');
  }

  // Regra 4: Deve conter pelo menos uma letra minúscula
  if (!/[a-z]/.test(password)) {
    errors.push('A senha deve conter pelo menos uma letra minúscula');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

module.exports = { validateStrongPassword };