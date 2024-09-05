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


function UpdateSubtitles(selectedSubtitle: any) {
    const dispatch = useDispatch();
    const [updatedSubtitle, setUpdatedSubtitle] = useState({
        SubtitleId: selectedSubtitle?.selectedSubtitle?.SubtitleId,
        userId: selectedSubtitle?.selectedSubtitle?.userId,
        youtubeUrl: selectedSubtitle?.selectedSubtitle?.youtubeUrl,
        subtitleTitle: selectedSubtitle?.selectedSubtitle?.subtitleTitle,
        episode: selectedSubtitle?.selectedSubtitle?.episode,
    });

    const { isLoading, isError, error, data, refetch } = useQuery({
        queryKey: ['updateSubtitle', updatedSubtitle],
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
            setUpdatedSubtitle({
                SubtitleId: selectedSubtitle?.selectedSubtitle?.SubtitleId,
                userId: selectedSubtitle?.selectedSubtitle?.userId,
                youtubeUrl: selectedSubtitle?.selectedSubtitle?.youtubeUrl,
                subtitleTitle: selectedSubtitle?.selectedSubtitle?.subtitleTitle,
                episode: selectedSubtitle?.selectedSubtitle?.episode,
            });
        }
    }, [selectedSubtitle]);

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="default" disabled={isLoading}>
                    {isLoading ? 'Updating...' : 'Edit'}
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Subtitle</DialogTitle>
                </DialogHeader>
                <DialogDescription>subtitleTitle</DialogDescription>
                <input
                    type="text"
                    value={updatedSubtitle?.subtitleTitle}
                    onChange={(e) => setUpdatedSubtitle({ ...updatedSubtitle, subtitleTitle: e.target.value })}
                />
                {selectedSubtitle?.selectedSubtitle?.youtubeUrl && <>
                    <DialogDescription>youtubeUrl</DialogDescription>
                    <input
                        type="text"
                        value={updatedSubtitle?.youtubeUrl}

                        onChange={(e) => setUpdatedSubtitle({ ...updatedSubtitle, youtubeUrl: e.target.value })}
                    />
                </>}
                {selectedSubtitle?.selectedSubtitle?.episode && <>
                    <DialogDescription>youtubeUrl</DialogDescription>
                    <input
                        type="number"
                        value={updatedSubtitle?.episode}

                        onChange={(e) => setUpdatedSubtitle({ ...updatedSubtitle, episode: e.target.value })}
                    />
                </>}

                <DialogFooter>
                    <Button
                        variant="default" className='mt-2'
                        onClick={() => {
                            refetch();
                        }}
                    >
                        Update
                    </Button>
                    <Button
                        variant="outline" className='mt-2'
                        onClick={() => {
                            setUpdatedSubtitle({
                                SubtitleId: selectedSubtitle?.selectedSubtitle?.SubtitleId,
                                userId: selectedSubtitle?.selectedSubtitle?.userId,
                                youtubeUrl: selectedSubtitle?.selectedSubtitle?.youtubeUrl,
                                subtitleTitle: selectedSubtitle?.selectedSubtitle?.subtitleTitle,
                                episode: selectedSubtitle?.selectedSubtitle?.episode,
                            });
                        }}
                    >
                        Cancel
                    </Button>

                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default UpdateSubtitles;
