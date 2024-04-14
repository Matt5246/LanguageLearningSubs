import React, { useState } from 'react';
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
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { EuropeLanguages } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios'
import { useDispatch } from 'react-redux';
import { updateSubtitle, setSelectedSubtitle } from '@/lib/features/subtitles/subtitleSlice';


function translateSubtitle(selectedSubtitle: any) {
    const [targetLanguage, setTargetLanguage] = useState('de'); // Default target language
    const [sourceLanguage, setSourceLanguage] = useState('auto'); // Default target language
    const dispatch = useDispatch()
    const { isFetching, refetch } = useQuery({
        queryKey: ['translate', selectedSubtitle?.selectedSubtitle?.SubtitleId],
        queryFn: async () => {
            const text = await selectedSubtitle?.selectedSubtitle?.subtitleData.map((data: any) => (data.text))

            const translationResponse = await axios.post('/api/subtitles/translate', {
                text: text,
                email: selectedSubtitle?.selectedSubtitle?.email,
                userId: selectedSubtitle?.selectedSubtitle?.userId,
                youtubeUrl: selectedSubtitle?.selectedSubtitle?.youtubeUrl,
                subtitleTitle: selectedSubtitle?.selectedSubtitle?.subtitleTitle,
                subtitleData: selectedSubtitle?.selectedSubtitle?.subtitleData,
                target: targetLanguage,
                source: sourceLanguage,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (translationResponse?.data?.combinedSubtitles) {
                console.log(translationResponse?.data?.combinedSubtitles)
                await dispatch(updateSubtitle({
                    SubtitleId: translationResponse?.data?.createdSubtitleData?.SubtitleId,
                    youtubeUrl: translationResponse?.data?.createdSubtitleData?.youtubeUrl,
                    subtitleTitle: translationResponse?.data?.createdSubtitleData?.subtitleTitle,
                    subtitleData: translationResponse?.data?.combinedSubtitles,
                    hardWords: translationResponse?.data?.createdSubtitleData?.SubtitleId,
                }));

            }

            return translationResponse.data;
        },

        enabled: false,
        retry: true,
    });



    return (
        <Dialog >
            <DialogTrigger asChild>
                <Button variant="outline" disabled={isFetching}>
                    {isFetching ? 'Updating...' : 'Translate'}
                </Button>
            </DialogTrigger>
            <DialogContent className="select-none">
                <DialogHeader>
                    <DialogTitle>Translate Subtitle</DialogTitle>
                </DialogHeader>
                <DialogDescription>Target language: </DialogDescription>
                <Select onValueChange={setTargetLanguage}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent >
                        <SelectGroup>
                            <SelectLabel>Europe</SelectLabel>
                            {EuropeLanguages.map((language) => (
                                <SelectItem key={language.value} value={language.value}>
                                    {language.label}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
                <DialogDescription>source language: </DialogDescription>
                <Select onValueChange={setSourceLanguage} defaultValue='auto'>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent >
                        <SelectGroup>

                            <SelectItem value="auto">auto</SelectItem>
                            <SelectLabel className='font-extrabold'>Europe</SelectLabel>
                            {EuropeLanguages.map((language) => (
                                <SelectItem key={language.value} value={language.value}>
                                    {language.label}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
                <DialogDescription>Subtitles row number: </DialogDescription>
                {selectedSubtitle?.selectedSubtitle?.subtitleData?.length}

                <DialogDescription>Subtitle title:</DialogDescription>
                {selectedSubtitle?.selectedSubtitle?.subtitleTitle}
                <DialogDescription>Subtitle URL:</DialogDescription>
                {selectedSubtitle?.selectedSubtitle?.youtubeUrl}
                <DialogFooter>

                    <Button variant="default" disabled={isFetching} className='mt-2'
                        onClick={() => {
                            refetch()
                        }}>
                        {isFetching ? 'Updating...' : 'Translate'}
                    </Button>

                    <Button variant="outline" className='mt-2'>
                        Cancel
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default translateSubtitle;
