const ChallengeService = require('../services/challenge.service');

class ChallengeController {
  static async create(req, res) {
    try {
      const { title, description, category, expirationDate } = req.body;
      const userId = req.userId;

      const challenge = await ChallengeService.createChallenge({
        userId,
        title,
        description,
        category,
        expirationDate
      });

      res.status(201).json({
        success: true,
        message: 'Desafio criado com sucesso',
        data: challenge
      });
    } catch (error) {
      console.error('Erro ao criar desafio:', error);
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  static async inviteUsers(req, res) {
    try {
      const { challengeId, userIds } = req.body;
      const senderId = req.userId;

      if (!Array.isArray(userIds) || userIds.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Lista de usuários inválida'
        });
      }

      const invites = await ChallengeService.inviteUsers({
        challengeId,
        senderId,
        userIds
      });

      res.status(200).json({
        success: true,
        message: 'Convites enviados com sucesso',
        data: { invitesSent: invites.length }
      });
    } catch (error) {
      console.error('Erro ao enviar convites:', error);
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  static async getAll(req, res) {
    try {
      const userId = req.userId;
      const challenges = await ChallengeService.getChallenges(userId);

      res.status(200).json({
        success: true,
        data: challenges
      });
    } catch (error) {
      console.error('Erro ao buscar desafios:', error);
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  static async getById(req, res) {
    try {
      const { id } = req.params;
      const userId = req.userId;

      const challenge = await ChallengeService.getChallengeById(id, userId);

      res.status(200).json({
        success: true,
        data: challenge
      });
    } catch (error) {
      console.error('Erro ao buscar desafio:', error);
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }

  static async checkin(req, res) {
    try {
      const { challengeId } = req.params;
      const userId = req.userId;

      const result = await ChallengeService.checkin({
        challengeId,
        userId
      });

      res.status(200).json({
        success: true,
        message: 'Check-in realizado com sucesso',
        data: result
      });
    } catch (error) {
      console.error('Erro ao realizar check-in:', error);
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  static async getRanking(req, res) {
    try {
      const { challengeId } = req.params;
      const userId = req.userId;

      const ranking = await ChallengeService.getRanking(challengeId, userId);

      res.status(200).json({
        success: true,
        data: ranking
      });
    } catch (error) {
      console.error('Erro ao buscar ranking:', error);
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = ChallengeController;
