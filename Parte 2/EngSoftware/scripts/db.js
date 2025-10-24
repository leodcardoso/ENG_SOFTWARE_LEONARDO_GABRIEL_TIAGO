const fs = require('fs').promises;
const path = require('path');

const dbPath = path.resolve(__dirname, '..', 'db.json');

async function readDB() {
  try {
    const raw = await fs.readFile(dbPath, 'utf8');
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

module.exports = {
  readDB,
  writeDB,
  getAll,
  getById,
  create,
  update,
  remove
};