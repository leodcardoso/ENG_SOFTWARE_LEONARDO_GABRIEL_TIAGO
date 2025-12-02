/**
 * Valida o formato de um endereço de email
 * @param {string} email - Email a ser validado
 * @returns {Object} { isValid: boolean, errors: string[] }
 */
function validateEmail(email) {
  const errors = [];

  if (!email || email.trim() === '') {
    return { isValid: false, errors: ['Email é obrigatório'] };
  }

  // Regras de validação
  const rules = [
    {
      test: (e) => e.includes('@'),
      message: 'Email deve conter @'
    },
    {
      test: (e) => e.indexOf('@') > 0,
      message: 'Email não pode começar com @'
    },
    {
      test: (e) => {
        const parts = e.split('@');
        return parts.length === 2 && parts[1].includes('.');
      },
      message: 'Email deve ter formato válido (ex: user@domain.com)'
    },
    {
      test: (e) => e.length <= 254,
      message: 'Email muito longo (máximo 254 caracteres)'
    }
  ];

  // Filtra regras violadas
  const violatedRules = rules
    .filter(rule => !rule.test(email))
    .map(rule => rule.message);

  errors.push(...violatedRules);

  return {
    isValid: errors.length === 0,
    errors
  };
}

module.exports = { validateEmail };