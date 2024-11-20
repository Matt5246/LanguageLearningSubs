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
    const wordCount = stats.totalWords;
    
    dispatch(updateAchievementProgress({
      id: 'vocab-beginner',
      progress: wordCount
    }));
    dispatch(updateAchievementProgress({
      id: 'vocab-starter',
      progress: wordCount
    }));
    dispatch(updateAchievementProgress({
      id: 'vocab-master-bronze',
      progress: wordCount
    }));
    dispatch(updateAchievementProgress({
      id: 'vocab-master-silver',
      progress: wordCount
    }));
    dispatch(updateAchievementProgress({
      id: 'vocab-master-gold',
      progress: wordCount
    }));

    // Video Achievements
    const videoCount = stats.totalSubtitles;
    
    dispatch(updateAchievementProgress({
      id: 'video-starter',
      progress: videoCount
    }));
    dispatch(updateAchievementProgress({
      id: 'video-explorer-bronze',
      progress: videoCount
    }));
    dispatch(updateAchievementProgress({
      id: 'video-explorer-silver',
      progress: videoCount
    }));
    dispatch(updateAchievementProgress({
      id: 'video-explorer-gold',
      progress: videoCount
    }));

    // Study Time Achievements
    const hoursWatched = stats.totalTime / 3600;
    
    dispatch(updateAchievementProgress({
      id: 'time-starter',
      progress: Math.floor(hoursWatched)
    }));
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
    const activeWeekDays = stats.activityData.filter(day => day.words > 0).length;
    if (activeWeekDays > 0) {
      dispatch(updateAchievementProgress({
        id: 'daily-starter',
        progress: 1
      }));
    }
    
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