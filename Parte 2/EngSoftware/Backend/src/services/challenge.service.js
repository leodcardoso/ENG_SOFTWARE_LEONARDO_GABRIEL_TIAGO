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
          data: {inviteId: challengeId}
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

  static async updateInviteStatus(inviteId, receiverId, status) {
    // Busca o convite
    const invite = await ChallengeInvite.findById(inviteId);
    
    if (!invite) {
      throw new Error('Convite não encontrado');
    }
    
    // Valida se o usuário é o destinatário
    if (invite.receiver_user_id !== receiverId) {
      throw new Error('Você não tem permissão para responder este convite');
    }
    
    // Valida se o convite está pendente
    if (invite.status !== 'PENDING') {
      throw new Error('Este convite já foi respondido');
    }
    
    // Atualiza o status do convite
    const updated = await ChallengeInvite.updateStatus(inviteId, status);
    
    // Se aceito, adiciona como membro do desafio
    if (status === 'ACCEPTED') {
      await Challenge.addMember(invite.challenge_id, receiverId, 'MEMBER');
      
      // Cria notificação para o remetente - TEMPORÁRIO: usando FRIEND_ACCEPTED até corrigir o ENUM
      await Notification.create({
        recipientUserId: invite.sender_user_id,
        actorUserId: receiverId,
        type: 'FRIEND_ACCEPTED', // TEMPORÁRIO: mudar para 'CHALLENGE_JOINED' após ALTER TYPE
        challengeInviteId: inviteId,
        data: { message: 'Aceitou seu convite para o desafio' }
      });
    }
    
    // Marca a notificação relacionada como lida
    await Notification.markAsReadByChallengeInvite(inviteId, receiverId);
    
    return updated;
  }
}

module.exports = ChallengeService;
