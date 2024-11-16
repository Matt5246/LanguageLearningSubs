'use client';

import { useSelector } from 'react-redux';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { User2, Settings, Target, Clock, BookOpen, Star, Languages, Brain, Video, Flame } from "lucide-react";
import { selectSubtitleStats } from '@/lib/features/subtitles/subtitleSlice';
import { selectAchievements, selectAchievementStats } from '@/lib/features/achievements/achievementsSlice';
import { formatDistance } from 'date-fns';
import { useAchievements } from '@/hooks/useAchievements';
import { selectUserData } from '@/lib/features/user/userSlice';
import { useEffect, useState } from 'react';
import { Spinner } from '@/components/ui/spinner';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { EuropeLanguages, AsiaLanguages } from '@/lib/utils';

const iconMap: Record<string, any> = {
    Star,
    BookOpen,
    Video,
    Clock,
    Brain,
    Languages,
    Flame
};

const tierColors = {
    bronze: 'text-orange-400',
    silver: 'text-slate-400',
    gold: 'text-yellow-400'
};
export default function ProfilePage() {
    const stats = useSelector(selectSubtitleStats);
    const achievements = useSelector(selectAchievements);
    const achievementStats = useSelector(selectAchievementStats);
    const user = useSelector(selectUserData);
    const [isLoading, setIsLoading] = useState(true);
    const [storedTargetLanguage, setStoredTargetLanguage] = useLocalStorage("targetLanguage", "");
    const [storedSourceLanguage, setStoredSourceLanguage] = useLocalStorage("sourceLanguage", "auto");

    useEffect(() => {
        if (stats && achievements && user) {
            setIsLoading(false);
        }
    }, [stats, achievements, user]);

    useAchievements();

    const formatTime = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        return `${hours.toFixed(1)} hrs`;
    };
    if (isLoading) {
        return (
            <h1 className="text-2xl font-bold mt-9 ml-9">Profile
                <Spinner />
            </h1>
        );
    }
    return (
        <div className="container mx-auto px-4 py-16">
            <div className="max-w-4xl mx-auto">
                {user && (
                    <div className="mb-8 flex items-center gap-6">
                        <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                            <User2 className="w-12 h-12 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold">{user?.name}</h1>
                            <p className="text-muted-foreground">
                                {user?.email}
                            </p>
                        </div>
                    </div>)}

                <Tabs defaultValue="overview" className="space-y-8">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="progress">Progress</TabsTrigger>
                        <TabsTrigger value="settings">Settings</TabsTrigger>
                    </TabsList>

                    {/* Overview Tab */}
                    <TabsContent value="overview">
                        <div className="grid gap-6">
                            {/* Quick Stats */}
                            <div className="grid gap-6 md:grid-cols-3">
                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                                            <Clock className="w-4 h-4 text-primary" />
                                            Study Time
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{formatTime(stats.totalTime)}</div>
                                        <p className="text-xs text-muted-foreground">Total watch time</p>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                                            <BookOpen className="w-4 h-4 text-primary" />
                                            Words Learned
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{stats.totalWords}</div>
                                        <p className="text-xs text-muted-foreground">
                                            +{stats.totalWordsTrend} this month
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                                            <Star className="w-4 h-4 text-primary" />
                                            Achievements
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">
                                            {achievementStats.unlockedAchievements}/{achievementStats.totalAchievements}
                                        </div>
                                        <p className="text-xs text-muted-foreground">Unlocked</p>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Recent Activity */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-xl flex items-center gap-2">
                                        <Clock className="w-5 h-5 text-primary" />
                                        Activity
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {stats.activityData.map((day, i) => (
                                            <div key={i} className="flex items-center gap-4 p-3 bg-secondary/30 rounded-lg">
                                                <div className="w-16 text-sm font-medium">{day.date}</div>
                                                <div className="flex-grow">
                                                    <Progress value={(day.words / Math.max(...stats.activityData.map(d => d.words))) * 100} />
                                                </div>
                                                <div className="w-16 text-sm text-right">{day.words} words</div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* Progress Tab */}
                    <TabsContent value="progress">
                        <div className="grid gap-6">
                            {/* Learning Progress */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-xl flex items-center gap-2">
                                        <Target className="w-5 h-5 text-primary" />
                                        Learning Progress
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span>Words Learned</span>
                                                <span className="text-primary">{stats.totalWords} words</span>
                                            </div>
                                            <Progress value={Math.min((stats.totalWords / 500) * 100, 100)} />
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span>Subtitles Watched</span>
                                                <span className="text-primary">{stats.totalSubtitles} videos</span>
                                            </div>
                                            <Progress value={Math.min((stats.totalSubtitles / 30) * 100, 100)} />
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span>Watch Time</span>
                                                <span className="text-primary">{formatTime(stats.totalTime)}</span>
                                            </div>
                                            <Progress value={Math.min((stats.totalTime / 72000) * 100, 100)} />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Achievement Badges */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-xl flex items-center gap-2">
                                        <Star className="w-5 h-5 text-primary" />
                                        Achievements
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {achievements.map((achievement) => {
                                            const Icon = iconMap[achievement.icon] || Star;
                                            const tierColor = achievement.tier ? tierColors[achievement.tier] : 'text-primary';

                                            return (
                                                <HoverCard key={achievement.id}>
                                                    <HoverCardTrigger asChild>
                                                        <div className="text-center p-4 bg-secondary/30 rounded-lg cursor-pointer transition-all hover:bg-secondary/40">
                                                            <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-primary/10 flex items-center justify-center">
                                                                <Icon className={`w-6 h-6 ${achievement.unlockedAt ? tierColor : 'text-muted-foreground'}`} />
                                                            </div>
                                                            <h3 className="font-medium text-sm">{achievement.title}</h3>
                                                            <p className="text-xs text-muted-foreground mt-1">{achievement.description}</p>
                                                            <Progress value={(achievement.progress / achievement.maxProgress) * 100} className="mt-2" />
                                                            {achievement.unlockedAt && (
                                                                <p className="text-xs text-primary mt-1">
                                                                    Unlocked {formatDistance(new Date(achievement.unlockedAt), new Date(), { addSuffix: true })}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </HoverCardTrigger>
                                                    <HoverCardContent className="w-80">
                                                        <div className="space-y-2">
                                                            <div className="flex items-center gap-2">
                                                                <Icon className={`w-5 h-5 ${tierColor}`} />
                                                                <h4 className="font-semibold">{achievement.title}</h4>
                                                                {achievement.tier && (
                                                                    <span className={`text-xs ${tierColor} capitalize`}>
                                                                        {achievement.tier}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <p className="text-sm text-muted-foreground">{achievement.description}</p>
                                                            <div className="space-y-1">
                                                                <div className="flex justify-between text-sm">
                                                                    <span>Progress</span>
                                                                    <span className={achievement.unlockedAt ? 'text-primary' : ''}>
                                                                        {achievement.progress} / {achievement.maxProgress}
                                                                    </span>
                                                                </div>
                                                                <Progress value={(achievement.progress / achievement.maxProgress) * 100} />
                                                            </div>
                                                            {achievement.unlockedAt ? (
                                                                <p className="text-xs text-primary">
                                                                    Completed {formatDistance(new Date(achievement.unlockedAt), new Date(), { addSuffix: true })}
                                                                </p>
                                                            ) : (
                                                                <p className="text-xs text-muted-foreground">
                                                                    {achievement.maxProgress - achievement.progress} more to go!
                                                                </p>
                                                            )}
                                                        </div>
                                                    </HoverCardContent>
                                                </HoverCard>
                                            );
                                        })}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* Settings Tab */}
                    <TabsContent value="settings">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-xl flex items-center gap-2">
                                    <Settings className="w-5 h-5 text-primary" />
                                    Profile Settings
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6">
                                    <div className="space-y-4">
                                        <h3 className="font-semibold">Learning Preferences</h3>
                                        <div className="grid gap-4 md:grid-cols-2">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">Target Language</label>
                                                <Select onValueChange={(value) => setStoredTargetLanguage(value)} defaultValue={storedTargetLanguage}>
                                                    <SelectTrigger className="w-[180px]">
                                                        <SelectValue placeholder="Select language" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectGroup>
                                                            <SelectLabel className="font-bold text-md">Europe</SelectLabel>
                                                            {EuropeLanguages.map((language) => (
                                                                <SelectItem key={language.value} value={language.value}>
                                                                    {language.label}
                                                                </SelectItem>
                                                            ))}
                                                            <SelectLabel className="font-bold text-md">Asia</SelectLabel>
                                                            {AsiaLanguages.map((language) => (
                                                                <SelectItem key={language.value} value={language.value}>
                                                                    {language.label}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <span className="text-sm font-medium ">Source Language</span>
                                                <Select onValueChange={(value) => setStoredSourceLanguage(value)} defaultValue={storedSourceLanguage}>
                                                    <SelectTrigger className="w-[180px]">
                                                        <SelectValue placeholder="Select language" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectGroup>
                                                            <SelectItem className="font-bold" key="auto" value="auto">
                                                                auto
                                                            </SelectItem>
                                                            <SelectLabel className="font-bold">Europe</SelectLabel>
                                                            {EuropeLanguages.map((language) => (
                                                                <SelectItem key={language.value} value={language.value}>
                                                                    {language.label}
                                                                </SelectItem>
                                                            ))}
                                                            <SelectLabel className="font-bold">Asia</SelectLabel>
                                                            {AsiaLanguages.map((language) => (
                                                                <SelectItem key={language.value} value={language.value}>
                                                                    {language.label}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                    </div>
                                    {/*                                     
                                    <div className="space-y-4">
                                        <h3 className="font-semibold">Daily Study Goals</h3>
                                        <div className="grid gap-4 md:grid-cols-2">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">Study Time (minutes)</label>
                                                <input type="number" className="w-full p-2 rounded-md border" defaultValue={30} />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">New Words per Day</label>
                                                <input type="number" className="w-full p-2 rounded-md border" defaultValue={10} />
                                            </div>
                                        </div>
                                    </div>

                                    <Button className="w-full">Save Changes</Button> */}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}