import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useSelector } from "react-redux";
import { SubtitlesState } from '@/lib/features/subtitles/subtitleSlice';
import SubsEditor from "@/services/subtitleConverter";

interface AddSubtitlesButtonProps {
    handleAddSubtitles: any;
    defaultSubs?: any;
}

export function AddSubtitlesButton({ handleAddSubtitles, defaultSubs }: AddSubtitlesButtonProps) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button className="w-[115px]">Add Subtitles</Button>
            </PopoverTrigger>
            <SubtitlePopoverContent handleAddSubtitles={handleAddSubtitles} defaultSubs={defaultSubs} />
        </Popover>
    );
}

export const SubtitlePopoverContent = ({ handleAddSubtitles, defaultSubs }: AddSubtitlesButtonProps) => {
    const { toast } = useToast();
    const subtitlesData: Subtitle[] = useSelector((state: { subtitle: SubtitlesState }) => state.subtitle.subtitles ?? []);
    const [subtitleText, setSubtitleText] = useState<string>(defaultSubs?.text);
    const [title, setTitle] = useState<string>(defaultSubs?.title);
    const [episode, setEpisode] = useState<number | string>();
    const [selectedFileType, setSelectedFileType] = useState("auto");
    const savedTitles = Array.from(new Set(Array.isArray(subtitlesData) ? subtitlesData.map(subtitle => subtitle.subtitleTitle) : []));

    useEffect(() => {
        // Clean up the title by removing any `.*` at the end
        const cleanedTitle = defaultSubs?.title || '';
        setTitle(cleanedTitle);

        // Extract episode number from the title if available
        const episodeMatch = cleanedTitle.match(/(\d+)/);
        if (episodeMatch) {
            setEpisode(parseInt(episodeMatch[0], 10));
        }

        // Check for a similar title in savedTitles
        const similarTitle = savedTitles.find(savedTitle => cleanedTitle.includes(savedTitle));
        if (similarTitle) {
            setTitle(similarTitle);
        }

        setSubtitleText(defaultSubs?.text);
    }, [defaultSubs]);

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

    const handleSubmit = () => {
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

        handleAddSubtitles(SubtitleText, {
            subtitleTitle: title,
            ...(episode && { episode: episode.toString() })
        });

        toast({
            title: "Success!",
            description: "Subtitles added successfully!",
        });
    };

    return (
        <PopoverContent className="p-4 ml-4 rounded-lg shadow-md">
            <div>
                <p className="mb-2">Subtitle title:</p>
                <div className="flex items-center "><Input
                    list="subtitle-titles"
                    placeholder="Select or enter a title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="mb-2"
                />
                    <button className="ml-2 mb-auto text-gray-500 text-xl" onClick={() => setTitle('')}>x</button></div>
                <datalist id="subtitle-titles">
                    {savedTitles.map((title) => (
                        <option key={title} value={title}>
                            {title}
                        </option>
                    ))}
                </datalist>
                <p className="mb-2">Subtitle episode:</p>
                <Input
                    type="number"
                    className="mb-2"
                    placeholder="Add episode number (optional)"
                    value={episode}
                    onChange={(e) => setEpisode(parseInt(e.target.value))}
                />
                <p>Subtitle text:</p>
                <Textarea
                    placeholder="Enter subtitle text or drop a .txt file here"
                    className="mb-3 mt-3 h-[200px]"
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
                <Button className="mt-4 absolute right-3 bottom-3" onClick={handleSubmit}>
                    Submit
                </Button>
            </div>
        </PopoverContent>
    );
};
