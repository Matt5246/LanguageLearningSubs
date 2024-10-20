'use client'
import { useState, useEffect } from "react";
import VideoPlayer from "@/components/VideoPlayer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable"
import axios from 'axios';
import SubtitlesSkeleton from "@/components/Subtitles/SubtitlesSkeleton"
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast"
import { useSession } from "next-auth/react"
import { useAppDispatch } from '@/lib/hooks'
import { SubtitlesState, initializeSubtitles } from '@/lib/features/subtitles/subtitleSlice';
import { DataTable } from "@/components/Subtitles/SubtitlesListTanstack"
import { useIsMobile } from '@/hooks/useMobile'
import { Drawer, DrawerTrigger } from "@/components/ui/drawer"
import { useSelector } from 'react-redux'
import { SubtitlesDropDown } from "../subtitles/SubtitlesDropDown"
import mkvExtract from "@/lib/mkvExtract"
import SettingsDrawerContent from "@/components/SettingsDrawer"
import { ToggleAutoScrollButton } from "@/components/ToggleAutoScrollButton"
import { AddSubtitlesButton } from "@/components/AddSubtitlesButton"
import TranslateSubtitle from "../subtitles/TranslateSubtitle"
import SwapTranslationButton from '@/app/home/subtitles/SwapTranslationButton'
import { getSubs } from "@/components/NavBar"
import FileBrowser from "./fileBrowser"
import { GearButton } from "@/components/SettingsButton"
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"

const Home = () => {
    const dispatch = useAppDispatch();
    const { toast } = useToast();
    const session = useSession();
    const isMobile = useIsMobile();
    const subtitlesData: Subtitle[] = useSelector((state: { subtitle: SubtitlesState }) => state.subtitle.subtitles ?? []);
    const selectedSub: Subtitle | null = useSelector((state: any) =>
        Array.isArray(state.subtitle.subtitles)
            ? state.subtitle.subtitles.find((subtitle: any) => subtitle.SubtitleId === state.subtitle.selectedSubtitle)
            : null
    );
    const [subtitleConverted, setSubtitleConverted] = useState<any>([]);
    const userEmail = session?.data?.user?.email;
    const [titleAndEpisode, setTitleAndEpisode] = useState<{ subtitleTitle: string, episode: string | null }>();
    const [targetLanguage, setTargetLanguage] = useState("");
    const [sourceLanguage, setSourceLanguage] = useState("");
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [videoTitle, setVideoTitle] = useState<string>("")
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
        setVideoTitle(file.name)
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
                    subtitleData: subtitleConverted,
                    ...titleAndEpisode,
                    sourceLang: sourceLanguage || null,
                    targetLang: targetLanguage || null,
                    hardWords: [],
                }
                console.log(subtitle)
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
                ).then(() => (getSubs(userEmail ?? "")
                    .then((subtitles) => {
                        dispatch(initializeSubtitles(subtitles));
                    })
                    .catch((error) => {
                        console.error('Error fetching subtitles:', error);
                    }))

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

    const handleVideoSelect = (videoUrl: string, vidTitle: string) => {
        setUrl(videoUrl)
        setVideoTitle(vidTitle)
    };
    const handleAddSubtitlesButton = (subtitleConverted: any, updateTitle: any) => {
        setSubtitleConverted(subtitleConverted)
        setTitleAndEpisode(updateTitle)
    }
    return (
        <div className="m-4 h-[1000px]" >
            <Drawer>
                {isMobile ?
                    <>
                        <div className="rounded-lg border min-h-[300px]">
                            <div className="flex flex-col h-full p-2">
                                <div className="flex flex-wrap space-x-2">
                                    <SubtitlesDropDown data={subtitlesData as any[]} />
                                    {!videoTitle && !url.startsWith('blob:') ? <Input type="text" value={url} disabled placeholder="Your video URL" className="mx-2" /> : <div className="mx-auto flex items-center">{videoTitle}</div>}

                                    {userEmail ?
                                        <>
                                            {selectedSub ? null : <>
                                                <AddSubtitlesButton handleAddSubtitles={handleAddSubtitlesButton} />
                                                <Button onClick={() => refetch2()} disabled={isFetching}> {isFetching ? 'Loading...' : 'Save Subtitles'}</Button>
                                            </>
                                            }
                                        </>
                                        : <span className="text-nowrap m-2 font-bold">Log in to save subs</span>}
                                    <DrawerTrigger asChild>
                                        <GearButton />
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
                            <DataTable captions={subtitleConverted as Caption[]} height="500px" />
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
                                    {!videoTitle && !url.startsWith('blob:') ? <Input type="text" value={url} disabled placeholder="Your video URL" className="mx-2" /> : <div className="mx-auto flex items-center">{videoTitle}</div>}
                                    {userEmail ?
                                        <>
                                            {selectedSub ? null : <>
                                                <AddSubtitlesButton handleAddSubtitles={handleAddSubtitlesButton} />
                                                <HoverCard>
                                                    <HoverCardTrigger><Button onClick={() => refetch2()} disabled={isFetching}> {isFetching ? 'Loading...' : 'Save Subtitles'}</Button>
                                                    </HoverCardTrigger>
                                                    {titleAndEpisode && <HoverCardContent className="p-4 shadow-lg rounded-lg">
                                                        <div className="text-sm ">
                                                            <span className="font-normal">{titleAndEpisode?.subtitleTitle}</span>
                                                            <div className="flex flex justify-between items-center mt-2 text-xs text-muted-foreground">
                                                                <p className="font-semibold">Episode: <span className="font-normal">{titleAndEpisode?.episode}</span></p>
                                                                <p className="font-semibold">Rows: <span className="font-normal">{subtitleConverted?.length}</span></p>
                                                            </div>
                                                        </div>
                                                    </HoverCardContent>}

                                                </HoverCard>

                                            </>
                                            }

                                        </>
                                        : <span className="text-nowrap m-2 font-bold">Log in to save subs</span>}

                                    <DrawerTrigger asChild >
                                        <GearButton />
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
                {selectedSub ? <SwapTranslationButton selectedSubtitle={selectedSub as Subtitle} /> : null}
            </div>
            <hr />
            <div className="my-5">
                <FileBrowser onVideoSelect={handleVideoSelect} handleAddSubtitles={handleAddSubtitlesButton} />
            </div>
        </div>
    );
};

export default Home;





