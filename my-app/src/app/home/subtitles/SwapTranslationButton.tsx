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
import { updateSubtitle } from '@/lib/features/subtitles/subtitleSlice';

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
            dispatch(updateSubtitle(response.data));
            return response.data;
        },
        enabled: false,
        retry: false,
    });

    useEffect(() => {
        if (selectedSubtitle) {
            const hasTranslations = selectedSubtitle.subtitleData.some((sub: any) => sub.translation && sub.text);
            if (hasTranslations) {
                const updatedData = selectedSubtitle.subtitleData.map((sub: any) => ({
                    id: sub.id,
                    text: sub.translation,
                    translation: sub.text,
                    end: sub.end,
                    start: sub.start
                }));
                console.log("subtitleData:", selectedSubtitle.subtitleData)
                setUpdatedSubtitle({
                    SubtitleId: selectedSubtitle.SubtitleId,
                    userId: selectedSubtitle.userId,
                    subtitleTitle: selectedSubtitle.subtitleTitle,
                    youtubeUrl: selectedSubtitle.youtubeUrl,
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
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="default" disabled={isLoading}>
                    {isLoading ? 'Swapping...' : 'Swap Translation'}
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Swap Translation</DialogTitle>
                </DialogHeader>
                <DialogDescription>Are you sure you want to swap the translations with the original text?</DialogDescription>
                <DialogFooter>
                    <Button
                        variant="default"
                        className='mt-2 select-none'
                        onClick={() => {
                            refetch();
                        }}
                        disabled={!hasTranslations}
                    >
                        Confirm Swap
                    </Button>
                    <Button
                        variant="outline"
                        className='mt-2 select-none'
                        onClick={() => {
                            // Reset state or perform additional actions if needed
                        }}
                    >
                        Cancel
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default SwapTranslationButton;
