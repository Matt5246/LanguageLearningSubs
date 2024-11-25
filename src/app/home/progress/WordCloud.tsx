import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

interface Word {
    word: string;
    translation: string;
    count: number;
}

const words: Word[] = [
    { word: "the", translation: "le", count: 100 },
    { word: "and", translation: "et", count: 90 },
    { word: "you", translation: "vous", count: 80 },
    { word: "to", translation: "à", count: 70 },
    { word: "a", translation: "un", count: 60 },
    { word: "it", translation: "il", count: 50 },
    { word: "of", translation: "de", count: 40 },
    { word: "that", translation: "que", count: 30 },
    { word: "in", translation: "dans", count: 20 },
    { word: "is", translation: "est", count: 10 },
];



export default function WordCloud(hardWords: any[]) {
    const { toast } = useToast();

    console.log(hardWords);
    const hardWordCounts = hardWords.words.reduce((acc: { [key: string]: number }, wordObj: any) => {
        const word = wordObj.word;
        if (acc[word]) {
            acc[word]++;
        } else {
            acc[word] = 1;
        }
        return acc;
    }, {});

    const hardWordsArray = Object.keys(hardWordCounts).map(word => ({
        word,
        translation: hardWords.words.find((w: any) => w.word === word).translation,
        count: hardWordCounts[word],
    }));

    console.log(hardWordsArray);
    const sortedWords = hardWordsArray.sort((a, b) => b.count - a.count);

    return (
        <Card className="col-span-4 md:col-span-2">
            <CardHeader>
                <CardTitle>Most Common Words</CardTitle>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[400px]">
                    <div className="flex flex-wrap gap-2">
                        {sortedWords.map((word, index) => (
                            <Badge
                                key={index}
                                variant={index < 40 ? "default" : "secondary"}
                                className="cursor-help"
                                title={word.translation}
                            >
                                {word.word} ({word.count})
                            </Badge>
                        ))}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    );
}