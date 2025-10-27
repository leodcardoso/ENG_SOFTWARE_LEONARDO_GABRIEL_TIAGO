const pool = require('../config/database');
const { pool: db } = require('../config/database');

class User {
  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await db.query(query, [email]);
    return result.rows[0];
  }

  static async findById(id) {
    const query = 'SELECT id, name, email, points, level, created_at FROM users WHERE id = $1';
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  static async create({ name, email, password_hash }) {
    const query = `
      INSERT INTO users (name, email, password_hash, points, level)
      VALUES ($1, $2, $3, 0, 1)
      RETURNING id, name, email, points, level
    `;
    const result = await db.query(query, [name, email, password_hash]);
    return result.rows[0];
  }

  static async createDefaultSettings(userId, remindersDefault) {
    const query = `
      INSERT INTO settings (user_id, notifications, reminders_default, private_by_default)
      VALUES ($1, true, $2, false)
    `;
    await db.query(query, [userId, remindersDefault || '09:00:00']);
  }
}

module.exports = User;