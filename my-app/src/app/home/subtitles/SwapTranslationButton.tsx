'use client'
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { swapTranslation } from '@/lib/features/subtitles/subtitleSlice';

interface SwapTranslationButtonProps {
    selectedSubtitle: any;
}

function SwapTranslationButton({ selectedSubtitle }: SwapTranslationButtonProps) {
    const dispatch = useDispatch();
    const [updatedSubtitle, setUpdatedSubtitle] = useState({
        SubtitleId: selectedSubtitle?.SubtitleId,
        userId: selectedSubtitle?.userId,
        subtitleTitle: selectedSubtitle?.subtitleTitle,
        youtubeUrl: selectedSubtitle?.youtubeUrl,
        sourceLang: selectedSubtitle?.sourceLang,
        targetLang: selectedSubtitle?.targetLang,
        subtitleData: []
    });

    const { isLoading, isError, error, data, refetch } = useQuery({
        queryKey: ['swapTranslation', updatedSubtitle],
        queryFn: async () => {
            const response = await axios.post('/api/subtitles/update', updatedSubtitle, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response && response.status === 200) {

                dispatch(swapTranslation(selectedSubtitle?.SubtitleId));
            }
            return response.data;
        },
        enabled: false,
        retry: false,
    });

    useEffect(() => {
        if (selectedSubtitle?.subtitleData) {
            const hasTranslations = selectedSubtitle.subtitleData.some((sub: any) => sub.translation && sub.text);
            if (hasTranslations) {
                const updatedData = selectedSubtitle.subtitleData.map((sub: any) => ({
                    id: sub.id,
                    text: sub.translation,
                    translation: sub.text,
                    end: sub.end,
                    start: sub.start
                }));

                setUpdatedSubtitle({
                    SubtitleId: selectedSubtitle.SubtitleId,
                    userId: selectedSubtitle.userId,
                    subtitleTitle: selectedSubtitle.subtitleTitle,
                    youtubeUrl: selectedSubtitle.youtubeUrl,
                    sourceLang: selectedSubtitle.targetLang,
                    targetLang: selectedSubtitle.sourceLang,
                    subtitleData: updatedData,
                });
            } else {
                setUpdatedSubtitle({
                    ...updatedSubtitle,
                    subtitleData: []
                });
            }
        }
    }, [selectedSubtitle]);
    const hasTranslations = selectedSubtitle?.subtitleData?.some((sub: any) => sub.translation && sub.text);
    return (
        <Button variant="secondary" disabled={isLoading && !hasTranslations} onClick={() => {
            refetch();
        }}>
            {isLoading ? 'Swapping...' : 'Swap Translation'}
        </Button>
    );
}

export default SwapTranslationButton;
