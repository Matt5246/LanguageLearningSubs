"use client"
import React from 'react'
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import axios from 'axios';
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { Progress } from "@/components/ui/progress"
import { useIsMobile } from '@/hooks/useMobile';
import { ResetIcon } from '@radix-ui/react-icons'
import { useOnKeyPress } from "@/hooks/useOnKeyPress";
import { Spinner } from '@/components/ui/spinner';

export default function Home() {
    const session = useSession();
    const userEmail = session?.data?.user?.email;
    const [progress, setProgress] = useState(0);
    const [subtitles, setSubtitles] = useState<any[]>([]);
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const currentSubtitle = subtitles[currentWordIndex] || null;
    const filteredSubtitles = subtitles.filter(subtitle => subtitle.learnState !== 100);

    const [showAllData, setShowAllData] = useState(false);
    const isMobile = useIsMobile();

    const { data, error, isLoading } = useQuery({
        queryKey: ['subtitles', userEmail],
        queryFn: async () => {
            const response = await axios.post('/api/hardWords/get', { email: userEmail });
            setSubtitles(response?.data?.userHardWords);
            return response?.data;
        },
        enabled: !!userEmail,
        retry: true,
    });
    const findNextUnlearnedWordIndex = () => {
        if (filteredSubtitles.length > 0) {
            for (let i = currentWordIndex + 1; i < subtitles.length; i++) {
                if (subtitles[i].learnState !== 100) {
                    setCurrentWordIndex(i);
                    return;
                }
            }
            for (let i = 0; i < currentWordIndex; i++) {
                if (subtitles[i].learnState !== 100) {
                    setCurrentWordIndex(i);
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
                const updatedLearnState = Math.min(subtitle.learnState + 34, 100);
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
                    learnState: Math.max(subtitle.learnState - 40, 0)
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

    React.useEffect(() => {
        if (subtitles.length > 0) {
            const completedSubtitles = subtitles.filter(subtitle => subtitle.learnState === 100).length;
            const currentSubtitleState = currentSubtitle?.learnState === 100 ? 1 : 0;
            const progressValue = ((completedSubtitles + currentSubtitleState) / subtitles.length) * 100;
            setProgress(progressValue);
        }
        if (filteredSubtitles.length === 0) { setProgress(100) }

    }, [subtitles, currentSubtitle]);

    useOnKeyPress(handlePreviousWord, ['1', 'z']);
    useOnKeyPress(handleHard, ['2', 'x']);
    useOnKeyPress(handleNextWord, ['3', 'c']);
    useOnKeyPress(handleEasy, ['4', 'v']);
    useOnKeyPress(handleShowTranslation, ['Enter', ' ']);

    return (
        <>
            <div className="flex justify-center ">
                <Progress value={progress} className="w-[60%] mt-6" />
            </div>
            <div className="flex justify-center mt-6">
                <div className="flex flex-col">
                    {filteredSubtitles?.length > 0 ? (
                        <Card className="min-w-[350px] md:w-[500px] min-h-[530px] m-3 relative">
                            <CardHeader>
                                <CardTitle className="text-xl">{currentSubtitle?.Subtitle?.subtitleTitle}</CardTitle>
                            </CardHeader>
                            <CardContent className="mb-[45px]">
                                <div className="grid w-full items-center gap-4">
                                    <div className="flex flex-col space-y-1.5">
                                        <CardDescription>Word</CardDescription>
                                        <CardTitle>{currentSubtitle?.word}</CardTitle>
                                    </div>
                                    <div className="flex flex-col space-y-1.5">
                                        {showAllData && (
                                            <>
                                                {currentSubtitle?.translation && (
                                                    <>
                                                        <CardDescription>Translation</CardDescription>
                                                        <CardTitle>{currentSubtitle?.translation}</CardTitle>
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
                                                {currentSubtitle?.sentences.map((data: any, index: number) => (
                                                    <div key={index} className="space-y-1.5">
                                                        <CardDescription>Sentence</CardDescription>
                                                        <CardTitle>{data?.sentence}</CardTitle>
                                                        <CardDescription>Sentence Translation</CardDescription>
                                                        <CardTitle>{data?.translation}</CardTitle>
                                                    </div>
                                                ))}
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
                        <div className="mt-12 text-center text-gray-500">
                            Add your hard words to the database first to use this component.{isLoading && <Spinner />}{error && <p className="text-red-500">Error fetching data.</p>}
                        </div>
                    )}
                    {/* {subtitles.length > 0 && (
                        <div className="mt-6">
                            <h2 className="text-xl font-bold">Learned Words:</h2>
                            {subtitles.map((wordObject, index) => (
                                <p key={index}>
                                    {wordObject.word && <span>{wordObject.word}: </span>}
                                    {wordObject.learnState}
                                </p>
                            ))}

                        </div>
                    )} */}
                </div>
            </div>
        </>
    );
}
