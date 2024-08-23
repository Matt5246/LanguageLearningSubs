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
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { MinusIcon, PlusIcon } from "@radix-ui/react-icons";
import { Input } from '@/components/ui/input'
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"
import { useToast } from "@/components/ui/use-toast";
import { redirect } from "next/navigation";
import Link from "next/link";

export default function FlashCard() {
    const selectedSub: Subtitle = useSelector((state: any) => state.subtitle.subtitles.find((subtitle: any) => subtitle.SubtitleId === state.subtitle.selectedSubtitle));
    const [progress, setProgress] = useState(0);
    const [subtitles, setSubtitles] = useState<any[]>(selectedSub?.hardWords || []);
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [showAllData, setShowAllData] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [editingWord, setEditingWord] = useState<any | null>(null);
    const currentSubtitle = subtitles[currentWordIndex] || null;
    const filteredSubtitles = subtitles.filter(subtitle => subtitle.learnState !== 100);
    const isMobile = useIsMobile();
    const { toast } = useToast();

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

    const fetchSubtitles = async () => {
        try {
            const response = await axios.post('/api/hardWords/update',
                { hardWords: subtitles }
            );
        } catch (error) {
            console.error('Error fetching subtitles:', error);
        }

    };
    const calculateLearningAttempts = (learnState: number): number => {
        const maxLearnState = 100;
        const learningIncrement = 34;
        return Math.ceil((maxLearnState - learnState) / learningIncrement);
    };
    const handleEditWord = (word: any) => {
        setEditingWord(word);
        setIsDrawerOpen(true);
    };

    const handleSaveEdit = async () => {
        try {
            const response = await axios.post('/api/hardWords/edit',
                { hardWord: editingWord }
            );
            toast({
                title: "Enter subtitle title",
                description: response.toString(),
            })
        } catch (error) {
            console.error('Error fetching hardWord:', error);
            toast({
                title: "Enter subtitle title",
                description: error?.toString(),
                variant: "destructive",
            })
        }
        setIsDrawerOpen(false);
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
                                <CardTitle className="text-xl">{selectedSub?.subtitleTitle}</CardTitle>
                            </CardHeader>
                            <Button variant="outline" className='absolute right-5 top-5' onClick={() => handleEditWord(currentSubtitle)}>
                                Edit Word
                            </Button>
                            <CardContent className="mb-[45px]">
                                <div className="grid w-full items-center  space-y-1.5">
                                    <div className="flex flex-col space-y-1.5">
                                        <CardDescription>Word</CardDescription>
                                        <CardTitle className='text-xl'>{currentSubtitle?.word}</CardTitle>


                                    </div>
                                    <div className="flex flex-col space-y-1.5">
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
                                                    {currentSubtitle?.sentences.map((data: any, index: number) => (
                                                        <>
                                                            <CardDescription>Sentence</CardDescription>
                                                            <AccordionItem value={`item-${index}`} key={index}>
                                                                <AccordionTrigger>{data?.sentence}</AccordionTrigger>
                                                                <AccordionContent>{data?.translation} </AccordionContent>
                                                            </AccordionItem>
                                                        </>
                                                    ))}
                                                </Accordion>

                                                <CardDescription>LearnState {calculateLearningAttempts(currentSubtitle?.learnState)}</CardDescription>
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
                            <Button className='mt-10' onClick={() => redirect('/home/flashcards')}>
                                <Link href='/home/flashcards'>Go back</Link>
                            </Button>
                        </>
                    )}
                </div>
            </div>
            <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
                <DrawerContent>
                    <div className="mx-auto w-full max-w-sm">
                        <DrawerHeader>
                            <DrawerTitle >Edit Hard Word</DrawerTitle>
                            <DrawerDescription>Edit the details of the selected hard word.</DrawerDescription>
                        </DrawerHeader>
                        <div className="p-4 pb-0 space-y-1.5">
                            <label className="flex flex-col space-y-1.5 text-lg font-semibold">Word</label>
                            <Input
                                type="text"
                                value={editingWord?.word || ''}
                                onChange={(e) => setEditingWord({ ...editingWord, word: e.target.value })}
                            />
                            <label className="flex flex-col space-y-1.5 text-lg font-semibold">Translation</label>
                            <Input
                                type="text"
                                value={editingWord?.translation || ''}
                                onChange={(e) => setEditingWord({ ...editingWord, translation: e.target.value })}
                            />
                            <label className="flex flex-col space-y-1.5 text-lg font-semibold">Lemma</label>
                            <Input
                                type="text"
                                value={editingWord?.lemma || ''}
                                onChange={(e) => setEditingWord({ ...editingWord, lemma: e.target.value })}
                            />
                            <label className="flex flex-col space-y-1.5 text-lg font-semibold">Part of Speech</label>
                            <Input
                                type="text"
                                value={editingWord?.pos || ''}
                                onChange={(e) => setEditingWord({ ...editingWord, pos: e.target.value })}
                            />

                            <div className="mt-3">
                                <Accordion type="single" collapsible>
                                    {editingWord?.sentences?.map((sentence: senteces, index: number) => (
                                        <AccordionItem value={`item-${index}`} key={index}>
                                            <AccordionTrigger className='font-semibold'>{sentence.sentence}</AccordionTrigger>
                                            <AccordionContent>
                                                <Input
                                                    type="text"
                                                    value={sentence?.translation || ""}
                                                    onChange={(e) => {
                                                        const updatedSentences = [...editingWord.sentences];
                                                        updatedSentences[index].translation = e.target.value;
                                                        setEditingWord({ ...editingWord, sentences: updatedSentences });
                                                    }}
                                                    className="w-full"
                                                    disabled
                                                />
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            </div>
                        </div>
                        <DrawerFooter>
                            <Button onClick={handleSaveEdit}>Save</Button>
                            <DrawerClose asChild>
                                <Button variant="outline">Cancel</Button>
                            </DrawerClose>
                        </DrawerFooter>
                    </div>
                </DrawerContent>
            </Drawer>

        </>
    );
}
