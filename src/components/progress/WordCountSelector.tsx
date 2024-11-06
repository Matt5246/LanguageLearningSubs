import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen } from "lucide-react";

interface WordCountSelectorProps {
    value: number;
    onChange: (value: number) => void;
}

const WORD_COUNT_OPTIONS = [5, 10, 15, 20, 25];

export function WordCountSelector({ value, onChange }: WordCountSelectorProps) {
    return (
        <Card className="mb-4">
            <CardHeader className="pb-2">
                <div className="flex items-center space-x-2">
                    <BookOpen className="h-4 w-4" />
                    <CardTitle className="text-lg">Words to Learn</CardTitle>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <Slider
                        value={[value]}
                        onValueChange={([newValue]) => onChange(newValue)}
                        max={25}
                        min={5}
                        step={5}
                        className="w-full"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground ">
                        {WORD_COUNT_OPTIONS.map((option) => (
                            <span
                                key={option}
                                className={value === option ? "font-bold text-primary" : ""}
                            >
                                {option}
                            </span>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}