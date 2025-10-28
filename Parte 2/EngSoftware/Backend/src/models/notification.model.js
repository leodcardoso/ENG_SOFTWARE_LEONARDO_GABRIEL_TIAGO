const { pool: db } = require("../config/database");

class Notification {
  static async create({ recipientUserId, actorUserId, type, friendInviteId, challengeInviteId, habitId, challengeId, data = {} }) {
    const query = `
      INSERT INTO notifications (
        recipient_user_id, actor_user_id, type, 
        friend_invite_id, challenge_invite_id, 
        habit_id, challenge_id, data
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;
    
    const values = [
      recipientUserId, 
      actorUserId, 
      type, 
      friendInviteId || null, 
      challengeInviteId || null,
      habitId || null,
      challengeId || null,
      JSON.stringify(data)
    ];
    
    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async findByUserId(userId) {
    const query = `
      SELECT n.*, 
        u.name as actor_name, 
        u.avatar_url as actor_avatar
      FROM notifications n
      LEFT JOIN users u ON n.actor_user_id = u.id
      WHERE n.recipient_user_id = $1
      ORDER BY n.created_at DESC
    `;
    
    const result = await db.query(query, [userId]);
    return result.rows;
  }

  static async markAsRead(notificationId, userId) {
    const query = `
      UPDATE notifications
      SET read_at = NOW()
      WHERE id = $1 AND recipient_user_id = $2
      RETURNING *
    `;
    
    const result = await db.query(query, [notificationId, userId]);
    return result.rows[0];
  }

  static async markAsReadByFriendInvite(friendInviteId, userId) {
    const query = `
      UPDATE notifications
      SET read_at = NOW()
      WHERE friend_invite_id = $1 
        AND recipient_user_id = $2 
        AND read_at IS NULL
      RETURNING *
    `;
    
    const result = await db.query(query, [friendInviteId, userId]);
    return result.rows[0];
  }

  static async markAsReadByChallengeInvite(challengeInviteId, userId) {
    const query = `
      UPDATE notifications
      SET read_at = NOW()
      WHERE challenge_invite_id = $1 
        AND recipient_user_id = $2 
        AND read_at IS NULL
      RETURNING *
    `;
    
    const result = await db.query(query, [challengeInviteId, userId]);
    return result.rows[0];
  }
}

module.exports = Notification;
