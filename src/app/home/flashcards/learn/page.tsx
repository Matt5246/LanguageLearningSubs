'use client'
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { useIsMobile } from '@/hooks/useMobile';
import { useOnKeyPress } from '@/hooks/useOnKeyPress';
import { calculateNextReviewDate, selectSRSFlashcards, updateHardWords, updateWordSRS } from '@/lib/features/subtitles/subtitleSlice';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ChevronLeft, ChevronRight, Clock, Laugh, Repeat } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SubtitlesDropDown } from '../../subtitles/SubtitlesDropDown';
import DeleteWord from './DeleteWord';
import EditWord from './EditWord';
import InputFlashCard from './InputWord';
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { getDueDate } from "@/lib/utils";
import { Angry, ThumbsUp } from "lucide-react";

export default function FlashCard() {
    const dispatch = useDispatch();
    const selectedSubId = useSelector((state: any) => state.subtitle.selectedSubtitle);
    const allSubtitles = useSelector((state: any) => state.subtitle.subtitles);
    const srsFlashcards = useSelector(selectSRSFlashcards);
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);
    const [completed, setCompleted] = useState(false);
    const [studyMode, setStudyMode] = useState<'flashcard' | 'write' | 'context'>('flashcard');
    const [filteredCards, setFilteredCards] = useState(srsFlashcards.filter((card: any) => card.SubtitleId === selectedSubId));
    const [initialFilteredCards, setInitialFilteredCards] = useState(filteredCards);

    useEffect(() => {
        setInitialFilteredCards(filteredCards);
    }, []);
    const { toast } = useToast();
    const isMobile = useIsMobile();

    useEffect(() => {
        if (selectedSubId) {
            setFilteredCards(srsFlashcards.filter((card: any) => card.SubtitleId === selectedSubId));
            setCurrentWordIndex(0);
        } else {
            setFilteredCards(srsFlashcards);
        }
    }, [selectedSubId, srsFlashcards]);

    const handleLearningComplete = async () => {
        try {
            await axios.post('/api/hardWords/update', {
                SubtitleId: selectedSubId,
                hardWords: allSubtitles.find((sub: any) => sub.SubtitleId === selectedSubId)?.hardWords
            });
            setShowAnswer(false);
            console.log('filteredCards:', filteredCards);
            console.log('allsubtitles:', allSubtitles.find((sub: any) => sub.SubtitleId === selectedSubId)?.hardWords);
            toast({
                title: "Learning session complete!",
                description: `You've learned ${initialFilteredCards?.length} words successfully.`,
            });
            setFilteredCards([]);
        } catch (error) {
            console.error('Error updating words:', error);
            toast({
                title: "Error updating progress",
                description: "Failed to save your progress. Please try again.",
                variant: "destructive"
            });
        }
    };
    const currentCard = filteredCards[currentWordIndex];

    const handleAnswer = (quality: number) => {
        if (currentCard) {
            dispatch(updateWordSRS({
                SubtitleId: currentCard?.SubtitleId || '',
                word: currentCard?.word || '',
                quality
            }));
            const nextReview = calculateNextReviewDate(currentCard?.repetitions || 1).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
            }
            );
            toast({
                title: quality > 3 ? "Good job!" : "Keep practicing",
                description: quality > 3
                    ? `Next review: ${nextReview}`
                    : "You'll see this card again soon.",
            });
            console.log('filteredCards:', filteredCards);
            handleNextWord();
            if (filteredCards.length === 1) {
                setCompleted(true);
            }
        }
    };


    const handleNextWord = () => {
        setShowAnswer(false);
        if (currentWordIndex < filteredCards.length - 1) {
            setCurrentWordIndex(prev => prev + 1);
        } else {
            setCurrentWordIndex(0);
        }
    };

    const handlePreviousWord = () => {
        setShowAnswer(false);
        if (currentWordIndex > 0) {
            setCurrentWordIndex(prev => prev - 1);
        } else {
            setCurrentWordIndex(filteredCards.length - 1);
        }
    };

    useOnKeyPress(() => handleAnswer(1), ['1']);
    useOnKeyPress(() => handleAnswer(2), ['2']);
    useOnKeyPress(() => handleAnswer(4), ['3']);
    useOnKeyPress(() => handleAnswer(5), ['4']);
    useOnKeyPress(() => setShowAnswer(true), ['Enter', ' ']);

    if (!currentCard) {
        if (completed) {
            handleLearningComplete();
            setCompleted(false);
        }
        return (
            <div className="container max-w-4xl mx-auto py-8">
                <div className="flex items-center space-x-2 mb-8">
                    <Link href="/home/flashcards">
                        <Button variant="ghost" size="sm">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Sets
                        </Button>
                    </Link>
                </div>
                <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                    <Clock className="h-16 w-16 text-muted-foreground" />
                    <h2 className="text-2xl font-semibold">No Cards Due</h2>
                    <p className="text-muted-foreground text-center max-w-md">
                        Great job! You've completed all your reviews for now.
                        Check back later for more cards.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="container max-w-4xl mx-auto py-8 space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                    <Link href="/home/flashcards">
                        <Button variant="ghost" size="sm">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Sets
                        </Button>
                    </Link>
                    <div className="text-2xl font-bold">
                        {isMobile ? <p className="text-sm bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent truncate max-w-xs whitespace-normal mr-2">
                            {currentCard.subtitleTitle}
                        </p> : <p className="text-3xl whitespace-nowrap bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                            {currentCard.subtitleTitle} Flashcards
                        </p>}

                    </div>
                </div>
                <SubtitlesDropDown data={allSubtitles as any[]} />
            </div>

            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">
                        {filteredCards.length} cards due
                    </span>
                </div>
                <HoverCard>
                    <HoverCardTrigger asChild>
                        <Button variant="outline" className="space-x-2">
                            <Clock className="h-4 w-4" />
                            <span>Due: {currentCard.dueDate ? getDueDate(currentCard?.dueDate) : 'New'}</span>
                        </Button>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80">
                        <div className="space-y-2">
                            <h4 className="font-semibold">Card Details</h4>
                            <p>From: {currentCard.subtitleTitle}</p>
                            <p>Word: {currentCard.word}</p>
                            <p>Reviews: {currentCard?.repetitions || 0}</p>
                        </div>
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
                                    Card {currentWordIndex + 1} of {filteredCards.length}
                                </CardTitle>
                                <div className='flex space-x-2'>
                                    {currentCard?.word && <DeleteWord hardWord={currentCard?.word} />}
                                    <EditWord wordData={currentCard} />
                                </div>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                From: {currentCard.subtitleTitle}
                            </p>
                        </CardHeader>

                        <CardContent>
                            {studyMode === 'flashcard' && (
                                <div className="space-y-6">
                                    <div className="text-center break-words">
                                        <h3 className="text-3xl font-bold mb-4">{currentCard.word}</h3>
                                        {showAnswer && (
                                            <div className="space-y-4">
                                                <p className="text-xl">{currentCard.translation}</p>
                                                {currentCard.lemma && (
                                                    <div className="text-md text-muted-foreground">
                                                        <p>Lemma: {currentCard.lemma}</p>
                                                        <p>Part of Speech: {currentCard.pos}</p>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {studyMode === 'write' && (
                                <InputFlashCard
                                    word={currentCard.word}
                                    translation={currentCard.translation}
                                    onCorrect={() => handleAnswer(5)}
                                    onIncorrect={() => handleAnswer(1)}
                                />
                            )}

                            {studyMode === 'context' && currentCard.sentences && (
                                <div className="space-y-4">
                                    {currentCard.sentences.map((sentence: any, index: number) => (
                                        <Card key={index} className="p-4">
                                            <p className="mb-2">{sentence.sentence}</p>
                                            {showAnswer && (
                                                <p className="text-muted-foreground">
                                                    {sentence.translation}
                                                </p>
                                            )}
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
                                    <div className={`space-x-1 ${isMobile ? 'p-2' : ''}`}>
                                        <Button variant="destructive" className={isMobile ? 'p-2' : ''} onClick={() => handleAnswer(1)}>
                                            {isMobile ? <Angry /> : '1. Hard'}
                                        </Button>
                                        <Button variant="outline" className={isMobile ? 'p-2' : ''} onClick={() => handleAnswer(2)}>
                                            {isMobile ? <Repeat /> : '2. Try again'}
                                        </Button>
                                        <Button variant="outline" className={isMobile ? 'p-2' : ''} onClick={() => handleAnswer(4)}>
                                            {isMobile ? <ThumbsUp /> : '3. Good'}
                                        </Button>
                                        <Button className={isMobile ? 'p-2' : ''} onClick={() => handleAnswer(5)}>
                                            {isMobile ? <Laugh /> : '4. Easy'}
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
            {isMobile ?
                <div className="flex justify-end items-end">
                    <Button onClick={handleLearningComplete} className="w-full">
                        Save Progress
                    </Button>
                </div> : <Button onClick={handleLearningComplete}
                    className="ml-4 absolute right-6 bottom-6">
                    Save Progress
                </Button>}

        </div>
    );
}