const FriendService = require('../services/friend.service');

class FriendController {
  static async sendInvite(req, res) {
    try {
      const senderUserId = req.userId; 
      const { targetUser } = req.params;

      const invite = await FriendService.sendInvite(senderUserId, targetUser);

      return res.status(201).json({
        success: true,
        message: 'Convite enviado com sucesso',
        data: invite
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  static async respondToInvite(req, res) {
    try {
      const userId = req.userId; // Fornecido pelo middleware auth
      const { requestId } = req.params;
      const { accept } = req.body; // boolean

      if (typeof accept !== 'boolean') {
        return res.status(400).json({
          success: false,
          message: 'O campo "accept" deve ser um booleano'
        });
      }

      const result = await FriendService.respondToInvite(requestId, userId, accept);

      return res.status(200).json({
        success: result,
        message: accept ? 'Convite aceito com sucesso' : 'Convite recusado'
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = FriendController;
