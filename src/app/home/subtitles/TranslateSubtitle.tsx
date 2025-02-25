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
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { EuropeLanguages, AsiaLanguages } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios'
import { useDispatch } from 'react-redux';
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { initializeSubtitles } from '@/lib/features/subtitles/subtitleSlice';
import { getSubs } from "@/components/NavBar";
import { useToast } from "@/components/ui/use-toast"
import { useSession } from 'next-auth/react';

function TranslateSubtitle(selectedSubtitle: any) {
    const dispatch = useDispatch();
    const { data: session, status } = useSession();
    const email = session?.user?.email;

    const [storedTargetLanguage, setStoredTargetLanguage] = useLocalStorage("targetLanguage", "de");
    const [storedSourceLanguage, setStoredSourceLanguage] = useLocalStorage("sourceLanguage", "auto");
    const [targetLanguage, setTargetLanguage] = useState(selectedSubtitle?.selectedSubtitle?.targetLang ? selectedSubtitle?.selectedSubtitle?.targetLang : storedTargetLanguage);
    const [sourceLanguage, setSourceLanguage] = useState(selectedSubtitle?.selectedSubtitle?.sourceLang ? selectedSubtitle?.selectedSubtitle?.sourceLang : storedSourceLanguage);
    const { toast } = useToast();
    useEffect(() => {
        setStoredTargetLanguage(targetLanguage);
    }, [targetLanguage, setStoredTargetLanguage]);

    useEffect(() => {
        setStoredSourceLanguage(sourceLanguage);
    }, [sourceLanguage, setStoredSourceLanguage]);

    const { isFetching, refetch } = useQuery({
        queryKey: ['translate', selectedSubtitle?.selectedSubtitle?.SubtitleId],
        queryFn: async () => {
            const text = selectedSubtitle?.selectedSubtitle?.subtitleData.map((data: any) => data.text);

            const translationResponse = await axios.post('/api/subtitles/translate', {
                SubtitleId: selectedSubtitle?.selectedSubtitle?.SubtitleId,
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
            }).then(() => (getSubs(email || "")
                .then((subtitles) => {
                    dispatch(initializeSubtitles(subtitles));
                })
                .catch((error) => {
                    console.error('Error fetching subtitles:', error);
                }))

            ).catch((e) => toast({
                title: "Error translating subtitles",
                description: e ? e.toString() : "Something went wrong while translating subtitles.",
                variant: 'destructive',
            }));

            return translationResponse;
        },
        enabled: false,
        retry: true,
    });

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="secondary" disabled={isFetching}>
                    {isFetching ? 'Updating...' : 'Translate'}
                </Button>
            </DialogTrigger>
            <DialogContent className="select-none">
                <DialogHeader>
                    <DialogTitle>Translate Subtitle</DialogTitle>
                </DialogHeader>

                <DialogDescription>Subtitle title:</DialogDescription>
                <div className='select-text'>{selectedSubtitle?.selectedSubtitle?.subtitleTitle}</div>
                <DialogDescription>Target language:</DialogDescription>
                <Select onValueChange={setTargetLanguage} defaultValue={targetLanguage}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent >
                        <SelectGroup>
                            <SelectLabel className='font-extrabold text-lg'>Europe</SelectLabel>
                            {EuropeLanguages.map((language) => (
                                <SelectItem key={language.value} value={language.value}>
                                    {language.label}
                                </SelectItem>
                            ))}
                            <SelectLabel className='font-extrabold text-lg'>Asia</SelectLabel>
                            {AsiaLanguages.map((language) => (
                                <SelectItem key={language.value} value={language.value}>
                                    {language.label}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
                <DialogDescription>Source language:</DialogDescription>
                <Select onValueChange={setSourceLanguage} defaultValue={sourceLanguage}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent >
                        <SelectGroup>
                            <SelectItem value="auto">auto</SelectItem>
                            <SelectLabel className='font-extrabold text-lg'>Europe</SelectLabel>
                            {EuropeLanguages.map((language) => (
                                <SelectItem key={language.value} value={language.value}>
                                    {language.label}
                                </SelectItem>
                            ))}
                            <SelectLabel className='font-extrabold text-lg'>Asia</SelectLabel>
                            {AsiaLanguages.map((language) => (
                                <SelectItem key={language.value} value={language.value}>
                                    {language.label}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>

                <DialogDescription>Subtitles row number:</DialogDescription>
                {selectedSubtitle?.selectedSubtitle?.subtitleData?.length}

                {selectedSubtitle?.selectedSubtitle?.youtubeUrl && <DialogDescription>Subtitle URL:</DialogDescription>}
                <div className='select-text'>{selectedSubtitle?.selectedSubtitle?.youtubeUrl}</div>
                <DialogFooter>
                    <Button variant="default" disabled={isFetching} className='mt-2' onClick={() => refetch()}>
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

export default TranslateSubtitle;
