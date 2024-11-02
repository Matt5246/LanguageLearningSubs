import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PlayCircle } from "lucide-react";

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
    return (
        <Card className="m-5 col-span-4 md:col-span-2">
            <CardHeader>
                <CardTitle>Recent Videos</CardTitle>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[400px] pr-4">
                    {videos.map((video, index) => (
                        <div
                            key={index}
                            className="mb-4 flex items-center space-x-4 rounded-md border p-4"
                        >
                            <PlayCircle className="h-8 w-8 text-primary" />
                            <div className="flex-1 space-y-1">
                                <p className="text-sm font-medium leading-none">
                                    {video.subtitleTitle}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {video.hardWords.length} words learned •{" "}
                                    {new Date(video.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    ))}
                </ScrollArea>
            </CardContent>
        </Card>
    );
}