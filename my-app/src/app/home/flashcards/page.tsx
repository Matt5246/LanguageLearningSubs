'use client';
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useSelector, useDispatch } from 'react-redux';
import { setSelectedSubtitle } from '@/lib/features/subtitles/subtitleSlice';
import { selectFlashCardData } from '@/lib/features/subtitles/subtitleSlice';
import { redirect } from "next/navigation";
import Link from "next/link";
import { motion } from 'framer-motion';
import DeleteSubtitle from '@/app/home/subtitles/DeleteSubtitles'
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
    if (!flashCardData) return <>none</>;
    return (
        <div className="flex justify-center mt-6 mx-5">
            {Object.keys(groupedSubtitles).length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {Object.entries(groupedSubtitles).map(([subtitleTitle, data], index) => (
                        data.some(subtitle => subtitle.hardWords!.length > 0) && (
                            <motion.div
                                key={subtitleTitle}
                                className="flex flex-col"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                <Card className="m-3 transition-transform transform group hover:scale-105 hover:shadow-lg min-h-[450px]">
                                    <CardHeader>
                                        <CardTitle className="text-xl">{subtitleTitle}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="flex-grow ">
                                        <p className='pb-3'>Word count: {data.reduce((acc, subtitle) => acc + subtitle.hardWords!.length, 0)}</p>
                                        <p className={`space-y-2 ${data.reduce((acc, subtitle) => acc + subtitle.hardWords!.length, 0) > 10 ? 'h-[250px] overflow-y-auto' : ''}`}>
                                            {data.map((subtitle, index) => (
                                                <p key={index}>
                                                    {subtitle.hardWords!.map((hardWord, idx) => (
                                                        <p key={idx}>
                                                            {hardWord.word} <a className="text-gray-500">{'->'}</a> {hardWord.translation} {hardWord.learnState === 100 && <a className="text-green-500">✓</a>}
                                                        </p>
                                                    ))}
                                                </p>
                                            ))}
                                        </p>
                                    </CardContent>
                                    <CardFooter className="flex w-full justify-between fixed bottom-0 left-0">
                                        <DeleteSubtitle SubtitleId={data[0].SubtitleId!} />
                                        <Link href='/home/flashcards/learn'>
                                            <Button variant="secondary" onClick={() => handleLearnButtonClick(data[0].SubtitleId!)}>
                                                Learn
                                            </Button>
                                        </Link>
                                    </CardFooter>
                                </Card>
                            </motion.div>
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
