"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import { useSelector } from 'react-redux'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { SubtitlesState } from '@/lib/features/subtitles/subtitleSlice'

const chartConfig = {
    views: {
        label: "Words",
    },
    hardWords: {
        label: "Hard Words",
        color: "hsl(var(--chart-1))",
    },
    learned: {
        label: "Learned",
        color: "hsl(var(--chart-2))",
    },
} satisfies ChartConfig



const getWeekNumber = (date: Date): string => {
    const startDate = new Date(date.getFullYear(), 0, 1);
    const days = Math.floor((date.valueOf() - startDate.valueOf()) / (24 * 60 * 60 * 1000));
    const weekNumber = Math.ceil((days + 1) / 7);
    return `${date.getFullYear()}-W${String(weekNumber).padStart(2, '0')}`;
};

const aggregateData = (data: Subtitle[], period: 'day' | 'week' | 'month') => {
    const groupedData: { [key: string]: { hardWords: number; learned: number } } = {};

    data.forEach(subtitle => {
        if (!subtitle.hardWords || subtitle.hardWords.length === 0) return;

        subtitle.hardWords.forEach(hardWord => {
            const date = new Date(hardWord.createdAt!);
            let periodKey: string;

            switch (period) {
                case 'day':
                    periodKey = date.toISOString().split('T')[0]; // YYYY-MM-DD
                    break;
                case 'week':
                    periodKey = getWeekNumber(date); // YYYY-Www
                    break;
                case 'month':
                    periodKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`; // YYYY-MM
                    break;
                default:
                    periodKey = '';
            }

            if (!groupedData[periodKey]) {
                groupedData[periodKey] = { hardWords: 0, learned: 0 };
            }

            groupedData[periodKey].hardWords += 1;
            groupedData[periodKey].learned = 0;
        });
    });

    return Object.entries(groupedData).map(([date, counts]) => ({
        date,
        ...counts,
    }));
};

export default function Component() {
    const [activeChart, setActiveChart] = React.useState<keyof typeof chartConfig>("hardWords");
    const [period, setPeriod] = React.useState<'day' | 'week' | 'month'>('month');

    const handlePeriodChange = (newPeriod: 'day' | 'week' | 'month') => {
        setPeriod(newPeriod);
    };

    const subtitlesData: Subtitle[] = useSelector((state: { subtitle: SubtitlesState }) => state.subtitle.subtitles);

    if (!subtitlesData || subtitlesData.length === 0) {
        return null;
    }

    const chartData = aggregateData(subtitlesData, period);

    const total = React.useMemo(
        () => ({
            hardWords: chartData.reduce((acc, curr) => acc + curr.hardWords, 0),
            learned: chartData.reduce((acc, curr) => acc + curr.learned, 0),
        }),
        [chartData]
    );

    return (
        <Card className="m-5">
            <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
                <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
                    <CardTitle>Your progress diagram</CardTitle>
                    <CardDescription>
                        Showing total words studied for the selected period
                    </CardDescription>
                </div>
                <div className="flex">
                    {["hardWords", "learned"].map((key) => {
                        const chart = key as keyof typeof chartConfig;
                        return (
                            <button
                                key={chart}
                                data-active={activeChart === chart}
                                className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                                onClick={() => setActiveChart(chart)}
                            >
                                <span className="text-xs text-muted-foreground">
                                    {chartConfig[chart].label}
                                </span>
                                <span className="text-lg font-bold leading-none sm:text-3xl">
                                    {total[key as keyof typeof total]}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </CardHeader>
            <CardContent className="px-2 sm:p-6">
                <div className="flex justify-end space-x-4 mb-4">
                    <button onClick={() => handlePeriodChange('day')} className={period === 'day' ? 'font-bold' : ''}>Day</button>
                    <button onClick={() => handlePeriodChange('week')} className={period === 'week' ? 'font-bold' : ''}>Week</button>
                    <button onClick={() => handlePeriodChange('month')} className={period === 'month' ? 'font-bold' : ''}>Month</button>
                </div>
                <ChartContainer
                    config={chartConfig}
                    className="aspect-auto h-[250px] w-full"
                >
                    <BarChart
                        accessibilityLayer
                        data={chartData}
                        margin={{
                            left: 12,
                            right: 12,
                        }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            minTickGap={32}
                            tickFormatter={(value) => {
                                const date = new Date(value);
                                switch (period) {
                                    case 'day':
                                        return date.toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                        });
                                    case 'week':
                                        const [year, week] = value.split('-W');
                                        return `Week ${week} (${year})`;
                                    case 'month':
                                        const [yearMonth] = value.split('-');
                                        return new Date(`${yearMonth}-01`).toLocaleDateString("en-US", {
                                            month: "short",
                                            year: "numeric",
                                        });
                                    default:
                                        return '';
                                }
                            }}
                        />
                        <ChartTooltip
                            content={
                                <ChartTooltipContent
                                    className="w-[150px]"
                                    nameKey="views"
                                    labelFormatter={(value) => {
                                        const date = new Date(value);
                                        switch (period) {
                                            case 'day':
                                                return date.toLocaleDateString("en-US", {
                                                    month: "short",
                                                    day: "numeric",
                                                    year: "numeric",
                                                });
                                            case 'week':
                                                const [year, week] = value.split('-W');
                                                return `Week ${week} (${year})`;
                                            case 'month':
                                                const [yearMonth] = value.split('-');
                                                return new Date(`${yearMonth}-01`).toLocaleDateString("en-US", {
                                                    month: "short",
                                                    year: "numeric",
                                                });
                                            default:
                                                return '';
                                        }
                                    }}
                                />
                            }
                        />
                        <Bar dataKey={activeChart} fill={`var(--color-${activeChart})`} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
