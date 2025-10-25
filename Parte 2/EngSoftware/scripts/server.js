const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db.js');
const cors = require('cors');
const bcrypt = require('bcrypt');


const app = express();
app.use(bodyParser.json());
app.use(cors());



const ALLOWED_COLLECTIONS = ['users','habits','tasks','challenges','achievements','notifications','docs','commands','userAchievements','auditLog'];

/* Endpoint de Registro (Criação de Usuário Segura) */
app.post('/register', async (req, res) => {
  try {
    console.log("Corpo Recebido:", req.body); // <-- ADICIONE ISTO
    const { name, email, password, role } = req.body;

    // 1. Verifica se a senha foi enviada
    if (!password) {
      return res.status(400).json({ error: 'Password is required' });
    }

    // 2. Gera o "hash" da senha (o bolo criptografado)
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // 3. Monta o novo usuário SEM salvar a senha original
    const newUser = {
      name,
      email,
      passwordHash, // Salva APENAS o hash
      role: role || 'developer',
      createdAt: new Date().toISOString(),
      profile: {},
      settings: {},
      friends: [],
      stats: { points: 0, level: 1 }
    };

    // 4. Salva no banco de dados
    const createdUser = await db.create('users', newUser); //
    
    // Remove o hash da resposta (boa prática)
    delete createdUser.passwordHash;
    
    res.status(201).json(createdUser);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* Endpoint de Login */
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Verifica se email e senha foram enviados
    if (!email || !password) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    // 2. Tenta encontrar o usuário pelo email
    const users = await db.getAll('users'); //
    const user = users.find(u => u.email === email);

    if (!user) {
      return res.status(401).json({ error: 'Usuário não encontrado' }); // 401 Unauthorized
    }

    // 3. Compara a senha enviada com o hash salvo
    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) {
      return res.status(401).json({ error: 'Senha incorreta' }); // 401 Unauthorized
    }

    // 4. Login bem-sucedido! Retorna os dados do usuário (sem o hash)
    // (Em uma aplicação real, você geraria um token JWT aqui)
    delete user.passwordHash; // Nunca envie o hash de volta
    res.status(200).json(user);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/:collection', async (req, res) => {
  const col = req.params.collection;
  
  // VAMOS PROIBIR A CRIAÇÃO DE USUÁRIOS POR AQUI
  if (col === 'users') {
    return res.status(403).json({ error: 'Use o endpoint /register para criar usuários.' });
  }
  // FIM DA ALTERAÇÃO

  if (!ALLOWED_COLLECTIONS.includes(col)) return res.status(400).json({ error: 'collection not allowed' });
  try {
    const newItem = await db.create(col, req.body); //
    res.status(201).json(newItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



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
    console.log('Executing command:', req.body);
    const cmd = await db.executeCommand(req.body);
    res.status(201).json(cmd);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
