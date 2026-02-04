
import { useState, useEffect } from 'react';
import { UserProgress, Badge, ToastNotification, Challenge, LeaderboardEntry } from '../types';

const LEVEL_THRESHOLDS = [0, 100, 300, 600, 1000, 1500, 2500, 4000, 6000, 10000];

// Definición extendida de Badges (15 Logros)
export const BADGES_DEF: Badge[] = [
  // Exploración
  { id: 'b1', title: 'Explorador Novato', description: 'Visitaste tus primeras 3 obras.', iconName: 'MapPin', level: 'bronze', isUnlocked: false, xpReward: 50, category: 'exploration' },
  { id: 'b5', title: 'Lector Voraz', description: 'Leíste la ficha completa de 5 obras.', iconName: 'BookOpen', level: 'silver', isUnlocked: false, xpReward: 100, category: 'exploration' },
  { id: 'b6', title: 'Gran Explorador', description: 'Has visitado 20 obras diferentes.', iconName: 'Compass', level: 'gold', isUnlocked: false, xpReward: 300, category: 'exploration' },
  { id: 'b10', title: 'Viajero del Tiempo', description: 'Visitaste la Línea de Tiempo.', iconName: 'Hourglass', level: 'bronze', isUnlocked: false, xpReward: 50, category: 'exploration' },
  { id: 'b11', title: 'Cartógrafo', description: 'Consultaste el Mapa del Museo.', iconName: 'Map', level: 'bronze', isUnlocked: false, xpReward: 50, category: 'exploration' },

  // Colección
  { id: 'b2', title: 'Erudito Románico', description: 'Guardaste 2 obras del Románico.', iconName: 'Shield', level: 'silver', isUnlocked: false, xpReward: 150, category: 'collection' },
  { id: 'b4', title: 'Coleccionista', description: 'Guardaste 5 obras en total.', iconName: 'Bookmark', level: 'gold', isUnlocked: false, xpReward: 200, category: 'collection' },
  { id: 'b9', title: 'Fan del Modernismo', description: 'Guardaste 3 obras modernistas.', iconName: 'Feather', level: 'silver', isUnlocked: false, xpReward: 150, category: 'collection' },
  
  // Maestría (Quiz & AI)
  { id: 'b3', title: 'Curioso Digital', description: 'Usaste el asistente Palau IA.', iconName: 'Sparkles', level: 'bronze', isUnlocked: false, xpReward: 100, category: 'mastery' },
  { id: 'b15', title: 'Experto en Arte', description: 'Completaste 5 preguntas del Quiz.', iconName: 'BrainCircuit', level: 'gold', isUnlocked: false, xpReward: 250, category: 'mastery' },
  { id: 'b8', title: 'Nocturno', description: 'Usaste la app después de las 22:00.', iconName: 'Moon', level: 'platinum', isUnlocked: false, xpReward: 500, category: 'mastery' },

  // Social & Rachas
  { id: 'b12', title: 'Influencer de Arte', description: 'Compartiste tu perfil o un logro.', iconName: 'Share2', level: 'silver', isUnlocked: false, xpReward: 150, category: 'social' },
  { id: 'b13', title: 'Racha de Fuego', description: '3 días seguidos visitando el museo.', iconName: 'Flame', level: 'silver', isUnlocked: false, xpReward: 200, category: 'social' },
  { id: 'b14', title: 'Imparable', description: '7 días seguidos de racha.', iconName: 'Zap', level: 'gold', isUnlocked: false, xpReward: 500, category: 'social' },
  { id: 'b7', title: 'VIP del MNAC', description: 'Alcanzaste el Nivel 5.', iconName: 'Crown', level: 'platinum', isUnlocked: false, xpReward: 1000, category: 'social' },
];

