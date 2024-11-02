'use client'
import { useState, useRef, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SubtitlesState } from "@/lib/features/subtitles/subtitleSlice";
import { BookOpen, Film, History, Trophy } from "lucide-react";

interface HardWordHistoryItem {
    type: "hardWord";
    word: string | undefined;
    translation: string | undefined;
    learnState: number | undefined;
    createdAt: Date;
}

interface SubtitleHistoryItem {
    type: "subtitle";
    subtitleTitle: string | undefined;
    createdAt: Date;
}

type HistoryItem = HardWordHistoryItem | SubtitleHistoryItem;

export default function HistoryList() {
    const subtitlesData = useSelector(
        (state: { subtitle: SubtitlesState }) => state.subtitle.subtitles
    );
    const [activeTab, setActiveTab] = useState("all");
    const [visibleCount, setVisibleCount] = useState(15);

    const historyData: HistoryItem[] = subtitlesData.flatMap((subtitle) => {
        const hardWordsItems: HardWordHistoryItem[] = subtitle.hardWords?.map((hardWord) => ({
            type: "hardWord",
            word: hardWord.word || "",
            translation: hardWord.translation || "",
            learnState: hardWord.learnState || 0,
            createdAt: new Date(hardWord.createdAt!),
        })) || [];

        const subtitleItem: SubtitleHistoryItem = {
            type: "subtitle",
            subtitleTitle: subtitle.subtitleTitle,
            createdAt: new Date(subtitle.createdAt!),
        };

        return [subtitleItem, ...hardWordsItems];
    });

    const filteredHistory = historyData
        .filter(item => {
            if (activeTab === "words") return item.type === "hardWord";
            if (activeTab === "subtitles") return item.type === "subtitle";
            return true;
        })
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    const observerRef = useRef<HTMLDivElement | null>(null);

    const handleObserver = useCallback(
        (entries: IntersectionObserverEntry[]) => {
            const target = entries[0];
            if (target.isIntersecting) {
                setVisibleCount(prev => prev + 10);
            }
        },
        []
    );

    useEffect(() => {
        const observer = new IntersectionObserver(handleObserver, {
            root: null,
            rootMargin: "100px",
            threshold: 0.1,
        });

        if (observerRef.current) {
            observer.observe(observerRef.current);
        }

        return () => observer.disconnect();
    }, [handleObserver]);

    return (
        <Card className="col-span-full m-5">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <History className="h-5 w-5" />
                        <CardTitle>Learning History</CardTitle>
                    </div>
                    <Badge variant="secondary">
                        {filteredHistory.length} items
                    </Badge>
                </div>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="mb-4">
                        <TabsTrigger value="all" className="flex items-center gap-2">
                            <History className="h-4 w-4" />
                            All
                        </TabsTrigger>
                        <TabsTrigger value="words" className="flex items-center gap-2">
                            <BookOpen className="h-4 w-4" />
                            Words
                        </TabsTrigger>
                        <TabsTrigger value="subtitles" className="flex items-center gap-2">
                            <Film className="h-4 w-4" />
                            Subtitles
                        </TabsTrigger>
                    </TabsList>

                    <ScrollArea className="h-[600px]">
                        {filteredHistory.slice(0, visibleCount).map((item, index) => (
                            <div
                                key={`${item.type}-${index}`}
                                className="mb-4 p-4 rounded-lg border bg-card"
                            >
                                {item.type === "hardWord" ? (
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <BookOpen className="h-4 w-4 text-muted-foreground" />
                                            <div>
                                                <span className={`font-medium ${item.learnState === 100
                                                    ? "text-green-500"
                                                    : "text-primary"
                                                    }`}>
                                                    {item.word}
                                                </span>
                                                {item.translation && (
                                                    <span className="text-muted-foreground ml-2">
                                                        ({item.translation})
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        {item.learnState === 100 && (
                                            <Trophy className="h-4 w-4 text-green-500" />
                                        )}
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <Film className="h-4 w-4 text-muted-foreground" />
                                        <div>
                                            <span className="font-medium">{item.subtitleTitle}</span>
                                        </div>
                                    </div>
                                )}
                                <div className="mt-2 text-xs text-muted-foreground">
                                    {item.createdAt.toLocaleString()}
                                </div>
                            </div>
                        ))}
                        <div ref={observerRef} className="h-4" />
                    </ScrollArea>
                </Tabs>
            </CardContent>
        </Card>
    );
}
