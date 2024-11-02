'use client'
import Chart from './Chart'
import HistoryList from './HistoryList'
import RecentVideos from './RecentVideos'
import { SubtitlesState } from '@/lib/features/subtitles/subtitleSlice';
import { useSelector } from 'react-redux';
import { useMemo } from 'react';
import WordCloud from './WordCloud';
import ProgressHeader from './ProgressHeader';
import { Video } from './RecentVideos';



export default function Home() {
    const subtitles: Subtitle[] = useSelector(
        (state: { subtitle: SubtitlesState }) => state.subtitle.subtitles
    );
    const videos: Video[] = subtitles.map(subtitle => ({
        subtitleTitle: subtitle.subtitleTitle || '',
        youtubeUrl: subtitle.youtubeUrl || '',
        hardWords: subtitle.hardWords || [],
        createdAt: subtitle.createdAt || '',
    }));
    const stats = useMemo(() => {
        const totalWords = subtitles.reduce(
            (acc, sub) => acc + (sub.hardWords?.length || 0),
            0
        );

        const totalTime = subtitles.reduce((acc, sub) => {
            const lastRowTime = sub.subtitleData?.length ? sub.subtitleData[sub.subtitleData.length - 1].end : 0;
            return acc + lastRowTime;
        }, 0);

        const lastActivity = subtitles.reduce(
            (latest, sub) => {
                const subDate = new Date(sub.createdAt || 0);
                return new Date(latest) > subDate ? latest : subDate.toISOString();
            },
            new Date(0).toISOString()
        );

        const activityByDate = subtitles.reduce((acc, sub) => {
            const date = sub.createdAt ? new Date(sub.createdAt).toLocaleDateString('en-US', { weekday: 'short' }) : 'Invalid Date';
            acc[date] = (acc[date] || 0) + (sub.hardWords?.length || 0);
            return acc;
        }, {} as Record<string, number>);

        const activityData = Array.from({ length: 7 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toLocaleDateString('en-US', { weekday: 'short' });
            return {
                date: dateStr,
                words: activityByDate[dateStr] || 0,
            };
        }).reverse();

        return {
            totalSubtitles: subtitles.length,
            totalWords,
            totalTime,
            lastActivity,
            activityData,
        };
    }, [subtitles]);

    return (
        <>
            <Chart />
            <ProgressHeader
                totalSubtitles={stats.totalSubtitles}
                totalWords={stats.totalWords}
                totalTime={stats.totalTime}
                lastActivity={stats.lastActivity}
            />
            <HistoryList />
            <RecentVideos videos={videos} />
        </>
    );
}