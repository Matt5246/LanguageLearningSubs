import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createSelector } from '@reduxjs/toolkit';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  progress: number;
  maxProgress: number;
  unlockedAt: string | null;
  category: 'learning' | 'watching' | 'streak' | 'vocabulary' | 'milestone';
  icon: string;
  tier?: 'bronze' | 'silver' | 'gold';
}

interface AchievementsState {
  achievements: Achievement[];
}

const loadAchievements = (): Achievement[] => {
  if (typeof window === 'undefined') return [];
  const saved = localStorage.getItem('achievements');
  if (saved) {
    return JSON.parse(saved);
  }
  return [
    {
      id: 'vocab-beginner',
      title: 'First Words',
      description: 'Learn your first 10 words',
      progress: 0,
      maxProgress: 10,
      unlockedAt: null,
      category: 'vocabulary',
      icon: 'BookOpen',
      tier: 'bronze'
    },
    {
      id: 'vocab-starter',
      title: 'Vocabulary Builder',
      description: 'Learn 25 words',
      progress: 0,
      maxProgress: 25,
      unlockedAt: null,
      category: 'vocabulary',
      icon: 'BookOpen',
      tier: 'bronze'
    },
    {
      id: 'vocab-master-bronze',
      title: 'Vocabulary Novice',
      description: 'Learn 50 words',
      progress: 0,
      maxProgress: 50,
      unlockedAt: null,
      category: 'vocabulary',
      icon: 'BookOpen',
      tier: 'bronze'
    },
    {
      id: 'vocab-master-silver',
      title: 'Vocabulary Expert',
      description: 'Learn 100 words',
      progress: 0,
      maxProgress: 100,
      unlockedAt: null,
      category: 'vocabulary',
      icon: 'BookOpen',
      tier: 'silver'
    },
    {
      id: 'vocab-master-gold',
      title: 'Vocabulary Master',
      description: 'Learn 500 words',
      progress: 0,
      maxProgress: 500,
      unlockedAt: null,
      category: 'vocabulary',
      icon: 'BookOpen',
      tier: 'gold'
    },
    {
      id: 'video-starter',
      title: 'First Watch',
      description: 'Watch your first video',
      progress: 0,
      maxProgress: 1,
      unlockedAt: null,
      category: 'watching',
      icon: 'Video',
      tier: 'bronze'
    },
    {
      id: 'video-explorer-bronze',
      title: 'Video Explorer',
      description: 'Watch 5 videos',
      progress: 0,
      maxProgress: 5,
      unlockedAt: null,
      category: 'watching',
      icon: 'Video',
      tier: 'bronze'
    },
    {
      id: 'video-explorer-silver',
      title: 'Video Enthusiast',
      description: 'Watch 20 videos',
      progress: 0,
      maxProgress: 20,
      unlockedAt: null,
      category: 'watching',
      icon: 'Video',
      tier: 'silver'
    },
    {
      id: 'video-explorer-gold',
      title: 'Video Master',
      description: 'Watch 50 videos',
      progress: 0,
      maxProgress: 50,
      unlockedAt: null,
      category: 'watching',
      icon: 'Video',
      tier: 'gold'
    },
    {
      id: 'time-starter',
      title: 'First Hour',
      description: 'Study for 1 hour',
      progress: 0,
      maxProgress: 1,
      unlockedAt: null,
      category: 'learning',
      icon: 'Clock',
      tier: 'bronze'
    },
    {
      id: 'time-master-bronze',
      title: 'Time Tracker',
      description: 'Study for 5 hours',
      progress: 0,
      maxProgress: 5,
      unlockedAt: null,
      category: 'learning',
      icon: 'Clock',
      tier: 'bronze'
    },
    {
      id: 'time-master-silver',
      title: 'Time Devotee',
      description: 'Study for 20 hours',
      progress: 0,
      maxProgress: 20,
      unlockedAt: null,
      category: 'learning',
      icon: 'Clock',
      tier: 'silver'
    },
    {
      id: 'time-master-gold',
      title: 'Time Master',
      description: 'Study for 50 hours',
      progress: 0,
      maxProgress: 50,
      unlockedAt: null,
      category: 'learning',
      icon: 'Clock',
      tier: 'gold'
    },
    {
      id: 'daily-starter',
      title: 'First Day',
      description: 'Complete your first day of learning',
      progress: 0,
      maxProgress: 1,
      unlockedAt: null,
      category: 'streak',
      icon: 'Flame',
      tier: 'bronze'
    },
    {
      id: 'daily-streak-bronze',
      title: 'Streak Starter',
      description: 'Maintain a 3-day streak',
      progress: 0,
      maxProgress: 3,
      unlockedAt: null,
      category: 'streak',
      icon: 'Flame',
      tier: 'bronze'
    },
    {
      id: 'daily-streak-silver',
      title: 'Streak Runner',
      description: 'Maintain a 7-day streak',
      progress: 0,
      maxProgress: 7,
      unlockedAt: null,
      category: 'streak',
      icon: 'Flame',
      tier: 'silver'
    },
    {
      id: 'daily-streak-gold',
      title: 'Streak Master',
      description: 'Maintain a 30-day streak',
      progress: 0,
      maxProgress: 30,
      unlockedAt: null,
      category: 'streak',
      icon: 'Flame',
      tier: 'gold'
    }
  ];
};

const initialState: AchievementsState = {
  achievements: loadAchievements()
};

const achievementsSlice = createSlice({
  name: 'achievements',
  initialState,
  reducers: {
    updateAchievementProgress(state, action: PayloadAction<{ id: string; progress: number }>) {
      const achievement = state.achievements.find(a => a.id === action.payload.id);
      if (achievement) {
        achievement.progress = Math.min(action.payload.progress, achievement.maxProgress);
        if (achievement.progress === achievement.maxProgress && !achievement.unlockedAt) {
          achievement.unlockedAt = new Date().toISOString();
        }
        if (typeof window !== 'undefined') {
          localStorage.setItem('achievements', JSON.stringify(state.achievements));
        }
      }
    },
    resetAchievements(state) {
      state.achievements = loadAchievements();
      if (typeof window !== 'undefined') {
        localStorage.removeItem('achievements');
      }
    }
  }
});

export const { updateAchievementProgress, resetAchievements } = achievementsSlice.actions;

export const selectAchievements = (state: { achievements: AchievementsState }) => state.achievements.achievements;

export const selectAchievementStats = createSelector(
  selectAchievements,
  (achievements) => ({
    totalAchievements: achievements.length,
    unlockedAchievements: achievements.filter(a => a.unlockedAt).length,
    nextAchievement: achievements.find(a => !a.unlockedAt),
    recentAchievements: achievements
      .filter(a => a.unlockedAt)
      .sort((a, b) => new Date(b.unlockedAt!).getTime() - new Date(a.unlockedAt!).getTime())
      .slice(0, 5)
  })
);

export default achievementsSlice.reducer;