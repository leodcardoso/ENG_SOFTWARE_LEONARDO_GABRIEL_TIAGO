const Challenge = require('../models/challenge.model');
const ChallengeInvite = require('../models/challengeInvite.model');
const Notification = require('../models/notification.model');

class ChallengeService {
  static async createChallenge({ userId, title, description, category, expirationDate }) {
    if (!title || title.trim().length === 0) {
      throw new Error('Título é obrigatório');
    }

    const challenge = await Challenge.create({
      ownerId: userId,
      title,
      description,
      category,
      expirationDate
    });

    // Adiciona o criador como membro ADMIN
    await Challenge.addMember(challenge.id, userId, 'ADMIN');

    return challenge;
  }

  static async inviteUsers({ challengeId, senderId, userIds }) {
    const invites = [];

    for (const userId of userIds) {
      if (userId === senderId) continue; // Não convida a si mesmo

      const invite = await ChallengeInvite.create({
        senderId,
        receiverId: userId,
        challengeId
      });

      if (invite) {
        // Cria notificação - CORRIGIDO: apenas challengeInviteId
        await Notification.create({
          recipientUserId: userId,
          actorUserId: senderId,
          type: 'CHALLENGE_INVITE',
          challengeInviteId: invite.id,
          // challengeId: challengeId, // REMOVIDO
          data: {}
        });

        invites.push(invite);
      }
    }

    return invites;
  }

  static async getChallenges(userId) {
    return await Challenge.findAll(userId);
  }

  static async getChallengeById(challengeId, userId) {
    const challenge = await Challenge.findById(challengeId);
    
    if (!challenge) {
      throw new Error('Desafio não encontrado');
    }

    const isMember = await Challenge.isMember(challengeId, userId);
    
    if (!isMember) {
      throw new Error('Você não é membro deste desafio');
    }

    return challenge;
  }

  static async checkin({ challengeId, userId }) {
    const isMember = await Challenge.isMember(challengeId, userId);
    
    if (!isMember) {
      throw new Error('Você não é membro deste desafio');
    }

    // Incrementa pontos do usuário no desafio
    const points = 1; // Pontos padrão por check-in
    await Challenge.incrementMemberPoints(challengeId, userId, points);

    // Atualiza pontos do usuário no perfil
    const userStats = await Challenge.updateUserPoints(userId, points);

    return { success: true, points, userStats };
  }

  static async getRanking(challengeId, userId) {
    const isMember = await Challenge.isMember(challengeId, userId);
    
    if (!isMember) {
      throw new Error('Você não é membro deste desafio');
    }

    const members = await Challenge.getAllMembers(challengeId);

    // Adiciona colocação
    const ranking = members.map((member, index) => ({
      userName: member.user_name,
      points: member.points,
      position: index + 1,
      avatarUrl: member.avatar_url,
      role: member.role
    }));

    return ranking;
  }
}

module.exports = ChallengeService;
