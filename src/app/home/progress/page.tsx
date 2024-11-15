'use client'
import Chart from './Chart'
import HistoryList from './HistoryList'
import RecentVideos from './RecentVideos'
import { SubtitlesState } from '@/lib/features/subtitles/subtitleSlice';
import { useSelector } from 'react-redux';
import { useMemo, useState, useEffect } from 'react';
import { BookOpen } from 'lucide-react';
import ProgressHeader from './ProgressHeader';
import { Video } from './RecentVideos';
import { Spinner } from '@/components/ui/spinner'


export default function Home() {
    const subtitles: Subtitle[] = useSelector(
        (state: { subtitle: SubtitlesState }) => state.subtitle.subtitles
    );

    const [isLoaded, setIsLoaded] = useState(false);
    const videos: Video[] = useMemo(() => {
        if (subtitles.length === 0 || (subtitles as any).error) return [];
        console.log(subtitles);
        return subtitles?.map(subtitle => ({
            subtitleTitle: subtitle.subtitleTitle || '',
            youtubeUrl: subtitle.youtubeUrl || '',
            hardWords: subtitle.hardWords || [],
            createdAt: subtitle.createdAt || '',
        }));
    }, [subtitles]);
    const stats = useMemo(() => {
        if ((subtitles as any).error) return [];
        const totalWords = subtitles?.reduce(
            (acc, sub) => acc + (sub.hardWords?.length || 0),
            0
        );

        const totalWordsTrend = subtitles?.filter(subtitle => {
            const subtitleDate = new Date(subtitle?.updatedAt || 0);
            const oneMonthAgo = new Date();
            oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
            return subtitleDate >= oneMonthAgo;
        }
        ).reduce(
            (acc, sub) => acc + (sub.hardWords?.length || 0),
            0
        );
        const totalSubtitlesTrend = subtitles.filter(subtitle => {
            const subtitleDate = new Date(subtitle?.updatedAt || 0);
            const oneMonthAgo = new Date();
            oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
            return subtitleDate >= oneMonthAgo;
        }).length;


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
            totalSubtitlesTrend,
            totalWords,
            totalWordsTrend,
            totalTime,
            lastActivity,
            activityData,
        };
    }, [subtitles]);

    useEffect(() => {

        setIsLoaded(true);
    }, [subtitles]);
    if (!isLoaded || !subtitles.length) {
        return (
            <h1 className="text-2xl font-bold mt-9 ml-9">Progress Page
                <Spinner />
            </h1>
        );
    } else if (!subtitles || subtitles.length === 0 || !videos) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <BookOpen className="h-16 w-16 text-muted-foreground" />
                <h2 className="text-2xl font-semibold">No Data Yet.</h2>
                <p className="text-muted-foreground text-center max-w-md">
                    Add your hard words and subtitles to the database first to see your progress.
                </p>
            </div>
        );
    }

    return (
        <>
            <Chart />
            <ProgressHeader
                totalSubtitles={{ totalSubtitles: stats?.totalSubtitles, totalSubtitlesTrend: stats?.totalSubtitlesTrend }}
                totalWords={{ totalWords: stats?.totalWords, totalWordsTrend: stats?.totalWordsTrend }}
                totalTime={stats?.totalTime}
                lastActivity={stats?.lastActivity}
            />
            <HistoryList />
            <RecentVideos videos={videos} />
        </>
    );
}