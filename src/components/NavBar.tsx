"use client"

import * as React from "react"
import Link from "next/link"
import { useDispatch } from 'react-redux';
import { useSession } from 'next-auth/react';
import { login, logout } from '@/lib/features/user/userSlice';

import { cn } from "@/lib/utils"
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import axios from "axios"
import { initializeSubtitles } from '@/lib/features/subtitles/subtitleSlice'; // Import the action creator


const components: { title: string; href: string; description: string }[] = [
    {
        title: "YOUTUBE video player",
        href: "/home/player-yt",
        description:
            "A page where you can watch your youTube videos.",
    },
    {
        title: "Saved video player",
        href: "/home/video-player",
        description:
            "A page where you can watch your saved videos with subtitles, and from your drive.",
    },
    {
        title: "Subtitles",
        href: "/home/subtitles",
        description:
            "Here you can manage all your subtitles. if you have any.",
    },
    {
        title: "Flashcards",
        href: "/home/flashcards",
        description:
            "A page where you can train your knowledge.",
    },
    {
        title: "Progress tracking",
        href: "/home/progress",
        description:
            "Here you can see the progress you've made.",
    },
    {
        title: "Word Bank",
        href: "/home/word-bank",
        description:
            "Your saved words are listed here. You can easily find what you need.",
    },
]

export default function Navigation() {
    const dispatch = useDispatch();
    const { data: session, status } = useSession();
    const email = session?.user?.email;

    React.useEffect(() => {

        if (status === 'authenticated' && session) {
            dispatch(login({
                name: session.user?.name ?? '',
                email: email ?? '',
            }));

        } else {
            dispatch(logout());
        }
        if (status === 'authenticated' && session) {
            getSubs(email ?? "")
                .then((subtitles) => {
                    dispatch(initializeSubtitles(subtitles));
                })
                .catch((error) => {
                    console.error('Error fetching subtitles:', error);
                });
        }

    }, [status]);
    return (
        <NavigationMenu>
            <NavigationMenuList>
                <NavigationMenuItem>
                    <NavigationMenuTrigger>Getting started</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                            <li className="row-span-3">
                                <NavigationMenuLink asChild>
                                    <Link href="/"
                                        className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"

                                    >
                                        <div className="mb-2 mt-4 text-lg font-medium">
                                            Language learning from subs
                                        </div>
                                        <p className="text-sm leading-tight text-muted-foreground">
                                            A place where you can learn a foreign language using subtitles.
                                        </p>

                                    </Link>
                                </NavigationMenuLink>
                            </li>
                            <Link href="/home/docs">
                                <ListItem title="Introduction">
                                    Discover effective methods for language acquisition through subtitles.
                                </ListItem>
                            </Link>
                            <Link href="/home/learning">
                                <ListItem title="Learning technics">
                                    Unlock the secrets of successful language learning.
                                </ListItem>
                            </Link>
                            <Link href="/home/about">
                                <ListItem title="About me">
                                    Learn more about the creator behind the scenes.
                                </ListItem>
                            </Link>
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuTrigger>Components</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className="grid  gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                            {components.map((component, index) => (
                                <Link href={component.href} key={index}>
                                    <ListItem
                                        key={component.title}
                                        title={component.title}
                                    >
                                        {component.description}
                                    </ListItem></Link>
                            ))}
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>
            </NavigationMenuList>

        </NavigationMenu>
    )
}

const ListItem = React.forwardRef<
    React.ElementRef<"a">,
    React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
    return (
        <li>
            <NavigationMenuLink asChild>
                <a
                    ref={ref}
                    className={cn(
                        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                        className
                    )}
                    {...props}
                >
                    <div className="text-sm font-medium leading-none">{title}</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        {children}
                    </p>
                </a>
            </NavigationMenuLink>
        </li>
    )
})
ListItem.displayName = "ListItem"
export async function getSubs(email: String) {
    try {
        if (email) {
            const response = await axios.post('/api/subtitles/get', { email });
            return response.data;
        } else {
            throw new Error('User is not authenticated');
        }
    } catch (error: any) {
        return error.message
    }
}