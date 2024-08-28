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
import { SubtitlesState, addSubtitle } from '@/lib/features/subtitles/subtitleSlice';
import { DataTable } from "@/components/Subtitles/SubtitlesListTanstack";
import { setSelectedSubtitle } from '@/lib/features/subtitles/subtitleSlice'
import { useIsMobile } from '@/hooks/useMobile'
import { GearIcon } from '@radix-ui/react-icons';
import { Drawer, DrawerTrigger } from "@/components/ui/drawer";
import { Textarea } from "@/components/ui/textarea"
import { useSelector } from 'react-redux'
import SubsEditor from "@/services/subtitleConverter";
import { SubtitlesDropDown } from "../subtitles/SubtitlesDropDown";
import mkvExtract from "@/lib/mkvExtract"
import SettingsDrawerContent from "@/components/SettingsDrawer";

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
    console.log(targetLanguage, sourceLanguage)
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
    const handleAddSubtitles = () => {
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
        const SubtitleText = SubsEditor(subtitleText, selectedFileType);

        console.log("SubtitleText", SubtitleText);

        setSubtitleConverted(SubtitleText)

        toast({
            title: "Success!",
            description: "Subtitles added succesfully!",
        })
    };
    const { isFetching, refetch: refetch2 } = useQuery({
        queryKey: ['saveCaptions'],
        queryFn: async () => {
            try {
                if (subtitleConverted.length === 0) {
                    throw new Error('Subtitle text not found.');
                }
                const subtitle = {
                    email: userEmail,
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
        if (selectedSub?.subtitleData) {
            if (selectedSub?.youtubeUrl !== null) {
                setUrl(selectedSub?.youtubeUrl as string);
            }
            setSubtitleConverted(selectedSub?.subtitleData)
        } else {
            setUrl("")
            setVideoFile(null)
            setSubtitleConverted(null)
        }
    }, [selectedSub]);


    return (
        <div className="m-4 h-[1000px]" >
            <Drawer>
                <Popover>
                    {isMobile ?
                        <>
                            <div className="rounded-lg border min-h-[300px]">
                                <div className="flex flex-col h-full p-2">
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
                                        {url && <VideoPlayer url={url} track={subtitleConverted} />}
                                    </div>
                                </div>
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
                                <div className="flex flex-col h-full p-2">
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
                                        {url && <VideoPlayer url={url} track={subtitleConverted} />}
                                    </div>
                                </div>

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
                    <SettingsDrawerContent selectedSub={selectedSub} setTargetLanguage={setTargetLanguage} setSourceLanguage={setSourceLanguage} />
                    <PopoverContent className="p-4 ml-4 rounded-lg shadow-md ">
                        <div>
                            <p className="mb-2">Subtitle title:</p>
                            <Input type="text" className="mb-2" placeholder="set title" onChange={(e) => setTitle(e.target.value)} />
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
                            <Button className="mt-4 absolute right-3 bottom-3" onClick={handleAddSubtitles}>Submit</Button>
                        </div>
                    </PopoverContent>
                </Popover>
            </Drawer>
        </div>
    );
};

export default Home;

