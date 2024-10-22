'use client'
import React from 'react';
import { useDispatch } from 'react-redux';
import { Button } from '@/components/ui/button';
import { setSelectedSubtitle } from '@/lib/features/subtitles/subtitleSlice';
import { ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons';

interface SubtitleNavigatorProps {
    selectedSub: Subtitle | null;
    groupedSubtitles: { [key: string]: Subtitle[] };
}

export const SubtitleNavigator: React.FC<SubtitleNavigatorProps> = ({ selectedSub, groupedSubtitles }) => {
    const dispatch = useDispatch();

    const handleEpisodeChange = (direction: 'up' | 'down') => {
        if (!selectedSub) return;

        const episodes = groupedSubtitles[selectedSub.subtitleTitle || ''] || [];
        const currentIndex = episodes.findIndex((ep) => ep.SubtitleId === selectedSub.SubtitleId);

        if (direction === 'up' && currentIndex > 0) {
            const prevEpisode = episodes[currentIndex - 1];
            dispatch(setSelectedSubtitle(prevEpisode.SubtitleId!));
        } else if (direction === 'down' && currentIndex < episodes.length - 1) {
            const nextEpisode = episodes[currentIndex + 1];
            dispatch(setSelectedSubtitle(nextEpisode.SubtitleId!));
        }
    };

    const hasPreviousEpisode = selectedSub?.subtitleTitle && groupedSubtitles[selectedSub.subtitleTitle]?.findIndex((ep) => ep.SubtitleId === selectedSub.SubtitleId) > 0;
    const hasNextEpisode = selectedSub?.subtitleTitle && groupedSubtitles[selectedSub.subtitleTitle]?.findIndex((ep) => ep.SubtitleId === selectedSub.SubtitleId) < (groupedSubtitles[selectedSub.subtitleTitle]?.length || 0) - 1;

    return (
        <div className='flex space-x-2 mt-3'>
            <Button disabled={!hasPreviousEpisode} onClick={() => handleEpisodeChange('up')}>
                <ChevronLeftIcon className='w-4 h-4' />Previous Episode
            </Button>
            <Button disabled={!hasNextEpisode} onClick={() => handleEpisodeChange('down')}>
                Next Episode<ChevronRightIcon className='w-4 h-4' />
            </Button>
        </div>
    );
};
