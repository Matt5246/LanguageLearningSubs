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
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { useState } from "react";
import axios from 'axios'
import { useLocalStorage } from "@/hooks/useLocalStorage"


export default function SubtitlesList({ captions, url, userEmail }: { captions: Caption[], url: string, userEmail: string | null | undefined }) {
    const [selectedSubtitle, setSelectedSubtitle] = useState<Caption | null>(null);
    const [selectedWord, setSelectedWord] = useState<string | null>(null);
    const [fontWeight, setFontWeight] = useLocalStorage("fontWeight", "font-light");

    const handleAddToHardWords = async () => {

        if (!selectedSubtitle || !selectedWord) return;
        const data = {
            youtubeUrl: url,
            email: userEmail,
            hardWord: selectedWord,
            //sentence: selectedSubtitle?.text,
        }
        try {
            const response = await axios.post('/api/hardWords/add', data);

            console.log('Word added to hard words:', response.data);
        } catch (error) {
            console.error('Error adding word to hard words:', error);
        }
    };
    return (
        <div className="overflow-auto h-full">
            {/* <Button onClick={() =>
                setFontWeight((prevWeight: string) =>
                    prevWeight === "font-light" ? "font-bold" : "font-light"
                )
            } className="mb-4 float-right">
                Toggle Font Weight
            </Button> */}
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

                            <TableRow key={key} className={fontWeight}>
                                <TableCell >{key + 1}</TableCell>
                                <TableCell >
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <p onClick={() => setSelectedSubtitle(subtitle)} className="cursor-pointer p-1">{subtitle.text}</p>
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
                                                                onChange={() => (setSelectedWord(word))}
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
                                <TableCell className="text-right">{convertTime(subtitle.start)}</TableCell>
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
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}



// function convertTime(time: number): string {
//     const seconds = Math.floor(time / 1000);
//     const minutes = Math.floor(seconds / 60);
//     const remainingSeconds = seconds % 60;
//     const hours = Math.floor(minutes / 60);
//     const remainingMinutes = minutes % 60;

//     return `${hours.toString().padStart(2, '0')}:${remainingMinutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
// }