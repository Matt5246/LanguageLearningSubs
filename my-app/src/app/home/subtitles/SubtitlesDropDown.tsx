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

export function SubtitlesDropDown({ data }: { data: Subtitle[] }) {
    const dispatch = useDispatch()
    const [open, setOpen] = React.useState(false);

    return (
        <div className="flex items-center space-x-4">
            <p className="text-sm text-muted-foreground">Subtitles</p>
            <DropdownMenu open={open} onOpenChange={setOpen}>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-[150px] justify-start">
                        Choose subtitles
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="p-1 w-[290px] md:w-[400px]">
                    {data.length > 0 ? (
                        data.map((subtitle, index: number) => (
                            <DropdownMenuItem
                                key={index}
                                onClick={() => {
                                    dispatch(setSelectedSubtitle(subtitle?.SubtitleId || null));
                                    setOpen(false);
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
                            setOpen(false);
                        }}
                    >
                        Clear Selection
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
