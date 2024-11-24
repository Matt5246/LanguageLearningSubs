"use client"

import * as React from "react"
import { Check, Copy, Moon, Repeat, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"
import { useConfig } from "@/hooks/use-config"
import { ThemeWrapper } from "@/components/theme/theme-wrapper"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Skeleton } from "@/components/ui/skeleton"
import { baseColors } from "@/registry/registry-base-colors"
import "@/styles/mdx.css"

export function ThemeCustomizer() {
    const [mounted, setMounted] = React.useState(false)
    const { setTheme: setMode, resolvedTheme: mode } = useTheme()
    const [config, setConfig] = useConfig()

    React.useEffect(() => {
        setMounted(true)
    }), []

    return mounted ? (
        <Popover>
            <PopoverTrigger asChild>
                <Button size="sm">Customize</Button>
            </PopoverTrigger>
            <PopoverContent
                align="start"
                className="z-40 w-[340px] rounded-[12px] bg-white p-6 dark:bg-zinc-950"
            >
                <Customizer />
            </PopoverContent>
        </Popover>
    ) : (
        null
    )
}

export function Customizer() {
    const [mounted, setMounted] = React.useState(false)
    const { setTheme: setMode, resolvedTheme: mode } = useTheme()
    const [config, setConfig] = useConfig()

    React.useEffect(() => {
        setMounted(true)
    }, [])

    return (
        <ThemeWrapper
            defaultTheme="zinc"
            className="flex flex-col space-y-4 md:space-y-6"
        >
            <div className="flex items-start pt-4 md:pt-0">
                <div className="space-y-1 pr-2">
                    <div className="font-semibold leading-none tracking-tight">
                        Theme Customizer
                    </div>
                    <div className="text-xs text-muted-foreground">
                        Customize your components colors.
                    </div>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    className="ml-auto rounded-[0.5rem]"
                    onClick={() => {
                        setConfig({
                            ...config,
                            theme: "zinc",
                            radius: 0.5,
                        })
                    }}
                >
                    <Repeat />
                    <span className="sr-only">Reset</span>
                </Button>
            </div>
            <div className="flex flex-1 flex-col space-y-4 md:space-y-6">
                <div className="space-y-1.5">
                    <Label className="text-xs">Color</Label>
                    <div className="grid grid-cols-3 gap-2">
                        {baseColors
                            .filter(
                                (theme) =>
                                    ![""].includes(theme.name)
                            )
                            .map((theme) => {
                                const isActive = config.theme === theme.name

                                return mounted ? (
                                    <Button
                                        variant={"outline"}
                                        size="sm"
                                        key={theme.name}
                                        onClick={() => {
                                            setConfig({
                                                ...config,
                                                theme: theme.name,
                                            })
                                        }}
                                        className={cn(
                                            "justify-start",
                                            isActive && "border-2 border-primary"
                                        )}
                                        style={
                                            {
                                                "--theme-primary": `hsl(${theme?.activeColor[mode === "dark" ? "dark" : "light"]
                                                    })`,
                                            } as React.CSSProperties
                                        }
                                    >
                                        <span
                                            className={cn(
                                                "mr-1 flex h-5 w-5 shrink-0 -translate-x-1 items-center justify-center rounded-full bg-[--theme-primary]"
                                            )}
                                        >
                                            {isActive && <Check className="h-4 w-4 text-white" />}
                                        </span>
                                        {theme.label}
                                    </Button>
                                ) : (
                                    <Skeleton className="h-8 w-full" key={theme.name} />
                                )
                            })}
                    </div>
                </div>
                <div className="space-y-1.5">
                    <Label className="text-xs">Radius</Label>
                    <div className="grid grid-cols-5 gap-2">
                        {["0", "0.5", "0.75", "1.0", "3.0"].map((value) => {
                            return (
                                <Button
                                    variant={"outline"}
                                    size="sm"
                                    key={value}
                                    onClick={() => {
                                        setConfig({
                                            ...config,
                                            radius: parseFloat(value),
                                        })
                                    }}
                                    className={cn(
                                        config.radius === parseFloat(value) &&
                                        "border-2 border-primary"
                                    )}
                                >
                                    {value}
                                </Button>
                            )
                        })}
                    </div>
                </div>
                <div className="space-y-1.5">
                    <Label className="text-xs">Mode</Label>
                    <div className="grid grid-cols-3 gap-2">
                        {mounted ? (
                            <>
                                <Button
                                    variant={"outline"}
                                    size="sm"
                                    onClick={() => setMode("light")}
                                    className={cn(mode === "light" && "border-2 border-primary")}
                                >
                                    <Sun className="mr-1 -translate-x-1" />
                                    Light
                                </Button>
                                <Button
                                    variant={"outline"}
                                    size="sm"
                                    onClick={() => setMode("dark")}
                                    className={cn(mode === "dark" && "border-2 border-primary")}
                                >
                                    <Moon className="mr-1 -translate-x-1" />
                                    Dark
                                </Button>
                            </>
                        ) : (
                            <>
                                <Skeleton className="h-8 w-full" />
                                <Skeleton className="h-8 w-full" />
                            </>
                        )}
                    </div>
                </div>
            </div>
        </ThemeWrapper>
    )
}
