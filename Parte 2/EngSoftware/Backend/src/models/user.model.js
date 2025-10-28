const pool = require("../config/database");
const { pool: db } = require("../config/database");

class User {
  static async findByEmail(email) {
    const query = "SELECT * FROM users WHERE email = $1";
    const result = await db.query(query, [email]);
    return result.rows[0];
  }

  static async findById(id) {
    const query =
      "SELECT id, name, email, points, level, created_at FROM users WHERE id = $1 LIMIT 1";
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  static async create({ name, email, password_hash, bio }) {
    const query = `
      INSERT INTO users (name, email, password_hash, bio,points, level)
      VALUES ($1, $2, $3, $4, 0, 1)
      RETURNING id, name, email, points, level
    `;
    const result = await db.query(query, [name, email, password_hash, bio]);
    return result.rows[0];
  }

  static async createDefaultSettings(userId, remindersDefault) {
    const query = `
      INSERT INTO settings (user_id, notifications, reminders_default, private_by_default)
      VALUES ($1, true, $2, false)
    `;
    await db.query(query, [userId, remindersDefault || "09:00:00"]);
  }

  static async update(id, { name, email, avatar_url }) {
    const query = `
      UPDATE users
      SET name = COALESCE($2, name),
          email = COALESCE($3, email),
          avatar_url = COALESCE($4, avatar_url),
          updated_at = NOW()
      WHERE id = $1
      RETURNING id, name, email, points, level, avatar_url, created_at, updated_at
    `;
    const result = await db.query(query, [id, name, email, avatar_url]);
    return result.rows[0];
  }

  // Lista amigos do usuário
  static async getFriends(userId) {
    const query = `
      SELECT u.id, u.name, u.avatar_url, u.points, u.level
      FROM (
        SELECT CASE WHEN user_id_a = $1 THEN user_id_b ELSE user_id_a END AS friend_id
        FROM friendships
        WHERE user_id_a = $1 OR user_id_b = $1
      ) f
      JOIN users u ON u.id = f.friend_id
      ORDER BY u.name
    `;
    const result = await db.query(query, [userId]);
    return result.rows;
  }

  // Todos os hábitos do usuário
  static async getAllHabits(userId) {
    const query = `
      SELECT id, title, description, category, points, active, last_check_in, expiration_date, is_private, created_at, updated_at
      FROM habits
      WHERE user_id = $1
      ORDER BY created_at DESC
    `;
    const result = await db.query(query, [userId]);
    return result.rows;
  }

  // Todos os desafios do usuário (membros ou dono)
  static async getAllChallenges(userId) {
    const query = `
      SELECT c.id, c.title, c.description, c.category, c.expiration_date, c.owner_id, c.is_active, c.created_at
      FROM challenge_members cm
      JOIN challenges c ON c.id = cm.challenge_id
      WHERE cm.user_id = $1
      ORDER BY c.created_at DESC
    `;
    const result = await db.query(query, [userId]);
    return result.rows;
  }

  // Notificações do usuário
  static async getNotifications(userId, limit = 50) {
    const query = `
      SELECT id, actor_user_id, type, data, read_at, created_at
      FROM notifications
      WHERE recipient_user_id = $1
      ORDER BY created_at DESC
      LIMIT $2
    `;
    const result = await db.query(query, [userId, limit]);
    return result.rows;
  }

  // Buscar usuários por nome (retorna se já são amigos)
  static async searchFriendByName(name, requesterId) {
    const q = `
      SELECT u.id, u.name, u.avatar_url,
        EXISTS(
          SELECT 1 FROM friendships f
          WHERE (f.user_id_a = LEAST(u.id, $2) AND f.user_id_b = GREATEST(u.id, $2))
        ) AS is_friend
      FROM users u
      WHERE u.name ILIKE $1
        AND u.id <> $2
      ORDER BY u.name
      LIMIT 50
    `;
    const result = await db.query(q, [`%${name}%`, requesterId]);
    return result.rows;
  }

  static async searchUserByName(name, requesterId) {
    // Garante trim e evita null/undefined
    const search = (name || '').trim();

    const q = `
      SELECT u.id,
             u.name,
             u.avatar_url,
             CASE WHEN f.user_id_a IS NOT NULL THEN TRUE ELSE FALSE END AS is_friend,
             CASE WHEN fi.id IS NOT NULL THEN TRUE ELSE FALSE END AS has_pending_invite
      FROM users u
      LEFT JOIN friendships f ON (
        (f.user_id_a = u.id AND f.user_id_b = $2)
        OR
        (f.user_id_a = $2 AND f.user_id_b = u.id)
      )
      LEFT JOIN friend_invites fi ON (
        (fi.sender_user_id = $2 AND fi.receiver_user_id = u.id AND fi.status = 'PENDING')
        OR
        (fi.sender_user_id = u.id AND fi.receiver_user_id = $2 AND fi.status = 'PENDING')
      )
      WHERE u.name ILIKE ('%' || $1 || '%')
        AND u.id <> $2
      ORDER BY is_friend DESC, u.name
      LIMIT 50
    `;

    const params = [search, requesterId];

    const result = await db.query(q, params); // ajuste se a variável de conexão for diferente
    return result.rows.map(r => ({
      id: r.id,
      name: r.name,
      avatar_url: r.avatar_url,
      is_friend: !!r.is_friend,
      has_pending_invite: !!r.has_pending_invite
    }));
  }

}

module.exports = User;
