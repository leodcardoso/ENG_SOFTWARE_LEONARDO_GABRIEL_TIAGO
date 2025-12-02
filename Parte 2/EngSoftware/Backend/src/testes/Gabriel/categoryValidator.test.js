const { validateCategory } = require('../../utils/categoryValidator');

describe('Category Validator - TDD', () => {
  describe('🔴 RED - Casos de Falha', () => {
    test('Deve rejeitar categoria vazia', () => {
      const result = validateCategory('');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Categoria é obrigatória');
    });

    test('Deve rejeitar categoria muito curta', () => {
      const result = validateCategory('AB');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Categoria deve ter pelo menos 3 caracteres');
    });

    test('Deve rejeitar categoria inválida', () => {
      const result = validateCategory('CategoriaInvalida');
      expect(result.isValid).toBe(false);
      expect(result.errors[0]).toContain('Categoria inválida');
    });
  });

  describe('🟢 GREEN - Casos de Sucesso', () => {
    test('Deve aceitar categoria "Saúde"', () => {
      const result = validateCategory('Saúde');
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('Deve aceitar categoria "Produtividade"', () => {
      const result = validateCategory('Produtividade');
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('Deve aceitar categoria "Exercícios"', () => {
      const result = validateCategory('Exercícios');
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });
});