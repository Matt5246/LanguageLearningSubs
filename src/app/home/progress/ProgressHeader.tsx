import { useState } from "react";
import { Calendar, Clock, Film, Book, TrendingUp, Settings, TrendingDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { useEffect } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { formatDistanceToNow } from 'date-fns'


interface ProgressHeaderProps {
    totalSubtitles: { totalSubtitles: number; totalSubtitlesTrend: number };
    totalWords: { totalWords: number, totalWordsTrend: number };
    totalTime: number;
    lastActivity: string | null;
}

export default function ProgressHeader({ totalSubtitles, totalWords, totalTime, lastActivity }: ProgressHeaderProps) {
    const [subtitlesGoal, setSubtitlesGoal] = useState(100);
    const [wordsGoal, setWordsGoal] = useState(1000);

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <VideoWatchedCard totalSubtitles={totalSubtitles.totalSubtitles} trend={totalSubtitles.totalSubtitlesTrend} goal={subtitlesGoal} setGoal={setSubtitlesGoal} />
            <WordsLearnedCard totalWords={totalWords.totalWords} trend={totalWords.totalWordsTrend} goal={wordsGoal} setGoal={setWordsGoal} />
            <TimeDisplayCard totalTime={totalTime} />
            <LastActivityCard lastActivity={lastActivity} />
        </div>
    );
}

interface ProgressCardProps {
    icon: React.ReactNode;
    title: string;
    value: number;
    goal: number;
    setGoal: (goal: number) => void;
    unit: string;
    trend?: number;
}

function ProgressCard({ icon, title, value, goal, setGoal, unit, trend }: ProgressCardProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [tempGoal, setTempGoal] = useState(goal);
    const [storedGoal, setStoredGoal] = useLocalStorage(`${title}-goal`, goal);
    useEffect(() => {
        if (storedGoal !== goal) {
            setGoal(storedGoal);
        }
    }, []);

    const handleSave = () => {
        setGoal(tempGoal);
        setStoredGoal(tempGoal);
        setIsOpen(false);
    };
    const progress = Math.min(100, (value / goal) * 100);

    return (
        <Card className="overflow-hidden">
            <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                        {icon}
                    </div>
                    <div className="flex items-center space-x-2">

                        {trend ? (
                            <div className="flex items-center text-sm ">
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <div className="flex text-green-500">
                                            <TrendingUp className="h-4 w-4 mr-1" />
                                            {trend}
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>updated last month</p>
                                    </TooltipContent>
                                </Tooltip>
                            </div>
                        ) : (
                            <div className="flex items-center text-sm ">
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <div className="flex text-red-500">
                                            <TrendingDown className="h-4 w-4 mr-1" />
                                            {trend}
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>updated last month</p>
                                    </TooltipContent>
                                </Tooltip>
                            </div>
                        )}

                        <Button variant="ghost" size="icon" onClick={() => setIsOpen(true)}>

                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div className="flex">
                                        <Settings className="h-4 w-4" />
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>updated your goal</p>
                                </TooltipContent>
                            </Tooltip>
                        </Button>
                    </div>
                </div>
                <h3 className="text-2xl font-bold mb-1">{value}</h3>
                <p className="text-sm text-muted-foreground mb-4">{title}</p>
                <Progress value={progress} className="h-2 mb-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                    <span>0</span>
                    <span>{goal / 2}</span>
                    <span>{goal}</span>
                </div>
                <div className="mt-4 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{progress.toFixed(1)}%</span>
                </div>
            </CardContent>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="flex flex-col space-y-2">
                    <DialogHeader>
                        <DialogTitle>Set Goal for {title}</DialogTitle>
                        <DialogDescription>Enter your desired goal for {title.toLowerCase()}.</DialogDescription>
                    </DialogHeader>
                    <div className="flex items-center py-4">
                        <Label htmlFor="goal" className="mr-4">
                            Goal
                        </Label>
                        <Input
                            id="goal"
                            type="number"
                            value={tempGoal}
                            onChange={(e) => setTempGoal(Math.max(0, Number(e.target.value)))}
                            className="w-full"
                        />
                    </div>
                    <DialogFooter className="flex gap-4">
                        <Button variant="secondary" onClick={() => setIsOpen(false)} className="flex-1">
                            Cancel
                        </Button>
                        <Button onClick={handleSave} className="flex-1">Save changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Card>
    );
}

function VideoWatchedCard({ totalSubtitles, trend, goal, setGoal }: { totalSubtitles: number; trend: number; goal: number; setGoal: (goal: number) => void }) {
    return (
        <ProgressCard
            icon={<Film className="h-6 w-6 text-primary" />}
            title="Videos Watched"
            value={totalSubtitles}
            goal={goal}
            setGoal={setGoal}
            unit="videos"
            trend={trend}
        />
    );
}

function WordsLearnedCard({ totalWords, trend, goal, setGoal }: { totalWords: number; trend: number; goal: number; setGoal: (goal: number) => void }) {
    return (
        <ProgressCard
            icon={<Book className="h-6 w-6 text-primary" />}
            title="Words Added"
            value={totalWords}
            goal={goal}
            setGoal={setGoal}
            unit="words"
            trend={trend}
        />
    );
}

function TimeDisplayCard({ totalTime }: { totalTime: number }) {
    const hours = Math.floor(totalTime / 3600)
    const minutes = Math.floor((totalTime % 3600) / 60)
    const progress = (totalTime / (24 * 3600)) * 100

    return (
        <Card className="overflow-hidden">
            <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                        <Clock className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="text-sm font-medium text-muted-foreground">
                            Approx. {Math.round(totalTime / 60)}m
                        </div>
                    </div>
                </div>
                <h3 className="text-2xl font-bold mb-1">{hours}h {minutes}m</h3>
                <p className="text-sm text-muted-foreground mb-4">Total Time</p>
                <Progress value={progress} className="h-2 mb-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                    <span>0h</span>
                    <span>{Math.floor(24 * 3600 / 7200)}h</span>
                    <span>{Math.floor(24 * 3600 / 3600)}h</span>
                </div>
                <div className="mt-4 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Daily Progress</span>
                    <span className="font-medium">{progress.toFixed(1)}%</span>
                </div>
            </CardContent>
        </Card>
    );
}

function LastActivityCard({ lastActivity }: { lastActivity: string | null }) {
    if (!lastActivity) {
        return null;
    }

    const activityDate = new Date(lastActivity);
    const timeAgo = formatDistanceToNow(activityDate, { addSuffix: true });

    return (
        <Card className="overflow-hidden">
            <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                        <Calendar className="h-6 w-6 text-primary" />
                    </div>
                    <div className="text-sm text-muted-foreground flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {timeAgo}
                    </div>
                </div>
                <h3 className="text-2xl font-bold mb-1">
                    {activityDate.toLocaleDateString(undefined, {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })}
                </h3>
                <p className="text-sm text-muted-foreground">Last Activity</p>
                <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                    <div className="flex flex-col">
                        <span className="text-muted-foreground">Time</span>
                        <span className="font-medium">
                            {activityDate.toLocaleTimeString(undefined, {
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-muted-foreground">Day of Week</span>
                        <span className="font-medium">
                            {activityDate.toLocaleDateString(undefined, { weekday: 'long' })}
                        </span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}