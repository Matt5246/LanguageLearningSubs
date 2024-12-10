"use client"

import * as React from "react"
import { TrendingUp } from "lucide-react"
import { Label, Pie, PieChart } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import { Spinner } from "@/components/ui/spinner"



export default function Component({ data, totalWords }: { data: any, totalWords: number }) {

    if (!data) {
        return (
            <h1 className="text-2xl font-bold mt-9 ml-9">Checking for data
                <Spinner />
            </h1>
        );
    }
    const chartData = Array.isArray(data) ? data?.map(([subtitleTitle, data], index) => {
        const totalWords = data.reduce((acc: any, s: { hardWords: string | any[] }) => acc + (s.hardWords?.length || 0), 0);
        const fill = index < 5 ? `hsl(var(--chart-${index + 1}))` : `hsl(${Math.random() * 360}, 100%, 75%)`;
        return {
            subtitleTitle,
            totalWords,
            fill
        };
    }) : [];

    const chartConfig = chartData.reduce((acc, { subtitleTitle }) => {

        acc[subtitleTitle] = { label: subtitleTitle };
        return acc;
    }, {} as ChartConfig);


    return (<>
        {totalWords > 0 &&
            <Card className="flex flex-col">
                <CardHeader className="items-center pb-0">
                    <CardTitle>Words in Subtitles</CardTitle>
                    <CardDescription>
                        This chart shows the distribution of hard words across different subtitles.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 pb-0">
                    <ChartContainer
                        config={chartConfig}
                        className="mx-auto aspect-square max-h-[250px]"
                    >
                        <PieChart>
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent hideLabel />}
                            />
                            <Pie
                                data={chartData}
                                dataKey="totalWords"
                                nameKey="subtitleTitle"
                                innerRadius={60}
                                strokeWidth={5}
                            >
                                <Label
                                    content={({ viewBox }) => {
                                        if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                            return (
                                                <text
                                                    x={viewBox.cx}
                                                    y={viewBox.cy}
                                                    textAnchor="middle"
                                                    dominantBaseline="middle"
                                                >
                                                    <tspan
                                                        x={viewBox.cx}
                                                        y={viewBox.cy}
                                                        className="fill-foreground text-3xl font-bold"
                                                    >
                                                        {totalWords.toLocaleString()}
                                                    </tspan>
                                                    <tspan
                                                        x={viewBox.cx}
                                                        y={(viewBox.cy || 0) + 24}
                                                        className="fill-muted-foreground"
                                                    >
                                                        Words
                                                    </tspan>
                                                </text>
                                            )
                                        }
                                    }}
                                />
                            </Pie>
                            <ChartLegend
                                content={<ChartLegendContent nameKey="subtitleTitle" />}
                                className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center truncate max-w-[300px] max-h-[80px]"
                            />
                        </PieChart>
                    </ChartContainer>
                </CardContent>
                <CardFooter>
                    <div className="text-sm leading-tight text-muted-foreground space-y-1">
                        <div>Total words in subtitles: <span className="font-semibold text-foreground">{totalWords.toLocaleString()}</span></div>
                        <div>Average words per subtitle: <span className="font-semibold text-foreground">{(totalWords / data?.length).toFixed(2)}</span></div>
                        <div>Total number of subtitles: <span className="font-semibold text-foreground">{data?.length}</span></div>
                    </div>
                </CardFooter>
            </Card>}</>
    )
}
