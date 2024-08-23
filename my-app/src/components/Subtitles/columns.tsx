import { ColumnDef } from "@tanstack/react-table";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import axios from 'axios'
import { useSelector } from "react-redux";
import { PopoverClose } from "@radix-ui/react-popover";
import { Cross1Icon } from "@radix-ui/react-icons";
import { toast } from "sonner"


function convertTime(time: number): string {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}
async function handleAddToHardWords(word: string | null, sentence: string, sentenceTranslation: string, subtitleTitle: string, url: string, userId: string) {

    console.log("hardWord", word)
    if (!word || (!url && !subtitleTitle) || !userId) return;
    const data = {
        youtubeUrl: url || null,
        subtitleTitle: subtitleTitle || null,
        userId: userId,
        hardWord: word,
        sentence,
        sentenceTranslation,
    };
    try {
        const response = await axios.post('/api/hardWords/add', data);
        if (response.data.error) {
            toast("Event has been Blocked", {
                description: response.data.error,
                action: {
                    label: "Close",
                    onClick: () => console.log("Closed"),
                },
            })
        } else if (response.data.success) {
            toast("Success", {
                description: response.data.error,
                action: {
                    label: "Close",
                    onClick: () => console.log("Closed"),
                },
            })
        }
        console.log('Word added to hard words:', response.data);
    } catch (error) {
        console.error('Error adding word to hard words:', error);
    }
}
async function handleEditSentence(id: number, sentence: string, sentenceTranslation: string, url: string, userId: string) {


}

export const columns: ColumnDef<Caption>[] = [
    {
        accessorKey: "ID",
        header: "Line",
        cell: (x) => (<p className="ml-2">{x.row.index + 1}</p>),
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
                    <RenderMiddlePopoverContent row={row} />
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

const RenderMiddlePopoverContent = (row: any) => {

    const [selectedWord, setSelectedWord] = useState<string | null>(null);
    const selectedSubtitle: Subtitle = useSelector((state: any) => state.subtitle.subtitles.find((subtitle: any) => subtitle.SubtitleId === state.subtitle.selectedSubtitle)); // new way of getting into it
    const fullRow = (row.row.row.original as Caption)

    return (
        <>
            <h4 className="font-medium leading-none">Subtitle Line:</h4>
            <p className="text-sm text-muted-foreground select-text m-1">{fullRow?.text as string}</p>
            <h4 className="font-medium leading-none">{fullRow?.translation ? "Translation:" : null}</h4>
            <p className="text-sm text-muted-foreground select-text m-1">{fullRow?.translation as string}</p>
            <h3>Select Hard Word:</h3>
            <ul>
                {fullRow?.text?.replace(/[,.-?![\]\"]/g, '').split(' ').filter((word: string) => word !== '').map((word: string, index: number) => (
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
            <Button className="mt-2" onClick={() =>
                handleAddToHardWords(selectedWord, fullRow?.text as string, fullRow?.translation as string, selectedSubtitle?.subtitleTitle || '', selectedSubtitle?.youtubeUrl || '', selectedSubtitle?.userId || '')}
            >Add to Hard Words</Button>
            <Button className="mt-2 absolute right-4" onClick={() => handleEditSentence(fullRow?.id as number, fullRow?.text as string, fullRow?.translation as string, selectedSubtitle?.youtubeUrl || '', selectedSubtitle?.userId || '')
            }
            >Edit</Button>
            <PopoverClose asChild className="absolute right-0 top-0 cursor-pointer">
                <button className="p-3">
                    <Cross1Icon className="w-4 h-4" />
                </button>
            </PopoverClose>
        </>
    );
};
