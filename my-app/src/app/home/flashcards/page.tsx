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
        <>

            <div className="flex items-center justify-center">

                {data?.userHardWords?.length > 0 ? (<>
                    <Card className="w-[350px] mt-60">
                        <CardHeader>
                            <CardTitle>{currentSubtitle?.Subtitle?.subtitleTitle}</CardTitle>

                        </CardHeader>
                        <CardContent>
                            <div className="grid w-full items-center gap-4">
                                <div className="flex flex-col space-y-1.5">
                                    <CardDescription>Word</CardDescription>
                                    <CardTitle>
                                        {currentSubtitle?.word}
                                    </CardTitle>
                                </div>
                                <div className="flex flex-col space-y-1.5">
                                    <CardDescription>Translation</CardDescription>
                                    <CardTitle>{currentSubtitle?.translation}</CardTitle>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                            <Button variant="secondary" onClick={handlePreviousWord}>Previous</Button>
                            <Button variant="outline" onClick={handleNextWord}>Next</Button>
                        </CardFooter>
                    </Card>
                </>
                ) : (
                    <div className="mt-12 text-center text-gray-500">Add your hard words to the database first, to use this component.</div>
                )}
            </div>
        </>
    );
}
