const { validarCamposHabito } = require('./habitValidator');

describe('Validação de Campos do Hábito', () => {

  test('Deve rejeitar hábito sem título', () => {
    const resultado = validarCamposHabito('', 'Saúde');
    expect(resultado.valido).toBe(false);
    expect(resultado.erro).toBe('Título é obrigatório');
  });

  test('Deve rejeitar título muito curto (menos de 5 letras)', () => {
    const resultado = validarCamposHabito('Ler', 'Educação');
    expect(resultado.valido).toBe(false);
    expect(resultado.erro).toBe('Título deve ter pelo menos 5 caracteres');
  });

  test('Deve rejeitar hábito sem categoria', () => {
    const resultado = validarCamposHabito('Ler Livro', '');
    expect(resultado.valido).toBe(false);
    expect(resultado.erro).toBe('Categoria é obrigatória');
  });

  test('Deve aceitar hábito com dados válidos', () => {
    const resultado = validarCamposHabito('Beber Água', 'Saúde');
    expect(resultado.valido).toBe(true);
  });

});