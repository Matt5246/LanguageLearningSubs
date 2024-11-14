import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { BookOpen, Rocket, Lightbulb, Target, Clock, Brain, Youtube, Languages } from "lucide-react";

export default function DocsPage() {
    return (
        <div className="container mx-auto px-4 py-16">
            <div className="max-w-4xl mx-auto">
                <div className="space-y-4 text-center mb-12">
                    <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                        Welcome to Language Learning from subs
                    </h1>
                    <p className="text-xl text-muted-foreground">
                        Your journey to language mastery begins here
                    </p>
                </div>

                <Tabs defaultValue="getting-started" className="space-y-8">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="getting-started">Getting Started</TabsTrigger>
                        <TabsTrigger value="features">Features</TabsTrigger>
                        <TabsTrigger value="tips">Learning Tips</TabsTrigger>
                    </TabsList>

                    <TabsContent value="getting-started">
                        <Card>
                            <CardHeader className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <Rocket className="w-8 h-8 text-primary" />
                                    <div>
                                        <CardTitle className="text-2xl">Quick Start Guide</CardTitle>
                                        <CardDescription>From zero to learning in minutes</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-8">
                                <div className="grid gap-6 md:grid-cols-2">
                                    <div className="space-y-4">
                                        <h3 className="text-xl font-semibold flex items-center gap-2">
                                            <Target className="w-5 h-5 text-primary" />
                                            Key Features
                                        </h3>
                                        <ul className="space-y-3 list-none">
                                            <li className="flex items-start gap-2">
                                                <Youtube className="w-5 h-5 text-primary shrink-0 mt-1" />
                                                <span><strong>Video Learning:</strong> Learn from YouTube or your own videos</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <Languages className="w-5 h-5 text-primary shrink-0 mt-1" />
                                                <span><strong>Interactive Subtitles:</strong> Click any word for instant translations</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <Brain className="w-5 h-5 text-primary shrink-0 mt-1" />
                                                <span><strong>Smart Review:</strong> Spaced repetition flashcards</span>
                                            </li>
                                        </ul>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="text-xl font-semibold flex items-center gap-2">
                                            <BookOpen className="w-5 h-5 text-primary" />
                                            First Steps
                                        </h3>
                                        <ol className="space-y-3 list-decimal pl-6">
                                            <li className="pl-2 marker:text-primary marker:font-bold">
                                                <strong>Choose Content:</strong> Select a video that interests you
                                            </li>
                                            <li className="pl-2 marker:text-primary marker:font-bold">
                                                <strong>Load Subtitles:</strong> Upload or auto-generate subtitles
                                            </li>
                                            <li className="pl-2 marker:text-primary marker:font-bold">
                                                <strong>Start Learning:</strong> Click words to see translations
                                            </li>
                                            <li className="pl-2 marker:text-primary marker:font-bold">
                                                <strong>Review:</strong> Create and study flashcards
                                            </li>
                                        </ol>
                                    </div>
                                </div>

                                <Separator />

                                <div className="bg-secondary/30 p-6 rounded-lg">
                                    <h3 className="text-xl font-semibold flex items-center gap-2 mb-4">
                                        <Lightbulb className="w-5 h-5 text-primary" />
                                        Pro Tips
                                    </h3>
                                    <ul className="grid gap-4 md:grid-cols-2">
                                        <li className="bg-background p-4 rounded-lg">
                                            <strong className="text-primary">Start Simple</strong>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                Begin with content you partially understand
                                            </p>
                                        </li>
                                        <li className="bg-background p-4 rounded-lg">
                                            <strong className="text-primary">Regular Practice</strong>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                15-30 minutes daily is better than long irregular sessions
                                            </p>
                                        </li>
                                        <li className="bg-background p-4 rounded-lg">
                                            <strong className="text-primary">Active Learning</strong>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                Repeat phrases out loud while watching
                                            </p>
                                        </li>
                                        <li className="bg-background p-4 rounded-lg">
                                            <strong className="text-primary">Track Progress</strong>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                Review your word bank and stats regularly
                                            </p>
                                        </li>
                                    </ul>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="features">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-3">
                                    <Target className="w-8 h-8 text-primary" />
                                    <div>
                                        <CardTitle className="text-2xl">Platform Features</CardTitle>
                                        <CardDescription>Everything you need to master a new language</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-8">
                                <div className="grid gap-6 md:grid-cols-2">
                                    <div className="space-y-6">
                                        <div className="space-y-4">
                                            <h3 className="text-xl font-semibold text-primary">Video Player</h3>
                                            <ul className="space-y-2">
                                                <li className="flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                                                    <span><strong>Interactive Subtitles:</strong> Click for translations</span>
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                                                    <span><strong>Loop Sections:</strong> Repeat difficult parts</span>
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                                                    <span><strong>Speed Control:</strong> Adjust to your level</span>
                                                </li>
                                            </ul>
                                        </div>

                                        <div className="space-y-4">
                                            <h3 className="text-xl font-semibold text-primary">Word Bank</h3>
                                            <ul className="space-y-2">
                                                <li className="flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                                                    <span><strong>Save Words:</strong> Build your vocabulary</span>
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                                                    <span><strong>Context:</strong> Examples from videos</span>
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                                                    <span><strong>Progress Tracking:</strong> See your growth</span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="space-y-4">
                                            <h3 className="text-xl font-semibold text-primary">Flashcards</h3>
                                            <ul className="space-y-2">
                                                <li className="flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                                                    <span><strong>Spaced Repetition:</strong> Optimized review</span>
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                                                    <span><strong>Audio:</strong> Hear native pronunciation</span>
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                                                    <span><strong>Custom Decks:</strong> Organize by theme</span>
                                                </li>
                                            </ul>
                                        </div>

                                        <div className="space-y-4">
                                            <h3 className="text-xl font-semibold text-primary">Progress Tracking</h3>
                                            <ul className="space-y-2">
                                                <li className="flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                                                    <span><strong>Statistics:</strong> Track your learning</span>
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                                                    <span><strong>Goals:</strong> Set daily targets</span>
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                                                    <span><strong>Achievements:</strong> Earn rewards</span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="tips">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-3">
                                    <Lightbulb className="w-8 h-8 text-primary" />
                                    <div>
                                        <CardTitle className="text-2xl">Learning Strategies</CardTitle>
                                        <CardDescription>Maximize your language learning journey</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-8">
                                <div className="grid gap-6 md:grid-cols-2">
                                    <Card className="border-primary/20">
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <Clock className="w-5 h-5 text-primary" />
                                                Daily Routine
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <ul className="space-y-4">
                                                <li className="p-3 bg-secondary/30 rounded-lg">
                                                    <strong className="text-primary">Morning</strong>
                                                    <p className="text-sm mt-1">Quick 5-minute flashcard review</p>
                                                </li>
                                                <li className="p-3 bg-secondary/30 rounded-lg">
                                                    <strong className="text-primary">Afternoon</strong>
                                                    <p className="text-sm mt-1">15-minute video session</p>
                                                </li>
                                                <li className="p-3 bg-secondary/30 rounded-lg">
                                                    <strong className="text-primary">Evening</strong>
                                                    <p className="text-sm mt-1">Review new words from today</p>
                                                </li>
                                            </ul>
                                        </CardContent>
                                    </Card>

                                    <Card className="border-primary/20">
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <Brain className="w-5 h-5 text-primary" />
                                                Study Tips
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <ul className="space-y-4">
                                                <li className="p-3 bg-secondary/30 rounded-lg">
                                                    <strong className="text-primary">Active Recall</strong>
                                                    <p className="text-sm mt-1">Test yourself before revealing answers</p>
                                                </li>
                                                <li className="p-3 bg-secondary/30 rounded-lg">
                                                    <strong className="text-primary">Immersion</strong>
                                                    <p className="text-sm mt-1">Watch without subtitles occasionally</p>
                                                </li>
                                                <li className="p-3 bg-secondary/30 rounded-lg">
                                                    <strong className="text-primary">Context Learning</strong>
                                                    <p className="text-sm mt-1">Learn words in phrases, not isolation</p>
                                                </li>
                                            </ul>
                                        </CardContent>
                                    </Card>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}