'use client';

import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectSubtitleStats } from '@/lib/features/subtitles/subtitleSlice';
import { updateAchievementProgress } from '@/lib/features/achievements/achievementsSlice';

export const useAchievements = () => {
  const dispatch = useDispatch();
  const stats = useSelector(selectSubtitleStats);

  useEffect(() => {
    // Vocabulary Achievements
    dispatch(updateAchievementProgress({
      id: 'vocab-master-bronze',
      progress: stats.totalWords
    }));
    dispatch(updateAchievementProgress({
      id: 'vocab-master-silver',
      progress: stats.totalWords
    }));
    dispatch(updateAchievementProgress({
      id: 'vocab-master-gold',
      progress: stats.totalWords
    }));

    // Video Achievements
    dispatch(updateAchievementProgress({
      id: 'video-explorer-bronze',
      progress: stats.totalSubtitles
    }));
    dispatch(updateAchievementProgress({
      id: 'video-explorer-silver',
      progress: stats.totalSubtitles
    }));
    dispatch(updateAchievementProgress({
      id: 'video-explorer-gold',
      progress: stats.totalSubtitles
    }));

    // Study Time Achievements
    const hoursWatched = stats.totalTime / 3600;
    dispatch(updateAchievementProgress({
      id: 'time-master-bronze',
      progress: Math.floor(hoursWatched)
    }));
    dispatch(updateAchievementProgress({
      id: 'time-master-silver',
      progress: Math.floor(hoursWatched)
    }));
    dispatch(updateAchievementProgress({
      id: 'time-master-gold',
      progress: Math.floor(hoursWatched)
    }));

    // Streak Achievements
    const activeWeekDays = stats?.activityData.filter(day => day.words > 0).length;
    dispatch(updateAchievementProgress({
      id: 'early-bird',
      progress: activeWeekDays
    }));
    
    // Calculate consecutive days streak
    let currentStreak = 0;
    for (const day of stats.activityData) {
      if (day.words > 0) {
        currentStreak++;
      } else {
        break;
      }
    }
    
    dispatch(updateAchievementProgress({
      id: 'daily-streak-bronze',
      progress: currentStreak
    }));
    dispatch(updateAchievementProgress({
      id: 'daily-streak-silver',
      progress: currentStreak
    }));
    dispatch(updateAchievementProgress({
      id: 'daily-streak-gold',
      progress: currentStreak
    }));
  }, [stats, dispatch]);
};