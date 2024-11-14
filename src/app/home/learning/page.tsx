'use client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, BookOpen, Lightbulb, Target, Clock, Music, Video, Pencil, Languages, MessageCircle } from "lucide-react";

export default function LearningPage() {
    return (
        <div className="container mx-auto px-4 py-16">
            <div className="max-w-4xl mx-auto">
                <div className="space-y-4 text-center mb-12">
                    <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent pb-1">
                        Learning Techniques
                    </h1>
                    <p className="text-xl text-muted-foreground">
                        Proven methods to accelerate your language learning journey
                    </p>
                </div>

                <div className="grid gap-8">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <Languages className="w-8 h-8 text-primary" />
                                <div>
                                    <CardTitle className="text-2xl">Immersion Learning</CardTitle>
                                    <CardDescription>Surround yourself with the language</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <Video className="w-5 h-5 text-primary shrink-0 mt-1" />
                                    <div>
                                        <h3 className="font-semibold">Watch Native Content</h3>
                                        <p className="text-sm text-muted-foreground">Start with content made for language learners, then progress to native media</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Music className="w-5 h-5 text-primary shrink-0 mt-1" />
                                    <div>
                                        <h3 className="font-semibold">Listen to Music</h3>
                                        <p className="text-sm text-muted-foreground">Use music to learn natural rhythm and pronunciation</p>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <MessageCircle className="w-5 h-5 text-primary shrink-0 mt-1" />
                                    <div>
                                        <h3 className="font-semibold">Language Exchange</h3>
                                        <p className="text-sm text-muted-foreground">Practice with native speakers through language exchange apps</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Brain className="w-5 h-5 text-primary shrink-0 mt-1" />
                                    <div>
                                        <h3 className="font-semibold">Think in the Language</h3>
                                        <p className="text-sm text-muted-foreground">Practice forming thoughts directly in your target language</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <Target className="w-8 h-8 text-primary" />
                                <div>
                                    <CardTitle className="text-2xl">Active Learning Methods</CardTitle>
                                    <CardDescription>Engage actively with the language</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-6 md:grid-cols-3">
                                <Card className="border-primary/20">
                                    <CardHeader>
                                        <CardTitle className="text-lg flex items-center gap-2">
                                            <Pencil className="w-5 h-5 text-primary" />
                                            Writing Practice
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <ul className="space-y-2 text-sm">
                                            <li>• Keep a daily journal</li>
                                            <li>• Write social media posts</li>
                                            <li>• Summarize watched content</li>
                                        </ul>
                                    </CardContent>
                                </Card>
                                <Card className="border-primary/20">
                                    <CardHeader>
                                        <CardTitle className="text-lg flex items-center gap-2">
                                            <MessageCircle className="w-5 h-5 text-primary" />
                                            Speaking Practice
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <ul className="space-y-2 text-sm">
                                            <li>• Shadow native speakers</li>
                                            <li>• Record yourself speaking</li>
                                            <li>• Practice tongue twisters</li>
                                        </ul>
                                    </CardContent>
                                </Card>
                                <Card className="border-primary/20">
                                    <CardHeader>
                                        <CardTitle className="text-lg flex items-center gap-2">
                                            <Brain className="w-5 h-5 text-primary" />
                                            Memory Techniques
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <ul className="space-y-2 text-sm">
                                            <li>• Create mnemonics</li>
                                            <li>• Use spaced repetition</li>
                                            <li>• Build word associations</li>
                                        </ul>
                                    </CardContent>
                                </Card>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <Clock className="w-8 h-8 text-primary" />
                                <div>
                                    <CardTitle className="text-2xl">Optimal Study Schedule</CardTitle>
                                    <CardDescription>Make the most of your study time</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-4">
                                    <h3 className="font-semibold text-lg flex items-center gap-2">
                                        <Target className="w-5 h-5 text-primary" />
                                        Daily Goals
                                    </h3>
                                    <ul className="space-y-3">
                                        <li className="flex items-center gap-2 bg-secondary/30 p-3 rounded-lg">
                                            <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                                            <span><strong>Learn 5-10 new words</strong> from context</span>
                                        </li>
                                        <li className="flex items-center gap-2 bg-secondary/30 p-3 rounded-lg">
                                            <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                                            <span><strong>Watch 15-30 minutes</strong> of content</span>
                                        </li>
                                        <li className="flex items-center gap-2 bg-secondary/30 p-3 rounded-lg">
                                            <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                                            <span><strong>Review flashcards</strong> twice daily</span>
                                        </li>
                                    </ul>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="font-semibold text-lg flex items-center gap-2">
                                        <Lightbulb className="w-5 h-5 text-primary" />
                                        Study Tips
                                    </h3>
                                    <ul className="space-y-3">
                                        <li className="flex items-center gap-2 bg-secondary/30 p-3 rounded-lg">
                                            <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                                            <span>Study in <strong>25-minute focused blocks</strong></span>
                                        </li>
                                        <li className="flex items-center gap-2 bg-secondary/30 p-3 rounded-lg">
                                            <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                                            <span>Take <strong>5-minute breaks</strong> between sessions</span>
                                        </li>
                                        <li className="flex items-center gap-2 bg-secondary/30 p-3 rounded-lg">
                                            <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                                            <span>Review before sleeping for better <strong>retention</strong></span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}