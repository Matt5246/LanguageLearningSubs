"use client"

import { Line, LineChart, XAxis } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from '@/components/ui/chart'
import { useSelector } from "react-redux"
import { selectChartData } from "@/lib/features/subtitles/chartData"


const chartConfig = {
    hardWords: {
        label: "Hard Words",
        color: "hsl(var(--primary))",
    },
    learned: {
        label: "Learned",
        color: "hsl(var(--muted-foreground))",
    },
} satisfies ChartConfig

export function CardsMetric() {

    const chartData = useSelector(state => selectChartData(state, 'day'));

    const total = {
        hardWords: chartData.reduce((acc, curr) => acc + curr.hardWords, 0),
        learned: chartData.reduce((acc, curr) => acc + curr.learned, 0)
    }
    chartData.sort((a, b) => {
        const aDate = new Date(a.date);
        const bDate = new Date(b.date);

        // if (period === 'week') {
        //     const [aYear, aWeek] = a.date.split('-W').map(Number);
        //     const [bYear, bWeek] = b.date.split('-W').map(Number);
        //     return aYear === bYear ? aWeek - bWeek : aYear - bYear;
        // }

        return aDate.getTime() - bDate.getTime();
    });
    return (
        <Card>
            <CardHeader>
                <CardTitle>All hard words</CardTitle>
                <CardDescription>
                    A summary of all hard words tracked in the database.

                </CardDescription>
            </CardHeader>
            <CardContent className="pb-4">
                <ChartContainer config={chartConfig} className="h-[200px] w-full">
                    <LineChart
                        data={chartData}
                        margin={{
                            top: 5,
                            right: 10,
                            left: 10,
                            bottom: 0,
                        }}
                    >
                        {Object.keys(chartConfig).map((key) => (
                            <Line
                                key={key}
                                type="monotone"
                                strokeWidth={2}
                                dataKey={key}
                                stroke={`var(--color-${key})`}
                                dot={{
                                    fill: "hsl(var(--background))",
                                }}
                                activeDot={{
                                    r: 6,
                                    fill: `var(--color-${key})`,
                                }}
                            />
                        ))}
                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            minTickGap={32}
                            tickFormatter={(value) => {
                                const date = new Date(value)
                                return date.toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                })
                            }}
                        />
                        <ChartTooltip content={<ChartTooltipContent />} />
                    </LineChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
