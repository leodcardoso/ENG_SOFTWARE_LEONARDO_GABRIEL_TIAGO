/**
 * Valida regras de envio de solicitação de amizade.
 * @param {string} friendId - ID do usuário alvo
 * @param {object} estado - objeto com flags simulando o estado atual
 *    { usuarioExiste: bool, jaEnviou: bool, jaAmigo: bool }
 */
function validarSolicitacaoAmizade(friendId, estado) {

  // Cenário 2: Usuário destino não existe
  if (!estado.usuarioExiste) {
    return { status: 404, mensagem: 'Usuário não encontrado' };
  }

  // Cenário 3: Solicitação já enviada
  if (estado.jaEnviou) {
    return { status: 409, mensagem: 'Solicitação já enviada' };
  }

  // Cenário 4: Usuários já são amigos
  if (estado.jaAmigo) {
    return { status: 400, mensagem: 'Usuários já são amigos' };
  }

  // Cenário 1: Sucesso
  return { status: 200, mensagem: 'Solicitação enviada com sucesso' };
}

module.exports = { validarSolicitacaoAmizade };