// Desafíos Semanales Mock
const WEEKLY_CHALLENGES: Challenge[] = [
  { id: 'c1', title: 'Semana del Románico', description: 'Visita 3 obras del periodo Románico.', target: 3, current: 0, rewardXP: 300, completed: false, iconName: 'Shield' },
  { id: 'c2', title: 'Pregúntale a Palau', description: 'Haz 2 consultas al asistente IA.', target: 2, current: 0, rewardXP: 150, completed: false, iconName: 'MessageSquare' },
  { id: 'c3', title: 'Caza del Tesoro', description: 'Encuentra la obra "Joven Decadente".', target: 1, current: 0, rewardXP: 500, completed: false, iconName: 'Search' }
];

// Leaderboard Mock
const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { id: 'u1', name: 'Ana García', avatarId: 'User', xp: 2450, level: 6, rank: 1 },
  { id: 'u2', name: 'Marc P.', avatarId: 'Smile', xp: 2100, level: 5, rank: 2 },
  { id: 'u3', name: 'Laia Art', avatarId: 'Heart', xp: 1850, level: 4, rank: 3 },
  { id: 'u4', name: 'Jordi_99', avatarId: 'Star', xp: 1200, level: 3, rank: 4 },
];

export const useGamification = (role: string | null) => {
  const [progress, setProgress] = useState<UserProgress>({
    xp: 0,
    level: 1,
    streak: 1,
    lastVisit: new Date().toISOString(),
    avatarId: 'User',
    unlockedBadges: [],
    readArtworks: [],
    savedCount: 0,
    quizScoreTotal: 0,
    challenges: WEEKLY_CHALLENGES
  });

  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  // Load from Storage
  useEffect(() => {
    if (!role) return;
    const stored = localStorage.getItem(`mnac_progress_${role}`);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Merge with default structure to ensure new fields exists
      setProgress({ ...progress, ...parsed, challenges: parsed.challenges || WEEKLY_CHALLENGES });
      
      // Check Streak Logic
      checkStreak(parsed);
    } else {
      // First visit ever
      localStorage.setItem(`mnac_progress_${role}`, JSON.stringify(progress));
    }
  }, [role]);

  // Save to Storage on Change
  useEffect(() => {
    if (!role) return;
    localStorage.setItem(`mnac_progress_${role}`, JSON.stringify(progress));
  }, [progress, role]);

  // --- HELPERS ---

  const checkStreak = (storedProgress: UserProgress) => {
    const lastVisitDate = new Date(storedProgress.lastVisit).setHours(0,0,0,0);
    const today = new Date().setHours(0,0,0,0);
    const diffTime = Math.abs(today - lastVisitDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      // Ayer fue la última visita -> Increment streak
      const newStreak = storedProgress.streak + 1;
      updateStreak(newStreak);
      if (newStreak === 3) unlockBadge('b13');
      if (newStreak === 7) unlockBadge('b14');
    } else if (diffDays > 1) {
      // Se rompió la racha -> Reset to 1 (today is day 1)
      updateStreak(1);
    } else {
      // Same day visit -> no streak change, just update time
      updateStreak(storedProgress.streak);
    }
  };

  const updateStreak = (streak: number) => {
    setProgress(prev => ({
      ...prev,
      streak: streak,
      lastVisit: new Date().toISOString()
    }));
  };

  const addToast = (type: ToastNotification['type'], message: string, subMessage?: string) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, type, message, subMessage }]);
    setTimeout(() => removeToast(id), 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const addXP = (amount: number) => {
    setProgress(prev => {
      const newXP = prev.xp + amount;
      let newLevel = prev.level;
      
      // Check Level Up
      const nextThreshold = LEVEL_THRESHOLDS[prev.level];
      if (nextThreshold && newXP >= nextThreshold) {
        newLevel += 1;
        addToast('achievement', `¡Has subido al Nivel ${newLevel}!`, 'Nueva insignia de perfil desbloqueada.');
        if (newLevel === 5) setTimeout(() => unlockBadge('b7'), 1000);
      }

      return { ...prev, xp: newXP, level: newLevel };
    });
  };

  const unlockBadge = (badgeId: string) => {
    // Necesitamos usar functional update para acceder al estado más reciente
    setProgress(currentProgress => {
      if (currentProgress.unlockedBadges.includes(badgeId)) return currentProgress;

      const badge = BADGES_DEF.find(b => b.id === badgeId);
      if (badge) {
        addToast('achievement', `Logro Desbloqueado: ${badge.title}`, `+${badge.xpReward} XP`);
        
        // Calculamos XP y Nivel nuevos dentro de la misma actualización
        const newXP = currentProgress.xp + badge.xpReward;
        let newLevel = currentProgress.level;
        const nextThreshold = LEVEL_THRESHOLDS[currentProgress.level];
        if (nextThreshold && newXP >= nextThreshold) {
           newLevel += 1;
           setTimeout(() => addToast('achievement', `¡Nivel ${newLevel} Alcanzado!`, '¡Sigue así!'), 500);
        }

        return {
          ...currentProgress,
          xp: newXP,
          level: newLevel,
          unlockedBadges: [...currentProgress.unlockedBadges, badgeId]
        };
      }
      return currentProgress;
    });
  };

  const updateChallenge = (challengeId: string, increment = 1) => {
    setProgress(prev => {
      const newChallenges = prev.challenges.map(ch => {
        if (ch.id === challengeId && !ch.completed) {
          const newCurrent = Math.min(ch.current + increment, ch.target);
          const isJustCompleted = newCurrent >= ch.target && !ch.completed;
          
          if (isJustCompleted) {
            addToast('success', `Desafío Completado: ${ch.title}`, `+${ch.rewardXP} XP`);
            // Add XP asynchronously to avoid state conflict loop
            setTimeout(() => addXP(ch.rewardXP), 100);
          }
          
          return { ...ch, current: newCurrent, completed: newCurrent >= ch.target };
        }
        return ch;
      });
      return { ...prev, challenges: newChallenges };
    });
  };

  const setAvatar = (iconName: string) => {
    setProgress(prev => ({ ...prev, avatarId: iconName }));
    addToast('info', 'Avatar actualizado', 'Tu perfil se ve genial.');
  };

  // --- ACTION TRIGGERS ---

  const trackArtworkVisit = (artId: string) => {
    if (!progress.readArtworks.includes(artId)) {
      const newRead = [...progress.readArtworks, artId];
      setProgress(prev => ({ ...prev, readArtworks: newRead }));
      addXP(10); 

      // Check Badges
      if (newRead.length === 3) unlockBadge('b1');
      if (newRead.length === 5) unlockBadge('b5');
      if (newRead.length === 20) unlockBadge('b6');

      // Check Time Badge
      const hour = new Date().getHours();
      if (hour >= 22 || hour < 5) unlockBadge('b8');
    }
  };

  const trackSaveArtwork = (count: number) => {
    setProgress(prev => ({ ...prev, savedCount: count }));
    if (count === 2) unlockBadge('b2'); // Simplified check for demo (should check if romanic)
    if (count === 5) unlockBadge('b4');
    if (count === 3) unlockBadge('b9'); // Simplified check for modernism
  };

  const trackAiUsage = () => {
    unlockBadge('b3');
    updateChallenge('c2', 1);
  };

  const trackShare = () => {
    unlockBadge('b12');
  };

  // Get current user leaderboard entry (dynamic)
  const userRankEntry: LeaderboardEntry = {
    id: 'me',
    name: 'Tú',
    avatarId: progress.avatarId,
    xp: progress.xp,
    level: progress.level,
    rank: 0, // Calculated in UI
    isCurrentUser: true
  };

  return {
    progress,
    badges: BADGES_DEF.map(b => ({ ...b, isUnlocked: progress.unlockedBadges.includes(b.id) })),
    leaderboard: [...MOCK_LEADERBOARD, userRankEntry].sort((a, b) => b.xp - a.xp).map((entry, idx) => ({...entry, rank: idx + 1})),
    challenges: progress.challenges,
    addXP,
    trackArtworkVisit,
    trackSaveArtwork,
    trackAiUsage,
    trackShare,
    setAvatar,
    toasts,
    removeToast,
    addToast
  };
};
