// src/viewmodels/HabitViewModel.ts
import { useState, useEffect } from 'react';
import { challengeService } from '../services/ChallengeService';
import { Challenge } from '../models/Challenge';

export function useChallengeViewModel(token?: string | null) { 
    // retorna todos os desafios doo usuario
    const [challenges, setChallenges] = useState<Challenge[]>([]);
    const [loading2, setLoading] = useState(false);

    async function loadChallenges() {
        if(!token) return;
        setLoading(true);
        const data = await challengeService.getByToken(token);
        console.log("data1", data);
        setChallenges(data);
        setLoading(false);
    }

        // Only load challenges when a token is available to avoid calling the API with an invalid token
        useEffect(() => {
            if (token) loadChallenges();
        }, [token]);

    return { challenges, loading2, reload: loadChallenges };
    }
