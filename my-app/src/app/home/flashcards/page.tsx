'use client'
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export default function Home() {
    const Subtitles: Record<string, {
        title: string;
        words: Record<string, {
            title: string;
            translation: string;
            posTag: string;
            progress: number;
        }>;
    }> = {
        English: {
            title: "The kleine hexe",
            words: {
                Hallo: {
                    title: "Greetings",
                    translation: "Hello",
                    posTag: "Greeting",
                    progress: 0,
                },
                Haus: {
                    title: "Nouns",
                    translation: "House",
                    posTag: "Noun",
                    progress: 3,
                },
                Katze: {
                    title: "Nouns",
                    translation: "Cat",
                    posTag: "Noun",
                    progress: 5,
                },
                Buch: {
                    title: "Nouns",
                    translation: "Book",
                    posTag: "Noun",
                    progress: 2,
                },
                gehen: {
                    title: "Verbs",
                    translation: "to go",
                    posTag: "Verb",
                    progress: 0,
                },
                essen: {
                    title: "Verbs",
                    translation: "to eat",
                    posTag: "Verb",
                    progress: 1,
                },
                schön: {
                    title: "Adjectives",
                    translation: "beautiful",
                    posTag: "Adjective",
                    progress: 4,
                },
                lernen: {
                    title: "Verbs",
                    translation: "to learn",
                    posTag: "Verb",
                    progress: 0,
                },
            },
        },
    };

    const words = Object.keys(Subtitles.English.words);
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const currentWord = words[currentWordIndex];

    const handleNextCard = () => {
        setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length);
    };

    return (
        <>
            <div className="flex justify-center mt-6">Example test</div>
            <div className="flex items-center justify-center">
                <Card className="w-[350px] mt-60">
                    <CardHeader>
                        <CardTitle>{Subtitles.English.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid w-full items-center gap-4">
                            <div className="flex flex-col space-y-1.5">
                                <CardDescription>Word</CardDescription>
                                <CardTitle>
                                    <div key={currentWord}>
                                        {currentWord}
                                    </div>
                                </CardTitle>
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <CardDescription>Translation</CardDescription>
                                <CardTitle>{Subtitles.English.words[currentWord].translation}</CardTitle>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <Button variant="outline">Skip</Button>
                        <Button variant="outline" onClick={handleNextCard}>
                            Next
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </>
    );
}
