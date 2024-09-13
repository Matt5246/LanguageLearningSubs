import { ColumnDef } from "@tanstack/react-table";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import axios from 'axios'
import { useSelector } from "react-redux";
import { PopoverClose } from "@radix-ui/react-popover";
import { Cross1Icon } from "@radix-ui/react-icons";
import { toast } from "sonner"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

function convertTime(time: number): string {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}
async function handleAddToHardWords(word: string | null, sentence: string, sentenceTranslation: string, subtitleTitle: string, url: string, userId: string) {
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
            toast("Successfully added hard word", {
                description: `Hard word added: ${word} `,
                action: {
                    label: "Close",
                    onClick: () => console.log("Closed"),
                },
            })
        }
    } catch (error) {
        console.error('Error adding word to hard words:', error);
    }
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
    const fullRow = row.row.row.original as Caption;
    const [sentence, setSentence] = useState(fullRow.text);
    const [sentenceTranslation, setSentenceTranslation] = useState(fullRow.translation);
    const selectedSubtitle: Subtitle = useSelector((state: any) => state.subtitle.subtitles.find((subtitle: any) => subtitle.SubtitleId === state.subtitle.selectedSubtitle));
    const [start, setStart] = useState(fullRow.start);
    const [end, setEnd] = useState(fullRow.end);

    const handleEditSentence = async () => {
        try {
            await axios.post('/api/subtitles/subtitleData/update', {
                id: fullRow?.id,
                subtitleDataId: fullRow?.subtitleDataId,
                text: sentence,
                translation: sentenceTranslation,
                start,
                end,
            });
            toast("Sentence updated successfully");
        } catch (error) {
            console.error('Error editing sentence:', error);
            toast("Error updating sentence");
        }
    };
    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>, setValue: (value: number) => void) => {
        const value = parseFloat(e.target.value);
        if (!isNaN(value)) {
            setValue(parseFloat(value.toFixed(2)));
        }
    };

    return (
        <>
            <TooltipProvider>
                <Drawer>
                    <DrawerContent>
                        <DrawerHeader>
                            <DrawerTitle>Edit Sentence</DrawerTitle>
                            <DrawerDescription>Here you can edit the chosen subtitle line</DrawerDescription>
                        </DrawerHeader>
                        <div className="flex justify-between p-4">
                            <div className="w-3/4 mr-4">
                                <label className="block mb-2">
                                    Sentence:
                                    <Textarea
                                        value={sentence}
                                        onChange={(e) => setSentence(e.target.value)}
                                        className="mt-1 p-2 border rounded w-full"
                                    />
                                </label>
                                <label className="block mb-2">
                                    Translation:
                                    <Textarea
                                        value={sentenceTranslation}
                                        onChange={(e) => setSentenceTranslation(e.target.value)}
                                        className="mt-1 p-2 border rounded w-full"
                                    />
                                </label>
                            </div>
                            <div className="w-1/4">
                                <label className="block mb-2">
                                    Start:
                                    <Input
                                        type="number"
                                        value={start}
                                        onChange={(e) => handleNumberChange(e, setStart)}
                                        className="mt-1 p-2 border rounded w-full"
                                    />
                                </label>
                                <label className="block mb-2">
                                    End:
                                    <Input
                                        type="number"
                                        value={end}
                                        onChange={(e) => handleNumberChange(e, setEnd)}
                                        className="mt-1 p-2 border rounded w-full"
                                    />
                                </label>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant='destructive' className="w-full">Delete</Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Delete this sentence</p>
                                    </TooltipContent>
                                </Tooltip>
                            </div>
                        </div>
                        <DrawerFooter>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button onClick={handleEditSentence}>Save</Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>save changes</p>
                                </TooltipContent>
                            </Tooltip>
                            <DrawerClose>
                                <Button variant="outline" className="w-full">Cancel</Button>
                            </DrawerClose>
                        </DrawerFooter>
                    </DrawerContent>


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
                                        onChange={() => setSelectedWord(word)}
                                    />
                                    {" " + word}
                                </label>
                            </li>
                        ))}
                    </ul>
                    <Button className="mt-2" onClick={() =>
                        handleAddToHardWords(selectedWord, fullRow?.text as string, fullRow?.translation as string, selectedSubtitle?.subtitleTitle || '', selectedSubtitle?.youtubeUrl || '', selectedSubtitle?.userId || '')}
                    >Add to Hard Words</Button>
                    <DrawerTrigger asChild>
                        <Button className="mt-2 absolute right-4">Edit</Button>
                    </DrawerTrigger>
                    <PopoverClose asChild className="absolute right-0 top-0 cursor-pointer">
                        <button className="p-3">
                            <Cross1Icon className="w-4 h-4" />
                        </button>
                    </PopoverClose>
                </Drawer>
            </TooltipProvider>
        </>
    );
};
