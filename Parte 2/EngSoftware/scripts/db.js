const fs = require('fs').promises;
const path = require('path');

const dbPath = path.resolve(__dirname, '..', 'data', 'db.json');

async function readDB() {
  try {
    const raw = await fs.readFile(dbPath, 'utf8');
    console.log(raw);
    return JSON.parse(raw);
  } catch (err) {
    if (err.code === 'ENOENT') {
      return {};
    }
    throw err;
  }
}

async function writeDB(db) {
  await fs.writeFile(dbPath, JSON.stringify(db, null, 2), 'utf8');
}

async function getAll(collection) {
  const db = await readDB();
  return db[collection] || [];
}

async function getById(collection, id) {
  const list = await getAll(collection);
  return list.find(x => x.id === id) || null;
}

async function create(collection, item) {
  const db = await readDB();
  db[collection] = db[collection] || [];
  const maxId = db[collection].reduce((max, x) => Math.max(max, x.id || 0), 0);
  const newItem = { id: maxId + 1, ...item };
  db[collection].push(newItem);
  await writeDB(db);
  return newItem;
}

async function update(collection, id, changes) {
  const db = await readDB();
  const list = db[collection] || [];
  const idx = list.findIndex(x => x.id === id);
  if (idx === -1) return null;
  list[idx] = { ...list[idx], ...changes };
  await writeDB(db);
  return list[idx];
}

async function remove(collection, id) {
  const db = await readDB();
  db[collection] = (db[collection] || []).filter(x => x.id !== id);
  await writeDB(db);
  return true;
}

