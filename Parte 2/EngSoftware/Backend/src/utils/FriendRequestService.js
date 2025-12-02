/**
 * Valida o envio de uma solicitação de amizade usando fail-fast.
 */
function validarSolicitacaoAmizade(friendId, regras) {
  // ---- Validações gerais (fail-fast) ----

  // Friend ID precisa ser string não vazia
  if (typeof friendId !== 'string' || friendId.trim() === '') {
    return resposta(400, 'ID do usuário destino inválido');
  }

  // Regras precisam ser um objeto válido
  if (!regras || typeof regras !== 'object') {
    return resposta(500, 'Erro interno: regras não fornecidas corretamente');
  }

  const { usuarioExiste, jaEnviou, jaAmigo } = regras;

  // Verificar se campos obrigatórios estão presentes
  if (usuarioExiste === undefined) {
    return resposta(500, 'Erro interno: campo "usuarioExiste" ausente');
  }
  if (jaEnviou === undefined) {
    return resposta(500, 'Erro interno: campo "jaEnviou" ausente');
  }
  if (jaAmigo === undefined) {
    return resposta(500, 'Erro interno: campo "jaAmigo" ausente');
  }

  // Verificar tipos booleanos
  if (typeof usuarioExiste !== 'boolean') {
    return resposta(500, 'Erro interno: "usuarioExiste" deve ser booleano');
  }
  if (typeof jaEnviou !== 'boolean') {
    return resposta(500, 'Erro interno: "jaEnviou" deve ser booleano');
  }
  if (typeof jaAmigo !== 'boolean') {
    return resposta(500, 'Erro interno: "jaAmigo" deve ser booleano');
  }

  // ---- Regras de negócio (fail-fast) ----

  if (!usuarioExiste) {
    return resposta(404, 'Usuário não encontrado');
  }

  if (jaEnviou) {
    return resposta(409, 'Solicitação já enviada');
  }

  if (jaAmigo) {
    return resposta(400, 'Usuários já são amigos');
  }

  // ---- Tudo OK ----
  return resposta(200, 'Solicitação enviada com sucesso');
}
function resposta(status, mensagem) {
  return { status, mensagem };
}

module.exports = { validarSolicitacaoAmizade };
