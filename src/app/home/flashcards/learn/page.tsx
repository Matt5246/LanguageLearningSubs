'use client'
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateHardWords } from '@/lib/features/subtitles/subtitleSlice';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { BookOpen, ChevronLeft, ChevronRight, Save } from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';
import Link from "next/link";
import { redirect } from "next/navigation";
import { WordCountSelector } from '@/components/progress/WordCountSelector';
import InputFlashCard from './InputWord';
import EditWord from './EditWord';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { useOnKeyPress } from '@/hooks/useOnKeyPress';
import { useIsMobile } from '@/hooks/useMobile';
import axios from 'axios';
import DeleteWord from './DeleteWord';

interface HardWord {
    word: string;
    translation: string;
    learnState: number;
    sentences?: Array<{ sentence: string; translation: string }>;
    lemma?: string;
    pos?: string;
}

interface Subtitle {
    SubtitleId: string;
    subtitleTitle: string;
    hardWords: HardWord[];
}

export default function FlashCard() {
    const dispatch = useDispatch();
    const selectedSub: Subtitle = useSelector((state: any) =>
        state.subtitle.subtitles.find((subtitle: Subtitle) =>
            subtitle.SubtitleId === state.subtitle.selectedSubtitle
        )
    );
    const [subtitles, setSubtitles] = useState<HardWord[]>(selectedSub?.hardWords || []);
    const [progress, setProgress] = useState(0);
    const [wordCount, setWordCount] = useState(10);
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);
    const [studyMode, setStudyMode] = useState<'flashcard' | 'write' | 'context'>('flashcard');
    const [learningComplete, setLearningComplete] = useState(false);
    const [filteredSubtitles, setFilteredSubtitles] = useState<HardWord[]>(subtitles
        .filter(subtitle => subtitle.learnState !== 100)
        .slice(0, wordCount));
    const { toast } = useToast();
    const isMobile = useIsMobile();

    useEffect(() => {
        const newFilteredSubtitles = subtitles
            .filter(subtitle => subtitle.learnState !== 100)
            .slice(0, wordCount);
        setFilteredSubtitles(newFilteredSubtitles);
    }, [wordCount]);
    const currentSubtitle = filteredSubtitles[currentWordIndex];

    useEffect(() => {
        const completedWords = subtitles.filter(w => w.learnState === 100).length;
        const currentProgress = (completedWords / subtitles.length) * 100;
        setProgress(currentProgress);

        const currentSetLearned = filteredSubtitles.every(filteredWord =>
            subtitles.some(subtitle => subtitle.word === filteredWord.word && subtitle.learnState === 100)
        );

        if (currentSetLearned && filteredSubtitles.length > 0) {
            setLearningComplete(true);
            handleLearningComplete();
        }
    }, [subtitles, filteredSubtitles]);

    const handleLearningComplete = async () => {
        try {
            const wordsToUpdate = subtitles
                .filter(word => word.learnState !== 0)
                .map(word => ({
                    ...word,
                }));
            await axios.post('/api/hardWords/update', {
                SubtitleId: selectedSub.SubtitleId,
                hardWords: wordsToUpdate
            });
            dispatch(updateHardWords({ SubtitleId: selectedSub.SubtitleId, hardWords: subtitles }));
            setShowAnswer(false);
            toast({
                title: "Learning session complete!",
                description: `You've learned ${wordCount} words successfully.`,
            });
            setFilteredSubtitles([]);
        } catch (error) {
            console.error('Error updating words:', error);
            toast({
                title: "Error updating progress",
                description: "Failed to save your progress. Please try again.",
                variant: "destructive"
            });
        }
    };

    const handleNextWord = () => {
        setShowAnswer(false);
        let nextIndex = currentWordIndex;
        let foundNext = false;

        for (let i = 1; i < filteredSubtitles.length; i++) {
            const newIndex = (currentWordIndex + i) % filteredSubtitles.length;
            const filteredWord = filteredSubtitles[newIndex];
            const subtitleWord = subtitles.find(sub => sub.word === filteredWord.word);
            if (subtitleWord && subtitleWord.learnState !== 100) {
                nextIndex = newIndex;
                foundNext = true;
                break;
            }
        }

        if (foundNext) {
            setCurrentWordIndex(nextIndex);
        }
    };

    const handlePreviousWord = () => {
        setShowAnswer(false);
        if (currentWordIndex > 0) {
            setCurrentWordIndex(prev => prev - 1);
        } else {
            setCurrentWordIndex(filteredSubtitles.length - 1);
        }
    };

    const handleEasy = () => {
        const updatedSubtitles = subtitles.map(subtitle => {
            if (subtitle.word === currentSubtitle?.word) {
                const updatedLearnState = Math.min(subtitle.learnState + 34, 100);
                return { ...subtitle, learnState: updatedLearnState };
            }
            return subtitle;
        });
        setSubtitles(updatedSubtitles);

        toast({
            title: "Great progress!",
            description: "You're getting better at this word.",
        });

        handleNextWord();
    };

    const handleHard = () => {
        const updatedSubtitles = subtitles.map(subtitle => {
            if (subtitle.word === currentSubtitle?.word) {
                return {
                    ...subtitle,
                    learnState: Math.max(subtitle.learnState - 40, 0)
                };
            }
            return subtitle;
        });
        setSubtitles(updatedSubtitles);

        toast({
            title: "Keep practicing",
            description: "Don't worry, you'll get it next time.",
        });

        handleNextWord();
    };

    // Keyboard shortcuts
    useOnKeyPress(handlePreviousWord, ['1']);
    useOnKeyPress(handleHard, ['2']);
    useOnKeyPress(handleNextWord, ['3']);
    useOnKeyPress(handleEasy, ['4']);
    useOnKeyPress(() => setShowAnswer(true), ['Enter', ' ']);

    if (!selectedSub || filteredSubtitles.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <BookOpen className="h-16 w-16 text-muted-foreground" />
                <h2 className="text-2xl font-semibold">
                    {selectedSub ? "All Words Learned!" : "No Flashcards Selected"}
                </h2>
                <p className="text-muted-foreground text-center max-w-md">
                    {selectedSub
                        ? "Congratulations! You've learned all the words in this set."
                        : "Please select a subtitle set to start learning."}
                </p>
                <Link href="/home/flashcards">
                    <Button onClick={() => redirect('/home/flashcards')}>
                        Go back
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="container max-w-4xl mx-auto py-8 space-y-6">
            <WordCountSelector value={wordCount} onChange={setWordCount} />

            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">{selectedSub.subtitleTitle}</h2>
                <HoverCard>
                    <HoverCardTrigger asChild>
                        <Progress value={progress} className="w-[200px]" />
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80">
                        <label className="text-xl font-bold pb-4">Learned Words:</label>
                        {subtitles.length > 0 && (
                            <div>
                                {subtitles.map((wordObject, index) => (
                                    <p key={index}>
                                        {wordObject.word && <span>{wordObject.word}: </span>}
                                        {wordObject.learnState}%
                                    </p>
                                ))}
                                <div className="text-2xl font-bold absolute right-5 bottom-5">
                                    {progress.toFixed(0)}%
                                </div>
                            </div>
                        )}
                    </HoverCardContent>
                </HoverCard>
            </div>

            <Tabs value={studyMode} onValueChange={(v: any) => setStudyMode(v)}>
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="flashcard">Flashcards</TabsTrigger>
                    <TabsTrigger value="write">Write</TabsTrigger>
                    <TabsTrigger value="context">Context</TabsTrigger>
                </TabsList>
            </Tabs>

            <AnimatePresence mode="wait">
                <motion.div
                    key={currentWordIndex + studyMode}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                >
                    <Card className="min-h-[530px] relative">
                        <CardHeader>
                            <div className="flex justify-between">
                                <CardTitle className="text-xl">
                                    Word {currentWordIndex + 1} of {filteredSubtitles.length}
                                </CardTitle>
                                <div className='flex space-x-2'>
                                    <DeleteWord hardWord={currentSubtitle.word} />
                                    <EditWord wordData={currentSubtitle} onSave={(word) => {
                                        const updatedSubtitles = subtitles.map(w =>
                                            w.word === word.word ? word : w
                                        );
                                        setSubtitles(updatedSubtitles);
                                        toast({
                                            title: "Word updated",
                                            description: "Changes saved successfully"
                                        });
                                    }} />
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent>
                            {studyMode === 'flashcard' && (
                                <div className="space-y-6">
                                    <div className="text-center">
                                        <h3 className="text-3xl font-bold mb-4">{currentSubtitle?.word}</h3>
                                        {showAnswer && (
                                            <div className="space-y-4">
                                                <p className="text-xl">{currentSubtitle?.translation}</p>
                                                {currentSubtitle?.lemma && (
                                                    <div className="text-md text-muted-foreground">
                                                        <p>Lemma: {currentSubtitle?.lemma}</p>
                                                        <p>Part of Speech: {currentSubtitle?.pos}</p>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {studyMode === 'write' && (
                                <InputFlashCard
                                    word={currentSubtitle?.word}
                                    translation={currentSubtitle?.translation}
                                    handleEasy={handleEasy}
                                />
                            )}

                            {studyMode === 'context' && currentSubtitle?.sentences && (
                                <div className="space-y-4">
                                    {currentSubtitle?.sentences.map((sentence, index) => (
                                        <Card key={index} className="p-4">
                                            <p className="mb-2">{sentence.sentence}</p>
                                            <p className="text-muted-foreground">
                                                {currentSubtitle.translation
                                                    ? sentence?.translation.replace(
                                                        new RegExp(`\\b${currentSubtitle?.translation}\\b`, 'gi'),
                                                        '_____'
                                                    )
                                                    : sentence?.translation}
                                            </p>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </CardContent>

                        <CardFooter className="absolute bottom-0 w-full p-6 border-t">
                            <div className="flex justify-between items-center w-full">
                                <Button variant="outline" onClick={handlePreviousWord}>
                                    <ChevronLeft className="h-4 w-4" />
                                    {!isMobile && <span className="ml-2">Previous</span>}
                                </Button>

                                {!showAnswer && studyMode === 'flashcard' && (
                                    <Button className="w-[150px]" onClick={() => setShowAnswer(true)}>
                                        Show Answer
                                    </Button>
                                )}

                                {showAnswer && studyMode === 'flashcard' && (
                                    <div className="space-x-2">
                                        <Button variant="outline" onClick={handleHard}>
                                            {isMobile ? 'Hard' : '2. Hard'}
                                        </Button>
                                        <Button onClick={handleEasy}>
                                            {isMobile ? 'Easy' : '4. Easy'}
                                        </Button>
                                    </div>
                                )}

                                <Button variant="outline" onClick={handleNextWord}>
                                    {!isMobile && <span className="mr-2">Next</span>}
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardFooter>
                    </Card>
                </motion.div>
            </AnimatePresence>
            <Button
                onClick={handleLearningComplete}
                className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full md:fixed bottom-6 right-6 z-50 shadow-lg w-full md:w-auto"
            >
                <Save className="h-5 w-5" />
                <span >Save Progress</span>
            </Button>

        </div>
    );
}