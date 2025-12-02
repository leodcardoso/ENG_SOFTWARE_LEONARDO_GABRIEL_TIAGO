const { validarSolicitacaoAmizade } = require('../../utils/FriendRequestService');

describe('Validação de solicitação de amizade', () => {

  test('Cenário 1: Deve enviar solicitação com sucesso (200)', () => {
    const resultado = validarSolicitacaoAmizade('12345', {
      usuarioExiste: true,
      jaEnviou: false,
      jaAmigo: false
    });

    expect(resultado.status).toBe(200);
    expect(resultado.mensagem).toBe('Solicitação enviada com sucesso');
  });

  test('Cenário 2: Usuário destino não existe (404)', () => {
    const resultado = validarSolicitacaoAmizade('99999', {
      usuarioExiste: false,
      jaEnviou: false,
      jaAmigo: false
    });

    expect(resultado.status).toBe(404);
    expect(resultado.mensagem).toBe('Usuário não encontrado');
  });

  test('Cenário 3: Solicitação já enviada (409)', () => {
    const resultado = validarSolicitacaoAmizade('12345', {
      usuarioExiste: true,
      jaEnviou: true,
      jaAmigo: false
    });

    expect(resultado.status).toBe(409);
    expect(resultado.mensagem).toBe('Solicitação já enviada');
  });

  test('Cenário 4: Usuários já são amigos (400)', () => {
    const resultado = validarSolicitacaoAmizade('12345', {
      usuarioExiste: true,
      jaEnviou: false,
      jaAmigo: true
    });

    expect(resultado.status).toBe(400);
    expect(resultado.mensagem).toBe('Usuários já são amigos');
  });

});
