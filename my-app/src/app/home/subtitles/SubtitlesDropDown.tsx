import * as React from "react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { setSelectedSubtitle } from '@/lib/features/subtitles/subtitleSlice';
import { useDispatch } from "react-redux";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

export function SubtitlesDropDown({ data }: { data: Subtitle[] }) {
    const dispatch = useDispatch()
    const [title, setTitle] = React.useState("");

    return (
        <div className="flex items-center space-x-4">
            <TooltipProvider>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="min-w-[150px] max-w-[250px] justify-start overflow-hidden">
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <span className="whitespace-nowrap overflow-hidden overflow-ellipsis">{title ? title : 'Choose subtitles'}</span>
                                </TooltipTrigger>
                                <TooltipContent>
                                    {title ? title : 'Choose subtitles'}
                                </TooltipContent>
                            </Tooltip>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="p-1 w-[290px] md:w-[400px]">
                        {data.length > 0 ? (
                            data.map((subtitle, index: number) => (
                                <DropdownMenuItem
                                    key={index}
                                    onClick={() => {
                                        dispatch(setSelectedSubtitle(subtitle?.SubtitleId || null));
                                        setTitle(subtitle?.subtitleTitle ? subtitle?.subtitleTitle : "")
                                    }}
                                >
                                    {subtitle?.subtitleTitle}
                                </DropdownMenuItem>
                            ))
                        ) : (
                            <DropdownMenuItem disabled>No subtitles available</DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={() => {
                                dispatch(setSelectedSubtitle(null));
                                setTitle("");
                            }}
                        >
                            Clear Selection
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </TooltipProvider>
        </div>
    );
}
