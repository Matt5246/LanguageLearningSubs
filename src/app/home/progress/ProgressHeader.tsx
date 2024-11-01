import { Calendar, Clock, Film, Book } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface ProgressHeaderProps {
    totalSubtitles: number;
    totalWords: number;
    totalTime: number;
    lastActivity: string;
}

export default function ProgressHeader({ totalSubtitles, totalWords, totalTime, lastActivity }: ProgressHeaderProps) {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 ">
            <Card>
                <CardContent className="flex items-center p-6">
                    <Film className="h-8 w-8 text-primary mr-4" />
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Videos Watched</p>
                        <h3 className="text-2xl font-bold">{totalSubtitles}</h3>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="flex items-center p-6">
                    <Book className="h-8 w-8 text-primary mr-4" />
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Words Learned</p>
                        <h3 className="text-2xl font-bold">{totalWords}</h3>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="flex items-center p-6">
                    <Clock className="h-8 w-8 text-primary mr-4" />
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Time</p>
                        <h3 className="text-2xl font-bold">{Math.round(totalTime / 60)}m</h3>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="flex items-center p-6">
                    <Calendar className="h-8 w-8 text-primary mr-4" />
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Last Activity</p>
                        <h3 className="text-lg font-bold">{new Date(lastActivity).toLocaleDateString()}</h3>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}