const FriendInvite = require('../models/friendInvite.model');
const Notification = require('../models/notification.model');
const User = require('../models/user.model');

class FriendService {
  static async sendInvite(senderUserId, targetUserId) {
    // Validar se não está enviando para si mesmo
    if (senderUserId === parseInt(targetUserId)) {
      throw new Error('Você não pode enviar convite para si mesmo');
    }

    // Verificar se o usuário alvo existe
    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
      throw new Error('Usuário não encontrado');
    }

    // Verificar se já são amigos
    const alreadyFriends = await FriendInvite.areFriends(senderUserId, targetUserId);
    if (alreadyFriends) {
      throw new Error('Vocês já são amigos');
    }

    // Verificar se já existe um convite pendente
    const existingInvite = await FriendInvite.findPendingByUsers(senderUserId, targetUserId);
    if (existingInvite) {
      throw new Error('Já existe um convite pendente entre vocês');
    }

    // Criar convite
    const invite = await FriendInvite.create(senderUserId, targetUserId);

    // Criar notificação para o destinatário
    await Notification.create({
      recipientUserId: targetUserId,
      actorUserId: senderUserId,
      type: 'FRIEND_INVITE',
      friendInviteId: invite.id,
      data: { inviteId: invite.id }
    });

    return invite;
  }

  static async respondToInvite(requestId, userId, accept) {
    // Buscar o convite
    const invite = await FriendInvite.findById(requestId);
    
    if (!invite) {
      throw new Error('Convite não encontrado');
    }

    // Verificar se o usuário é o destinatário do convite
    if (invite.receiver_user_id !== userId) {
      throw new Error('Você não tem permissão para responder a este convite');
    }

    // Verificar se o convite ainda está pendente
    if (invite.status !== 'PENDING') {
      throw new Error('Este convite já foi respondido');
    }

    const newStatus = accept ? 'ACCEPTED' : 'REJECTED';
    
    // Atualizar status do convite
    await FriendInvite.updateStatus(requestId, newStatus);

    // Se aceito, criar amizade
    if (accept) {
      await FriendInvite.createFriendship(invite.sender_user_id, invite.receiver_user_id);
    }

    // Criar notificação para o remetente
    await Notification.create({
      recipientUserId: invite.sender_user_id,
      actorUserId: userId,
      type: accept ? 'FRIEND_ACCEPTED' : 'FRIEND_REJECT',
      friendInviteId: invite.id,
      data: { 
        inviteId: invite.id,
        accepted: accept
      }
    });

    await Notification.markAsReadByFriendInvite(requestId, userId);

    return true;
  }

  async updateInviteStatus(requestId, receiverId, status) {
    // Busca o convite
    const invite = await FriendInvite.findById(requestId);
    
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
    const updated = await FriendInvite.updateStatus(requestId, status);
    
    // Se aceito, cria a amizade
    if (status === 'ACCEPTED') {
      await Friendship.create(invite.sender_user_id, invite.receiver_user_id);
      
      // Cria notificação para o remetente
      await Notification.create({
        recipientUserId: invite.sender_user_id,
        actorUserId: receiverId,
        type: 'FRIEND_ACCEPTED',
        friendInviteId: requestId
      });
    }
    
    // Marca a notificação relacionada como lida
    await Notification.markAsReadByFriendInvite(requestId, receiverId);
    
    return updated;
  }
}

module.exports = FriendService;
