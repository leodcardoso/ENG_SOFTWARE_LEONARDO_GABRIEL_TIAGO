// Incorreto, arrumar
const { pool } = require('./database');

async function query(text, params) {

  const result = await pool.query(text, params);
  return result;
}

async function getAll(collection) {
  const validTables = ['users', 'habits', 'tasks', 'challenges', 'achievements', 
                       'notifications', 'commands', 'audit_log', 'user_achievements'];
  
  if (!validTables.includes(collection)) {
    throw new Error(`Coleção inválida: ${collection}`);
  }

  const result = await query(`SELECT * FROM ${collection}`);
  return result.rows;
}

async function getById(collection, id) {
  const validTables = ['users', 'habits', 'tasks', 'achievements', 'notifications', 'commands', 'challenges'];
  
  if (!validTables.includes(collection)) {
    throw new Error(`Coleção inválida: ${collection}`);
  }

  const result = await query(`SELECT * FROM ${collection} WHERE id = $1`, [id]);
  return result.rows[0] || null;
}

async function create(collection, item) {
  if (collection === 'users') {
    const { name, email, passwordHash, role, profile, settings } = item;
    const result = await query(
      `INSERT INTO users (name, email, password_hash, role, profile, settings, stats_points, stats_level, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
       RETURNING *`,
      [name, email, passwordHash, role || 'developer', 
       profile || {}, settings || {}, 0, 1]
    );
    return result.rows[0];
  }

  if (collection === 'habits') {
    const { userId, title, description, frequency, schedule, reminders, 
            pointsPerCheckIn, privacy } = item;
    const result = await query(
      `INSERT INTO habits (user_id, title, description, frequency, schedule, 
                           reminders, points_per_check_in, privacy, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
       RETURNING *`,
      [userId, title, description || '', frequency || 'daily', 
       schedule || [], reminders || [], pointsPerCheckIn || 10, privacy || 'private']
    );
    return result.rows[0];
  }

  if (collection === 'challenges') {
    const { title, goal, endDate, startDate, privacy, creatorId } = item;
    const result = await query(
      `INSERT INTO challenges (title, goal, end_date, start_date, privacy, creator_id, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())
       RETURNING challenge_id as id, *`,
      [title, goal, endDate, startDate, privacy || 'private', creatorId]
    );
    
    const challenge = result.rows[0];
    
    await query(
      `INSERT INTO challenge_participants (challenge_id, creator_id, created_at, user_id)
       VALUES ($1, $2, $3, $4)`,
      [challenge.challenge_id, challenge.creator_id, challenge.created_at, creatorId]
    );
    
    await query(
      `INSERT INTO challenge_progress (challenge_id, creator_id, created_at, user_id, progress_value)
       VALUES ($1, $2, $3, $4, 0)`,
      [challenge.challenge_id, challenge.creator_id, challenge.created_at, creatorId]
    );
    
    return challenge;
  }

  if (collection === 'challengeInvites') {
    const { challengeId, inviterUserId, invitedUserId } = item;
    
    const challengeData = await query(
      `SELECT creator_id, created_at FROM challenges WHERE challenge_id = $1`,
      [challengeId]
    );
    
    if (challengeData.rows.length === 0) {
      throw new Error('Desafio não encontrado');
    }
    
    const { creator_id, created_at } = challengeData.rows[0];
    
    const result = await query(
      `INSERT INTO challenge_invited_friends (challenge_id, creator_id, created_at, friend_id, status)
       VALUES ($1, $2, $3, $4, 'pending')
       RETURNING *`,
      [challengeId, creator_id, created_at, invitedUserId]
    );
    
    return result.rows[0];
  }

  if (collection === 'notifications') {
    const { userId, type, title, body } = item;
    const result = await query(
      `INSERT INTO notifications (user_id, type, title, body, created_at)
       VALUES ($1, $2, $3, $4, NOW())
       RETURNING *`,
      [userId, type, title, body || '']
    );
    return result.rows[0];
  }

  if (collection === 'commands') {
    const { userId, type, target, metadata, pointsDelta, undone } = item;
    const result = await query(
      `INSERT INTO commands (user_id, type, target, metadata, points_delta, undone, timestamp)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())
       RETURNING *`,
      [userId, type, target, metadata || {}, pointsDelta || 0, undone || false]
    );
    return result.rows[0];
  }

  throw new Error(`Create não implementado para: ${collection}`);
}

