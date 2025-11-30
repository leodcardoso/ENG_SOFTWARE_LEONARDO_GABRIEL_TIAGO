const { validateStrongPassword } = require('./passwordValidator');

describe('Validação de Senha Forte', () => {
  
  test('Deve rejeitar senha com menos de 8 caracteres', () => {
    const result = validateStrongPassword('Abc123');
    
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('A senha deve ter no mínimo 8 caracteres');
  });

  test('Deve rejeitar senha sem números', () => {
    const result = validateStrongPassword('SenhaForte');
    
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('A senha deve conter pelo menos um número');
  });

  test('Deve rejeitar senha sem letras maiúsculas', () => {
    const result = validateStrongPassword('senha123');
    
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('A senha deve conter pelo menos uma letra maiúscula');
  });

  test('Deve rejeitar senha sem letras minúsculas', () => {
    const result = validateStrongPassword('SENHA123');
    
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('A senha deve conter pelo menos uma letra minúscula');
  });

  test('Deve aceitar senha válida com todos os requisitos', () => {
    const result = validateStrongPassword('Senha123');
    
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  test('Deve aceitar senha válida mais complexa', () => {
    const result = validateStrongPassword('S3nh@F0rt3!');
    
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  test('Deve retornar múltiplos erros para senha muito fraca', () => {
    const result = validateStrongPassword('abc');
    
    expect(result.isValid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(1);
  });

  test('Deve rejeitar senha vazia', () => {
    const result = validateStrongPassword('');
    
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Senha inválida ou não fornecida');
  });

  test('Deve rejeitar senha nula ou indefinida', () => {
    const resultNull = validateStrongPassword(null);
    const resultUndefined = validateStrongPassword(undefined);
    
    expect(resultNull.isValid).toBe(false);
    expect(resultUndefined.isValid).toBe(false);
  });
});