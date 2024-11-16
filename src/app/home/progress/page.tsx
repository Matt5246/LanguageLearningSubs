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
import { selectSubtitleStats } from '@/lib/features/subtitles/subtitleSlice';


export default function Home() {
    const subtitles: Subtitle[] = useSelector(
        (state: { subtitle: SubtitlesState }) => state.subtitle.subtitles
    );
    const stats = useSelector(selectSubtitleStats);

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