async function update(collection, id, changes) {
  if (collection === 'users') {
    const fields = [];
    const values = [];
    let paramCount = 1;
    
    const allowedFields = ['name', 'email', 'profile', 'settings', 'stats_points', 'stats_level'];
    
    for (const [key, value] of Object.entries(changes)) {
      const dbField = key === 'statsPoints' ? 'stats_points' : 
                     key === 'statsLevel' ? 'stats_level' : key;
      
      if (allowedFields.includes(dbField)) {
        fields.push(`${dbField} = $${paramCount}`);
        values.push(value);
        paramCount++;
      }
    }
    
    if (fields.length === 0) return null;
    
    values.push(id);
    const result = await query(
      `UPDATE users SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );
    
    return result.rows[0] || null;
  }

  if (collection === 'habits') {
    const fields = [];
    const values = [];
    let paramCount = 1;
    
    for (const [key, value] of Object.entries(changes)) {
      const dbField = key === 'lastCheckIn' ? 'last_check_in' :
                     key === 'bestStreak' ? 'best_streak' :
                     key === 'pointsPerCheckIn' ? 'points_per_check_in' :
                     key === 'jokerUsedDates' ? 'joker_used_dates' : key;
      
      fields.push(`${dbField} = $${paramCount}`);
      values.push(value);
      paramCount++;
    }
    
    if (fields.length === 0) return null;
    
    values.push(id);
    const result = await query(
      `UPDATE habits SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );
    
    return result.rows[0] || null;
  }

  if (collection === 'commands') {
    const fields = [];
    const values = [];
    let paramCount = 1;
    
    for (const [key, value] of Object.entries(changes)) {
      const dbField = key === 'pointsDelta' ? 'points_delta' : key;
      fields.push(`${dbField} = $${paramCount}`);
      values.push(value);
      paramCount++;
    }
    
    if (fields.length === 0) return null;
    
    values.push(id);
    const result = await query(
      `UPDATE commands SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );
    
    return result.rows[0] || null;
  }

  throw new Error(`Update não implementado para: ${collection}`);
}

async function remove(collection, id) {
  const validTables = ['habits', 'tasks', 'notifications', 'commands'];
  
  if (!validTables.includes(collection)) {
    throw new Error(`Delete não permitido para: ${collection}`);
  }

  await query(`DELETE FROM ${collection} WHERE id = $1`, [id]);
  return true;
}

async function findByUser(collection, userId, options = {}) {
  const { page = 1, perPage = 20 } = options;
  const offset = (page - 1) * perPage;
  
  const userField = collection === 'tasks' ? 'owner_id' : 'user_id';
  
  const countResult = await query(
    `SELECT COUNT(*) FROM ${collection} WHERE ${userField} = $1`,
    [userId]
  );
  
  const result = await query(
    `SELECT * FROM ${collection} WHERE ${userField} = $1 
     ORDER BY id DESC LIMIT $2 OFFSET $3`,
    [userId, perPage, offset]
  );
  
  return {
    items: result.rows,
    total: parseInt(countResult.rows[0].count)
  };
}

function getCategoryForHabit(habit) {
  if (!habit || !habit.title) return 'Outro';
  const lowerTitle = habit.title.toLowerCase();

  if (lowerTitle.includes('ler') || lowerTitle.includes('leitura') || lowerTitle.includes('livro')) return 'Leitura';
  if (lowerTitle.includes('exercício') || lowerTitle.includes('academia') || lowerTitle.includes('correr') || lowerTitle.includes('treino')) return 'Exercício';
  if (lowerTitle.includes('alimentação') || lowerTitle.includes('comer') || lowerTitle.includes('dieta') || lowerTitle.includes('comida')) return 'Alimentação';
  if (lowerTitle.includes('hidratação') || lowerTitle.includes('água') || lowerTitle.includes('beber')) return 'Hidratação';
  if (lowerTitle.includes('meditação') || lowerTitle.includes('meditar') || lowerTitle.includes('mindfulness')) return 'Meditação';
  if (lowerTitle.includes('sono') || lowerTitle.includes('dormir')) return 'Sono';
  if (lowerTitle.includes('saúde') || lowerTitle.includes('remédio') || lowerTitle.includes('vitamina')) return 'Saúde';
  if (lowerTitle.includes('música') || lowerTitle.includes('instrumento') || lowerTitle.includes('tocar')) return 'Música';
  if (lowerTitle.includes('criatividade') || lowerTitle.includes('desenhar') || lowerTitle.includes('escrever') || lowerTitle.includes('arte') || lowerTitle.includes('foto')) return 'Criatividade';
  if (lowerTitle.includes('entretenimento') || lowerTitle.includes('jogo') || lowerTitle.includes('filme') || lowerTitle.includes('série')) return 'Entretenimento';
  if (lowerTitle.includes('trabalho') || lowerTitle.includes('estudar') || lowerTitle.includes('projeto') || lowerTitle.includes('commit') || lowerTitle.includes('revisar')) return 'Trabalho';

  return 'Outro';
}

async function executeCommand(command) {
  const pool = getPool();
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const { userId, type, target, metadata = {} } = command;
    let pointsDelta = 0;
    
    if (type === 'checkin') {
      const habitResult = await client.query(
        'SELECT * FROM habits WHERE id = $1',
        [target.id]
      );
      
      if (habitResult.rows.length === 0) {
        throw new Error('Hábito não encontrado');
      }
      
      const habit = habitResult.rows[0];
      const habitCategory = getCategoryForHabit(habit);
      const today = new Date().toISOString().slice(0, 10);
      
      if (habit.last_check_in === today) {
        console.log(`[Check-in] Hábito ${habit.id} já teve check-in hoje.`);
        pointsDelta = 0;
      } else {
        const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
        let newStreak = habit.last_check_in === yesterday ? habit.streak + 1 : 1;
        let newBestStreak = Math.max(habit.best_streak || 0, newStreak);
        
        pointsDelta = habit.points_per_check_in || 10;
        
        await client.query(
          `UPDATE habits SET last_check_in = $1, streak = $2, best_streak = $3 
           WHERE id = $4`,
          [today, newStreak, newBestStreak, habit.id]
        );
        
        await client.query(
          `UPDATE users SET stats_points = stats_points + $1 WHERE id = $2`,
          [pointsDelta, userId]
        );
        
        await client.query(
          `UPDATE challenge_progress 
           SET progress_value = progress_value + 1
           WHERE user_id = $1 
           AND (challenge_id, creator_id, created_at) IN (
             SELECT c.challenge_id, c.creator_id, c.created_at 
             FROM challenges c
             WHERE c.goal->>'categoryTitle' = $2
             AND EXISTS (
               SELECT 1 FROM challenge_participants cp
               WHERE cp.challenge_id = c.challenge_id
               AND cp.creator_id = c.creator_id
               AND cp.created_at = c.created_at
               AND cp.user_id = $1
             )
           )`,
          [userId, habitCategory]
        );
        
        const userAchResult = await client.query(
          `SELECT * FROM user_achievements WHERE user_id = $1 AND achievement_id = 1`,
          [userId]
        );
        
        if (userAchResult.rows.length === 0) {
          await client.query(
            `INSERT INTO user_achievements (user_id, achievement_id) VALUES ($1, 1)`,
            [userId]
          );
          
          const achResult = await client.query(
            `SELECT points FROM achievements WHERE id = 1`
          );
          
          if (achResult.rows.length > 0) {
            await client.query(
              `UPDATE users SET stats_points = stats_points + $1 WHERE id = $2`,
              [achResult.rows[0].points, userId]
            );
          }
        }
      }
      
    } else if (type === 'joker_use') {
      const date = metadata.date || new Date().toISOString().slice(0, 10);
      
      const habitResult = await client.query(
        'SELECT joker_used_dates FROM habits WHERE id = $1',
        [target.id]
      );
      
      if (habitResult.rows.length === 0) {
        throw new Error('Hábito não encontrado');
      }
      
      const jokerDates = habitResult.rows[0].joker_used_dates || [];
      
      if (jokerDates.includes(date)) {
        throw new Error('Coringa já usado para esta data: ' + date);
      }
      
      await client.query(
        `UPDATE habits SET joker_used_dates = array_append(joker_used_dates, $1::date)
         WHERE id = $2`,
        [date, target.id]
      );
      
    } else if (type === 'revert') {
      const targetCmdResult = await client.query(
        'SELECT * FROM commands WHERE id = $1',
        [target.id]
      );
      
      if (targetCmdResult.rows.length === 0) {
        throw new Error('Comando alvo não encontrado');
      }
      
      const targetCmd = targetCmdResult.rows[0];
      
      if (targetCmd.undone) {
        throw new Error('Comando alvo já foi desfeito');
      }
      
      pointsDelta = -(targetCmd.points_delta || 0);
      
      await client.query(
        'UPDATE commands SET undone = TRUE WHERE id = $1',
        [target.id]
      );
      
      if (targetCmd.type === 'checkin') {
        const habitResult = await client.query(
          'SELECT * FROM habits WHERE id = $1',
          [targetCmd.target.id]
        );
        
        if (habitResult.rows.length > 0) {
          const habit = habitResult.rows[0];
          const habitCategory = getCategoryForHabit(habit);
          
          await client.query(
            'UPDATE habits SET streak = GREATEST(0, streak - 1) WHERE id = $1',
            [habit.id]
          );
          
          await client.query(
            `UPDATE users SET stats_points = GREATEST(0, stats_points + $1) 
             WHERE id = $2`,
            [pointsDelta, targetCmd.user_id]
          );
          
          await client.query(
            `UPDATE challenge_progress 
             SET progress_value = GREATEST(0, progress_value - 1)
             WHERE user_id = $1 
             AND (challenge_id, creator_id, created_at) IN (
               SELECT c.challenge_id, c.creator_id, c.created_at 
               FROM challenges c
               WHERE c.goal->>'categoryTitle' = $2
             )`,
            [targetCmd.user_id, habitCategory]
          );
        }
      } else if (targetCmd.type === 'joker_use') {
        const dateUsed = targetCmd.metadata.date || targetCmd.timestamp.toISOString().slice(0, 10);
        
        await client.query(
          `UPDATE habits SET joker_used_dates = array_remove(joker_used_dates, $1::date)
           WHERE id = $2`,
          [dateUsed, targetCmd.target.id]
        );
      }
    } else {
      throw new Error('Tipo de comando desconhecido: ' + type);
    }
    
    const cmdResult = await client.query(
      `INSERT INTO commands (user_id, type, target, metadata, points_delta, undone, timestamp)
       VALUES ($1, $2, $3, $4, $5, FALSE, NOW())
       RETURNING *`,
      [userId, type, target, metadata, pointsDelta]
    );
    
    await client.query(
      `INSERT INTO audit_log (entity, entity_id, action, user_id, data, timestamp)
       VALUES ('commands', $1, 'create', $2, $3, NOW())`,
      [cmdResult.rows[0].id, userId, { type, target, pointsDelta, metadata }]
    );
    
    await client.query('COMMIT');
    
    return cmdResult.rows[0];
    
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

async function filterHabitsForViewer(viewerId) {
  const result = await query(
    `SELECT h.* FROM habits h
     LEFT JOIN users u ON h.user_id = u.id
     LEFT JOIN user_friends uf ON (uf.user_id = h.user_id AND uf.friend_id = $1)
     WHERE h.privacy = 'public'
        OR h.user_id = $1
        OR (h.privacy = 'friends' AND uf.friend_id IS NOT NULL)`,
    [viewerId]
  );
  
  return result.rows;
}


module.exports.query = query;
module.exports.getAll = getAll;
module.exports.getById = getById;
module.exports.create = create;
module.exports.update = update;
module.exports.remove = remove;
module.exports.findByUser = findByUser;
module.exports.executeCommand = executeCommand;
module.exports.filterHabitsForViewer = filterHabitsForViewer;