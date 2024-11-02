import { useState } from "react";
import { Calendar, Clock, Film, Book, TrendingUp, Settings } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ProgressHeaderProps {
    totalSubtitles: number;
    totalWords: number;
    totalTime: number;
    lastActivity: string;
}

export default function ProgressHeader({ totalSubtitles, totalWords, totalTime, lastActivity }: ProgressHeaderProps) {
    const [subtitlesGoal, setSubtitlesGoal] = useState(100);
    const [wordsGoal, setWordsGoal] = useState(1000);

    return (
        <div className="m-5 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <VideoWatchedCard totalSubtitles={totalSubtitles} goal={subtitlesGoal} setGoal={setSubtitlesGoal} />
            <WordsLearnedCard totalWords={totalWords} goal={wordsGoal} setGoal={setWordsGoal} />
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
    const progress = (value / goal) * 100;

    const handleSave = () => {
        setGoal(tempGoal);
        setIsOpen(false);
    };

    return (
        <Card className="overflow-hidden">
            <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                        {icon}
                    </div>
                    <div className="flex items-center space-x-2">
                        {trend && (
                            <div className="flex items-center text-sm text-green-500">
                                <TrendingUp className="h-4 w-4 mr-1" />
                                {trend}%
                            </div>
                        )}
                        <Button variant="ghost" size="icon" onClick={() => setIsOpen(true)}>
                            <Settings className="h-4 w-4" />
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
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Set Goal for {title}</DialogTitle>
                        <DialogDescription>Enter your desired goal for {title.toLowerCase()}.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="goal" className="text-right">
                                Goal
                            </Label>
                            <Input
                                id="goal"
                                type="number"
                                value={tempGoal}
                                onChange={(e) => setTempGoal(Number(e.target.value))}
                                className="col-span-3"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={handleSave}>Save changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Card>
    );
}

function VideoWatchedCard({ totalSubtitles, goal, setGoal }: { totalSubtitles: number; goal: number; setGoal: (goal: number) => void }) {
    return (
        <ProgressCard
            icon={<Film className="h-6 w-6 text-primary" />}
            title="Videos Watched"
            value={totalSubtitles}
            goal={goal}
            setGoal={setGoal}
            unit="videos"
            trend={5}
        />
    );
}

function WordsLearnedCard({ totalWords, goal, setGoal }: { totalWords: number; goal: number; setGoal: (goal: number) => void }) {
    return (
        <ProgressCard
            icon={<Book className="h-6 w-6 text-primary" />}
            title="Words Learned"
            value={totalWords}
            goal={goal}
            setGoal={setGoal}
            unit="words"
            trend={12}
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

function LastActivityCard({ lastActivity }: { lastActivity: string }) {
    const activityDate = new Date(lastActivity);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - activityDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    const progress = ((daysInMonth - diffDays) / daysInMonth) * 100;

    return (
        <Card className="overflow-hidden">
            <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                        <Calendar className="h-6 w-6 text-primary" />
                    </div>
                    <div className="text-sm text-muted-foreground">
                        {diffDays} day{diffDays !== 1 ? 's' : ''} ago
                    </div>
                </div>
                <h3 className="text-2xl font-bold mb-1">{activityDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</h3>
                <p className="text-sm text-muted-foreground mb-4">Last Activity</p>
                <Progress value={progress} className="h-2 mb-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                    <span>1d</span>
                    <span>{Math.floor(daysInMonth / 2)}d</span>
                    <span>{daysInMonth}d</span>
                </div>
                <div className="mt-4 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Weekly Goal</span>
                    <span className="font-medium">{progress.toFixed(1)}%</span>
                </div>
            </CardContent>
        </Card>
    );
}