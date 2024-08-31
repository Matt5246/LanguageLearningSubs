import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useAppDispatch } from '@/lib/hooks';
import SubsEditor from "@/services/subtitleConverter";
import { addSubtitle } from '@/lib/features/subtitles/subtitleSlice';

interface AddSubtitlesButtonProps {
    setSubtitleConverted: any;
    updateTitle: any
}

export function AddSubtitlesButton({ setSubtitleConverted, updateTitle }: AddSubtitlesButtonProps) {
    const dispatch = useAppDispatch();
    const { toast } = useToast();
    const [subtitleText, setSubtitleText] = useState("");
    const [title, setTitle] = useState<string>('');
    const [selectedFileType, setSelectedFileType] = useState("srt");


    const handleAddSubtitles = () => {
        if (!subtitleText.trim()) {
            toast({
                title: "Enter subtitle text",
                description: "Subtitles text is missing!",
                variant: "destructive",
            });
            return;
        }
        if (title === '') {
            toast({
                title: "Enter subtitle title",
                description: "Subtitles title is missing!",
                variant: "destructive",
            });
            return;
        }
        const SubtitleText = SubsEditor(subtitleText, selectedFileType);
        setSubtitleConverted(SubtitleText)
        updateTitle(title)
        console.log("SubtitleText", SubtitleText);


        toast({
            title: "Success!",
            description: "Subtitles added successfully!",
        });
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button className="mr-2 w-[115px]">Add Subtitles</Button>
            </PopoverTrigger>
            <PopoverContent className="p-4 ml-4 rounded-lg shadow-md">
                <div>
                    <p className="mb-2">Subtitle title:</p>
                    <Input
                        type="text"
                        className="mb-2"
                        placeholder="Set title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <p>Subtitle text:</p>
                    <Textarea
                        placeholder="Enter subtitle text"
                        className="mb-3 mt-3"
                        value={subtitleText}
                        onChange={(e) => setSubtitleText(e.target.value)}
                    />
                    <RadioGroup defaultValue="srt" onValueChange={(value) => setSelectedFileType(value)}>
                        <div>
                            <RadioGroupItem value="srt" className="mr-2" />
                            <Label htmlFor="option-srt">.srt</Label>
                        </div>
                        <div>
                            <RadioGroupItem value="ass" className="mr-2" />
                            <Label htmlFor="option-ass">.ass</Label>
                        </div>
                    </RadioGroup>
                    <Button className="mt-4 absolute right-3 bottom-3" onClick={handleAddSubtitles}>Submit</Button>
                </div>
            </PopoverContent>
        </Popover>
    );
}
