'use client'
import React, { useEffect, useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import Link from "next/link";
import { Search, BookOpen, Trophy, Clock, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { setSelectedSubtitle, selectFlashCardData, selectSrsStats } from '@/lib/features/subtitles/subtitleSlice';
import DeleteSubtitle from '@/app/home/subtitles/DeleteSubtitles';
import { Spinner } from '@/components/ui/spinner';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';

interface GroupedSubtitles {
    [key: string]: Subtitle[];
}

interface Subtitle {
    SubtitleId?: string;
    subtitleTitle?: string;
    hardWords?: Array<{
        word: string;
        translation: string;
        learnState: number;
        srs?: {
            interval: number;
            easeFactor: number;
            repetitions: number;
            dueDate: string;
        };
    }>;
}

const sortOptions = {
    'title-asc': (a: [string, Subtitle[]], b: [string, Subtitle[]]) => a[0].localeCompare(b[0]),
    'title-desc': (a: [string, Subtitle[]], b: [string, Subtitle[]]) => b[0].localeCompare(a[0]),
    'words-asc': (a: [string, Subtitle[]], b: [string, Subtitle[]]) =>
        a[1].reduce((acc, s) => acc + (s.hardWords?.length || 0), 0) -
        b[1].reduce((acc, s) => acc + (s.hardWords?.length || 0), 0),
    'words-desc': (a: [string, Subtitle[]], b: [string, Subtitle[]]) =>
        b[1].reduce((acc, s) => acc + (s.hardWords?.length || 0), 0) -
        a[1].reduce((acc, s) => acc + (s.hardWords?.length || 0), 0),
    'due-asc': (a: [string, Subtitle[]], b: [string, Subtitle[]]) =>
        getDueWordsCount(a[1]) - getDueWordsCount(b[1]),
    'due-desc': (a: [string, Subtitle[]], b: [string, Subtitle[]]) =>
        getDueWordsCount(b[1]) - getDueWordsCount(a[1]),
};

function getDueWordsCount(subtitles: Subtitle[]): number {
    const now = new Date();
    return subtitles.reduce((acc, s) =>
        acc + (s.hardWords?.filter(w =>
            !w.srs || new Date(w.srs.dueDate) <= now
        ).length || 0), 0);
}

function getProgressPercentage(subtitles: Subtitle[]): number {
    const totalWords = subtitles.reduce((acc, s) => acc + (s.hardWords?.length || 0), 0);
    const masteredWords = subtitles.reduce((acc, s) =>
        acc + (s.hardWords?.filter(w => w.srs?.interval || 0 >= 30)?.length || 0), 0);
    return totalWords ? (masteredWords / totalWords) * 100 : 0;
}

export default function FlashcardPage() {
    const dispatch = useDispatch();
    const [isLoaded, setIsLoaded] = useState(false);
    const flashCardData = useSelector(selectFlashCardData) as Subtitle[];
    const srsStats = useSelector(selectSrsStats);
    const [search, setSearch] = useState('');
    const [sort, setSort] = useState('due-desc');
    const [filter, setFilter] = useState('all');
    const [groupedSubtitles, setGroupedSubtitles] = useState<GroupedSubtitles>({});
    console.log(srsStats);
    useEffect(() => {
        const grouped = flashCardData.reduce((acc: GroupedSubtitles, subtitle: Subtitle) => {
            if (!acc[subtitle.subtitleTitle!]) {
                acc[subtitle.subtitleTitle!] = [];
            }
            acc[subtitle.subtitleTitle!].push(subtitle);
            return acc;
        }, {});
        setIsLoaded(true);
        setGroupedSubtitles(grouped);
    }, [flashCardData]);

    const filteredAndSortedSubtitles = useMemo(() => {
        return Object.entries(groupedSubtitles)
            .filter(([title, data]) => {
                const hasWords = data.some(subtitle => subtitle.hardWords!.length > 0);
                const matchesSearch = title.toLowerCase().includes(search.toLowerCase()) ||
                    data.some(subtitle =>
                        subtitle.hardWords?.some(word =>
                            word.word.toLowerCase().includes(search.toLowerCase()) ||
                            word?.translation?.toLowerCase().includes(search.toLowerCase())
                        )
                    );
                const progress = getProgressPercentage(data);
                const dueWords = getDueWordsCount(data);

                if (filter === 'not-started') return progress === 0 && hasWords;
                if (filter === 'in-progress') return progress > 0 && progress < 100 && hasWords;
                if (filter === 'completed') return progress === 100 && hasWords;
                if (filter === 'due') return dueWords > 0;
                return hasWords && matchesSearch;
            })
            .sort(sortOptions[sort as keyof typeof sortOptions]);
    }, [groupedSubtitles, search, sort, filter]);

    const handleLearnButtonClick = (SubtitleId: string) => {
        dispatch(setSelectedSubtitle(SubtitleId));
    };

    if (!isLoaded) {
        return (
            <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-bold mt-9 ml-9">Flash cards</h1>
                <Spinner />
            </div>
        );
    }

    if (!flashCardData || flashCardData.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <BookOpen className="h-16 w-16 text-muted-foreground" />
                <h2 className="text-2xl font-semibold">No Flashcards Yet</h2>
                <p className="text-muted-foreground text-center max-w-md">
                    Add your hard words to the database first to start learning with flashcards.
                </p>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8 space-y-6">
            <div className="flex flex-col space-y-4">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold">Flashcard Sets</h1>
                    <HoverCard>
                        <HoverCardTrigger asChild>
                            <Button variant="outline" className="space-x-2">
                                <Brain className="h-4 w-4" />
                                <span>{srsStats?.dueWords} words due</span>
                            </Button>
                        </HoverCardTrigger>
                        <HoverCardContent className="w-80">
                            <div className="space-y-2">
                                <h4 className="font-semibold">SRS Statistics</h4>
                                <div className="grid grid-cols-2 gap-2">
                                    <div>Total Words:</div>
                                    <div>{srsStats.totalWords}</div>
                                    <div>In SRS:</div>
                                    <div>{srsStats.wordsWithSRS}</div>
                                    <div>Mastered:</div>
                                    <div>{srsStats.masteredWords}</div>
                                </div>
                            </div>
                        </HoverCardContent>
                    </HoverCard>
                </div>
                <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 md:items-center">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by title or word..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                    <Select value={sort} onValueChange={setSort}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Sort by..." />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="title-asc">Title A-Z</SelectItem>
                            <SelectItem value="title-desc">Title Z-A</SelectItem>
                            <SelectItem value="words-asc">Words: Low to High</SelectItem>
                            <SelectItem value="words-desc">Words: High to Low</SelectItem>
                            <SelectItem value="due-asc">Due: Low to High</SelectItem>
                            <SelectItem value="due-desc">Due: High to Low</SelectItem>
                        </SelectContent>
                    </Select>
                    <Tabs value={filter} onValueChange={setFilter} className="sm:w-[500px] w-[310px]">
                        <TabsList className="grid w-full grid-cols-5">
                            <TabsTrigger value="all">All</TabsTrigger>
                            <TabsTrigger value="due">Due</TabsTrigger>
                            <TabsTrigger value="not-started">New</TabsTrigger>
                            <TabsTrigger value="in-progress">Learning</TabsTrigger>
                            <TabsTrigger value="completed">Mastered</TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>
            </div>

            <AnimatePresence>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredAndSortedSubtitles.map(([subtitleTitle, data], index) => {
                        const dueWords = getDueWordsCount(data);
                        const totalWords = data.reduce((acc, s) => acc + (s.hardWords?.length || 0), 0);
                        const masteredWords = data.reduce((acc, s) =>
                            acc + (s.hardWords?.filter(w => w.srs?.interval || 0 >= 30)?.length || 0), 0);

                        return (
                            <motion.div
                                key={subtitleTitle}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                            >
                                <Card className="h-full flex flex-col">
                                    <CardHeader>
                                        <div className="flex justify-between items-start">
                                            <CardTitle className="text-xl">{subtitleTitle}</CardTitle>
                                            <div className="flex space-x-2">
                                                {dueWords > 0 && (
                                                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                                                        {dueWords} due
                                                    </Badge>
                                                )}
                                                <Badge variant={masteredWords === totalWords ? "default" : "secondary"}>
                                                    {Math.round((masteredWords / totalWords) * 100)}%
                                                </Badge>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="flex-grow">
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-2">
                                                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                                                    <span>{totalWords} words</span>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <Trophy className="h-4 w-4 text-muted-foreground" />
                                                    <span>{masteredWords} mastered</span>
                                                </div>
                                            </div>
                                            <Progress value={(masteredWords / totalWords) * 100} className="h-2" />
                                            <div className="h-[200px] overflow-y-auto space-y-2">
                                                {data.map((subtitle) =>
                                                    subtitle.hardWords?.map((word, idx) => {
                                                        const isDue = !word.srs || new Date(word.srs.dueDate) <= new Date();
                                                        const isMastered = word.srs?.interval || 0 >= 30;

                                                        return (
                                                            <div
                                                                key={idx}
                                                                className="p-2 rounded-md bg-muted/50 flex justify-between items-center"
                                                            >
                                                                <div>
                                                                    <span className="font-medium">{word.word}</span>
                                                                    <span className="text-muted-foreground"> → </span>
                                                                    <span>{word.translation}</span>
                                                                </div>
                                                                <div className="flex space-x-2">
                                                                    {isDue && (
                                                                        <Clock className="h-4 w-4 text-yellow-500" />
                                                                    )}
                                                                    {isMastered && (
                                                                        <Trophy className="h-4 w-4 text-green-500" />
                                                                    )}
                                                                </div>
                                                            </div>
                                                        );
                                                    })
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="border-t pt-4">
                                        <div className="flex justify-between items-center w-full">
                                            <DeleteSubtitle SubtitleId={data[0].SubtitleId!} />
                                            <Link href="/home/flashcards/learn">
                                                <Button
                                                    variant="default"
                                                    onClick={() => handleLearnButtonClick(data[0].SubtitleId!)}
                                                    className="space-x-2"
                                                >
                                                    <BookOpen className="h-4 w-4" />
                                                    <span>Learn</span>
                                                </Button>
                                            </Link>
                                        </div>
                                    </CardFooter>
                                </Card>
                            </motion.div>
                        );
                    })}
                </div>
            </AnimatePresence>
        </div>
    );
}