const fs = require('fs').promises;
const path = require('path');

const dbPath = path.resolve(__dirname, '..', 'data', 'db.json');

async function readDB() {
  try {
    const raw = await fs.readFile(dbPath, 'utf8');
    // console.log(raw); // Descomente para depurar o que está sendo lido
    return JSON.parse(raw);
  } catch (err) {
      if (err.code === 'ENOENT') {
        return {
          nextId: {},
          users: [],
          habits: [],
          tasks: [],
          challenges: [],
          challengeInvites: [], 
          achievements: [],
          notifications: [],
          docs: [],
          commands: [],
          auditLog: [],
          userAchievements: [],
          patterns: [],
          flows: []
        };
      }
      throw err;
    }
}

async function writeDB(db) {
  await fs.writeFile(dbPath, JSON.stringify(db, null, 2), 'utf8');
}

/* Generic CRUD */
async function getAll(collection) {
  const db = await readDB();
  return db[collection] || [];
}

async function getById(collection, id) {
  const list = await getAll(collection);
  return list.find(x => x.id === id) || null;
}

// --- FUNÇÃO 'CREATE' CORRIGIDA ---
// (Usa db.nextId para consistência com o resto do app e executeCommand)
async function create(collection, item) {
  const db = await readDB();
  db[collection] = db[collection] || [];
  // Usa o nextId para a coleção específica, ou 1 como padrão
  const next = (db.nextId && db.nextId[collection]) || 1;
  const newItem = { id: next, ...item };
  db[collection].push(newItem);
  db.nextId = db.nextId || {};
  db.nextId[collection] = next + 1; // Incrementa o nextId
  await writeDB(db);
  return newItem;
}
// --- FIM DA CORREÇÃO ---

async function update(collection, id, changes) {
  const db = await readDB();
  const list = db[collection] || [];
  const idx = list.findIndex(x => x.id === id);
  if (idx === -1) return null;
  list[idx] = { ...list[idx], ...changes };
  // Não sobrescreve a coleção inteira, apenas o db
  await writeDB(db);
  return list[idx];
}

async function remove(collection, id) {
  const db = await readDB();
  db[collection] = (db[collection] || []).filter(x => x.id !== id);
  await writeDB(db);
  return true;
}

// --- FUNÇÃO HELPER DE CATEGORIA ADICIONADA ---
/**
 * Determina a categoria de um hábito com base no seu título.
 * DEVE ser mantida em sincronia com as categorias no frontend (criaDesafio.tsx).
 * @param {object} habit - O objeto do hábito (ex: { id: 1, title: "Ler 30 min" })
 * @returns {string} O nome da categoria (ex: "Leitura", "Outro")
 */
function getCategoryForHabit(habit) {
  if (!habit || !habit.title) return 'Outro'; // Padrão
  const lowerTitle = habit.title.toLowerCase();

  // Mapeamento baseado nas categorias de criaDesafio.tsx
  if (lowerTitle.includes('ler') || lowerTitle.includes('leitura') || lowerTitle.includes('livro')) return 'Leitura';
  if (lowerTitle.includes('exercício') || lowerTitle.includes('academia') || lowerTitle.includes('correr') || lowerTitle.includes('treino')) return 'Exercício';
  if (lowerTitle.includes('alimentação') || lowerTitle.includes('comer') || lowerTitle.includes('dieta') || lowerTitle.includes('comida')) return 'Alimentação';
  if (lowerTitle.includes('hidratação') || lowerTitle.includes('água') || lowerTitle.includes('beber')) return 'Hidratação';
  if (lowerTitle.includes('meditação') || lowerTitle.includes('meditar') || lowerTitle.includes('mindfulness')) return 'Meditação';
  if (lowerTitle.includes('sono') || lowerTitle.includes('dormir')) return 'Sono';
  if (lowerTitle.includes('saúde') || lowerTitle.includes('remédio') || lowerTitle.includes('vitamina')) return 'Saúde';
  if (lowerTitle.includes('música') || lowerTitle.includes('instrumento') || lowerTitle.includes('tocar')) return 'Música';
  if (lowerTitle.includes('criatividade') || lowerTitle.includes('desenhar') || lowerTitle.includes('escrever') || lowerTitle.includes('arte') || lowerTitle.includes('foto')) return 'Criatividade';
  if (lowerTitle.includes('entretenimento') || lowerTitle.includes('jogo') || lowerTitle.includes('filme') || lowerTitle.includes('série')) return 'Entretenimento';
  if (lowerTitle.includes('trabalho') || lowerTitle.includes('estudar') || lowerTitle.includes('projeto') || lowerTitle.includes('commit') || lowerTitle.includes('revisar')) return 'Trabalho';

  return 'Outro'; // Padrão se nenhuma categoria for encontrada
}
// --- FIM DA FUNÇÃO HELPER ---


