'use client'
import { useState, useMemo, useEffect } from "react";
import VideoPlayer from "@/components/VideoPlayer";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable"
import axios from 'axios';
import SubtitlesSkeleton from "@/components/Subtitles/SubtitlesSkeleton"
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast"
import { ToastAction } from "@/components/ui/toast"
import { useSession } from "next-auth/react";
import { useAppDispatch } from '@/lib/hooks';
import { SubtitlesState, addSubtitle, Subtitle } from '@/lib/features/subtitles/subtitleSlice';
import { DataTable } from "@/components/Subtitles/SubtitlesListTanstack";
import { setSelectedSubtitle } from '@/lib/features/subtitles/subtitleSlice'
import { useIsMobile } from '@/hooks/useMobile'
import { GearIcon } from '@radix-ui/react-icons';
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger, DrawerDescription } from "@/components/ui/drawer";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { EuropeLanguages, AsiaLanguages } from '@/lib/utils';
import { useSelector } from 'react-redux'
import TranslateSubtitle from "../subtitles/TranslateSubtitle";
import SubsEditor from "@/services/subtitleConverter";
import { SubtitlesDropDown } from "../subtitles/SubtitlesDropDown";
import mkvExtract from "@/lib/mkvExtract"

const Home = () => {
    const subtitlesData: Subtitle[] = useSelector((state: { subtitle: SubtitlesState }) => state.subtitle.subtitles);
    const selectedSub: Subtitle = useSelector((state: any) => state.subtitle.subtitles.find((subtitle: any) => subtitle.SubtitleId === state.subtitle.selectedSubtitle));
    const { toast } = useToast();
    const session = useSession();
    const [subtitleText, setSubtitleText] = useState("");
    const [subtitleConverted, setSubtitleConverted] = useState<any>([]);
    const [selectedFileType, setSelectedFileType] = useState("srt");
    const userEmail = session?.data?.user?.email;
    const dispatch = useAppDispatch();
    const [title, setTitle] = useState<string>('');
    const isMobile = useIsMobile();
    const [targetLanguage, setTargetLanguage] = useState("");
    const [sourceLanguage, setSourceLanguage] = useState("");
    //const selectedSub: Subtitle = useSelector((state: any) => state.subtitle.subtitles.find((subtitle: any) => subtitle.SubtitleId === state.subtitle.selectedSubtitle));
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [url, setUrl] = useState<string>('');

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        console.log('file', file)
        if (file.type.startsWith('video/')) {
            setVideoFile(file);
            setUrl(URL.createObjectURL(file));
            mkvExtract(file, (error: any, files: any) => {
                let subtitle;
                const fonts = [];
                for (let f of files) {
                    if ((f.name.endsWith(".ass") || f.name.endsWith(".ssa")) && !subtitle)
                        subtitle = URL.createObjectURL(new Blob([f.data]));
                    else if (f.name.endsWith(".ttf"))
                        fonts.push(URL.createObjectURL(new Blob([f.data])));
                }
                console.log(
                    // 'file prev:', file.preview,
                    'subtitle', subtitle,
                    'fonts', fonts
                );
            })
        } else {
            toast({
                title: "Error!",
                description: "Please drop a video file here!",
            })
        }
    };
    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
    };
    const handleSaveSubtitles = () => {
        if (!subtitleText.trim()) {
            toast({
                title: "Enter subtitle text",
                description: "Subtitles text is missing!",
                variant: "destructive",
            })
            return;
        }
        if (title === '') {
            toast({
                title: "Enter subtitle title",
                description: "Subtitles text is missing!",
                variant: "destructive",
            })
            return;
        }
        const youtubeSubtitleText = SubsEditor(subtitleText, selectedFileType);

        console.log(youtubeSubtitleText);

        setSubtitleConverted(youtubeSubtitleText)
        console.log(subtitleConverted);
        toast({
            title: "Success!",
            description: "Subtitles added succesfully!",
        })
    };
    const { isFetching, refetch: refetch2 } = useQuery({
        queryKey: ['saveCaptions', url],
        queryFn: async () => {
            try {
                if (subtitleConverted.length === 0) {
                    throw new Error('Subtitle text not found.');
                }
                const subtitle = {
                    email: userEmail,
                    youtubeUrl: url,
                    subtitleTitle: title,
                    subtitleData: subtitleConverted,
                    sourceLang: sourceLanguage || null,
                    targetLang: targetLanguage || null,
                    hardWords: [],
                }

                if (!userEmail) {
                    throw new Error('User email not found in session.');
                }
                const res = await axios.post('/api/subtitles/create', {
                    ...subtitle
                },
                    {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }
                ).then(() => dispatch(addSubtitle(subtitle))
                ).catch((e) => toast({
                    title: "Error saving subtitles",
                    description: e ? e.toString() : "Something went wrong while saving subtitles.",
                    variant: 'destructive',
                }));

                //dispatch(setSelectedSubtitle(res?.subtitle?.SubtitleId || null))

                console.log("success")
            } catch (error) {
                console.error('Error saving subtitles:', error);
                toast({
                    title: "Error saving subtitles",
                    description: error ? error.toString() : "Something went wrong while saving subtitles.",
                    variant: 'destructive',
                });
            }
        },
        enabled: false,
        retry: true,
    })
    useEffect(() => {
        if (selectedSub?.youtubeUrl) {
            setUrl(selectedSub?.youtubeUrl as string);
            setSubtitleConverted(selectedSub?.subtitleData)
        } else {
            setUrl("")
            setSubtitleConverted(null)
        }
    }, [selectedSub]);

    const memorizedUrl = useMemo(() => url, [url]);

    const VideoPlayerBlock = () => {
        return <div className="flex flex-col h-full p-2">
            <div className="flex">
                <SubtitlesDropDown data={subtitlesData as any[]} />
                <Input type="text" value={url} disabled placeholder="Your video URL" className="mx-2" />
                {userEmail ?
                    <>
                        {selectedSub ? null : <>
                            <PopoverTrigger asChild>
                                <Button className="mr-2 w-[115px]">Add Subtitles</Button>
                            </PopoverTrigger>

                            <Button onClick={() => refetch2()} disabled={isFetching}> {isFetching ? 'Loading...' : 'Save Subtitles'}</Button>
                            <DrawerTrigger asChild>
                                <Button variant="secondary" className="p-2 ml-2"><GearIcon className="w-5 h-5" /></Button>
                            </DrawerTrigger></>
                        }

                    </>
                    : <span className="text-nowrap m-2 font-bold">Log in to save subs</span>}

            </div>
            <div className="p-2 h-full" onDrop={handleDrop} onDragOver={handleDragOver}>
                {!videoFile && !url && (
                    <div className="flex justify-center items-center h-full">
                        <p className="mr-4 text-gray-600">Drop your video here</p>
                        <Input
                            type="file"
                            className="w-[220px] "
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    setVideoFile(file);
                                    setUrl(URL.createObjectURL(file));
                                }
                            }}
                        />
                    </div>
                )}
                {memorizedUrl && <VideoPlayer url={memorizedUrl} />}
            </div>
        </div>;
    }
    return (
        <div className="m-4 h-[1000px]" >
            <Drawer>
                <Popover>
                    {isMobile ?
                        <>
                            <div className="rounded-lg border min-h-[300px]">
                                <VideoPlayerBlock />
                            </div>
                            {subtitleConverted?.length > 0 ?
                                <DataTable captions={subtitleConverted as Caption[]} height="1000px" />
                                : null}
                            <div className="flex justify-center items-center h-full">
                                <p className="text-center">No subtitles detected.</p>
                            </div>
                        </>
                        : <ResizablePanelGroup
                            direction="horizontal"
                            className="rounded-lg border"
                        >
                            <ResizablePanel defaultSize={65}>
                                <VideoPlayerBlock />
                            </ResizablePanel>
                            <ResizableHandle withHandle />
                            <ResizablePanel defaultSize={35} >
                                {subtitleConverted?.length > 0 ?
                                    <DataTable captions={subtitleConverted as Caption[]} height="1000px" />
                                    : null}
                                <div className="flex justify-center items-center h-full">
                                    <p className="text-center">No subtitles detected.</p>
                                </div>
                            </ResizablePanel>

                        </ResizablePanelGroup>}
                    <DrawerContent>
                        <DrawerHeader className="text-left">
                            <DrawerTitle className="text-center">Edit subtitle profile</DrawerTitle>
                            <DrawerDescription className="text-center">
                                Make changes to your subtitle profile here. Click save when you are done.
                            </DrawerDescription>
                            <DrawerTitle>Edit preferences</DrawerTitle>
                            <DrawerDescription>
                                Pick your prefered language to translate to.
                            </DrawerDescription>
                            <Select onValueChange={setTargetLanguage}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Select language" />
                                </SelectTrigger>
                                <SelectContent >
                                    <SelectGroup>
                                        <SelectLabel className="font-bold text-md">Europe</SelectLabel>
                                        {EuropeLanguages.map((language) => (
                                            <SelectItem key={language.value} value={language.value}>
                                                {language.label}
                                            </SelectItem>
                                        ))}

                                        <SelectLabel className="font-bold text-md">Asia</SelectLabel>
                                        {AsiaLanguages.map((language) => (
                                            <SelectItem key={language.value} value={language.value}>
                                                {language.label}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            <DrawerDescription>
                                Optional, pick your subtitles language you want to get from youtube, if exists.
                            </DrawerDescription>
                            <Select onValueChange={setSourceLanguage} defaultValue={"auto"}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Select language" />
                                </SelectTrigger>
                                <SelectContent >
                                    <SelectGroup>
                                        <SelectItem className="font-bold" key="auto" value="auto">
                                            auto
                                        </SelectItem>
                                        <SelectLabel className="font-bold">Europe</SelectLabel>
                                        {EuropeLanguages.map((language) => (
                                            <SelectItem key={language.value} value={language.value}>
                                                {language.label}
                                            </SelectItem>
                                        ))}
                                        <SelectLabel className="font-bold">Asia</SelectLabel>
                                        {AsiaLanguages.map((language) => (
                                            <SelectItem key={language.value} value={language.value}>
                                                {language.label}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            {selectedSub ? <TranslateSubtitle selectedSubtitle={selectedSub as Subtitle} SubtitleId={selectedSub?.SubtitleId} /> : null}
                        </DrawerHeader>
                        <DrawerFooter className="pt-2">
                            <DrawerClose asChild>
                                <Button variant="default">save</Button>
                            </DrawerClose>
                            <DrawerClose asChild>
                                <Button variant="outline">Cancel</Button>
                            </DrawerClose>
                        </DrawerFooter>
                    </DrawerContent>
                    <PopoverContent className="p-4 ml-4 rounded-lg shadow-md ">
                        <div>
                            <p className="mb-2">Subtitle title:</p>
                            <Input type="text" className="mb-2" placeholder="set title" onChange={(e: any) => setTitle(e)} />
                            <p >Subtitle text:</p>
                            <Textarea
                                placeholder="Enter subtitle text"
                                className="mb-3 mt-3 "
                                value={subtitleText}
                                onChange={(e) => setSubtitleText(e.target.value)}
                            />
                            <RadioGroup defaultValue="srt" onValueChange={(value) => setSelectedFileType(value)}>
                                <div >
                                    <RadioGroupItem value="srt" className="mr-2" />
                                    <Label htmlFor="option-srt">.srt</Label>
                                </div>
                                <div>
                                    <RadioGroupItem value="ass" className="mr-2" />
                                    <Label htmlFor="option-ass">.ass</Label>
                                </div>
                            </RadioGroup>
                            <Button className="mt-4 absolute right-3 bottom-3" onClick={handleSaveSubtitles}>Submit</Button>
                        </div>
                    </PopoverContent>
                </Popover>
            </Drawer>
        </div>
    );
};

export default Home;
