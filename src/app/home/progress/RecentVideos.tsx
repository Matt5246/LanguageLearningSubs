'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PlayCircle, Calendar, Book, ExternalLink, ChevronUp, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from "framer-motion"

export interface Video {
    subtitleTitle: string;
    youtubeUrl: string;
    hardWords: any[];
    createdAt: string | Date;
}

interface RecentVideosProps {
    videos: Video[];
}

export default function RecentVideos({ videos }: RecentVideosProps) {
    const [expandedVideo, setExpandedVideo] = useState<number | null>(null)

    const toggleExpand = (index: number) => {
        setExpandedVideo(expandedVideo === index ? null : index)
    }

    return (
        <Card className="m-5 col-span-4 md:col-span-2">
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <span>Recent Videos</span>
                    <Badge variant="secondary">{videos.length}</Badge>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[400px] pr-4">
                    <AnimatePresence>
                        {videos.map((video, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.2, delay: index * 0.05 }}
                                className="mb-4 rounded-md border p-4 bg-card hover:bg-accent/50 transition-colors duration-200"
                            >
                                <div className="flex items-center space-x-4">
                                    <div className="bg-primary/10 p-2 rounded-full">
                                        <PlayCircle className="h-6 w-6 text-primary" />
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <p className="font-medium leading-none">{video.subtitleTitle}</p>
                                        <p className="text-sm text-muted-foreground flex items-center">
                                            <Book className="h-4 w-4 mr-1" />
                                            {video.hardWords.length} words learned
                                            <span className="mx-2">•</span>
                                            <Calendar className="h-4 w-4 mr-1" />
                                            {new Date(video.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => toggleExpand(index)}
                                    >
                                        {expandedVideo === index ? (
                                            <ChevronUp className="h-4 w-4" />
                                        ) : (
                                            <ChevronDown className="h-4 w-4" />
                                        )}
                                    </Button>
                                </div>
                                <AnimatePresence>
                                    {expandedVideo === index && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="mt-4 space-y-2"
                                        >
                                            <div className="text-sm">
                                                <strong>Hard Words:</strong>{' '}
                                                {video.hardWords.map((hardWord, index) => (
                                                    <span key={index} className="px-1 bg-primary/10 rounded-md mx-1">
                                                        {hardWord.word}
                                                    </span>
                                                ))}
                                            </div>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="w-full"
                                                asChild
                                            >
                                                <a
                                                    href={video.youtubeUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center justify-center"
                                                >
                                                    <ExternalLink className="h-4 w-4 mr-2" />
                                                    Watch on YouTube
                                                </a>
                                            </Button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </ScrollArea>
            </CardContent>
        </Card>
    )
}