/* Command service: checkin, joker_use, revert */
// --- FUNÇÃO 'executeCommand' ATUALIZADA ---
async function executeCommand(command) {
  const db = await readDB();
  const cmdId = (db.nextId && db.nextId.commands) || 101; // Usa 101 como base
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
    if (!habit) throw new Error('Hábito não encontrado');
    
    // --- MUDANÇA 1: Determinar a categoria do hábito ---
    const habitCategory = getCategoryForHabit(habit);
    console.log(`[Check-in] Hábito: '${habit.title}', Categoria: '${habitCategory}'`);
    
    const today = (new Date()).toISOString().slice(0,10);
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    
    if (habit.lastCheckIn === today) {
       console.log(`[Check-in] Hábito ${habit.id} já teve check-in hoje.`);
       cmd.pointsDelta = 0;
    } else {
        habit.lastCheckIn = today;
        if (habit.lastCheckIn === yesterday) { // Esta lógica de streak pode estar incorreta (deveria checar o streak ANTES de atualizar)
            habit.streak = (habit.streak || 0) + 1;
        } else {
            habit.streak = 1; // Reseta o streak
        }
        habit.bestStreak = Math.max(habit.bestStreak || 0, habit.streak);
        cmd.pointsDelta = habit.pointsPerCheckIn || 0;
        
        const user = findUser(cmd.userId);
        if (user) {
          user.stats = user.stats || { points: 0, level: 1 };
          user.stats.points = (user.stats.points || 0) + cmd.pointsDelta;
        }

        // --- MUDANÇA 2: Atualizar progresso de desafios baseado na CATEGORIA ---
        (db.challenges || []).forEach(ch => {
          // Verifica se o 'goal' do desafio tem 'categoryTitle'
          // e se ela é igual à categoria do hábito que recebeu check-in.
          if (ch.goal && 
              ch.goal.categoryTitle === habitCategory && 
              Array.isArray(ch.participantIds) && 
              ch.participantIds.includes(cmd.userId)) 
          {
            console.log(`[Check-in] Atualizando progresso do desafio: '${ch.title}'`);
            ch.progress = ch.progress || {};
            ch.progress[cmd.userId] = (ch.progress[cmd.userId] || 0) + 1;
          }
        });
        // --- FIM DA MUDANÇA 2 ---

        // Lógica de Conquistas
        db.userAchievements = db.userAchievements || [];
        let userAch = db.userAchievements.find(a => a.userId === cmd.userId);
        if (!userAch) {
          userAch = { userId: cmd.userId, achievementIds: [] };
          db.userAchievements.push(userAch);
        }
        if (!userAch.achievementIds.includes(1)) { // ID 1 = "first_checkin"
          userAch.achievementIds.push(1);
          const usr = findUser(cmd.userId);
          const firstCheckinAch = (db.achievements || []).find(a => a.id === 1);
          if (usr && firstCheckinAch) {
             usr.stats.points = (usr.stats.points || 0) + (firstCheckinAch.points || 0);
          }
        }
    }

  } else if (cmd.type === 'joker_use') {
    // ... (Lógica do joker_use - sem alterações) ...
    const habit = findHabit(cmd.target.id);
    if (!habit) throw new Error('Habit not found');
    const date = cmd.metadata?.date || (new Date()).toISOString().slice(0,10);
    habit.jokerUsedDates = habit.jokerUsedDates || [];
    if (habit.jokerUsedDates.includes(date)) throw new Error('Coringa já usado para esta data: ' + date);
    habit.jokerUsedDates.push(date);
    cmd.pointsDelta = 0;

  } else if (cmd.type === 'revert') {
    // ... (Lógica do revert - com adição) ...
    const targetCmdId = cmd.target.id;
    const targetCmd = (db.commands || []).find(c => c.id === targetCmdId);
    if (!targetCmd) throw new Error('Comando alvo não encontrado');
    if (targetCmd.undone) throw new Error('Comando alvo já foi desfeito');

    cmd.pointsDelta = -(targetCmd.pointsDelta || 0);
    targetCmd.undone = true;

    if (targetCmd.type === 'checkin') {
      const habit = findHabit(targetCmd.target.id);
      if (habit) {
        habit.streak = Math.max(0, (habit.streak || 1) - 1);
        // TODO: Reverter lastCheckIn
      }
      const user = findUser(targetCmd.userId);
      if (user && user.stats) {
         user.stats.points = Math.max(0, (user.stats.points || 0) + cmd.pointsDelta);
      }
      
      // --- MUDANÇA 3: Reverter progresso do desafio ---
      const habitCategory = getCategoryForHabit(habit);
      (db.challenges || []).forEach(ch => {
          if (ch.goal && 
              ch.goal.categoryTitle === habitCategory && 
              Array.isArray(ch.participantIds) && 
              ch.participantIds.includes(targetCmd.userId) &&
              ch.progress &&
              ch.progress[targetCmd.userId] > 0)
          {
             console.log(`[Revert] Revertendo progresso do desafio: '${ch.title}'`);
             ch.progress[targetCmd.userId] = (ch.progress[targetCmd.userId] || 1) - 1;
          }
      });
      // --- FIM DA MUDANÇA 3 ---

    } else if (targetCmd.type === 'joker_use') {
        const habit = findHabit(targetCmd.target.id);
        const dateUsed = targetCmd.metadata?.date || targetCmd.timestamp.slice(0,10);
        if (habit && habit.jokerUsedDates) {
            habit.jokerUsedDates = habit.jokerUsedDates.filter(d => d !== dateUsed);
        }
    }
  } else {
    throw new Error('Tipo de comando desconhecido: ' + cmd.type);
  }

  // Salva o comando
  db.commands = db.commands || [];
  db.commands.push(cmd);
  db.nextId = db.nextId || {};
  db.nextId.commands = cmdId + 1;

  // Cria o registro de auditoria
  db.auditLog = db.auditLog || [];
  const auditId = (db.nextId && db.nextId.auditLog) || 201; // Usa 201 como base
  db.auditLog.push({
    id: auditId,
    entity: 'commands',
    entityId: cmd.id,
    action: 'create',
    userId: cmd.userId,
    timestamp: new Date().toISOString(),
    data: {
      type: cmd.type,
      target: cmd.target,
      pointsDelta: cmd.pointsDelta,
      metadata: cmd.metadata
    }
  });
  db.nextId.auditLog = auditId + 1;

  await writeDB(db);
  return cmd;
}
// --- FIM DA FUNÇÃO 'executeCommand' ---


/* Visibility: filter habits for a viewer according to habit.privacy */
async function filterHabitsForViewer(viewerId) {
  const db = await readDB();
  const users = db.users || [];
  const viewer = users.find(u => u.id === viewerId) || null;
  
  return (db.habits || []).filter(h => {
    if (!h) return false;
    if (h.privacy === 'public') return true;
    if (h.privacy === 'private') return h.userId === viewerId;
    if (h.privacy === 'friends') {
      if (h.userId === viewerId) return true;
      const owner = users.find(u => u.id === h.userId);
      return !!(owner && Array.isArray(owner.friends) && owner.friends.includes(viewerId));
    }
    return h.userId === viewerId; // Padrão é privado
  });
}

// Exporta todas as funções necessárias
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