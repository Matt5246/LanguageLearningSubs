'use client'
import DeleteSubtitle from '@/app/home/subtitles/DeleteSubtitles';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Spinner } from '@/components/ui/spinner';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { selectFlashCardData, selectSRSStats, selectSRSFlashcards, setSelectedSubtitle } from '@/lib/features/subtitles/subtitleSlice';
import { getDueDate } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { BookOpen, Brain, Clock, Search, Trophy, Timer, Star } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import WordChart from './WordChart';

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
        repetitions: number;
        dueDate: string;
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
            new Date(w.dueDate) <= now
        ).length || 0), 0);
}

function getProgressPercentage(subtitles: Subtitle[], level: number): number {
    const totalWords = subtitles.reduce((acc, s) => acc + (s.hardWords?.length || 0), 0);
    const masteredWords = subtitles.reduce((acc, s) =>
        acc + (s.hardWords?.filter(w => w?.repetitions >= level)?.length || 0), 0);
    return totalWords ? (masteredWords / totalWords) * 100 : 0;
}

export default function FlashcardPage() {
    const dispatch = useDispatch();
    const [isLoaded, setIsLoaded] = useState(false);
    const flashCardData = useSelector(selectFlashCardData) as Subtitle[];
    const srsStats = useSelector(selectSRSStats);

    const [search, setSearch] = useState('');
    const [sort, setSort] = useState('due-desc');
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
                const progress = getProgressPercentage(data, 3);
                const dueWords = getDueWordsCount(data);

                if (filter === 'not-started') return progress === 0 && hasWords;
                if (filter === 'in-progress') return progress > 0 && progress < 100 && hasWords;
                if (filter === 'completed') return getProgressPercentage(data, 5) === 100 && hasWords;
                if (filter === 'due') return dueWords > 0;
                return hasWords && matchesSearch;
            })
            .sort(sortOptions[sort as keyof typeof sortOptions]);
    }, [groupedSubtitles, search, sort, filter]);
    const totalWords = useMemo(() => {
        return filteredAndSortedSubtitles.reduce((acc, [_, subtitles]) =>
            acc + subtitles.reduce((subAcc, subtitle) => subAcc + (subtitle.hardWords?.length || 0), 0)
            , 0);
    }, [filteredAndSortedSubtitles]);
    const handleLearnButtonClick = (SubtitleId: string) => {
        dispatch(setSelectedSubtitle(SubtitleId));
    };


    if (!isLoaded) {
        return (
            <h1 className="text-2xl font-bold mt-9 ml-9">Flash cards <Spinner /></h1>
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
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <div className="font-medium">Total Words:</div>
                                        <div>{srsStats.totalWords}</div>
                                    </div>
                                    <div className="flex justify-between">
                                        <div className="font-medium">Learning:</div>
                                        <div>{srsStats.wordsWithSRS}</div>
                                    </div>
                                    <div className="flex justify-between">
                                        <div className="font-medium">Mastered:</div>
                                        <div>{srsStats.masteredWords}</div>
                                    </div>
                                    <div className="mt-2">
                                        <div className="flex items-center space-x-2">
                                            <Clock className='h-4 w-4 text-blue-500' />
                                            <span>not ready for review</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Clock className='h-4 w-4 text-orange-500' />
                                            <span>not ready for review (high priority)</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Star className='h-4 w-4 text-yellow-500' />
                                        <span>Due for review</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Star className='h-4 w-4 text-orange-500' />
                                        <span>Due for review (high priority)</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Trophy className="h-4 w-4 text-green-500" />
                                        <span>Mastered</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <BookOpen className="h-4 w-4 text-blue-500" />
                                        <span>Not studied yet (new)</span>
                                    </div>
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
                {filteredAndSortedSubtitles.length === 0 && (
                    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                        <BookOpen className="h-16 w-16 text-muted-foreground" />
                        <h2 className="text-2xl font-semibold">No Flashcards Found</h2>
                        <p className="text-muted-foreground text-center max-w-md">
                            Try changing your search query or filter options.
                        </p>
                    </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

                    <WordChart data={filteredAndSortedSubtitles} totalWords={totalWords} />
                    {filteredAndSortedSubtitles.map(([subtitleTitle, data], index) => {
                        const dueWords = getDueWordsCount(data);
                        const totalWords = data.reduce((acc, s) => acc + (s.hardWords?.length || 0), 0);
                        const masteredWords = data.reduce((acc, s) => acc + (s.hardWords?.filter(w => w?.repetitions > 4)?.length || 0), 0);

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
                                            <CardTitle className="text-xl truncate">{subtitleTitle}</CardTitle>
                                            <div className="flex space-x-2">
                                                {dueWords > 0 && (
                                                    <Badge variant="default" className="bg-yellow-100 text-yellow-800 whitespace-nowrap">
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
                                                        const now = new Date();
                                                        const dueDate = word?.dueDate ? new Date(word.dueDate) : null;
                                                        const isWaitingForReview = dueDate && dueDate > now;
                                                        const isDue = dueDate && dueDate <= now;
                                                        const isNotStudied = !word || !word.repetitions || word.repetitions === 0;
                                                        const isMastered = word?.repetitions > 4;

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
                                                                    <HoverCard>
                                                                        <HoverCardTrigger>
                                                                            {isWaitingForReview && (<Clock className={`h-4 w-4 ${word?.repetitions < 3 ? 'text-blue-500' : 'text-orange-500'}`} />)}
                                                                            {isDue && (<Star className={`h-4 w-4 ${word?.repetitions < 3 ? 'text-yellow-500' : 'text-orange-500'}`} />)}
                                                                            {isMastered && (<Trophy className="h-4 w-4 text-green-500" />)}
                                                                            {isNotStudied && (<BookOpen className="h-4 w-4 text-blue-500" />)}
                                                                        </HoverCardTrigger>
                                                                        <HoverCardContent className="w-auto p-2 text-sm">
                                                                            {word?.repetitions && (
                                                                                <div>Repetitions: {word.repetitions}</div>
                                                                            )}
                                                                            {word?.dueDate && <p className='text-xs'>{getDueDate(word.dueDate)}</p>}
                                                                        </HoverCardContent>
                                                                    </HoverCard>
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