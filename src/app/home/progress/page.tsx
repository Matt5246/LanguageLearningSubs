'use client'
import { Spinner } from '@/components/ui/spinner';
import { selectSubtitleStats } from '@/lib/features/subtitles/subtitleSlice';
import { BookOpen } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { CardsMetric } from './ExerciseChart';
import HistoryList from './HistoryList';
import ProgressHeader from './ProgressHeader';
import RecentVideos, { Video } from './RecentVideos';
import Chart from './WordsChart';

export default function Home() {
    const subtitles: Subtitle[] = useSelector(
        (state: { subtitle: { subtitles: Subtitle[] } }) => state.subtitle.subtitles
    );
    const allHardWords = subtitles.flatMap(subtitle => subtitle.hardWords || []);
    const stats = useSelector(selectSubtitleStats);
    const [isLoaded, setIsLoaded] = useState(false);
    const videos: Video[] = useMemo(() => {
        if (subtitles.length === 0 || (subtitles as any).error) return [];
        return subtitles?.map(subtitle => ({
            subtitleTitle: subtitle.subtitleTitle || '',
            youtubeUrl: subtitle.youtubeUrl || '',
            hardWords: subtitle.hardWords || [],
            createdAt: subtitle.createdAt || '',
        }));
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
        <div className='m-5 space-y-5'>
            <Chart />
            <ProgressHeader
                totalSubtitles={{ totalSubtitles: stats?.totalSubtitles, totalSubtitlesTrend: stats?.totalSubtitlesTrend }}
                totalWords={{ totalWords: stats?.totalWords, totalWordsTrend: stats?.totalWordsTrend }}
                totalTime={stats?.totalTime}
                lastActivity={stats?.lastActivity}
            />
            <HistoryList />
            <CardsMetric />
            <RecentVideos videos={videos} />
        </div>
    );
}