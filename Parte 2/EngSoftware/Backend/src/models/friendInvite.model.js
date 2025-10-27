const pool = require("../config/database");
const { pool: db } = require("../config/database");

class FriendInvite {
  static async create(senderUserId, receiverUserId, message = null) {
    const query = `
      INSERT INTO friend_invites (sender_user_id, receiver_user_id, message)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    
    const result = await db.query(query, [senderUserId, receiverUserId, message]);
    return result.rows[0];
  }

  static async findById(inviteId) {
    const query = `
      SELECT fi.*,
        sender.name as sender_name,
        sender.avatar_url as sender_avatar,
        receiver.name as receiver_name,
        receiver.avatar_url as receiver_avatar
      FROM friend_invites fi
      JOIN users sender ON fi.sender_user_id = sender.id
      JOIN users receiver ON fi.receiver_user_id = receiver.id
      WHERE fi.id = $1
    `;
    
    const result = await db.query(query, [inviteId]);
    return result.rows[0];
  }

  static async updateStatus(inviteId, status) {
    const query = `
      UPDATE friend_invites
      SET status = $1, updated_at = NOW()
      WHERE id = $2
      RETURNING *
    `;
    
    const result = await db.query(query, [status, inviteId]);
    return result.rows[0];
  }

  static async findPendingByUsers(senderUserId, receiverUserId) {
    const query = `
      SELECT * FROM friend_invites
      WHERE ((sender_user_id = $1 AND receiver_user_id = $2)
         OR (sender_user_id = $2 AND receiver_user_id = $1))
        AND status = 'PENDING'
    `;
    
    const result = await db.query(query, [senderUserId, receiverUserId]);
    return result.rows[0];
  }

  static async createFriendship(userIdA, userIdB) {
    const [minId, maxId] = [Math.min(userIdA, userIdB), Math.max(userIdA, userIdB)];
    
    const query = `
      INSERT INTO friendships (user_id_a, user_id_b)
      VALUES ($1, $2)
      ON CONFLICT DO NOTHING
      RETURNING *
    `;
    
    const result = await db.query(query, [minId, maxId]);
    return result.rows[0];
  }

  static async areFriends(userIdA, userIdB) {
    const [minId, maxId] = [Math.min(userIdA, userIdB), Math.max(userIdA, userIdB)];
    
    const query = `
      SELECT * FROM friendships
      WHERE user_id_a = $1 AND user_id_b = $2
    `;
    
    const result = await db.query(query, [minId, maxId]);
    return result.rows.length > 0;
  }
}

module.exports = FriendInvite;
