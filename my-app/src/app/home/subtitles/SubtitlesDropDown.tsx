import * as React from "react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";



export function SubtitlesDropDown({ data, setSelectedSubtitle }: SubtitlesDropDownProps) {
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
                <DropdownMenuContent className="p-0">
                    {data.length > 0 ? (
                        data.map((subtitle, index) => (
                            <DropdownMenuItem
                                key={index}
                                onClick={() => {
                                    setSelectedSubtitle(subtitle);
                                    setOpen(false);
                                }}
                            >
                                {subtitle.subtitleTitle}
                            </DropdownMenuItem>
                        ))
                    ) : (
                        <DropdownMenuItem disabled>No subtitles available</DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onClick={() => {
                            setSelectedSubtitle(null);
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
