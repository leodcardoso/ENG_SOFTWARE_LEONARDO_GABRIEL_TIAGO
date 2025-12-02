const { validateEmail } = require('../../utils/emailValidator');

describe('Email Validator - TDD', () => {
  describe('🔴 RED - Casos de Falha', () => {
    test('Deve rejeitar email vazio', () => {
      const result = validateEmail('');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Email é obrigatório');
    });

    test('Deve rejeitar email sem @', () => {
      const result = validateEmail('emailinvalido.com');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Email deve conter @');
    });

    test('Deve rejeitar email começando com @', () => {
      const result = validateEmail('@email.com');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Email não pode começar com @');
    });

    test('Deve rejeitar email sem domínio', () => {
      const result = validateEmail('user@');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Email deve ter formato válido (ex: user@domain.com)');
    });
  });

  describe('🟢 GREEN - Casos de Sucesso', () => {
    test('Deve aceitar email válido simples', () => {
      const result = validateEmail('user@example.com');
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('Deve aceitar email com subdomínio', () => {
      const result = validateEmail('user@mail.example.com');
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('Deve aceitar email com números', () => {
      const result = validateEmail('user123@example.com');
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });
});