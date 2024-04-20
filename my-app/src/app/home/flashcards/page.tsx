"use client"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import axios from 'axios';
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";

export default function Home() {
    const session = useSession();
    const userEmail = session?.data?.user?.email
    const [subtitles, setSubtitles] = useState<any[]>([]);
    const [currentWordIndex, setCurrentWordIndex] = useState(0); // Track the current word index
    const currentSubtitle = subtitles ? subtitles[currentWordIndex] : null;

    const { data, error, isLoading } = useQuery({
        queryKey: ['subtitles', userEmail],
        queryFn: async () => {
            const response = await axios.post('/api/hardWords/get', { email: userEmail });
            setSubtitles(response?.data?.userHardWords)
            return response?.data;
        },
        enabled: !!userEmail,
        retry: false,
    })

    const handleNextWord = () => {
        setCurrentWordIndex((prevIndex) => (prevIndex + 1) % (data?.userHardWords.length || 0));
    };

    const handlePreviousWord = () => {
        setCurrentWordIndex((prevIndex) => (prevIndex - 1 + (data?.userHardWords.length || 0)) % (data?.userHardWords.length || 0));
    };
    console.log(currentSubtitle)
    return (
        <div className="flex items-center justify-center h-screen">
            <div className="flex flex-col items-center">
                {data?.userHardWords?.length > 0 ? (
                    <Card className="min-w-[350px] w-[550px] m-3">
                        <CardHeader>
                            <CardTitle className="text-xl">{currentSubtitle?.Subtitle?.subtitleTitle}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid w-full items-center gap-4">
                                <div className="flex flex-col space-y-1.5">
                                    <CardDescription>Word</CardDescription>
                                    <CardTitle>{currentSubtitle?.word}</CardTitle>
                                </div>
                                <div className="flex flex-col space-y-1.5">
                                    {currentSubtitle?.translation ? (
                                        <>
                                            <CardDescription>Translation</CardDescription>
                                            <CardTitle>{currentSubtitle?.translation}</CardTitle>
                                        </>
                                    ) : null}
                                    {currentSubtitle?.sentences.map((data: any) => (
                                        <>
                                            <CardDescription>Sentence</CardDescription>
                                            {data?.sentence}
                                            <CardDescription>Sentence Translation</CardDescription>
                                            {data?.translation}
                                        </>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                            <Button variant="secondary" onClick={handlePreviousWord}>
                                Previous
                            </Button>
                            <Button variant="outline" onClick={handleNextWord}>
                                Next
                            </Button>
                        </CardFooter>
                    </Card>
                ) : (
                    <div className="mt-12 text-center text-gray-500">
                        Add your hard words to the database first to use this component.
                    </div>
                )}
            </div>
        </div>
    );
}
