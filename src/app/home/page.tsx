'use client'
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { BookOpen, Youtube, PlayCircle, User2, FileText, Brain, Languages, BookMarked } from "lucide-react";

const features = [
  {
    icon: <Youtube className="w-12 h-12 text-primary/80" />,
    title: "YouTube Player",
    description: "Learn from YouTube videos with interactive subtitles",
    href: "/home/player-yt"
  },
  {
    icon: <PlayCircle className="w-12 h-12 text-primary/80" />,
    title: "Video Player",
    description: "Watch your saved videos with synchronized subtitles",
    href: "/home/video-player"
  },
  {
    icon: <Brain className="w-12 h-12 text-primary/80" />,
    title: "Flashcards",
    description: "Review vocabulary with spaced repetition",
    href: "/home/flashcards"
  },
  {
    icon: <Languages className="w-12 h-12 text-primary/80" />,
    title: "Subtitles",
    description: "Manage and edit your subtitle collection",
    href: "/home/subtitles"
  },
  {
    icon: <BookMarked className="w-12 h-12 text-primary/80" />,
    title: "Word Bank",
    description: "Track your vocabulary progress",
    href: "/home/word-bank"
  },
  {
    icon: <User2 className="w-12 h-12 text-primary/80" />,
    title: "Profile",
    description: "Customize your learning experience",
    href: "/home/profile"
  }
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Language Learning through Media
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Master any language naturally by watching videos with interactive subtitles
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/docs">
                <BookOpen className="mr-2 h-5 w-5" />
                Get Started
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/home/player-yt">
                <Youtube className="mr-2 h-5 w-5" />
                Try Now
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <Card key={feature.title} className="group hover:shadow-lg transition-all duration-300">
              <Link href={feature.href}>
                <CardHeader className="text-center">
                  <div className="mb-4 flex justify-center transform group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <CardTitle className="group-hover:text-primary transition-colors">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}