'use client'

import { useState, useRef, useEffect, useCallback } from "react"
import { useSelector } from "react-redux"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { SubtitlesState } from "@/lib/features/subtitles/subtitleSlice"
import { BookOpen, Film, History, Trophy, Calendar, Search, SlidersHorizontal, X, ArrowUpDown } from 'lucide-react'
import { motion, AnimatePresence } from "framer-motion"

interface HardWordHistoryItem {
    type: "hardWord"
    word: string
    translation: string
    repetitions: number
    createdAt: Date
}

interface SubtitleHistoryItem {
    type: "subtitle"
    subtitleTitle: string
    createdAt: Date
}

type HistoryItem = HardWordHistoryItem | SubtitleHistoryItem

interface HistoryListProps {
    initialVisibleCount?: number
    incrementCount?: number
}

export default function HistoryList({ initialVisibleCount = 15, incrementCount = 10 }: HistoryListProps) {
    const subtitlesData = useSelector((state: { subtitle: SubtitlesState }) => state.subtitle.subtitles)
    const [activeTab, setActiveTab] = useState("all")
    const [visibleCount, setVisibleCount] = useState(initialVisibleCount)
    const [searchTerm, setSearchTerm] = useState("")
    const [dateFilter, setDateFilter] = useState("all")
    const [showFilters, setShowFilters] = useState(false)
    const [sortOption, setSortOption] = useState("dateDesc")

    const historyData: HistoryItem[] = Array.isArray(subtitlesData) ? subtitlesData.flatMap((subtitle) => {
        const hardWordsItems: HardWordHistoryItem[] = subtitle.hardWords?.map((hardWord) => ({
            type: "hardWord",
            word: hardWord.word || "",
            translation: hardWord.translation || "",
            repetitions: hardWord.repetitions || 0,
            createdAt: new Date(hardWord.createdAt!),
        })) || []

        const subtitleItem: SubtitleHistoryItem = {
            type: "subtitle",
            subtitleTitle: subtitle.subtitleTitle || "",
            createdAt: new Date(subtitle.createdAt!),
        }

        return [subtitleItem, ...hardWordsItems]
    }) : []

    const filteredHistory = historyData
        .filter(item => {
            if (activeTab === "words") return item.type === "hardWord"
            if (activeTab === "subtitles") return item.type === "subtitle"
            return true
        })
        .filter(item => {
            const searchLower = searchTerm.toLowerCase()
            if (item.type === "hardWord") {
                return item.word.toLowerCase().includes(searchLower) ||
                    item.translation.toLowerCase().includes(searchLower)
            } else {
                return item.subtitleTitle.toLowerCase().includes(searchLower)
            }
        })
        .filter(item => {
            const now = new Date()
            switch (dateFilter) {
                case "today":
                    return item.createdAt.toDateString() === now.toDateString()
                case "week":
                    const weekAgo = new Date(now.setDate(now.getDate() - 7))
                    return item.createdAt >= weekAgo
                case "month":
                    const monthAgo = new Date(now.setMonth(now.getMonth() - 1))
                    return item.createdAt >= monthAgo
                default:
                    return true
            }
        })
        .sort((a, b) => {
            switch (sortOption) {
                case "dateAsc":
                    return a.createdAt.getTime() - b.createdAt.getTime()
                case "dateDesc":
                    return b.createdAt.getTime() - a.createdAt.getTime()
                case "titleAsc":
                    if (a.type === "subtitle" && b.type === "subtitle") {
                        return a.subtitleTitle.localeCompare(b.subtitleTitle)
                    } else if (a.type === "hardWord" && b.type === "hardWord") {
                        return a.word.localeCompare(b.word)
                    }
                    return 0
                case "titleDesc":
                    if (a.type === "subtitle" && b.type === "subtitle") {
                        return b.subtitleTitle.localeCompare(a.subtitleTitle)
                    } else if (a.type === "hardWord" && b.type === "hardWord") {
                        return b.word.localeCompare(a.word)
                    }
                    return 0
                default:
                    return 0
            }
        })

    const observerRef = useRef<HTMLDivElement | null>(null)

    const handleObserver = useCallback(
        (entries: IntersectionObserverEntry[]) => {
            const target = entries[0]
            if (target.isIntersecting) {
                setVisibleCount(prev => prev + incrementCount)
            }
        },
        [incrementCount]
    )

    useEffect(() => {
        const observer = new IntersectionObserver(handleObserver, {
            root: null,
            rootMargin: "100px",
            threshold: 0.1,
        })

        if (observerRef.current) {
            observer.observe(observerRef.current)
        }

        return () => observer.disconnect()
    }, [handleObserver])

    return (
        <Card className="col-span-full">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <History className="h-5 w-5" />
                        <CardTitle>Learning History</CardTitle>
                    </div>
                    <Badge variant="secondary">
                        {filteredHistory.length} items
                    </Badge>
                </div>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 space-y-4 sm:space-y-0">
                        <TabsList>
                            <TabsTrigger value="all" className="flex items-center gap-2">
                                <History className="h-4 w-4" />
                                All
                            </TabsTrigger>
                            <TabsTrigger value="words" className="flex items-center gap-2">
                                <BookOpen className="h-4 w-4" />
                                Words
                            </TabsTrigger>
                            <TabsTrigger value="subtitles" className="flex items-center gap-2">
                                <Film className="h-4 w-4" />
                                Subtitles
                            </TabsTrigger>
                        </TabsList>
                        <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)}>
                            <SlidersHorizontal className="h-4 w-4 mr-2" />
                            {showFilters ? "Hide Filters" : "Show Filters"}
                        </Button>
                    </div>

                    <AnimatePresence>
                        {showFilters && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                                className="mb-4 space-y-4"
                            >
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <div className="flex-1">
                                        <Input
                                            placeholder="Search..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full"
                                        />
                                    </div>
                                    <Select value={dateFilter} onValueChange={setDateFilter}>
                                        <SelectTrigger className="w-full sm:w-[180px]">
                                            <SelectValue placeholder="Filter by date" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All time</SelectItem>
                                            <SelectItem value="today">Today</SelectItem>
                                            <SelectItem value="week">This week</SelectItem>
                                            <SelectItem value="month">This month</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Select value={sortOption} onValueChange={setSortOption}>
                                        <SelectTrigger className="w-full sm:w-[180px]">
                                            <SelectValue placeholder="Sort by" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="dateDesc">Newest first</SelectItem>
                                            <SelectItem value="dateAsc">Oldest first</SelectItem>
                                            <SelectItem value="titleAsc">Title A-Z</SelectItem>
                                            <SelectItem value="titleDesc">Title Z-A</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                {(searchTerm || dateFilter !== "all" || sortOption !== "dateDesc") && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">
                                            Showing {filteredHistory.length} results
                                        </span>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => {
                                                setSearchTerm("")
                                                setDateFilter("all")
                                                setSortOption("dateDesc")
                                            }}
                                        >
                                            <X className="h-4 w-4 mr-2" />
                                            Clear filters
                                        </Button>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <ScrollArea className="h-[600px]">
                        <AnimatePresence>
                            {filteredHistory.slice(0, visibleCount).map((item, index) => (
                                <motion.div
                                    key={`${item.type}-${index}`}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.2 }}
                                    className="mb-4 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors duration-200"
                                >
                                    {item.type === "hardWord" ? (
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <BookOpen className="h-4 w-4 text-muted-foreground" />
                                                <div>
                                                    <span className={`font-medium ${item.repetitions === 5 ? "text-green-500" : "text-primary"
                                                        }`}>
                                                        {item.word}
                                                    </span>
                                                    {item.translation && (
                                                        <span className="text-muted-foreground ml-2">
                                                            ({item.translation})
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            {item.repetitions === 5 && (
                                                <Trophy className="h-4 w-4 text-green-500" />
                                            )}
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <Film className="h-4 w-4 text-muted-foreground" />
                                            <div>
                                                <span className="font-medium">{item.subtitleTitle}</span>
                                            </div>
                                        </div>
                                    )}
                                    <div className="mt-2 text-xs text-muted-foreground flex items-center">
                                        <Calendar className="h-3 w-3 mr-1" />
                                        {item.createdAt.toLocaleString()}
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        <div ref={observerRef} className="h-4" />
                    </ScrollArea>
                </Tabs>
            </CardContent>
        </Card>
    )
}

