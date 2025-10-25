const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db.js');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'onanoleozinhhoehonossoheisenberg'; // SEU SEGREDO JWT

const app = express();
app.use(bodyParser.json());
app.use(cors()); // Permite requisições de diferentes origens (ex: seu app Expo)

const ALLOWED_COLLECTIONS = ['users','habits','tasks','challenges','achievements','notifications','docs','commands','userAchievements','auditLog'];

// --- MIDDLEWARE DE AUTENTICAÇÃO ---
const authenticateToken = (req, res, next) => {
  // 1. Pega o token do cabeçalho 'Authorization'
  const authHeader = req.headers['authorization'];
  // O formato esperado é "Bearer TOKEN"
  const token = authHeader && authHeader.split(' ')[1];

  // 2. Se não veio token, retorna erro 401 (Não Autorizado)
  if (token == null) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  // 3. Verifica se o token é válido
  jwt.verify(token, JWT_SECRET, (err, userPayload) => {
    // Se o token for inválido (expirado, assinatura errada), retorna erro 403 (Proibido)
    if (err) {
      console.error("Erro na verificação do JWT:", err.message); // Log para depuração
      return res.status(403).json({ error: 'Token inválido ou expirado' });
    }

    // 4. Se o token for válido, anexa o payload (dados do usuário) ao objeto 'req'
    req.user = userPayload; // Agora nossas rotas saberão quem fez a requisição

    // 5. Chama 'next()' para passar a requisição para a próxima função (a rota real)
    next();
  });
};

// --- ROTAS PÚBLICAS (NÃO PRECISAM DE TOKEN) ---

/* Endpoint de Registro (Criação de Usuário Segura) */
app.post('/register', async (req, res) => {
  try {
    console.log("Corpo Recebido no Registro:", req.body);
    const { name, email, password, role } = req.body;

    // 1. Verifica se a senha foi enviada
    if (!password) {
      return res.status(400).json({ error: 'Password is required' });
    }

    // TODO: Adicionar validação de email (formato e se já existe)

    // 2. Gera o "hash" da senha
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
    const createdUser = await db.create('users', newUser);
    
    // Remove o hash da resposta (boa prática)
    delete createdUser.passwordHash;
    
    res.status(201).json(createdUser);

  } catch (err) {
    console.error("Erro no registro:", err); // Log de erro mais detalhado
    res.status(500).json({ error: err.message });
  }
});

/* Endpoint de Login (com JWT) */
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    const users = await db.getAll('users');
    const user = users.find(u => u.email === email);

    if (!user || !user.passwordHash) { // Verifica se tem hash também
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    // 4. Login bem-sucedido! Gerar o Token JWT
    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role
    };
    const options = {
      expiresIn: '1h' // Token expira em 1 hora
    };
    const token = jwt.sign(payload, JWT_SECRET, options);

    // 5. Retorna APENAS o token para o frontend
    res.status(200).json({ token: token });

  } catch (err) {
    console.error("Erro no login:", err); // Log de erro
    res.status(500).json({ error: err.message });
  }
});

// --- ROTAS PROTEGIDAS (PRECISAM DE TOKEN JWT VÁLIDO) ---

