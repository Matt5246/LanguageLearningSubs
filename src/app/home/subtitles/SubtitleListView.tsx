'use client';

import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setSelectedSubtitle } from '@/lib/features/subtitles/subtitleSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronRight, PlayCircle, Book, AlignLeft, Calendar, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';


type GroupedSubtitles = {
    [key: string]: Subtitle[];
};

export function SubtitleListView({ groupedSubtitles }: { groupedSubtitles: GroupedSubtitles }) {
    const dispatch = useDispatch();

    return (
        <ScrollArea className="h-[900px] w-full pr-4">
            <Accordion type="multiple" className="w-full">
                {Object.entries(groupedSubtitles).map(([title, subtitles]) => (
                    <AccordionItem key={title} value={title}>
                        <AccordionTrigger className="hover:no-underline">
                            <div className="flex items-center justify-between w-full">
                                <div className="flex items-center space-x-2">
                                    <ChevronRight className="h-4 w-4" />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 text-lg font-semibold">{title}</span>
                                </div>
                                <Badge variant="secondary">
                                    {subtitles.length} episode{subtitles.length > 1 ? 's' : ''}
                                </Badge>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent>
                            <AnimatePresence>
                                {subtitles.map((subtitle, index) => (
                                    <motion.div
                                        key={subtitle?.SubtitleId}
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.2, delay: index * 0.05 }}
                                    >
                                        <Card className="mb-4 hover:shadow-md transition-shadow duration-200 cursor-pointer" onClick={() => dispatch(setSelectedSubtitle(subtitle?.SubtitleId || null))}>
                                            <CardHeader className="p-4 cursor-pointer">
                                                <CardTitle className="text-lg flex items-center justify-between">
                                                    <span>{subtitle?.subtitleTitle}</span>

                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="p-4 pt-0 grid grid-cols-1 md:grid-cols-2 gap-2">
                                                {subtitle.episode && (
                                                    <div className="flex items-center text-sm text-muted-foreground">
                                                        <PlayCircle className="w-4 h-4 mr-2" />
                                                        Episode: {subtitle.episode}
                                                    </div>
                                                )}
                                                {subtitle.hardWords && (
                                                    <div className="flex items-center text-sm text-muted-foreground">
                                                        <Book className="w-4 h-4 mr-2" />
                                                        Hard Words: {subtitle.hardWords.length}
                                                    </div>
                                                )}
                                                {subtitle.subtitleData && (
                                                    <div className="flex items-center text-sm text-muted-foreground">
                                                        <AlignLeft className="w-4 h-4 mr-2" />
                                                        Subtitle Rows: {subtitle.subtitleData.length}
                                                    </div>
                                                )}

                                                {subtitle.createdAt && (
                                                    <div className="flex items-center text-sm text-muted-foreground">
                                                        <Calendar className="w-4 h-4 mr-2" />
                                                        Created: {new Date(subtitle.createdAt).toLocaleDateString()}
                                                    </div>
                                                )}

                                                {subtitle.youtubeUrl && (
                                                    <div className="md:col-span-2 mt-2">
                                                        <Button variant="outline" size="sm" asChild className="w-full sm:w-auto">
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
                                                    </div>
                                                )}
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </ScrollArea>
    );
}

export default SubtitleListView;