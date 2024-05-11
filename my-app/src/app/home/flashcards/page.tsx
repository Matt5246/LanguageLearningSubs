'use client'
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useSelector, useDispatch } from 'react-redux';
import { setSelectedSubtitle } from '@/lib/features/subtitles/subtitleSlice';
import { selectFlashCardData } from '@/lib/features/subtitles/subtitleSlice';
import { redirect } from "next/navigation";
import Link from "next/link";

const Home = () => {
    const dispatch = useDispatch();
    const flashCardData: any[] = useSelector(selectFlashCardData);
    console.log(flashCardData)
    const groupedSubtitles = flashCardData.reduce((acc, flashCardData) => {
        if (!acc[flashCardData.subtitleTitle]) {
            acc[flashCardData.subtitleTitle] = [];
        }
        acc[flashCardData.subtitleTitle].push(flashCardData);
        return acc;
    }, {});

    function handleLearnButtonClick(SubtitleId: string) {
        dispatch(setSelectedSubtitle(SubtitleId));
        redirect('/home/flashcards/learn');
    };

    return (
        <div className="flex justify-center mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {Object.keys(groupedSubtitles)?.length > 0 ? (
                    Object.entries(groupedSubtitles).map(([subtitleTitle, data]: [any, any]) => (
                        (data as any).some((subtitle: any) => subtitle.hardWords.length > 0) && (
                            <Card className="m-3" key={subtitleTitle}>
                                <CardHeader>
                                    <CardTitle className="text-xl">{subtitleTitle}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p>Word count: {(data as any).reduce((acc: number, subtitle: any) => acc + subtitle.hardWords.length, 0)}</p>
                                    {(data as any[]).map((subtitle: any, index: number) => (
                                        <div key={index}>
                                            {subtitle.hardWords.map((hardWord: any, index: number) => (
                                                <p key={index}>
                                                    {hardWord.word} <a className="text-gray-500">{'->'}</a> {hardWord.translation}  {hardWord.learnState === 100 && <a className="text-green-500">✓</a>}
                                                </p>
                                            ))}
                                        </div>
                                    ))}
                                </CardContent>
                                <CardFooter>
                                    <Button variant="secondary" onClick={() => handleLearnButtonClick(data[0].SubtitleId as string)}>
                                        <Link href='/home/flashcards/learn'>Learn</Link>
                                    </Button>
                                </CardFooter>
                            </Card>
                        )
                    ))
                ) : (
                    <p className="mt-12 text-center text-gray-500">
                        Add your hard words to the database first to use this component.
                    </p>
                )}
            </div>
        </div>
    );
};

export default Home;
