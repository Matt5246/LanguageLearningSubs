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
import { ToggleAutoScrollButton } from "@/components/ToggleAutoScrollButton";
import { AddSubtitlesButton } from "@/components/AddSubtitlesButton";
import TranslateSubtitle from "../subtitles/TranslateSubtitle";

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

                // dispatch(setSelectedSubtitle(res?.SubtitleId || null))

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
                {isMobile ?
                    <>
                        <div className="rounded-lg border min-h-[300px]">
                            <div className="flex flex-col h-full p-2">
                                <div className="flex space-x-2 ">
                                    <SubtitlesDropDown data={subtitlesData as any[]} />
                                    {subtitleConverted?.length > 0 ? <Input type="text" value={url} disabled placeholder="Your video URL" className="mx-2" /> : null}
                                    {userEmail ?
                                        <>
                                            {selectedSub ? null : <>
                                                <AddSubtitlesButton setSubtitleConverted={setSubtitleConverted} updateTitle={setTitle} />
                                                <Button onClick={() => refetch2()} disabled={isFetching}> {isFetching ? 'Loading...' : 'Save Subtitles'}</Button>
                                            </>
                                            }
                                        </>
                                        : <span className="text-nowrap m-2 font-bold">Log in to save subs</span>}
                                    <DrawerTrigger asChild>
                                        <Button variant="secondary" className="p-2 ml-2"><GearIcon className="w-5 h-5" /></Button>
                                    </DrawerTrigger>
                                </div>
                                <div className="flex justify-center mt-10 h-full" onDrop={handleDrop} onDragOver={handleDragOver}>
                                    {!videoFile && !url && (
                                        <div>
                                            <p className="text-gray-600 mb-3">Drop your video here</p>
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
                            : <div className="flex justify-center items-center h-full">
                                <p className="text-center">No subtitles detected.</p>
                            </div>}


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
                                                <AddSubtitlesButton setSubtitleConverted={setSubtitleConverted} updateTitle={setTitle} />

                                                <Button onClick={() => refetch2()} disabled={isFetching}> {isFetching ? 'Loading...' : 'Save Subtitles'}</Button>
                                            </>
                                            }

                                        </>
                                        : <span className="text-nowrap m-2 font-bold">Log in to save subs</span>}
                                    <DrawerTrigger asChild>
                                        <Button variant="secondary" className="p-2 ml-2"><GearIcon className="w-5 h-5" /></Button>
                                    </DrawerTrigger>
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
                                : <div className="flex justify-center items-center h-full">
                                    <p className="text-center">No subtitles detected.</p>
                                </div>}

                        </ResizablePanel>
                    </ResizablePanelGroup>}
                <SettingsDrawerContent selectedSub={selectedSub} setTargetLanguage={setTargetLanguage} setSourceLanguage={setSourceLanguage} />
            </Drawer>
            <div className="my-4 space-x-4">
                <ToggleAutoScrollButton />
                {selectedSub ? <TranslateSubtitle selectedSubtitle={selectedSub as Subtitle} SubtitleId={selectedSub?.SubtitleId} /> : null}
            </div>
        </div>
    );
};

export default Home;

