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
import SubtitlesList from '@/components/Subtitles/SubtitlesList';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { updateSubtitle } from '@/lib/features/subtitles/subtitleSlice';


function UpdateSubtitles(selectedSubtitle: any) {
    const dispatch = useDispatch();
    const [updatedSubtitle, setUpdatedSubtitle] = useState({
        email: selectedSubtitle?.selectedSubtitle?.email,
        userId: selectedSubtitle?.selectedSubtitle?.userId,
        youtubeUrl: selectedSubtitle?.selectedSubtitle?.youtubeUrl,
        subtitleTitle: selectedSubtitle?.selectedSubtitle?.subtitleTitle,
        subtitleData: selectedSubtitle?.selectedSubtitle?.subtitleData,
        hardWords: selectedSubtitle?.selectedSubtitle?.hardWords,
    });

    // Function to handle update subtitle
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
                email: selectedSubtitle?.selectedSubtitle?.email,
                userId: selectedSubtitle?.selectedSubtitle?.userId,
                youtubeUrl: selectedSubtitle?.selectedSubtitle?.youtubeUrl,
                subtitleTitle: selectedSubtitle?.selectedSubtitle?.subtitleTitle,
                subtitleData: selectedSubtitle?.selectedSubtitle?.subtitleData,
                hardWords: selectedSubtitle?.selectedSubtitle?.hardWords,
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
                <DialogDescription>youtubeUrl</DialogDescription>
                <input
                    type="text"
                    value={updatedSubtitle?.youtubeUrl}
                    onChange={(e) => setUpdatedSubtitle({ ...updatedSubtitle, youtubeUrl: e.target.value })}
                />
                <DialogDescription>{selectedSubtitle?.selectedSubtitle?.subtitleTitle}</DialogDescription>
                <DialogDescription>{selectedSubtitle?.selectedSubtitle?.youtubeUrl}</DialogDescription>
                <DialogDescription>{selectedSubtitle?.selectedSubtitle?.email}</DialogDescription>
                <DialogFooter>
                    <Button
                        variant="default"
                        onClick={() => {
                            setUpdatedSubtitle({
                                email: selectedSubtitle?.selectedSubtitle?.email,
                                userId: selectedSubtitle?.selectedSubtitle?.userId,
                                youtubeUrl: selectedSubtitle?.selectedSubtitle?.youtubeUrl,
                                subtitleTitle: selectedSubtitle?.selectedSubtitle?.subtitleTitle,
                                subtitleData: selectedSubtitle?.selectedSubtitle?.subtitleData,
                                hardWords: selectedSubtitle?.selectedSubtitle?.hardWords,
                            });
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => {
                            refetch(); // Trigger the query execution
                        }}
                    >
                        Update
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default UpdateSubtitles;
