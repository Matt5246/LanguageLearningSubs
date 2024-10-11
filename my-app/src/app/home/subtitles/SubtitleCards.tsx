'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setSelectedSubtitle } from '@/lib/features/subtitles/subtitleSlice';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

type GroupedSubtitles = {
    [key: string]: Subtitle[];
};

export function SubtitleCards({ groupedSubtitles }: { groupedSubtitles: GroupedSubtitles }) {
    const dispatch = useDispatch();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;

    return (
        <div className=" columns-sm gap-4 space-y-4 mt-5 ">
            {Object.entries(groupedSubtitles).map(([title, subtitles]) => (
                <Card key={title} className="flex flex-col h-full break-inside-avoid transition-all duration-300 ease-in-out w-[250px]">
                    <CardHeader className="p-4">
                        <CardTitle className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
                            {title}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 flex-1">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                            {subtitles.length} episode{(subtitles.length > 1 ? 's' : '')}
                        </p>
                        <div className="grid grid-cols-1 gap-2">
                            {subtitles.map((subtitle) => (
                                <Card
                                    key={subtitle.SubtitleId}
                                    className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-shadow duration-300 ease-in-out"
                                    onClick={() => dispatch(setSelectedSubtitle(subtitle.SubtitleId!))}
                                >
                                    <CardContent className="p-4 space-y-1">
                                        {subtitle.episode && (
                                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Episode: {subtitle.episode}
                                            </p>
                                        )}
                                        {subtitle.subtitleData && subtitle.subtitleData.length > 0 && (
                                            <>
                                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                    Subtitle Rows:
                                                </p>
                                                <p className="text-lg text-gray-900 dark:text-gray-100">
                                                    {subtitle.subtitleData.length}
                                                </p>
                                            </>
                                        )}
                                        {subtitle.hardWords && subtitle.hardWords.length > 0 && (
                                            <>
                                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                    Hard Words:
                                                </p>
                                                <p className="text-lg text-gray-900 dark:text-gray-100">
                                                    {subtitle.hardWords.length}
                                                </p>
                                            </>
                                        )}
                                        {!subtitle.subtitleData && !subtitle.hardWords && (
                                            <p className="text-sm text-gray-700 dark:text-gray-300">No data</p>
                                        )}
                                        {subtitle.createdAt && (
                                            <>
                                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                    Created At:
                                                </p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    {new Date(subtitle.createdAt).toLocaleDateString()}
                                                </p>
                                            </>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </CardContent>
                    {subtitles.some((subtitle) => subtitle.youtubeUrl) && (
                        <CardFooter className="p-4">
                            <div>
                                {subtitles.map(
                                    (subtitle) =>
                                        subtitle.youtubeUrl && (
                                            <p key={subtitle.SubtitleId} className="text-md">
                                                <a
                                                    href={subtitle.youtubeUrl}
                                                    target="_blank"
                                                    className="text-blue-600 hover:underline dark:text-blue-400"
                                                >
                                                    Watch on YouTube
                                                </a>
                                            </p>
                                        )
                                )}
                            </div>
                        </CardFooter>
                    )}
                </Card>

            ))}
        </div>
    );
}

export default SubtitleCards;
