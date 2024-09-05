import * as React from "react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuSub,
    DropdownMenuSubTrigger,
    DropdownMenuSubContent,
    DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";
import { setSelectedSubtitle } from '@/lib/features/subtitles/subtitleSlice';
import { useDispatch } from "react-redux";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

// Assuming your Subtitle type is something like this
type Subtitle = {
    SubtitleId: string;
    subtitleTitle: string;
    episode?: number;
};

export function SubtitlesDropDown({ data }: { data: Subtitle[] }) {
    const dispatch = useDispatch();
    const [title, setTitle] = React.useState("");

    const groupedSubtitles = data.reduce((acc: { [key: string]: Subtitle[] }, subtitle) => {
        if (!acc[subtitle.subtitleTitle]) {
            acc[subtitle.subtitleTitle] = [];
        }
        acc[subtitle.subtitleTitle].push(subtitle);
        return acc;
    }, {});

    return (
        <div className="flex items-center space-x-4">
            <TooltipProvider>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="min-w-[150px] max-w-[250px] justify-start overflow-hidden">
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <span className="whitespace-nowrap overflow-hidden overflow-ellipsis">
                                        {title ? title : 'Choose subtitles'}
                                    </span>
                                </TooltipTrigger>
                                <TooltipContent>
                                    {title ? title : 'Choose subtitles'}
                                </TooltipContent>
                            </Tooltip>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="p-1 w-[290px] md:w-[400px]">
                        {Object.keys(groupedSubtitles).length > 0 ? (
                            Object.keys(groupedSubtitles).map((subtitleTitle, index) => {
                                const subtitles = groupedSubtitles[subtitleTitle];
                                const sortedSubtitles = subtitles.sort((a, b) => (a.episode || 0) - (b.episode || 0));

                                if (subtitles.length === 1 && !subtitles[0].episode) {
                                    return (
                                        <DropdownMenuItem
                                            key={index}
                                            onClick={() => {
                                                dispatch(setSelectedSubtitle(subtitles[0].SubtitleId));
                                                setTitle(subtitleTitle);
                                            }}
                                        >
                                            {subtitleTitle}
                                        </DropdownMenuItem>
                                    );
                                } else {
                                    return (
                                        <DropdownMenuSub key={index}>
                                            <DropdownMenuSubTrigger>
                                                {subtitleTitle}
                                            </DropdownMenuSubTrigger>
                                            <DropdownMenuPortal>
                                                <DropdownMenuSubContent>
                                                    {sortedSubtitles.map((subtitle, subIndex) => (
                                                        <DropdownMenuItem
                                                            key={subIndex}
                                                            onClick={() => {
                                                                dispatch(setSelectedSubtitle(subtitle.SubtitleId));
                                                                setTitle(`${subtitle.subtitleTitle} ${subtitle.episode ? `- ep${subtitle.episode}` : ""}`);
                                                            }}
                                                        >
                                                            {subtitle.episode ? `Episode ${subtitle.episode}` : "No episode"}
                                                        </DropdownMenuItem>
                                                    ))}
                                                </DropdownMenuSubContent>
                                            </DropdownMenuPortal>
                                        </DropdownMenuSub>
                                    );
                                }
                            })
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
