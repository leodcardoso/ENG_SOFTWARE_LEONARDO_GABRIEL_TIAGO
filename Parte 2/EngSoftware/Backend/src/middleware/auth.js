// Semi-certo, verificar a exportação do JWT_SECRET

const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'onanoleozinhhoehonossoheisenberg';

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  jwt.verify(token, JWT_SECRET, (err, userPayload) => {
    if (err) {
      console.error("Erro na verificação do JWT:", err.message);
      return res.status(403).json({ error: 'Token inválido ou expirado' });
    }

    req.user = userPayload;
    next();
  });
};

module.exports = { authenticateToken, JWT_SECRET };
