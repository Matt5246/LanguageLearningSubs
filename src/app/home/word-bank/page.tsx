'use client'

import { useSelector } from 'react-redux'
import { useState, useEffect } from 'react'
import { selectFlashCardData } from '@/lib/features/subtitles/subtitleSlice'
import { Spinner } from '@/components/ui/spinner'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent } from "@/components/ui/card"
import { Search, BookOpen, ChevronUp, ZoomIn, ZoomOut, ArrowUpCircle, Circle, Tag, Repeat } from 'lucide-react'
import { motion, AnimatePresence } from "framer-motion"
import { Drawer } from '@/components/ui/drawer'
import { Dialog } from '@/components/ui/dialog'
import OptionsDialog from './OptionsDialog'
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'

interface Subtitle {
    hardWords: Word[];
}

interface Word {
    repetitions: number;
    pos: string;
    createdAt: Date;
    dueDate: Date;
    learnedAt: Date | null;
    id: string;
    word: string;
    translation: string;
}

const FONT_SIZES = {
    small: 'text-base',
    medium: 'text-lg',
    large: 'text-xl',
    extraLarge: 'text-2xl',
    extraExtraLarge: 'text-3xl'
}


const Home: React.FC = () => {
    const flashCardData: Subtitle[] = useSelector(selectFlashCardData) || [];
    const [isLoaded, setIsLoaded] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [fontSize, setFontSize] = useState<keyof typeof FONT_SIZES>('medium');
    const [showScrollTop, setShowScrollTop] = useState(false);
    const [selectedLetter, setSelectedLetter] = useState<string | null>(null);

    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 200);
        };
        window.addEventListener('scroll', handleScroll);
        setIsLoaded(true);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    if (!isLoaded || !flashCardData.length) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Spinner className="w-8 h-8" />
            </div>
        );
    }

    const sortedHardWords: Word[] = flashCardData
        .flatMap(data => data.hardWords)
        .filter(word => word && word.word)
        .sort((a, b) => a.word.localeCompare(b.word));

    const groupedWords: { [key: string]: Word[] } = sortedHardWords.reduce((acc, word) => {
        const firstLetter = word.word.charAt(0).toUpperCase();
        if (!acc[firstLetter]) {
            acc[firstLetter] = [];
        }
        acc[firstLetter].push(word);
        return acc;
    }, {} as { [key: string]: Word[] });
    
    const filteredGroups = Object.entries(groupedWords).reduce((acc, [letter, words]) => {
        const filtered = words.filter(word => {
            const wordText = word.word || "";
            const translationText = word.translation || "";
            const pos = word.pos || "";
            const repetitions = word.repetitions || 0;
            return (
                wordText.toLowerCase().includes(searchTerm.toLowerCase()) ||
                translationText.toLowerCase().includes(searchTerm.toLowerCase()) ||
                pos.toLowerCase().includes(searchTerm.toLowerCase()) ||
                repetitions.toString().includes(searchTerm.toLowerCase())
            );
        });

        if (filtered.length) acc[letter] = filtered;
        return acc;
    }, {} as { [key: string]: Word[] });

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const scrollToLetter = (letter: string) => {
        const element = document.getElementById(`section-${letter}`);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            setSelectedLetter(letter);
            setTimeout(() => setSelectedLetter(null), 1500);
        }
    };

    const fontSizeOptions = Object.keys(FONT_SIZES) as Array<keyof typeof FONT_SIZES>;

    const increaseFontSize = () => {
        const currentIndex = fontSizeOptions.indexOf(fontSize);
        if (currentIndex < fontSizeOptions.length - 1) {
            setFontSize(fontSizeOptions[currentIndex + 1]);
        }
    };

    const decreaseFontSize = () => {
        const currentIndex = fontSizeOptions.indexOf(fontSize);
        if (currentIndex > 0) {
            setFontSize(fontSizeOptions[currentIndex - 1]);
        }
    };

    return (
        <div className="bg-background min-h-screen">
            <header className="sticky top-0 z-10 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-14 items-center">
                    <div className="flex items-center space-x-4">
                        <BookOpen className="h-6 w-6" />
                        <h1 className="text-xl font-bold">Dictionary</h1>
                    </div>
                    <div className="flex flex-1 items-center space-x-4 justify-end">
                        <div className="w-full max-w-sm">
                            <div className="relative">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search words..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value || "")}
                                    className="pl-8"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </header>
            <main className="container pt-6 px-8 h-full flex flex-col">
                <div className="flex justify-between items-center mb-6">
                    <p className="text-muted-foreground">
                        {Object.values(filteredGroups).flat().length} words found
                    </p>
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={decreaseFontSize}
                        >
                            <ZoomOut className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={increaseFontSize}
                        >
                            <ZoomIn className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-[auto,1fr] gap-6 flex-grow">
                    <div className="hidden md:block sticky top-20 space-y-2">
                        <Card className="p-2 w-[60px]">
                            {Object.keys(groupedWords).map(letter => (
                                <Button
                                    key={letter}
                                    variant={selectedLetter === letter ? "secondary" : "ghost"}
                                    className="w-full justify-start"
                                    onClick={() => scrollToLetter(letter)}
                                >
                                    {letter}
                                </Button>
                            ))}
                        </Card>
                    </div>
                    <ScrollArea className="h-[calc(100vh-10rem)]">
                        <Dialog>
                            <AnimatePresence>
                                {Object.entries(filteredGroups).map(([letter, words]) => (
                                    <motion.div
                                        key={letter}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        className="mb-8"
                                        id={`section-${letter}`}
                                    >
                                        <div className="sticky top-0 bg-background/95 backdrop-blur py-2 z-9">
                                            <h2 className="text-2xl font-bold flex items-center">
                                                {letter}
                                                <Separator className="ml-4 flex-1" />
                                            </h2>
                                        </div>
                                        {words.map((word, index) => (
                                            <motion.div
                                                key={word.word}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: index * 0.05 }}
                                                className={`group p-2 rounded-lg transition-all duration-200 ${FONT_SIZES[fontSize]}`}
                                            >
                                                <Card className="overflow-hidden transition-all duration-200 hover:shadow-md hover:scale-[1.02] sm:w-[98%] mx-auto">
                                                    <CardContent className="p-4">
                                                        <div className="flex justify-between items-start">
                                                            <div className="space-y-1">
                                                                <p className="font-semibold ">
                                                                    {word.word}
                                                                </p>
                                                                <p className="text-muted-foreground">
                                                                    {word.translation}
                                                                </p>
                                                                <div className="flex items-center space-x-2">
                                                                    {word.pos && (
                                                                        <Badge>
                                                                            <Tag className="w-3 h-3 mr-1" />
                                                                            {word.pos}
                                                                        </Badge>
                                                                    )}
                                                                    <Badge variant="outline" className="cursor-help">
                                                                        <Repeat className="w-3 h-3 mr-1" />
                                                                        {word.repetitions || 0}
                                                                    </Badge>
                                                                </div>
                                                            </div>
                                                            <OptionsDialog word={word} />
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </motion.div>
                                        ))}
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </Dialog>
                    </ScrollArea>
                </div>
            </main>
            <AnimatePresence>
                {showScrollTop && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="fixed bottom-6 right-6"
                    >
                        <Button
                            size="icon"
                            className="rounded-full h-12 w-12"
                            onClick={scrollToTop}
                        >
                            <ChevronUp className="h-6 w-6" />
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Home;