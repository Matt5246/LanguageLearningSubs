"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Spinner } from '@/components/ui/spinner'
import { selectChartData } from "@/lib/features/subtitles/chartData"
import { BarChart2, LineChartIcon } from "lucide-react"
import { useState } from "react"
import { useSelector } from 'react-redux'
import { Bar, BarChart, CartesianGrid, Line, LineChart, XAxis } from "recharts"

const chartConfig = {
    views: {
        label: "Words",
    },
    hardWords: {
        label: "Hard Words",
        color: "hsl(var(--primary))",
    },
    learned: {
        label: "Learned",
        color: "hsl(var(--muted-foreground))",
    },
} satisfies ChartConfig

export default function Component() {
    const [activeChart, setActiveChart] = useState<keyof typeof chartConfig>("hardWords");
    const [period, setPeriod] = useState<'day' | 'week' | 'month'>('day');
    const chartData = useSelector(state => selectChartData(state, period));
    const [chartType, setChartType] = useState(false)

    if (!chartData) {
        return (
            <h1 className="text-2xl font-bold mt-9 ml-9">Checking for data
                <Spinner />
            </h1>
        );
    }
    if (!chartData || chartData.length === 0) {
        return null;
    }
    const total = {
        hardWords: chartData.reduce((acc, curr) => acc + curr.hardWords, 0),
        learned: chartData.reduce((acc, curr) => acc + curr.learned, 0)
    }
    chartData.sort((a, b) => {
        const aDate = new Date(a.date);
        const bDate = new Date(b.date);

        if (period === 'week') {
            const [aYear, aWeek] = a.date.split('-W').map(Number);
            const [bYear, bWeek] = b.date.split('-W').map(Number);
            return aYear === bYear ? aWeek - bWeek : aYear - bYear;
        }

        return aDate.getTime() - bDate.getTime();
    });


    return (
        <Card>
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
                <div className="flex justify-between my-2 sm:my-0">
                    <div className="flex-1 space-x-4">
                        <button onClick={() => setChartType(false)} className={!chartType ? 'font-extrabold' : ''}>
                            <BarChart2 className="inline-block w-4 h-4 mr-1" />
                            Bar
                        </button>
                        <button onClick={() => setChartType(true)} className={chartType ? 'font-extrabold' : ''}>
                            <LineChartIcon className="inline-block w-4 h-4 mr-1" />
                            Line
                        </button>
                    </div>
                    <div className="flex-1 space-x-4 text-right">
                        <button onClick={() => setPeriod('day')} className={period === 'day' ? 'font-extrabold' : ''}>Day</button>
                        <button onClick={() => setPeriod('week')} className={period === 'week' ? 'font-extrabold' : ''}>Week</button>
                        <button onClick={() => setPeriod('month')} className={period === 'month' ? 'font-extrabold' : ''}>Month</button>
                    </div>
                </div>
                <div className="relative mt-1.5">
                    {!chartType ? <ChartContainer
                        config={chartConfig}
                        className="aspect-auto h-[250px] w-full"
                    >
                        <BarChart
                            accessibilityLayer
                            data={chartData}
                            margin={{
                                top: 12,
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
                    </ChartContainer> :
                        <ChartContainer
                            config={chartConfig}
                            className="aspect-auto h-[250px] w-full"
                        >
                            <LineChart
                                accessibilityLayer
                                data={chartData}
                                margin={{
                                    top: 12,
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
                                <Line
                                    dataKey={activeChart}
                                    type="monotone"
                                    stroke={`var(--color-${activeChart})`}
                                    strokeWidth={2}
                                    dot={{
                                        fill: "hsl(var(--background))",
                                    }}
                                    activeDot={{
                                        r: 6,
                                    }}
                                />
                            </LineChart>
                        </ChartContainer>}
                </div>
            </CardContent>
        </Card>
    );
}
