/**
 * Valida categoria de hábito
 * @param {string} category - Categoria a ser validada
 * @returns {Object} { isValid: boolean, errors: string[] }
 */
function validateCategory(category) {
  const errors = [];

  if (!category || category.trim() === '') {
    return { isValid: false, errors: ['Categoria é obrigatória'] };
  }

  const validCategories = [
    'Saúde',
    'Produtividade',
    'Estudos',
    'Exercícios',
    'Bem-estar',
    'Financeiro'
  ];

  const rules = [
    {
      test: (cat) => cat.length >= 3,
      message: 'Categoria deve ter pelo menos 3 caracteres'
    },
    {
      test: (cat) => validCategories.includes(cat),
      message: `Categoria inválida. Opções: ${validCategories.join(', ')}`
    }
  ];

  const violatedRules = rules
    .filter(rule => !rule.test(category))
    .map(rule => rule.message);

  errors.push(...violatedRules);

  return {
    isValid: errors.length === 0,
    errors
  };
}

module.exports = { validateCategory };