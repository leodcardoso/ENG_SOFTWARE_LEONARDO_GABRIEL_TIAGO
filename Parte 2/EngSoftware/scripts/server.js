const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db.js');

const app = express();
app.use(bodyParser.json());

const ALLOWED_COLLECTIONS = ['users','habits','tasks','challenges','achievements','notifications','docs','commands','userAchievements','auditLog'];

/* Generic CRUD endpoints */
app.get('/:collection', async (req, res) => {
  const col = req.params.collection;
  if (!ALLOWED_COLLECTIONS.includes(col)) return res.status(400).json({ error: 'collection not allowed' });
  res.json(await db.getAll(col));
});

app.get('/:collection/:id', async (req, res) => {
  const col = req.params.collection;
  const id = parseInt(req.params.id, 10);
  if (!ALLOWED_COLLECTIONS.includes(col)) return res.status(400).json({ error: 'collection not allowed' });
  const item = await db.getById(col, id);
  if (!item) return res.status(404).json({ error: 'not found' });
  res.json(item);
});

app.post('/:collection', async (req, res) => {
  const col = req.params.collection;
  if (!ALLOWED_COLLECTIONS.includes(col)) return res.status(400).json({ error: 'collection not allowed' });
  try {
    const newItem = await db.create(col, req.body);
    res.status(201).json(newItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/:collection/:id', async (req, res) => {
  const col = req.params.collection;
  const id = parseInt(req.params.id, 10);
  if (!ALLOWED_COLLECTIONS.includes(col)) return res.status(400).json({ error: 'collection not allowed' });
  const updated = await db.update(col, id, req.body);
  if (!updated) return res.status(404).json({ error: 'not found' });
  res.json(updated);
});

app.delete('/:collection/:id', async (req, res) => {
  const col = req.params.collection;
  const id = parseInt(req.params.id, 10);
  if (!ALLOWED_COLLECTIONS.includes(col)) return res.status(400).json({ error: 'collection not allowed' });
  await db.remove(col, id);
  res.json({ ok: true });
});

/* Habits visible to a viewer */
app.get('/habits-visible', async (req, res) => {
  const viewerId = req.query.viewerId ? parseInt(req.query.viewerId, 10) : null;
  try {
    const list = await db.filterHabitsForViewer(viewerId);
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* Execute command (checkin/joker_use/revert) */
app.post('/commands', async (req, res) => {
  try {
    const cmd = await db.executeCommand(req.body);
    res.status(201).json(cmd);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));