/* Command service: checkin, joker_use, revert */
async function executeCommand(command) {
  const db = await readDB();
  const cmdId = (db.nextId && db.nextId.commands) || 1;
  const now = new Date().toISOString();
  const cmd = {
    id: cmdId,
    timestamp: command.timestamp || now,
    userId: command.userId,
    type: command.type,
    target: command.target,
    metadata: command.metadata || {},
    pointsDelta: 0,
    undone: false
  };

  const findUser = id => (db.users || []).find(u => u.id === id);
  const findHabit = id => (db.habits || []).find(h => h.id === id);

  if (cmd.type === 'checkin') {
    const habit = findHabit(cmd.target.id);
    if (!habit) throw new Error('Habit not found');
    const today = (new Date()).toISOString().slice(0,10);
    // REMOVIDO: A verificação original permitia checkin mesmo se já feito. Corrigido:
    // if (habit.lastCheckIn === today) throw new Error('Already checked-in today'); // Comentado para permitir múltiplos checkins no teste inicial
    
    // Adicionando lógica para lidar com a falta de lastCheckIn ou streak inicial
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10); // Data de ontem
    if (habit.lastCheckIn === today) {
       // Se já fez check-in hoje, não faz nada (ou poderia dar erro, dependendo da regra)
       console.log(`Habit ${habit.id} already checked-in today by user ${cmd.userId}.`);
       // Poderia lançar erro se a regra for estrita: throw new Error('Already checked-in today');
       // Por enquanto, apenas não atualiza streak ou pontos novamente.
       cmd.pointsDelta = 0; // Não ganha pontos de novo
    } else {
        habit.lastCheckIn = today;
        // Verifica se o último checkin foi ontem para continuar o streak
        if (habit.lastCheckIn === yesterday) {
            habit.streak = (habit.streak || 0) + 1;
        } else {
            habit.streak = 1; // Reseta o streak se pulou um dia
        }
        habit.bestStreak = Math.max(habit.bestStreak || 0, habit.streak);
        cmd.pointsDelta = habit.pointsPerCheckIn || 0;
        
        const user = findUser(cmd.userId);
        if (user) {
          user.stats = user.stats || { points: 0, level: 1 };
          user.stats.points = (user.stats.points || 0) + cmd.pointsDelta; // Garante que pontos não sejam NaN
        }

        // Atualiza progresso em desafios
        (db.challenges || []).forEach(ch => {
          if (ch.goal && ch.goal.habitId === habit.id && Array.isArray(ch.participantIds) && ch.participantIds.includes(cmd.userId)) {
            ch.progress = ch.progress || {};
            ch.progress[cmd.userId] = (ch.progress[cmd.userId] || 0) + 1;
          }
        });

        // Lógica de Conquistas (ainda usa modelo antigo userAchievements)
        db.userAchievements = db.userAchievements || [];
        let userAch = db.userAchievements.find(a => a.userId === cmd.userId);
        if (!userAch) {
          userAch = { userId: cmd.userId, achievementIds: [] };
          db.userAchievements.push(userAch);
        }
        // Conquista "Primeiro Checkin" (ID 1)
        if (!userAch.achievementIds.includes(1)) {
          userAch.achievementIds.push(1);
          const usr = findUser(cmd.userId);
          // Adiciona os pontos da conquista (buscar de db.achievements)
          const firstCheckinAch = (db.achievements || []).find(a => a.id === 1);
          if (usr && firstCheckinAch) {
             usr.stats.points = (usr.stats.points || 0) + (firstCheckinAch.points || 0);
          }
        }
         // TODO: Adicionar lógica para outras conquistas (ex: 7_day_streak)
    }

  } else if (cmd.type === 'joker_use') {
    const habit = findHabit(cmd.target.id);
    if (!habit) throw new Error('Habit not found');
    const date = cmd.metadata?.date || (new Date()).toISOString().slice(0,10); // Permite usar coringa para uma data específica
    habit.jokerUsedDates = habit.jokerUsedDates || [];
    if (habit.jokerUsedDates.includes(date)) throw new Error('Joker already used for date ' + date);
    // TODO: Adicionar lógica para limitar nº de coringas por usuário/período
    habit.jokerUsedDates.push(date);
    cmd.pointsDelta = 0; // Coringa não dá pontos

  } else if (cmd.type === 'revert') {
    const targetCmdId = cmd.target.id;
    const targetCmd = (db.commands || []).find(c => c.id === targetCmdId);
    if (!targetCmd) throw new Error('Target command not found');
    if (targetCmd.undone) throw new Error('Target command already undone');
    // TODO: Adicionar verificação de permissão e janela de tempo para reverter

    cmd.pointsDelta = -(targetCmd.pointsDelta || 0); // Inverte os pontos
    targetCmd.undone = true; // Marca o comando original como desfeito

    // Lógica para reverter os efeitos do comando original
    if (targetCmd.type === 'checkin') {
      const habit = findHabit(targetCmd.target.id);
      if (habit) {
        // Reverter streak é complexo, idealmente recalcularia baseado nos comandos não desfeitos
        // Simplificação: apenas decrementa se o checkin desfeito era o último
         if (habit.lastCheckIn === targetCmd.timestamp.slice(0,10)) {
             habit.streak = Math.max(0, (habit.streak || 1) - 1);
             // Reverter lastCheckIn? Precisaria encontrar o checkin anterior válido.
             // habit.lastCheckIn = encontrarUltimoCheckinValido(db, habit.id, targetCmd.userId);
         }
      }
      const user = findUser(targetCmd.userId);
      if (user && user.stats) {
         user.stats.points = Math.max(0, (user.stats.points || 0) + cmd.pointsDelta); // Aplica a reversão dos pontos
      }
      // TODO: Reverter progresso de desafios e conquistas se necessário (complexo)

    } else if (targetCmd.type === 'joker_use') {
        const habit = findHabit(targetCmd.target.id);
        const dateUsed = targetCmd.metadata?.date || targetCmd.timestamp.slice(0,10);
        if (habit && habit.jokerUsedDates) {
            habit.jokerUsedDates = habit.jokerUsedDates.filter(d => d !== dateUsed);
        }
    }
    // Não há 'else' aqui, pois só revertemos checkin ou joker_use por enquanto

  } else {
    throw new Error('Unknown command type: ' + cmd.type);
  }

  // Salva o comando atual (checkin, joker ou revert)
  db.commands = db.commands || [];
  db.commands.push(cmd);
  db.nextId = db.nextId || {};
  db.nextId.commands = cmdId + 1;

  // Cria o registro de auditoria para o comando atual
  db.auditLog = db.auditLog || [];
  const auditId = (db.nextId && db.nextId.auditLog) || 1;
  db.auditLog.push({
    id: auditId,
    entity: 'commands',
    entityId: cmd.id, // O ID do comando que acabou de ser criado
    action: 'create', // A ação foi criar este comando
    userId: cmd.userId,
    timestamp: new Date().toISOString(),
    data: { // Um resumo dos dados do comando
      type: cmd.type,
      target: cmd.target,
      pointsDelta: cmd.pointsDelta,
      metadata: cmd.metadata,
      revertedCmdId: cmd.type === 'revert' ? cmd.target.id : undefined // Se for revert, indica qual comando foi desfeito
    }
  });
  db.nextId.auditLog = auditId + 1;

  await writeDB(db);
  return cmd; // Retorna o comando que foi executado
}

/* Visibility: filter habits for a viewer according to habit.privacy */
async function filterHabitsForViewer(viewerId) {
  const db = await readDB();
  const users = db.users || []; // Garante que users seja um array
  const viewer = users.find(u => u.id === viewerId) || null;
  
  return (db.habits || []).filter(h => {
    if (!h) return false; // Adiciona verificação para hábito nulo/inválido

    if (h.privacy === 'public') return true;
    if (h.privacy === 'private') return h.userId === viewerId;
    if (h.privacy === 'friends') {
      // É visível se for o próprio dono
      if (h.userId === viewerId) return true;
      // Ou se o viewer estiver na lista de amigos do dono
      const owner = users.find(u => u.id === h.userId);
      // Verifica se owner existe, se tem a prop friends e se ela é um array antes de usar includes
      return !!(owner && Array.isArray(owner.friends) && owner.friends.includes(viewerId));
    }
    // Se a privacidade não for nenhuma das anteriores, assume como privado por segurança
    return h.userId === viewerId;
  });
}

module.exports = {
  readDB,
  writeDB,
  getAll,
  getById,
  create,
  update,
  remove,
  executeCommand,
  filterHabitsForViewer
};