/* Endpoint de Hábitos Visíveis (PROTEGIDO) */
app.get('/habits-visible', authenticateToken, async (req, res) => {
  const viewerId = req.user.userId; // Usa o ID do token autenticado
  try {
    const list = await db.filterHabitsForViewer(viewerId);
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* Endpoint de Executar Comando (PROTEGIDO) */
app.post('/commands', authenticateToken, async (req, res) => {
  try {
    // Adiciona o userId do token ao comando, garantindo segurança
    const commandData = { ...req.body, userId: req.user.userId };
    console.log('Executing command for user:', req.user.userId, commandData);
    const cmd = await db.executeCommand(commandData);
    res.status(201).json(cmd);
  } catch (err) {
    console.error("Erro ao executar comando:", err); // Log de erro
    res.status(400).json({ error: err.message });
  }
});

/* Generic CRUD endpoints (Protegidos ou Não, conforme a necessidade) */

// GET /:collection (Deixado público por enquanto, pode precisar de proteção dependendo da coleção)
app.get('/:collection', async (req, res) => {
  const col = req.params.collection;
  if (!ALLOWED_COLLECTIONS.includes(col)) return res.status(400).json({ error: 'collection not allowed' });
  try {
    res.json(await db.getAll(col));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /:collection/:id (Deixado público, mas pode precisar verificar permissão dependendo da coleção)
app.get('/:collection/:id', async (req, res) => {
  const col = req.params.collection;
  const id = parseInt(req.params.id, 10);
  if (!ALLOWED_COLLECTIONS.includes(col)) return res.status(400).json({ error: 'collection not allowed' });
  try {
    const item = await db.getById(col, id);
    if (!item) return res.status(404).json({ error: 'not found' });
    // TODO: Adicionar verificação de permissão aqui se necessário (ex: usuário só pode ver seu próprio perfil?)
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /:collection (PROTEGIDO - Usuário logado cria itens)
app.post('/:collection', authenticateToken, async (req, res) => {
  const col = req.params.collection;

  // Proíbe a criação de usuários por esta rota genérica
  if (col === 'users') {
    return res.status(403).json({ error: 'Use o endpoint /register para criar usuários.' });
  }
  if (!ALLOWED_COLLECTIONS.includes(col)) {
    return res.status(400).json({ error: 'collection not allowed' });
  }

  try {
    // Garante que o item criado pertença ao usuário logado (se aplicável)
    let itemData = { ...req.body };
    // Adiciona userId/ownerId automaticamente para coleções que pertencem a um usuário
    if (['habits', 'notifications', 'tasks', 'challenges'].includes(col)) { // Adapte esta lista
      itemData.userId = req.user.userId;
      if (col === 'tasks') itemData.ownerId = req.user.userId; // Campo específico de tasks
      if (col === 'challenges') itemData.creatorId = req.user.userId; // Campo específico de challenges
    }

    const newItem = await db.create(col, itemData);
    res.status(201).json(newItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /:collection/:id (PROTEGIDO - Usuário logado só edita o que é seu)
app.put('/:collection/:id', authenticateToken, async (req, res) => {
  const col = req.params.collection;
  const id = parseInt(req.params.id, 10);
  const userIdFromToken = req.user.userId;

  if (!ALLOWED_COLLECTIONS.includes(col)) {
     return res.status(400).json({ error: 'collection not allowed' });
  }

  try {
    const item = await db.getById(col, id);

    if (!item) {
       return res.status(404).json({ error: 'not found' });
    }

    // Verifica se o usuário logado é o "dono" do item
    // Adapte os campos 'userId', 'ownerId', 'creatorId' conforme a coleção
    const ownerField = item.userId || item.ownerId || item.creatorId;
    if (ownerField !== userIdFromToken && col !== 'users' && col !== 'achievements') { // Permite editar próprio user, achievements são globais
        // Se a coleção for 'users', permite editar apenas o próprio perfil
        if (col === 'users' && item.id !== userIdFromToken) {
           return res.status(403).json({ error: 'Forbidden: You can only edit your own profile' });
        } else if (col !== 'users') {
           return res.status(403).json({ error: 'Forbidden: You do not own this resource' });
        }
    }

    // Evita que campos críticos sejam alterados via PUT genérico
    delete req.body.id;
    delete req.body.userId;
    delete req.body.ownerId;
    delete req.body.creatorId;
    delete req.body.createdAt;
    delete req.body.passwordHash; // Nunca permitir alterar hash por aqui

    const updated = await db.update(col, id, req.body);
    if (!updated) return res.status(404).json({ error: 'Internal error during update' }); // Deveria ter sido encontrado antes
    res.json(updated);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /:collection/:id (PROTEGIDO - Usuário logado só deleta o que é seu)
app.delete('/:collection/:id', authenticateToken, async (req, res) => {
   const col = req.params.collection;
   const id = parseInt(req.params.id, 10);
   const userIdFromToken = req.user.userId;

   if (!ALLOWED_COLLECTIONS.includes(col)) {
       return res.status(400).json({ error: 'collection not allowed' });
   }

   // Coleções que não devem ser deletadas por aqui (ou nunca)
   if (['users', 'achievements', 'auditLog'].includes(col)) {
      return res.status(403).json({ error: `Deletion of ${col} is not allowed via this endpoint.` });
   }

   try {
     const item = await db.getById(col, id);

     if (!item) {
          return res.status(404).json({ error: 'not found' });
     }

     // Verifica se o usuário logado é o "dono" do item
     const ownerField = item.userId || item.ownerId || item.creatorId;
     if (ownerField !== userIdFromToken) {
         return res.status(403).json({ error: 'Forbidden: You do not own this resource' });
     }

     await db.remove(col, id);
     res.json({ ok: true });

   } catch (err) {
     res.status(500).json({ error: err.message });
   }
});

// --- INICIAR O SERVIDOR ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));