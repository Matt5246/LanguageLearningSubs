import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import SubsEditor from "@/services/subtitleConverter";

interface AddSubtitlesButtonProps {
    setSubtitleConverted: any;
    updateTitle: any;
}

export function AddSubtitlesButton({ setSubtitleConverted, updateTitle }: AddSubtitlesButtonProps) {
    const { toast } = useToast();
    const [subtitleText, setSubtitleText] = useState("");
    const [title, setTitle] = useState<string>('');
    const [episode, setEpisode] = useState<number>();
    const [selectedFileType, setSelectedFileType] = useState("srt");

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const text = e.target?.result as string;
                setSubtitleText(text);
            };
            reader.readAsText(file);
        }
    };

    const handleDrop = (event: React.DragEvent<HTMLTextAreaElement>) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const text = e.target?.result as string;
                setSubtitleText(text);
            };
            reader.readAsText(file);
        } else {
            toast({
                title: "Invalid file type",
                description: "Please drop a valid .txt subtitle file.",
                variant: "destructive",
            });
        }
    };



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
        setSubtitleConverted(SubtitleText);
        updateTitle({
            subtitleTitle: title,
            episode: episode,
        });

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
                    <p className="mb-2">Subtitle episode:</p>
                    <Input
                        type="number"
                        className="mb-2"
                        placeholder="add episode number (optional)"
                        value={episode}
                        onChange={(e) => setEpisode(parseInt(e.target.value))}
                    />
                    <p>Subtitle text:</p>
                    <Textarea
                        placeholder="Enter subtitle text or drop a .txt file here"
                        className="mb-3 mt-3"
                        value={subtitleText}
                        onChange={(e) => setSubtitleText(e.target.value)}
                        onDrop={handleDrop}
                    />
                    <div className="mb-3 mt-3">
                        <Input type="file" accept=".txt" onChange={handleFileChange} />
                    </div>
                    <RadioGroup defaultValue="auto" onValueChange={(value) => setSelectedFileType(value)}>
                        <div>
                            <RadioGroupItem value="auto" className="mr-2" />
                            <Label htmlFor="option-auto">auto</Label>
                        </div>
                        <div>
                            <RadioGroupItem value="srt" className="mr-2" />
                            <Label htmlFor="option-srt">.srt</Label>
                        </div>
                        <div>
                            <RadioGroupItem value="ass" className="mr-2" />
                            <Label htmlFor="option-ass">.ass</Label>
                        </div>
                    </RadioGroup>
                    <Button className="mt-4 absolute right-3 bottom-3" onClick={handleAddSubtitles}>
                        Submit
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    );
}
