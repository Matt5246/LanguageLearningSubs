import React from 'react';
import { useDispatch } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import axios from 'axios';
import { deleteSubtitle } from '@/lib/features/subtitles/subtitleSlice';
import { useQuery } from '@tanstack/react-query';

function DeleteSubtitle({ SubtitleId }: any) {
    const dispatch = useDispatch();
    // const handleDelete = async () => {
    //     try {
    //         await axios.delete('/api/subtitles/delete', {
    //             data: { SubtitleId },
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //         });
    //         dispatch(deleteSubtitle(SubtitleId));
    //     } catch (error) {
    //         console.error('Error deleting subtitle:', error);
    //     }
    // };
    const { isLoading, isError, error, data, refetch } = useQuery({
        queryKey: ['SubtitleId', SubtitleId],
        queryFn: async () => {

            const response = await axios.delete('/api/subtitles/delete', {
                data: { SubtitleId },
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.status === 200) {
                dispatch(deleteSubtitle(SubtitleId));
            }
            console.log(response.data.message)
            return response.data.message;

        },
        enabled: false,
        retry: false,
    });
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="destructive" disabled={isLoading}>
                    {isLoading ? 'Loading...' : 'Delete'}
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Confirm Deletion</DialogTitle>
                </DialogHeader>
                <p>Are you sure you want to delete this subtitle?</p>
                <DialogFooter>
                    <Button variant="default" className='mt-2' onClick={() => {
                        refetch();
                    }}>
                        Confirm
                    </Button>
                    <Button variant="outline" className='mt-2'>Cancel</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default DeleteSubtitle;
