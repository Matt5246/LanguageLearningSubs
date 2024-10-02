"use client"
import React from 'react'
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import axios from 'axios';
import { Progress } from "@/components/ui/progress"
import { useIsMobile } from '@/hooks/useMobile';
import { ResetIcon } from '@radix-ui/react-icons'
import { useOnKeyPress } from "@/hooks/useOnKeyPress";
import { useSelector } from 'react-redux';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"
import { useToast } from "@/components/ui/use-toast";
import { redirect } from "next/navigation";
import Link from "next/link";
import EditWord from "./EditWord"

export default function FlashCard() {
    const selectedSub: Subtitle = useSelector((state: any) => state.subtitle.subtitles.find((subtitle: Subtitle) => subtitle.SubtitleId === state.subtitle.selectedSubtitle));
    const [progress, setProgress] = useState(0);
    const [subtitles, setSubtitles] = useState<HardWord[]>(selectedSub?.hardWords || []);
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [showAllData, setShowAllData] = useState(false);
    const [currentSubtitle, setCurrentSubtitle] = useState(subtitles[currentWordIndex] || null);
    const filteredSubtitles = subtitles.filter(subtitle => subtitle.learnState !== 100)
    const isMobile = useIsMobile();
    const { toast } = useToast();

    const findNextUnlearnedWordIndex = () => {
        if (filteredSubtitles.length > 0) {
            for (let i = currentWordIndex + 1; i < subtitles.length; i++) {
                if (subtitles[i].learnState !== 100) {
                    setCurrentWordIndex(i);
                    setCurrentSubtitle(subtitles[i])
                    return;
                }
            }
            for (let i = 0; i < currentWordIndex; i++) {
                if (subtitles[i].learnState !== 100) {
                    setCurrentWordIndex(i);
                    setCurrentSubtitle(subtitles[i])
                    return;
                }
            }
        }
    };

    const handleNextWord = () => {
        setShowAllData(false);
        findNextUnlearnedWordIndex();
    };
    const handleEasy = () => {
        setShowAllData(false);
        const updatedSubtitles = subtitles.map(subtitle => {
            if (subtitle.word === currentSubtitle?.word) {
                const updatedLearnState = Math.min(subtitle.learnState! + 34, 100);
                return {
                    ...subtitle,
                    learnState: updatedLearnState
                };
            }
            return subtitle;
        });
        setSubtitles(updatedSubtitles);
        findNextUnlearnedWordIndex();
    };

    const handleHard = () => {
        setShowAllData(false);
        const updatedSubtitles = subtitles.map(subtitle => {
            if (subtitle?.word === currentSubtitle?.word) {
                return {
                    ...subtitle,
                    learnState: Math.max(subtitle.learnState! - 40, 0)
                };
            }
            return subtitle;
        });

        setSubtitles(updatedSubtitles);
        findNextUnlearnedWordIndex();
    };


    const handlePreviousWord = () => {
        setShowAllData(false);
        setCurrentWordIndex((prevIndex) => (prevIndex - 1 + filteredSubtitles.length) % filteredSubtitles.length);
    };

    const handleShowTranslation = () => {
        setShowAllData(true)
    };

    const fetchSubtitles = async () => {
        try {
            const response = await axios.post('/api/hardWords/update',
                { hardWords: subtitles }
            );
            toast({
                title: "Word updated successfully!",
                // description: response.toString(),
            })
        } catch (error) {
            console.error('Error fetching subtitles:', error);
        }

    };
    const calculateLearningAttempts = (learnState: number): number => {
        const maxLearnState = 100;
        const learningIncrement = 34;
        return Math.ceil((maxLearnState - learnState) / learningIncrement);
    };
    const handleSaveEditWord = (updatedWord: HardWord) => {
        const updatedSubtitles = subtitles.map(subtitle =>
            subtitle.word === updatedWord.word ? updatedWord : subtitle
        );
        setSubtitles(updatedSubtitles);
        setCurrentSubtitle(updatedWord)
    };

    React.useEffect(() => {
        if (subtitles.length > 0) {
            const completedSubtitles = subtitles.filter(subtitle => subtitle.learnState === 100).length;
            const currentSubtitleState = currentSubtitle?.learnState === 100 ? 1 : 0;
            const progressValue = ((completedSubtitles + currentSubtitleState) / subtitles.length) * 100;
            setProgress(progressValue);
        }

        if (filteredSubtitles.length === 0 && subtitles.length > 0) {
            setProgress(100);
            fetchSubtitles();
        }

    }, [subtitles, currentSubtitle]);

    useOnKeyPress(handlePreviousWord, ['1']);
    useOnKeyPress(handleHard, ['2']);
    useOnKeyPress(handleNextWord, ['3']);
    useOnKeyPress(handleEasy, ['4']);
    useOnKeyPress(handleShowTranslation, ['Enter', ' ']);

    return (
        <>
            <div className="flex justify-center ">
                <HoverCard >
                    <HoverCardTrigger asChild >
                        <Progress value={progress} className="w-[60%] mt-6" />
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80">
                        <label className="text-xl font-bold pb-4">Learned Words:</label>
                        {subtitles.length > 0 && (
                            <div>
                                {subtitles.map((wordObject, index) => (
                                    <p key={index}>
                                        {wordObject.word && <span>{wordObject.word}: </span>}
                                        {wordObject.learnState}
                                    </p>
                                ))}
                                <div className="text-2xl font-bold absolute right-5 bottom-5">{progress}%</div>
                            </div>
                        )}
                    </HoverCardContent>
                </HoverCard>
            </div>
            <div className="flex justify-center mt-6">
                <div className="flex flex-col">
                    {filteredSubtitles?.length > 0 ? (
                        <Card className="min-w-[350px] md:w-[500px] min-h-[530px] m-3 relative">
                            <CardHeader>
                                <div className="flex justify-between">
                                    <CardTitle className="text-xl">{selectedSub?.subtitleTitle}</CardTitle>
                                    <EditWord wordData={currentSubtitle} onSave={handleSaveEditWord} />
                                </div>
                            </CardHeader>
                            <CardContent className="mb-[45px]">
                                <div className="grid w-full items-center  space-y-1.5">
                                    <div className="flex flex-col space-y-1.5">
                                        <CardDescription>Word</CardDescription>
                                        <CardTitle className='text-xl'>{currentSubtitle?.word}</CardTitle>
                                    </div>
                                    <div className="flex flex-col space-y-1.5 text-xl">
                                        {showAllData && (
                                            <>
                                                {currentSubtitle?.translation && (
                                                    <>
                                                        <CardDescription>Translation</CardDescription>
                                                        <CardTitle className='text-xl'>{currentSubtitle?.translation}</CardTitle>
                                                    </>
                                                )}
                                                {currentSubtitle?.lemma && (
                                                    <>
                                                        <CardDescription>Lemma</CardDescription>
                                                        <CardTitle>{currentSubtitle?.lemma}</CardTitle>
                                                        <CardDescription>Part of speech</CardDescription>
                                                        <CardTitle>{currentSubtitle?.pos}</CardTitle>
                                                    </>
                                                )}
                                                <Accordion type="single" collapsible>
                                                    {currentSubtitle?.sentences && currentSubtitle?.sentences.map((data: any, index: number) => (
                                                        <>
                                                            <CardDescription>Sentence</CardDescription>
                                                            <AccordionItem value={`item-${index}`} key={index}>
                                                                <AccordionTrigger>{data?.sentence}</AccordionTrigger>
                                                                <AccordionContent>{data?.translation} </AccordionContent>
                                                            </AccordionItem>
                                                        </>
                                                    ))}
                                                </Accordion>

                                                <CardDescription>LearnState {calculateLearningAttempts(currentSubtitle?.learnState!)}</CardDescription>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className={`absolute bottom-0 ${isMobile ? 'flex space-x-2' : 'flex justify-between space-x-8'}`}>
                                {showAllData && (
                                    <>
                                        <Button variant="secondary" onClick={handlePreviousWord}>
                                            {isMobile ? <ResetIcon /> : "1. prev"}
                                        </Button>
                                        <Button variant="outline" onClick={handleHard}>
                                            {isMobile ? 'Hard' : '2. Hard'}
                                        </Button>
                                        <Button variant="outline" onClick={handleNextWord}>
                                            {isMobile ? 'Try again' : '3. Try again'}
                                        </Button>
                                        <Button variant="outline" onClick={handleEasy}>
                                            {isMobile ? 'Easy' : '4. Easy'}
                                        </Button>
                                    </>
                                )}
                                {!showAllData &&
                                    <Button variant="outline" className="md:w-[448px] w-[297px]" onClick={handleShowTranslation}>
                                        Show Translation
                                    </Button>
                                }
                            </CardFooter>
                        </Card>
                    ) : (
                        <>
                            <div className="mt-12 text-center text-gray-500 mx-4">
                                Add your hard words to {selectedSub?.subtitleTitle ? <p>{selectedSub.subtitleTitle}</p> : ' the database'} first to use this component. {!selectedSub?.subtitleTitle && 'Or pick subtitles in flashCards page.'}
                            </div>

                            <Link href='/home/flashcards'>
                                <Button className='mt-10 w-full' onClick={() => redirect('/home/flashcards')}>
                                    Go back
                                </Button>
                            </Link>
                        </>
                    )}
                </div>
            </div>

        </>
    );
}
