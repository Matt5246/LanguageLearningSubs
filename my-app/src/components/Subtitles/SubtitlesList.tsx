'use client'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { useState } from "react";

export default function SubtitlesList({ captions }: { captions: Caption[] }) {
    const [selectedSubtitle, setSelectedSubtitle] = useState<Caption | null>(null);
    const [selectedWord, setSelectedWord] = useState<string | null>(null);

    const handleOpenPopover = (subtitle: Caption) => {
        setSelectedSubtitle(subtitle);
        console.log(subtitle)
    };

    const handleWordSelection = (word: string) => {
        setSelectedWord(word);
    };
    const handleAddToHardWords = () => {
        // Implement logic to send selectedWord to backend API for adding to hard words database
        console.log('Selected Word:', selectedWord);

    };
    return (
        <div className="overflow-auto h-full">
            {captions && captions.length > 0 ? (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">line</TableHead>
                            <TableHead>captions</TableHead>
                            <TableHead>translation</TableHead>
                            <TableHead className="text-right">time</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody >
                        {captions.map((subtitle, key) => (
                            <TableRow key={key}>
                                <TableCell className="font-light">{key + 1}</TableCell>
                                <TableCell >
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <p onClick={() => handleOpenPopover(subtitle)}>{subtitle.text}</p>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-80 select-none">
                                            <h4 className="font-medium leading-none">Subtitle Line:</h4>
                                            <p className="text-sm text-muted-foreground select-text m-1">{key + 1 + ". "}{selectedSubtitle?.text}</p>
                                            <h3 >Select Hard Word:</h3>
                                            <ul>
                                                {selectedSubtitle?.text.split(' ').map((word, index) => (
                                                    <li key={index}>
                                                        <label>
                                                            <input
                                                                type="radio"
                                                                name="hardWord"
                                                                value={word}
                                                                onChange={() => handleWordSelection(word)}
                                                                checked={word === selectedWord}

                                                            />
                                                            {" " + word}
                                                        </label>
                                                    </li>
                                                ))}
                                            </ul>
                                            <Button onClick={handleAddToHardWords} className="mt-2">Add to Hard Words</Button>
                                        </PopoverContent>
                                    </Popover>
                                </TableCell>
                                <TableCell></TableCell>
                                <TableCell className="text-right">{convertTime(subtitle.offset)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TableCell colSpan={3}>{captions.length}</TableCell>
                            <TableCell className="text-right">Total</TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            ) : (
                <p className="flex justify-center items-center h-full">No captions available.</p>
            )
            }
        </div >
    );
}
function convertTime(time: number): string {
    const seconds = Math.floor(time / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    return `${hours.toString().padStart(2, '0')}:${remainingMinutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}