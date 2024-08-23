'use client'
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useSelector, useDispatch } from 'react-redux';
import { setSelectedSubtitle } from '@/lib/features/subtitles/subtitleSlice';
import { selectFlashCardData } from '@/lib/features/subtitles/subtitleSlice';
import { redirect } from "next/navigation";
import Link from "next/link";

const Home = () => {
    const dispatch = useDispatch();
    const flashCardData = useSelector(selectFlashCardData) as Subtitle[];
    const [groupedSubtitles, setGroupedSubtitles] = useState<GroupedSubtitles>({});

    useEffect(() => {
        const grouped = flashCardData.reduce((acc: GroupedSubtitles, subtitle: Subtitle) => {
            if (!acc[subtitle.subtitleTitle!]) {
                acc[subtitle.subtitleTitle!] = [];
            }
            acc[subtitle.subtitleTitle!].push(subtitle);
            return acc;
        }, {});

        setGroupedSubtitles({ ...groupedSubtitles, ...grouped });
    }, [flashCardData]);

    function handleLearnButtonClick(SubtitleId: string) {
        dispatch(setSelectedSubtitle(SubtitleId));
        redirect('/home/flashcards/learn');
    };

    return (
        <div className="flex justify-center mt-6 mx-5">
            {Object.keys(groupedSubtitles).length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {Object.entries(groupedSubtitles).map(([subtitleTitle, data]) => (
                        data.some(subtitle => subtitle.hardWords!.length > 0) && (
                            <Card className="m-3 flex flex-col " key={subtitleTitle}>
                                <CardHeader>
                                    <CardTitle className="text-xl">{subtitleTitle}</CardTitle>
                                </CardHeader>
                                <CardContent className="flex-grow overflow-auto">
                                    <p className='pb-3'>Word count: {data.reduce((acc, subtitle) => acc + subtitle.hardWords!.length, 0)}</p>
                                    <div className={`space-y-2 ${data.reduce((acc, subtitle) => acc + subtitle.hardWords!.length, 0) > 10 ? 'h-[250px] overflow-y-auto' : ''}`}>
                                        {data.map((subtitle, index) => (
                                            <div key={index}>
                                                {subtitle.hardWords!.map((hardWord, idx) => (
                                                    <p key={idx}>
                                                        {hardWord.word} <a className="text-gray-500">{'->'}</a> {hardWord.translation} {hardWord.learnState === 100 && <a className="text-green-500">✓</a>}
                                                    </p>
                                                ))}
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button variant="secondary" onClick={() => handleLearnButtonClick(data[0].SubtitleId!)}>
                                        <Link href='/home/flashcards/learn'>Learn</Link>
                                    </Button>
                                </CardFooter>
                            </Card>
                        )
                    ))}
                </div>
            ) : (
                <p className="mt-12 text-center text-gray-500">
                    Add your hard words to the database first to use this component.
                </p>
            )}
        </div>
    );
};

export default Home;
