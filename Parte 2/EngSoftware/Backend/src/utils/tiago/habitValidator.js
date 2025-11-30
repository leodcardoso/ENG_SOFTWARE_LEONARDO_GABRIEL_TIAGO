/**
 * Valida os dados básicos para criação de um hábito
 * @param {string} titulo - Título do hábito
 * @param {string} categoria - Categoria do hábito
 */
function validarCamposHabito(titulo, categoria) {
  // Regra 1: Título obrigatório
  if (!titulo || titulo.trim() === '') {
    return { valido: false, erro: 'Título é obrigatório' };
  }

  // Regra 2: Tamanho do título
  if (titulo.length < 5) {
    return { valido: false, erro: 'Título deve ter pelo menos 5 caracteres' };
  }

  // Regra 3: Categoria obrigatória
  if (!categoria || categoria.trim() === '') {
    return { valido: false, erro: 'Categoria é obrigatória' };
  }

  // Se passou por tudo, é válido
  return { valido: true, erro: null };
}

module.exports = { validarCamposHabito };