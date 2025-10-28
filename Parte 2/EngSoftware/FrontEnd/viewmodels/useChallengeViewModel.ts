// src/viewmodels/useChallengeDetailViewModel.ts
import { useState, useEffect } from "react";
import { Challenge } from "../models/Challenge";
import RankingModel from "../models/Ranking";
import { challengeService } from "../services/ChallengeService";

export function useChallengeDetailViewModel(id?: string, token?: string | null) {
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [ranking, setRanking] = useState<RankingModel | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  async function loadChallenge() {
    if (!id || !token) return;
    try {
      setLoading(true);
      setError(null);
      const [challengeData, rankingData] = await Promise.all([
        challengeService.getChallengeById(id, token),
        challengeService.getRanking(id, token),
      ]);
      setChallenge(challengeData);
      setRanking(rankingData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }
  async function checkIn(){
      if (!id || !token) return;
      try {
        console.log(id, token);
        const data = await challengeService.setCheckIn(token, id);
      } finally {
      }
    }
  useEffect(() => {
    loadChallenge();
  }, [id, token]);

  return {
    challenge,
    ranking,
    loading,
    error,
    checkIn,
    reload: loadChallenge,
  };
}
