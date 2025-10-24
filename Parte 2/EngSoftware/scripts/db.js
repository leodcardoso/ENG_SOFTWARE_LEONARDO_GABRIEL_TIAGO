const fs = require('fs').promises;
const path = require('path');

const dbPath = path.resolve(__dirname, '..', 'data', 'db.json');

async function readDB() {
  try {
    const raw = await fs.readFile(dbPath, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    if (err.code === 'ENOENT') {
      // Arquivo não existe — retornar estrutura inicial para evitar que o server quebre
      return {
        nextId: {},
        users: [],
        habits: [],
        tasks: [],
        challenges: [],
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

async function create(collection, item) {
  const db = await readDB();
  db[collection] = db[collection] || [];
  const next = (db.nextId && db.nextId[collection]) || 1;
  const newItem = { id: next, ...item };
  db[collection].push(newItem);
  db.nextId = db.nextId || {};
  db.nextId[collection] = next + 1;
  await writeDB(db);
  return newItem;
}

async function update(collection, id, changes) {
  const db = await readDB();
  const list = db[collection] || [];
  const idx = list.findIndex(x => x.id === id);
  if (idx === -1) return null;
  list[idx] = { ...list[idx], ...changes };
  db[collection] = list;
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
    if (habit.lastCheckIn === today) throw new Error('Already checked-in today');
    habit.lastCheckIn = today;
    habit.streak = (habit.streak || 0) + 1;
    habit.bestStreak = Math.max(habit.bestStreak || 0, habit.streak);
    cmd.pointsDelta = habit.pointsPerCheckIn || 0;
    const user = findUser(cmd.userId);
    if (user) {
      user.stats = user.stats || { points: 0, level: 1 };
      user.stats.points += cmd.pointsDelta;
    }
    (db.challenges || []).forEach(ch => {
      if (ch.goal && ch.goal.habitId === habit.id && ch.participantIds.includes(cmd.userId)) {
        ch.progress = ch.progress || {};
        ch.progress[cmd.userId] = (ch.progress[cmd.userId] || 0) + 1;
      }
    });
    db.userAchievements = db.userAchievements || [];
    let userAch = db.userAchievements.find(a => a.userId === cmd.userId);
    if (!userAch) {
      userAch = { userId: cmd.userId, achievementIds: [] };
      db.userAchievements.push(userAch);
    }
    if (!userAch.achievementIds.includes(1)) {
      userAch.achievementIds.push(1);
      const usr = findUser(cmd.userId);
      if (usr) usr.stats.points += 5;
    }
  } else if (cmd.type === 'joker_use') {
    const habit = findHabit(cmd.target.id);
    if (!habit) throw new Error('Habit not found');
    const date = (new Date()).toISOString().slice(0,10);
    habit.jokerUsedDates = habit.jokerUsedDates || [];
    if (habit.jokerUsedDates.includes(date)) throw new Error('Joker already used for date');
    habit.jokerUsedDates.push(date);
    cmd.pointsDelta = 0;
  } else if (cmd.type === 'revert') {
    const targetCmdId = cmd.target.id;
    const target = (db.commands || []).find(c => c.id === targetCmdId);
    if (!target) throw new Error('Target command not found');
    if (target.undone) throw new Error('Target already undone');
    cmd.pointsDelta = -(target.pointsDelta || 0);
    target.undone = true;
    if (target.type === 'checkin') {
      const habit = findHabit(target.target.id);
      if (habit) {
        habit.streak = Math.max(0, (habit.streak || 1) - 1);
      }
      const user = findUser(target.userId);
      if (user) user.stats.points = Math.max(0, (user.stats.points || 0) + cmd.pointsDelta);
    }
  } else {
    throw new Error('Unknown command type');
  }

  db.commands = db.commands || [];
  db.commands.push(cmd);
  db.nextId = db.nextId || {};
  db.nextId.commands = cmdId + 1;

  db.auditLog = db.auditLog || [];
  const auditId = (db.nextId && db.nextId.auditLog) || 1;
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

/* Visibility: filter habits for a viewer according to habit.privacy */
async function filterHabitsForViewer(viewerId) {
  const db = await readDB();
  const viewer = db.users.find(u => u.id === viewerId) || null;
  return (db.habits || []).filter(h => {
    if (h.privacy === 'public') return true;
    if (h.privacy === 'private') return h.userId === viewerId;
    if (h.privacy === 'friends') {
      if (h.userId === viewerId) return true;
      const owner = db.users.find(u => u.id === h.userId);
      return !!(owner && Array.isArray(owner.friends) && owner.friends.includes(viewerId));
    }
    return false;
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