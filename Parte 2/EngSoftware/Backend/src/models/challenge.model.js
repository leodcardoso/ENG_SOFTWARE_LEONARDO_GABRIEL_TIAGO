const { pool: db } = require("../config/database");

class Challenge {
  static async create({ ownerId, title, description, category, expirationDate }) {
    const query = `
      INSERT INTO challenges (owner_id, title, description, category, expiration_date)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    
    const values = [ownerId, title, description, category, expirationDate];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async findAll(userId) {
    const query = `
      SELECT DISTINCT c.*, u.name as owner_name
      FROM challenges c
      JOIN users u ON c.owner_id = u.id
      JOIN challenge_members cm ON c.id = cm.challenge_id
      WHERE cm.user_id = $1 AND c.is_active = true
      ORDER BY c.created_at DESC
    `;
    
    const result = await db.query(query, [userId]);
    return result.rows;
  }

  static async findById(challengeId) {
    const query = `
      SELECT c.*, u.name as owner_name, u.avatar_url as owner_avatar
      FROM challenges c
      JOIN users u ON c.owner_id = u.id
      WHERE c.id = $1
    `;
    
    const result = await db.query(query, [challengeId]);
    return result.rows[0];
  }

  static async addMember(challengeId, userId, role = 'MEMBER') {
    const query = `
      INSERT INTO challenge_members (challenge_id, user_id, role)
      VALUES ($1, $2, $3)
      ON CONFLICT (challenge_id, user_id) DO NOTHING
      RETURNING *
    `;
    
    const result = await db.query(query, [challengeId, userId, role]);
    return result.rows[0];
  }

  static async getAllMembers(challengeId) {
    const query = `
      SELECT 
        cm.user_id,
        u.name as user_name,
        u.avatar_url,
        cm.user_points as points,
        cm.role,
        cm.joined_at
      FROM challenge_members cm
      JOIN users u ON cm.user_id = u.id
      WHERE cm.challenge_id = $1 AND cm.is_active = true
      ORDER BY cm.user_points DESC
    `;
    
    const result = await db.query(query, [challengeId]);
    return result.rows;
  }

  static async incrementMemberPoints(challengeId, userId, points = 1) {
    const query = `
      UPDATE challenge_members
      SET user_points = user_points + $3
      WHERE challenge_id = $1 AND user_id = $2
      RETURNING *
    `;
    
    const result = await db.query(query, [challengeId, userId, points]);
    return result.rows[0];
  }

  static async isMember(challengeId, userId) {
    const query = `
      SELECT * FROM challenge_members
      WHERE challenge_id = $1 AND user_id = $2 AND is_active = true
    `;
    
    const result = await db.query(query, [challengeId, userId]);
    return result.rows.length > 0;
  }
}

module.exports = Challenge;
