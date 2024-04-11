import { ColumnDef } from "@tanstack/react-table";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import axios from 'axios'
import { useSelector } from "react-redux";
import { PopoverClose } from "@radix-ui/react-popover";
import { Cross1Icon } from "@radix-ui/react-icons";
const RenderMiddlePopoverContent = (row: any) => {
    const [selectedWord, setSelectedWord] = useState<string | null>(null);
    const selectedSubtitle: any = useSelector((state: { subtitle: any }) => state.subtitle.selectedSubtitles);
    console.log('selectedSubtitle:', selectedSubtitle.youtubeUrl)
    return (
        <>

            <h4 className="font-medium leading-none">Subtitle Line:</h4>
            <p className="text-sm text-muted-foreground select-text m-1">{row.row as string}</p>
            <h3>Select Hard Word:</h3>
            <ul>
                {row?.row.replace(/[,.]/g, '').split(' ').map((word: string, index: number) => (
                    <li key={index} onChange={() => setSelectedWord(word)}>
                        <label className={word === selectedWord ? "text-green-500" : ""}>
                            <input
                                type="radio"
                                name="hardWord"

                                value={word}
                                checked={word === selectedWord}
                            />
                            {" " + word}
                        </label>
                    </li>
                ))}
            </ul>
            <Button className="mt-2" onClick={() => handleAddToHardWords(selectedWord, row.row, selectedSubtitle.youtubeUrl, selectedSubtitle.userId)}>Add to Hard Words</Button>
            <PopoverClose asChild className="absolute right-0 top-0 cursor-pointer">
                <button className="p-3">
                    <Cross1Icon className="w-4 h-4" />
                </button>
            </PopoverClose>
        </>
    );
};

async function handleAddToHardWords(word: string | null, sentence: string, url: string, userId: string) {
    console.log("hardWord", word)
    if (!word || !url || !userId) return;
    const data = {
        youtubeUrl: url,
        userId: userId,
        hardWord: word,
        //sentence: sentence,
    }
    try {
        const response = await axios.post('/api/hardWords/add', data);

        console.log('Word added to hard words:', response.data);
    } catch (error) {
        console.error('Error adding word to hard words:', error);
    }
}

export const columns: ColumnDef<Caption>[] = [
    {
        accessorKey: "ID",
        header: "Line",
        cell: (x) => x.row.index + 1,
        size: 10,
    },
    {
        accessorKey: "text",
        header: "Captions",
        cell: (row) => (
            <Popover>
                <PopoverTrigger asChild>
                    <p className="cursor-pointer p-1">{row.getValue() as string}</p>
                </PopoverTrigger>
                <PopoverContent className="w-80 select-none">
                    <RenderMiddlePopoverContent row={row.getValue()} />
                </PopoverContent>
            </Popover>
        ),
    },
    {
        accessorKey: "translation",
        header: "Translation",
        cell: (info) => info.getValue(),

    },
    {
        accessorKey: "start",
        header: "Time",
        cell: (info) => convertTime(info.getValue() as number),
        size: 10,
    },
];

function convertTime(time: number): string {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}
