'use client'
import React, { useEffect, useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import Link from "next/link";
import { Search, SortAsc, SortDesc, Filter, BookOpen, Trophy, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { setSelectedSubtitle, selectFlashCardData } from '@/lib/features/subtitles/subtitleSlice';
import DeleteSubtitle from '@/app/home/subtitles/DeleteSubtitles';
import { Spinner } from '@/components/ui/spinner'

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
        lastReviewed?: string;
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
    'progress-asc': (a: [string, Subtitle[]], b: [string, Subtitle[]]) =>
        getProgressPercentage(a[1]) - getProgressPercentage(b[1]),
    'progress-desc': (a: [string, Subtitle[]], b: [string, Subtitle[]]) =>
        getProgressPercentage(b[1]) - getProgressPercentage(a[1]),
};

function getProgressPercentage(subtitles: Subtitle[]): number {
    const totalWords = subtitles.reduce((acc, s) => acc + (s.hardWords?.length || 0), 0);
    const learnedWords = subtitles.reduce((acc, s) =>
        acc + (s.hardWords?.filter(w => w.learnState === 100)?.length || 0), 0);
    return totalWords ? (learnedWords / totalWords) * 100 : 0;
}

export default function FlashcardPage() {
    const dispatch = useDispatch();
    const [isLoaded, setIsLoaded] = useState(false);
    const flashCardData = useSelector(selectFlashCardData) as Subtitle[];
    const [search, setSearch] = useState('');
    const [sort, setSort] = useState('title-asc');
    const [filter, setFilter] = useState('all');
    const [groupedSubtitles, setGroupedSubtitles] = useState<GroupedSubtitles>({});

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

                if (filter === 'not-started') return progress === 0 && hasWords;
                if (filter === 'in-progress') return progress > 0 && progress < 100 && hasWords;
                if (filter === 'completed') return progress === 100 && hasWords;
                return hasWords && matchesSearch;
            })
            .sort(sortOptions[sort as keyof typeof sortOptions]);
    }, [groupedSubtitles, search, sort, filter]);

    const handleLearnButtonClick = (SubtitleId: string) => {
        dispatch(setSelectedSubtitle(SubtitleId));
    };
    if (!isLoaded || !flashCardData.length) {
        return (
            <h1 className="text-2xl font-bold mt-9 ml-9">Flash cards
                <Spinner />
            </h1>
        );
    } else if (!flashCardData || flashCardData.length === 0) {
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
            <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 md:items-center">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by title or word..."
                        disabled={!flashCardData.length}
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
                        <SelectItem value="progress-asc">Progress: Low to High</SelectItem>
                        <SelectItem value="progress-desc">Progress: High to Low</SelectItem>
                    </SelectContent>
                </Select>
                <Tabs value={filter} onValueChange={setFilter} className="sm:w-[400px] w-[310px]">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="all">All</TabsTrigger>
                        <TabsTrigger value="not-started">Not Started</TabsTrigger>
                        <TabsTrigger value="in-progress">In Progress</TabsTrigger>
                        <TabsTrigger value="completed">Completed</TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>

            <AnimatePresence>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredAndSortedSubtitles.map(([subtitleTitle, data], index) => (
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
                                        <Badge variant={getProgressPercentage(data) === 100 ? "default" : "secondary"}>
                                            {Math.round(getProgressPercentage(data))}%
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="flex-grow">
                                    <div className="space-y-4">
                                        <div className="flex items-center space-x-2">
                                            <BookOpen className="h-4 w-4 text-muted-foreground" />
                                            <span>{data.reduce((acc, s) => acc + (s.hardWords?.length || 0), 0)} words</span>
                                        </div>
                                        <Progress value={getProgressPercentage(data)} className="h-2" />
                                        <div className="h-[200px] overflow-y-auto space-y-2">
                                            {data.map((subtitle) =>
                                                subtitle.hardWords?.map((word, idx) => (
                                                    <div
                                                        key={idx}
                                                        className="p-2 rounded-md bg-muted/50 flex justify-between items-center"
                                                    >
                                                        <div>
                                                            <span className="font-medium">{word.word}</span>
                                                            <span className="text-muted-foreground"> → </span>
                                                            <span>{word.translation}</span>
                                                        </div>
                                                        {word.learnState === 100 && (
                                                            <Trophy className="h-4 w-4 text-green-500" />
                                                        )}
                                                    </div>
                                                ))
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
                    ))}
                </div>
            </AnimatePresence>
        </div>
    );
}



