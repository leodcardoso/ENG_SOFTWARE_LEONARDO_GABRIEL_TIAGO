const { pool: db } = require("../config/database");

class ChallengeInvite {
  static async create({ senderId, receiverId, challengeId, message = null }) {
    const query = `
      INSERT INTO challenge_invites (sender_user_id, receiver_user_id, challenge_id, message)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (challenge_id, receiver_user_id) DO NOTHING
      RETURNING *
    `;
    
    const values = [senderId, receiverId, challengeId, message];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async findById(inviteId) {
    const query = `SELECT * FROM challenge_invites WHERE id = $1`;
    const result = await db.query(query, [inviteId]);
    return result.rows[0];
  }

  static async updateStatus(inviteId, status) {
    // Validação do status
    const validStatuses = ['PENDING', 'ACCEPTED', 'REJECTED', 'CANCELLED'];
    
    if (!status || !validStatuses.includes(status)) {
      status = 'ACCEPTED';
    }

    const query = `
      UPDATE challenge_invites
      SET status = $2, updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `;
    const result = await db.query(query, [inviteId, status]);
    return result.rows[0];
  }
}

module.exports = ChallengeInvite;
