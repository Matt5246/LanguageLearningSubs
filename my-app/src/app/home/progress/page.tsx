"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"

export const description = "An interactive bar chart"

const chartData = [
    { date: "2024-04-01", hardWords: 222, learned: 150 },
    { date: "2024-04-02", hardWords: 97, learned: 180 },
    { date: "2024-04-03", hardWords: 167, learned: 120 },
    { date: "2024-04-04", hardWords: 242, learned: 260 },
    { date: "2024-04-05", hardWords: 373, learned: 290 },
    { date: "2024-04-06", hardWords: 301, learned: 340 },
    { date: "2024-04-07", hardWords: 245, learned: 180 },
    { date: "2024-04-08", hardWords: 409, learned: 320 },
    { date: "2024-04-09", hardWords: 59, learned: 110 },
    { date: "2024-04-10", hardWords: 261, learned: 190 },
    { date: "2024-04-11", hardWords: 327, learned: 350 },
    { date: "2024-04-12", hardWords: 292, learned: 210 },
    { date: "2024-04-13", hardWords: 342, learned: 380 },
    { date: "2024-04-14", hardWords: 137, learned: 220 },
    { date: "2024-04-15", hardWords: 120, learned: 170 },
    { date: "2024-04-16", hardWords: 138, learned: 190 },
    { date: "2024-04-17", hardWords: 446, learned: 360 },
    { date: "2024-04-18", hardWords: 364, learned: 410 },
    { date: "2024-04-19", hardWords: 243, learned: 180 },
    { date: "2024-04-20", hardWords: 89, learned: 150 },
    { date: "2024-04-21", hardWords: 137, learned: 200 },
    { date: "2024-04-22", hardWords: 224, learned: 170 },
    { date: "2024-04-23", hardWords: 138, learned: 230 },
    { date: "2024-04-24", hardWords: 387, learned: 290 },
    { date: "2024-04-25", hardWords: 215, learned: 250 },
    { date: "2024-04-26", hardWords: 75, learned: 130 },
    { date: "2024-04-27", hardWords: 383, learned: 420 },
    { date: "2024-04-28", hardWords: 122, learned: 180 },
    { date: "2024-04-29", hardWords: 315, learned: 240 },
    { date: "2024-04-30", hardWords: 454, learned: 380 },
    { date: "2024-05-01", hardWords: 165, learned: 220 },
    { date: "2024-05-02", hardWords: 293, learned: 310 },
    { date: "2024-05-03", hardWords: 247, learned: 190 },
    { date: "2024-05-04", hardWords: 385, learned: 420 },
    { date: "2024-05-05", hardWords: 481, learned: 390 },
    { date: "2024-05-06", hardWords: 498, learned: 520 },
    { date: "2024-05-07", hardWords: 388, learned: 300 },
    { date: "2024-05-08", hardWords: 149, learned: 210 },
    { date: "2024-05-09", hardWords: 227, learned: 180 },
    { date: "2024-05-10", hardWords: 293, learned: 330 },
    { date: "2024-05-11", hardWords: 335, learned: 270 },
    { date: "2024-05-12", hardWords: 197, learned: 240 },
    { date: "2024-05-13", hardWords: 197, learned: 160 },
    { date: "2024-05-14", hardWords: 448, learned: 490 },
    { date: "2024-05-15", hardWords: 473, learned: 380 },
    { date: "2024-05-16", hardWords: 338, learned: 400 },
    { date: "2024-05-17", hardWords: 499, learned: 420 },
    { date: "2024-05-18", hardWords: 315, learned: 350 },
    { date: "2024-05-19", hardWords: 235, learned: 180 },
    { date: "2024-05-20", hardWords: 177, learned: 230 },
    { date: "2024-05-21", hardWords: 82, learned: 140 },
    { date: "2024-05-22", hardWords: 81, learned: 120 },
    { date: "2024-05-23", hardWords: 252, learned: 290 },
    { date: "2024-05-24", hardWords: 294, learned: 220 },
    { date: "2024-05-25", hardWords: 201, learned: 250 },
    { date: "2024-05-26", hardWords: 213, learned: 170 },
    { date: "2024-05-27", hardWords: 420, learned: 460 },
    { date: "2024-05-28", hardWords: 233, learned: 190 },
    { date: "2024-05-29", hardWords: 78, learned: 130 },
    { date: "2024-05-30", hardWords: 340, learned: 280 },
    { date: "2024-05-31", hardWords: 178, learned: 230 },
    { date: "2024-06-01", hardWords: 178, learned: 200 },
    { date: "2024-06-02", hardWords: 470, learned: 410 },
    { date: "2024-06-03", hardWords: 103, learned: 160 },
    { date: "2024-06-04", hardWords: 439, learned: 380 },
    { date: "2024-06-05", hardWords: 88, learned: 140 },
    { date: "2024-06-06", hardWords: 294, learned: 250 },
    { date: "2024-06-07", hardWords: 323, learned: 370 },
    { date: "2024-06-08", hardWords: 385, learned: 320 },
    { date: "2024-06-09", hardWords: 438, learned: 480 },
    { date: "2024-06-10", hardWords: 155, learned: 200 },
    { date: "2024-06-11", hardWords: 92, learned: 150 },
    { date: "2024-06-12", hardWords: 492, learned: 420 },
    { date: "2024-06-13", hardWords: 81, learned: 130 },
    { date: "2024-06-14", hardWords: 426, learned: 380 },
    { date: "2024-06-15", hardWords: 307, learned: 350 },
    { date: "2024-06-16", hardWords: 371, learned: 310 },
    { date: "2024-06-17", hardWords: 475, learned: 520 },
    { date: "2024-06-18", hardWords: 107, learned: 170 },
    { date: "2024-06-19", hardWords: 341, learned: 290 },
    { date: "2024-06-20", hardWords: 408, learned: 450 },
    { date: "2024-06-21", hardWords: 169, learned: 210 },
    { date: "2024-06-22", hardWords: 317, learned: 270 },
    { date: "2024-06-23", hardWords: 480, learned: 530 },
    { date: "2024-06-24", hardWords: 132, learned: 180 },
    { date: "2024-06-25", hardWords: 141, learned: 190 },
    { date: "2024-06-26", hardWords: 434, learned: 380 },
    { date: "2024-06-27", hardWords: 448, learned: 490 },
    { date: "2024-06-28", hardWords: 149, learned: 200 },
    { date: "2024-06-29", hardWords: 103, learned: 160 },
    { date: "2024-06-30", hardWords: 446, learned: 400 },
]

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

export default function Component() {
    const [activeChart, setActiveChart] =
        React.useState<keyof typeof chartConfig>("hardWords")

    const total = React.useMemo(
        () => ({
            hardWords: chartData.reduce((acc, curr) => acc + curr.hardWords, 0),
            learned: chartData.reduce((acc, curr) => acc + curr.learned, 0),
        }),
        []
    )

    return (
        <Card className="m-5">
            <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
                <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
                    <CardTitle>Bar Chart - Interactive</CardTitle>
                    <CardDescription>
                        Showing total words studied for the last 3 months
                    </CardDescription>
                </div>
                <div className="flex">
                    {["hardWords", "learned"].map((key) => {
                        const chart = key as keyof typeof chartConfig
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
                        )
                    })}
                </div>
            </CardHeader>
            <CardContent className="px-2 sm:p-6">
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
                                const date = new Date(value)
                                return date.toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                })
                            }}
                        />
                        <ChartTooltip
                            content={
                                <ChartTooltipContent
                                    className="w-[150px]"
                                    nameKey="views"
                                    labelFormatter={(value) => {
                                        return new Date(value).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric",
                                        })
                                    }}
                                />
                            }
                        />
                        <Bar dataKey={activeChart} fill={`var(--color-${activeChart})`} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
