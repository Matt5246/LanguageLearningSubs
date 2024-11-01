import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface Word {
    word: string;
    translation: string;
    count: number;
}

interface WordCloudProps {
    words: Word[];
}

export default function WordCloud({ words }: WordCloudProps) {
    const sortedWords = words.sort((a, b) => b.count - a.count);

    return (
        <Card className="col-span-4 md:col-span-2">
            <CardHeader>
                <CardTitle>Most Common Words</CardTitle>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[400px]">
                    <div className="flex flex-wrap gap-2">
                        {sortedWords.map((word, index) => (
                            <Badge
                                key={index}
                                variant={index < 5 ? "default" : "secondary"}
                                className="cursor-help"
                                title={word.translation}
                            >
                                {word.word} ({word.count})
                            </Badge>
                        ))}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    );
}