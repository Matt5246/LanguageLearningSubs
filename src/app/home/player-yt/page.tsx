'use client'
import { getSubs } from "@/components/NavBar";
import { GearButton } from "@/components/SettingsButton";
import SettingsDrawerContent from "@/components/SettingsDrawer";
import { DataTable } from "@/components/Subtitles/SubtitlesListTanstack";
import SubtitlesSkeleton from "@/components/Subtitles/SubtitlesSkeleton";
import VideoPlayer from "@/components/VideoPlayer";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerTrigger } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import { useIsMobile } from '@/hooks/useMobile';
import { addSubtitle, initializeSubtitles } from '@/lib/features/subtitles/subtitleSlice';
import { useSelector, useDispatch } from 'react-redux'
import { useQuery } from "@tanstack/react-query";
import axios from 'axios';
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
const isValidYouTubeUrl = (url: string) => {
    const youtubeRegex = /^(https?\:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/|v\/)|youtu\.be\/)[\w\-]+/;
    return youtubeRegex.test(url);
};

const Home = () => {
    const [url, setUrl] = useState<string>('');
    const { toast } = useToast();
    const session = useSession();
    const userEmail = session?.data?.user?.email;
    const dispatch = useDispatch();
    const [title, setTitle] = useState<string>('Subtitle Title');
    const isMobile = useIsMobile();
    const [targetLanguage, setTargetLanguage] = useState("");
    const [sourceLanguage, setSourceLanguage] = useState("");
    const subtitlesData: Subtitle[] = useSelector((state: { subtitle: { subtitles: Subtitle[] } }) => state.subtitle.subtitles ?? []);
    const cachedSubtitle = subtitlesData.find((subtitle) => subtitle.youtubeUrl === url);

    const { data, error, isLoading, refetch } = useQuery({
        queryKey: ['captions', url],
        queryFn: async () => {
            const response = await axios.post('/api/captions', {
                youtubeUrl: url
            },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

            setTitle(response.data.videoDetails.title)
            if (response.data.deSubtitles.length !== 0) {
                return response.data.deSubtitles;
            } else if (response.data.enSubtitles.length !== 0) {
                return response.data.enSubtitles;
            } else if (response.data.videoDetails.subtitles.length !== 0) {
                console.log("captions returned", response.data.videoDetails.subtitles)
                return response.data.videoDetails.subtitles;
            } else {
                throw new Error('No subtitles found');
            }
        },
        enabled: false,
        retry: true,
        staleTime: 60000,
    })
    const { isFetching, refetch: refetch2 } = useQuery({
        queryKey: ['saveCaptions', url],
        queryFn: async () => {
            try {
                const subtitle = {
                    email: userEmail,
                    youtubeUrl: url,
                    subtitleTitle: title,
                    subtitleData: data,
                    sourceLang: sourceLanguage || undefined,
                    targetLang: targetLanguage || undefined,
                    hardWords: [],
                }

                if (!userEmail) {
                    throw new Error('User email not found in session.');
                }
                if (!url) {
                    throw new Error('Youtube url not found in session.');
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
                const subtitles = await getSubs(userEmail ?? "");
                dispatch(initializeSubtitles(subtitles));
                console.log(res)
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

    if (error) {
        toast({
            title: "Ups something went wrong!",
            description: error ? error.toString() : undefined,
            action: <ToastAction altText="Ok!">Ok!</ToastAction>,
            variant: 'destructive',
        })
    }
    useEffect(() => {
        const readClipboardText = async () => {
            try {
                const text = await navigator.clipboard.readText();
                if (isValidYouTubeUrl(text) && text !== url) {
                    toast({
                        title: "Found YouTube URL",
                        description: "Use URL from clipboard.",
                        action: (
                            <ToastAction altText="Use URL" onClick={() => setUrl(text)}>
                                Use
                            </ToastAction>
                        ),
                    });
                }
            } catch (err) {
                console.error(err);
            }
        };
        readClipboardText();

        if (url && isValidYouTubeUrl(url)) {
            console.log('URL:', url);
            refetch();
        }
    }, [url, toast, refetch]);
    return (
        <div className="m-4 h-[1000px]" >
            <Drawer>
                {isMobile ?
                    <>
                        <div className="rounded-lg border min-h-[300px]">
                            <div className="flex flex-col h-full p-2">
                                <div className="flex">
                                    <Input type="text" value={url} onChange={(event) => setUrl(event.target.value)} placeholder="Enter YouTube URL" className="mr-2" />
                                    {userEmail ? (
                                        <>
                                            <Button onClick={() => refetch2()} disabled={isLoading || isFetching}>
                                                {isLoading || isFetching ? 'Loading...' : 'Save Subtitles'}
                                            </Button>
                                            <DrawerTrigger asChild>
                                                <GearButton />
                                            </DrawerTrigger>
                                        </>
                                    ) : (
                                        <span className="text-nowrap m-2 font-bold">Log in to save subs</span>
                                    )}
                                </div>
                                <div className="p-2 h-full">
                                    <VideoPlayer url={url} />
                                </div>
                            </div>
                        </div>
                        {!isLoading && !error && data && (
                            cachedSubtitle ? (
                                <DataTable captions={cachedSubtitle.subtitleData as Caption[]} height="1000px" />
                            ) : (
                                <DataTable captions={data as Caption[]} height="1000px" />
                            )
                        )}

                        {!isLoading && !error && !data && (
                            <SubtitlesSkeleton />
                        )}
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
                                    <Input type="text" value={url} onChange={(event) => setUrl(event.target.value)} placeholder="Enter YouTube URL" className="mr-2" />
                                    {userEmail ? (
                                        <>
                                            <Button onClick={() => refetch2()} disabled={isLoading || isFetching} className="mr-2">
                                                {isLoading || isFetching ? 'Loading...' : 'Save Subtitles'}
                                            </Button>
                                            <DrawerTrigger asChild>
                                                <GearButton />
                                            </DrawerTrigger>
                                        </>
                                    ) : (
                                        <span className="text-nowrap m-2 font-bold">Log in to save subs</span>
                                    )}
                                </div>
                                <div className="p-2 h-full">
                                    {url && <VideoPlayer url={url} />}
                                </div>
                            </div>
                        </ResizablePanel>
                        <ResizableHandle withHandle />
                        <ResizablePanel defaultSize={35} >
                            {!isLoading && !error && data && (
                                cachedSubtitle ? (
                                    <DataTable captions={cachedSubtitle.subtitleData as Caption[]} height="1000px" />
                                ) : (
                                    <DataTable captions={data as Caption[]} height="1000px" />
                                )
                            )}
                            {!isLoading && !error && !data && url && (
                                <SubtitlesSkeleton />
                            )}
                            <div className="flex justify-center items-center h-full">
                                <p className="text-center">No subtitles detected.</p>
                            </div>
                        </ResizablePanel>
                    </ResizablePanelGroup>
                }
                <SettingsDrawerContent
                    setTargetLanguage={setTargetLanguage}
                    setSourceLanguage={setSourceLanguage}
                />
            </Drawer>
        </div >
    );


};

export default Home;

