'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setSelectedSubtitle } from '@/lib/features/subtitles/subtitleSlice';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion, AnimatePresence } from 'framer-motion';
import { PlayCircle, Book, AlignLeft, Calendar, ExternalLink } from 'lucide-react';


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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-5">
            <AnimatePresence>
                {Object.entries(groupedSubtitles).map(([title, subtitles]) => (
                    <motion.div
                        key={title}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3 }}

                        whileHover={{ scale: 1.06 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <Card className="overflow-hidden h-full shadow-lg hover:shadow-xl transition-shadow duration-300 w-[250px] cursor-pointer"
                            onClick={() => {
                                if (subtitles.length === 1 || subtitles.length === 0) {
                                    dispatch(setSelectedSubtitle(subtitles[0]?.SubtitleId || null));
                                }
                            }}
                        >
                            <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6">
                                <CardTitle className="text-2xl font-bold truncate">{title}</CardTitle>
                                <Badge variant="secondary" className="mt-2">
                                    {subtitles.length} episode{subtitles.length > 1 ? 's' : ''}
                                </Badge>
                            </CardHeader>

                            <CardContent className="px-6 py-2">
                                <ScrollArea className="h-[250px] pr-4">
                                    {subtitles.map((subtitle) => (
                                        <motion.div
                                            key={subtitle.SubtitleId}
                                        >
                                            <Card
                                                className="mb-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
                                                onClick={() => dispatch(setSelectedSubtitle(subtitle?.SubtitleId || null))}
                                            >
                                                <CardContent className="p-4 space-y-2">
                                                    {subtitle?.episode && (
                                                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                                            <PlayCircle className="w-4 h-4 mr-2" />
                                                            Episode: {subtitle?.episode}
                                                        </div>
                                                    )}
                                                    {subtitle?.subtitleData && (
                                                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                                            <AlignLeft className="w-4 h-4 mr-2" />
                                                            Subtitle Rows: {subtitle.subtitleData.length}
                                                        </div>
                                                    )}
                                                    {subtitle?.hardWords && (
                                                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                                            <Book className="w-4 h-4 mr-2" />
                                                            Hard Words: {subtitle.hardWords.length}
                                                        </div>
                                                    )}
                                                    {subtitle?.createdAt && (
                                                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                                            <Calendar className="w-4 h-4 mr-2" />
                                                            Created: {new Date(subtitle.createdAt).toLocaleDateString()}
                                                        </div>
                                                    )}
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    ))}
                                </ScrollArea>
                            </CardContent>

                            {subtitles.some((subtitle) => subtitle.youtubeUrl) ? (
                                <CardFooter className="bg-gray-50 dark:bg-gray-800 p-4">
                                    {subtitles.map(
                                        (subtitle) =>
                                            subtitle.youtubeUrl && (
                                                <Button
                                                    key={subtitle.SubtitleId}
                                                    variant="outline"
                                                    className="w-full"
                                                    asChild
                                                >
                                                    <a
                                                        href={subtitle.youtubeUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center justify-center"
                                                    >
                                                        <ExternalLink className="w-4 h-4 mr-2" />
                                                        Watch on YouTube
                                                    </a>
                                                </Button>
                                            )
                                    )}
                                </CardFooter>
                            ) : null}
                        </Card>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}

export default SubtitleCards;