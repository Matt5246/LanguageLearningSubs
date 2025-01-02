"use client"

import * as React from "react"
import { TrendingUp } from "lucide-react"
import { Label, Pie, PieChart } from "recharts"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
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

export default function Component({ data }: { data: any }) {
    const transformedData = data.reduce((acc: any, item: any) => {
        const { pos } = item;
        if (!acc[pos]) {
            acc[pos] = 0;
        }
        acc[pos] += 1;
        return acc;
    }, {});
    // const transformedData = [
    //     { pos: 'null', count: 1 },
    //     { pos: 'noun', count: 10 },
    //     { pos: 'verb', count: 5 },
    //     { pos: 'adjective', count: 3 },
    //     { pos: 'adverb', count: 2 },
    //     { pos: 'pronoun', count: 1 },
    //     { pos: 'preposition', count: 1 },
    //     { pos: 'conjunction', count: 1 },
    //     { pos: 'interjection', count: 1 },
    //     { pos: 'determiner', count: 1 },
    //     { pos: 'numeral', count: 1 }
    // ];

    const chartData = Object.entries(transformedData).map(([pos, count], index) => ({
        name: pos,
        value: count,
        fill: index < 5 ? `hsl(var(--chart-${index + 1}))` : `hsl(${Math.random() * 360}, 100%, 75%)`
    }));

    const chartConfig = chartData.reduce((acc, { name }) => {
        acc[name] = { label: name };
        return acc;
    }, {} as ChartConfig);

    const totalWords = data.length;
    const totalPosCounts = transformedData;
    if (!data) {
        return null
    }
    return (<>
        {totalWords > 0 &&
            <Card className="flex flex-col min-h-[420px]">
                <HoverCard>
                    <HoverCardTrigger>
                        <CardHeader className="items-center pb-0">
                            <CardTitle>Parts of Speech in Hard Words</CardTitle>
                            <CardDescription>
                                This chart shows the distribution of parts of speech in hard words.
                            </CardDescription>
                        </CardHeader>
                    </HoverCardTrigger>
                    <HoverCardContent>
                        <div className="text-sm leading-tight text-muted-foreground">
                            <div>Total words in subtitles: <span className="font-semibold text-foreground">{totalWords.toLocaleString()}</span></div>
                            <div>Average words per subtitle: <span className="font-semibold text-foreground">{(totalWords / data?.length).toFixed(2)}</span></div>
                            <div>Total number of subtitles: <span className="font-semibold text-foreground">{data?.length}</span></div>
                        </div>
                    </HoverCardContent>
                </HoverCard>
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
                                data={Object.entries(totalPosCounts).map(([pos, count], index) => ({
                                    name: pos,
                                    value: count,
                                    fill: index < 5 ? `hsl(var(--chart-${index + 1}))` : `hsl(${Math.random() * 360}, 100%, 75%)`
                                }))}
                                dataKey="value"
                                nameKey="name"
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
                                content={<ChartLegendContent nameKey="name" />}
                                className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center max-w-[250px] max-h-[120px] absolute overflow-auto "
                            />
                        </PieChart>
                    </ChartContainer>
                </CardContent>
            </Card>}</>
    )
}
