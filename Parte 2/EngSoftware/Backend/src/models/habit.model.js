const { pool: db } = require("../config/database");

class Habit {
  static async create({ userId, title, description, category, expirationDate }) {
    const query = `
      INSERT INTO habits (
        user_id, title, description, category, expiration_date
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    
    const values = [userId, title, description, category, expirationDate || null];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async findById(habitId, userId) {
    const query = `
      SELECT * FROM habits
      WHERE id = $1 AND user_id = $2
    `;
    
    const result = await db.query(query, [habitId, userId]);
    return result.rows[0];
  }

  static async findByUserId(userId) {
    const query = `
      SELECT * FROM habits
      WHERE user_id = $1
      ORDER BY created_at DESC
    `;
    
    const result = await db.query(query, [userId]);
    return result.rows;
  }

  static async checkin(habitId, userId) {
    const query = `
      UPDATE habits
      SET points = points + 1,
          last_check_in = CURRENT_DATE,
          updated_at = NOW()
      WHERE id = $1 AND user_id = $2 AND active = TRUE
      RETURNING *
    `;
    
    const result = await db.query(query, [habitId, userId]);
    return result.rows[0];
  }

  static async updateUserPoints(userId, points) {
    const query = `
      UPDATE users
      SET points = points + $1,
          updated_at = NOW()
      WHERE id = $2
      RETURNING points, level
    `;
    
    const result = await db.query(query, [points, userId]);
    return result.rows[0];
  }
}

module.exports = Habit;
