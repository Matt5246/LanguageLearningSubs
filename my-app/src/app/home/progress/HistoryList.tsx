"use client";

import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { SubtitlesState } from "@/lib/features/subtitles/subtitleSlice";

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

const HistoryList = () => {
    const subtitlesData: Subtitle[] = useSelector((state: { subtitle: SubtitlesState }) => state.subtitle.subtitles);

    const historyData: HistoryItem[] = subtitlesData.flatMap(subtitle => {
        return subtitle.hardWords?.map(hardWord => ({
            type: "hardWord",
            word: hardWord.word,
            translation: hardWord.translation,
            learnState: hardWord.learnState,
            createdAt: new Date(subtitle.createdAt!)
        })).concat({
            type: "subtitle",
            subtitleTitle: subtitle.subtitleTitle,
            createdAt: new Date(subtitle.createdAt!)
        });
    });

    const sortedHistory = historyData.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    const [visibleCount, setVisibleCount] = useState(10);

    const loadMore = () => {
        setVisibleCount(prevCount => prevCount + 10);
    };

    return (
        <>
            {subtitlesData.length > 0 && <Card className="m-5">
                <CardTitle className="px-6 py-4 flex justify-center">Recently added</CardTitle>
                <CardContent>
                    <ul className="space-y-2">
                        {sortedHistory.slice(0, visibleCount).map((item, index) => (
                            <li key={index} className="border-b py-2">
                                {item.type === "hardWord" ? (
                                    <div>
                                        <span className={`font-bold ${item?.learnState === 100 ? 'text-green-700 dark:text-green-300' : 'text-orange-600 dark:text-blue-500'}`}>
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
                            </li>
                        ))}
                    </ul>
                    {visibleCount < sortedHistory.length && (
                        <div className="flex justify-center mt-4">
                            <button
                                onClick={loadMore}
                                className="hover:underline"
                            >
                                Show More
                            </button>
                        </div>
                    )}
                </CardContent>
            </Card>}
        </>
    );
};

export default HistoryList;
