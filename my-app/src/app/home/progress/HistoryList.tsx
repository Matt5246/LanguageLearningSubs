"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { SubtitlesState } from "@/lib/features/subtitles/subtitleSlice";
import { motion } from "framer-motion";

interface HardWordHistoryItem {
    type: "hardWord";
    word: string | undefined;
    translation: string | undefined;
    learnState: number | undefined;
    createdAt: Date;
}

interface SubtitleHistoryItem {
    type: "subtitle";
    subtitleTitle: string | undefined;
    createdAt: Date;
}

type HistoryItem = HardWordHistoryItem | SubtitleHistoryItem;

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
};

const HistoryList = () => {
    const subtitlesData: Subtitle[] = useSelector(
        (state: { subtitle: SubtitlesState }) => state.subtitle.subtitles
    );

    const historyData: HistoryItem[] = subtitlesData.flatMap((subtitle) => {
        const hardWordsItems: HardWordHistoryItem[] = subtitle.hardWords?.map((hardWord) => ({
            type: "hardWord",
            word: hardWord.word || "",
            translation: hardWord.translation || "",
            learnState: hardWord.learnState || 0,
            createdAt: new Date(hardWord.createdAt!),
        })) || [];

        const subtitleItem: SubtitleHistoryItem = {
            type: "subtitle",
            subtitleTitle: subtitle.subtitleTitle,
            createdAt: new Date(subtitle.createdAt!),
        };

        return [subtitleItem, ...hardWordsItems];
    });

    const sortedHistory = historyData.sort(
        (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );

    const [visibleCount, setVisibleCount] = useState(10);

    const observerRef = useRef<HTMLDivElement | null>(null);

    const handleObserver = useCallback(
        (entries: IntersectionObserverEntry[]) => {
            const target = entries[0];
            if (target.isIntersecting) {
                setVisibleCount((prevCount) => prevCount + 10);
            }
        },
        []
    );

    useEffect(() => {
        const option = {
            root: null,
            rootMargin: "0px",
            threshold: 1.0,
        };
        const observer = new IntersectionObserver(handleObserver, option);

        if (observerRef.current) {
            observer.observe(observerRef.current);
        }

        return () => {
            if (observerRef.current) {
                observer.unobserve(observerRef.current);
            }
        };
    }, [handleObserver]);

    return (
        <>
            {subtitlesData.length > 0 && (
                <Card className="m-5">
                    <CardTitle className="px-6 py-4 flex">Recently added</CardTitle>
                    <CardContent>
                        <ul className="space-y-2">
                            {sortedHistory.slice(0, visibleCount).map((item, index) => (
                                <AnimatedListItem item={item} key={index} />
                            ))}
                        </ul>
                        <div ref={observerRef} style={{ height: "20px" }} />
                    </CardContent>
                </Card>
            )}
        </>
    );
};

const AnimatedListItem = ({ item }: { item: HistoryItem }) => {
    const ref = useRef(null);
    const [isInView, setIsInView] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const entry = entries[0];
                setIsInView(entry.isIntersecting);
            },
            { threshold: 0.1 }
        );
        if (ref.current) {
            observer.observe(ref.current);
        }
        return () => {
            if (ref.current) observer.unobserve(ref.current);
        };
    }, []);

    return (
        <motion.li
            ref={ref}
            className="border-b py-2"
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={itemVariants}
            transition={{ duration: 0.2 }}
        >
            {item.type === "hardWord" ? (
                <div>
                    <span
                        className={`font-bold ${item?.learnState === 100
                            ? "text-green-700 dark:text-green-300"
                            : "text-orange-600 dark:text-blue-500"
                            }`}
                    >
                        {item.word}
                    </span>
                    {item.translation && (
                        <span className="text-gray-500 ml-2">({item.translation})</span>
                    )}
                </div>
            ) : (
                <div>
                    <div>Subtitle:</div>
                    <span className="text-xl font-bold">{item?.subtitleTitle}</span>
                </div>
            )}
            <span className="text-gray-500 text-sm ml-2">
                {item.createdAt.toLocaleString()}
            </span>
        </motion.li>
    );
};

export default HistoryList;
