'use client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Heart, Star, Users, Lightbulb, Github, Coffee } from "lucide-react";

export default function AboutPage() {
    return (
        <div className="container mx-auto px-4 py-16">
            <div className="max-w-4xl mx-auto">
                <div className="space-y-4 text-center mb-12">
                    <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent pb-1">
                        About Me
                    </h1>
                    <p className="text-xl text-muted-foreground">
                        Building tools to make language learning accessible and enjoyable
                    </p>
                </div>

                <div className="grid gap-8">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <Heart className="w-8 h-8 text-primary" />
                                <div>
                                    <CardTitle className="text-2xl">Hi, I&apos;m Paul!</CardTitle>
                                    <CardDescription>Web Developer and Creator of &quot;Language Learning from Subs&quot;</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="prose prose-neutral dark:prose-invert max-w-none">
                            <p className="text-lg leading-relaxed">
                                I&apos;m a web developer with a passion for building apps using React and Next.js. While I don&apos;t consider myself a language enthusiast, I&apos;ve always been fascinated by different cultures and have enjoyed exploring countries where communicating in the local language can make a huge difference.
                            </p>
                            <p className="text-lg leading-relaxed">
                                My motivation for creating &quot;Language Learning from Subs&quot; came from my own experiences abroad. I realized that watching movies and series with subtitles could be an easy and natural way to pick up essential vocabulary and phrases. So, I set out to build a tool that would make language learning feel like entertainment rather than a chore.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <Star className="w-8 h-8 text-primary" />
                                <div>
                                    <CardTitle className="text-2xl">My Mission</CardTitle>
                                    <CardDescription>Why I built Language Learning from Subs</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="prose prose-neutral dark:prose-invert max-w-none">
                            <p className="text-lg leading-relaxed">
                                I created &quot;Language Learning from Subs&quot; to make language learning feel less like studying and more like part of daily life. My goal is to help people, like myself, who want to learn a language for practical reasons—whether it’s to navigate a foreign country, connect with locals, or simply enjoy foreign films more deeply.
                            </p>
                            <div className="grid gap-6 md:grid-cols-2 mt-8">
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <Lightbulb className="w-5 h-5 text-primary shrink-0 mt-1" />
                                        <div>
                                            <h3 className="font-semibold">Practical Learning</h3>
                                            <p className="text-sm text-muted-foreground">Learn essential phrases and vocabulary naturally through subtitles</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Users className="w-5 h-5 text-primary shrink-0 mt-1" />
                                        <div>
                                            <h3 className="font-semibold">Built for Travelers</h3>
                                            <p className="text-sm text-muted-foreground">Designed for those who need a quick way to communicate abroad</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <Coffee className="w-5 h-5 text-primary shrink-0 mt-1" />
                                        <div>
                                            <h3 className="font-semibold">Casual & Fun</h3>
                                            <p className="text-sm text-muted-foreground">No textbooks or lessons—just entertainment-based learning</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Heart className="w-5 h-5 text-primary shrink-0 mt-1" />
                                        <div>
                                            <h3 className="font-semibold">Passion Project</h3>
                                            <p className="text-sm text-muted-foreground">A tool created to make language learning easy and enjoyable</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <Star className="w-8 h-8 text-primary" />
                                <div>
                                    <CardTitle className="text-2xl">Features & Benefits</CardTitle>
                                    <CardDescription>What makes Language Learning from Subs unique</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-6 md:grid-cols-3">
                                <div className="space-y-3">
                                    <h3 className="font-semibold text-lg text-primary">Interactive Learning</h3>
                                    <ul className="space-y-2 text-sm">
                                        <li className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                                            Click to translate subtitles
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                                            3-clicks to save a flashcard
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                                            Context-aware translations
                                        </li>
                                    </ul>
                                </div>

                                <div className="space-y-3">
                                    <h3 className="font-semibold text-lg text-primary">Smart Progress</h3>
                                    <ul className="space-y-2 text-sm">
                                        <li className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                                            Ai lemmatization model
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                                            Spaced repetition system
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                                            Progress analytics dashboard
                                        </li>
                                    </ul>
                                </div>

                                <div className="space-y-3">
                                    <h3 className="font-semibold text-lg text-primary">Content Library</h3>
                                    <ul className="space-y-2 text-sm">
                                        <li className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                                            YouTube integration
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                                            Custom video upload
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                                            Subtitle management
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <Users className="w-8 h-8 text-primary" />
                                <div>
                                    <CardTitle className="text-2xl">Connect With Me</CardTitle>
                                    <CardDescription>Join the journey</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-4">
                                    <h3 className="font-semibold text-lg">Community</h3>
                                    <div className="space-y-3">
                                        <a href="https://github.com/Matt5246/LanguageLearningSubs" target="_blank" className="flex items-center gap-2 text-primary hover:underline">
                                            <Github className="w-5 h-5" />
                                            GitHub Repository
                                        </a>
                                        <a href="#" target="_blank" className="flex items-center gap-2 text-primary hover:underline">
                                            <Users className="w-5 h-5" />
                                            Join the Community
                                        </a>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <h3 className="font-semibold text-lg">Support the Project</h3>
                                    <p className="text-sm text-muted-foreground">
                                        If you love what I&apos;m building, consider supporting it!
                                    </p>
                                    <a href="#" className="flex items-center gap-2 text-primary hover:underline">
                                        <Coffee className="w-5 h-5" />
                                        Buy Me a Coffee
                                    </a>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
