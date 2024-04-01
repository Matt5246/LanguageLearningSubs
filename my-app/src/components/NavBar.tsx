"use client"

import * as React from "react"
import Link from "next/link"

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

const components: { title: string; href: string; description: string }[] = [
    {
        title: "YOUTUBE video player",
        href: "/home/player-yt",
        description:
            "A page where you can watch your youtube videos.",
    },
    {
        title: "Other video type player",
        href: "/home/video-player",
        description:
            "A page where you can watch your videos with subtitles.",
    },
    {
        title: "Flashcards",
        href: "/home/flashcards",
        description:
            "A page where you can train your knowledge.",
    },
    {
        title: "Books",
        href: "/home/books",
        description:
            "Here you can read books in german language.",
    },
    {
        title: "Subtitles",
        href: "/home/subtitles",
        description:
            "Here you can see your all subtitles.",
    },
]

export default function NavigationMenuDemo() {
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
                            <Link href="/home/">
                                <ListItem title="Learning technics">
                                    Unlock the secrets of successful language learning.
                                </ListItem>
                            </Link>
                            <Link href="/home/">
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
                            {components.map((component) => (
                                <Link href={component.href}>
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
