'use client'
import { useState, useEffect } from "react"
import { useSelector, useDispatch } from 'react-redux'
import { useQuery } from "@tanstack/react-query"
import { useSession } from "next-auth/react"
import axios from 'axios'
import { Input } from "@/components/ui/input"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Drawer, DrawerTrigger } from "@/components/ui/drawer"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { SubtitlesDropDown } from "../subtitles/SubtitlesDropDown"
import { ToggleAutoScrollButton } from "@/components/ToggleAutoScrollButton"
import TranslateSubtitle from "../subtitles/TranslateSubtitle"
import SwapTranslationButton from '@/app/home/subtitles/SwapTranslationButton'
import FileBrowser from "./fileBrowser"
import SettingsDrawerContent from "@/components/SettingsDrawer"
import { useIsMobile } from '@/hooks/useMobile'
import { SubtitlesState, initializeSubtitles } from '@/lib/features/subtitles/subtitleSlice'
import { getSubs } from "@/components/NavBar"
import mkvExtract from "@/lib/mkvExtract"
import { ControlButtons, ControlButtonsProps, SubtitleArea, VideoUploadArea } from "./VideoControls"
import { Button } from "@/components/ui/button"
import { isValidYouTubeUrl } from "../player-yt/page"
import { ToastAction } from "@/components/ui/toast"


const Home = () => {
    const dispatch = useDispatch();
    const { toast } = useToast();
    const session = useSession();
    const isMobile = useIsMobile();
    const subtitlesData: Subtitle[] = useSelector((state: { subtitle: { subtitles: Subtitle[] } }) => state.subtitle.subtitles ?? []);
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
    const cachedSubtitle = subtitlesData.find((subtitle) => subtitle.youtubeUrl === url);
    console.log('targetLanguage:', targetLanguage);
    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
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
            })
            setVideoTitle(file.name)
        } else {
            toast({
                title: "Error!",
                description: "Please drop a video file here!",
            })
        }
    };
    ////////////////////////////youtube only code//////////////////////////////////
    const { data, error, isLoading, refetch } = useQuery({
        queryKey: ['captions', url],
        queryFn: async () => {
            const response = await axios.post('/api/captions', {
                youtubeUrl: url, sourceLanguage
            }, {
                headers: { 'Content-Type': 'application/json' }
            });

            console.log('response:', response);
            setTitleAndEpisode({ subtitleTitle: response.data.videoDetails.title, episode: null })
            if (Array.isArray(response.data.sourceLangSubtitles) && response.data.sourceLangSubtitles.length !== 0) {
                setSubtitleConverted(response.data.sourceLangSubtitles);
                return response.data.sourceLangSubtitles;
            } else if (response.data.deSubtitles.length !== 0) {
                setSubtitleConverted(response.data.deSubtitles);
                return response.data.deSubtitles;
            } else if (response.data.enSubtitles.length !== 0) {
                setSubtitleConverted(response.data.enSubtitles);
                return response.data.enSubtitles;
            } else {
                setSubtitleConverted(response.data.videoDetails.subtitles);
                return response.data.videoDetails.subtitles;
            }
        },
        enabled: false,
        retry: true,
        staleTime: 60000,
    })
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
        if (url === "") {
            setSubtitleConverted([])
        }
        if (url && isValidYouTubeUrl(url) && !selectedSub) {
            console.log('URL:', url);
            refetch();
        }


    }, [url, toast, refetch]);
    ////////////////////////////youtube only code end//////////////////////////////////
    const { isFetching, refetch: refetch2 } = useQuery({
        queryKey: ['saveCaptions'],
        queryFn: async () => {
            try {
                if (subtitleConverted.length === 0) {
                    throw new Error('Subtitle text not found.');
                }
                const subtitle: {
                    email: string | null | undefined;
                    subtitleData: any;
                    subtitleTitle?: string;
                    episode?: string | null;
                    sourceLang: string;
                    targetLang: string | null;
                    hardWords: never[];
                    youtubeUrl?: string;
                } = {
                    email: userEmail,
                    subtitleData: subtitleConverted,
                    ...titleAndEpisode,
                    sourceLang: sourceLanguage || 'auto',
                    targetLang: targetLanguage || null,
                    hardWords: [],
                }
                if (isValidYouTubeUrl(url)) {
                    subtitle.youtubeUrl = url;
                }
                if (!userEmail) {
                    throw new Error('User email not found in session.');
                }
                await axios.post('/api/subtitles/create', {
                    ...subtitle
                }, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                const subtitles = await getSubs(userEmail ?? "");
                dispatch(initializeSubtitles(subtitles));
                toast({
                    title: "Success",
                    description: "Subtitles saved successfully.",
                });
            } catch (error: string | any) {
                console.error('Error saving subtitles:', error);
                toast({
                    title: "Error saving subtitles",
                    description: error.toString(),
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
                setVideoTitle(selectedSub?.subtitleTitle as string);
                setUrl(selectedSub?.youtubeUrl as string);
            } else {
                setVideoTitle(selectedSub?.subtitleTitle as string);
            }
            setSubtitleConverted(selectedSub?.subtitleData)
        } else {
            setUrl("")
            setVideoTitle("");
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
        <div className="m-2 h-[1000px]">
            <Drawer>
                <Tabs defaultValue="video" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="video">Video Player</TabsTrigger>
                        <TabsTrigger value="subtitles">Subtitles</TabsTrigger>
                        <TabsTrigger value="both">Both</TabsTrigger>
                    </TabsList>
                    <TabsContent value="video">
                        <Card className="">
                            <CardContent className={`p-3 ${isMobile ? "h-[500px]" : "h-[900px]"} `}>
                                <div className="flex flex-wrap items-center gap-4 mb-2">
                                    <SubtitlesDropDown data={subtitlesData as any[]} />
                                    {!videoTitle && !url.startsWith('blob:') ? (
                                        <Input type="text" value={url} disabled={!!selectedSub} onChange={(event) => setUrl(event.target.value)} placeholder="Your video URL" className="flex-1 hidden sm:inline" />
                                    ) : (
                                        <div className="flex-grow text-center">{videoTitle}</div>
                                    )}

                                    {userEmail ? (
                                        <ControlButtons
                                            selectedSub={selectedSub}
                                            handleAddSubtitles={handleAddSubtitlesButton}
                                            refetch2={refetch2}
                                            isFetching={isFetching}
                                            titleAndEpisode={titleAndEpisode}
                                            subtitleConverted={subtitleConverted}
                                        />
                                    ) : (
                                        <span className="text-sm text-muted-foreground">Log in to save subtitles</span>
                                    )}
                                </div>
                                <div className={`${isMobile ? "h-[310px]" : "h-[830px]"} `}>
                                    <VideoUploadArea
                                        onDrop={handleDrop}
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                setVideoFile(file);
                                                setUrl(URL.createObjectURL(file));
                                                setVideoTitle(file.name);
                                            }
                                        }}
                                        videoFile={videoFile}
                                        url={url}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="subtitles">
                        <Card className={`h-[500px] ${subtitleConverted?.length > 0 ? 'border-none' : ''}`}>
                            <SubtitleArea subtitleConverted={cachedSubtitle ? cachedSubtitle.subtitleData : subtitleConverted} height='500px' />
                        </Card>
                    </TabsContent>
                    <TabsContent value="both">
                        {isMobile ? (
                            <div className="space-y-4">
                                <Card>
                                    <CardContent className="p-3">
                                        <div className="flex flex-col space-y-4 mb-2">
                                            <div className="flex flex-wrap items-center gap-4 mb-2">
                                                <SubtitlesDropDown data={subtitlesData as any[]} />
                                                {!videoTitle && !url.startsWith('blob:') ? (
                                                    <Input type="text" value={url} disabled={!!selectedSub} onChange={(event) => setUrl(event.target.value)} placeholder="Your video URL" className="flex-1 hidden sm:inline" />
                                                ) : (
                                                    <div className="flex-grow text-center">{videoTitle}</div>
                                                )}

                                                {userEmail ? (
                                                    <ControlButtons
                                                        selectedSub={selectedSub}
                                                        handleAddSubtitles={handleAddSubtitlesButton}
                                                        refetch2={refetch2}
                                                        isFetching={isFetching}
                                                        titleAndEpisode={titleAndEpisode}
                                                        subtitleConverted={subtitleConverted}
                                                    />
                                                ) : (
                                                    <span className="text-sm text-muted-foreground">Log in to save subtitles</span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="h-[300px]">
                                            <VideoUploadArea
                                                onDrop={handleDrop}
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) {
                                                        setVideoFile(file);
                                                        setUrl(URL.createObjectURL(file));
                                                        setVideoTitle(file.name);
                                                    }
                                                }}
                                                videoFile={videoFile}
                                                url={url}
                                            />
                                        </div>
                                    </CardContent>
                                </Card>
                                <SubtitleArea subtitleConverted={cachedSubtitle ? cachedSubtitle.subtitleData : subtitleConverted} height='500px' />
                            </div>
                        ) : (
                            <ResizablePanelGroup direction="horizontal" className="rounded-lg border">
                                <ResizablePanel defaultSize={65}>
                                    <div className="flex flex-col h-full p-3">
                                        <div className="flex flex-wrap items-center gap-4 mb-2">
                                            <SubtitlesDropDown data={subtitlesData as any[]} />
                                            {!videoTitle && !url.startsWith('blob:') ? (
                                                <Input type="text" value={url} disabled={!!selectedSub} onChange={(event) => setUrl(event.target.value)} placeholder="Your video URL" className="flex-1 hidden sm:inline" />
                                            ) : (
                                                <div className="flex-grow text-center">{videoTitle}</div>
                                            )}

                                            {userEmail ? (
                                                <ControlButtons
                                                    selectedSub={selectedSub}
                                                    handleAddSubtitles={handleAddSubtitlesButton}
                                                    refetch2={refetch2}
                                                    isFetching={isFetching}
                                                    titleAndEpisode={titleAndEpisode}
                                                    subtitleConverted={subtitleConverted}
                                                />
                                            ) : (
                                                <span className="text-sm text-muted-foreground">Log in to save subtitles</span>
                                            )}
                                        </div>
                                        <div className="flex-grow h-[800px]">
                                            <VideoUploadArea
                                                onDrop={handleDrop}
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) {
                                                        setVideoFile(file);
                                                        setUrl(URL.createObjectURL(file));
                                                        setVideoTitle(file.name);
                                                    }
                                                }}
                                                videoFile={videoFile}
                                                url={url}
                                            />
                                        </div>
                                    </div>
                                </ResizablePanel>
                                <ResizableHandle withHandle />
                                <ResizablePanel defaultSize={35}>
                                    <SubtitleArea subtitleConverted={cachedSubtitle ? cachedSubtitle.subtitleData : subtitleConverted} height='1000px' />
                                </ResizablePanel>

                            </ResizablePanelGroup>
                        )}
                    </TabsContent>
                </Tabs>
                <SettingsDrawerContent
                    setTargetLanguage={setTargetLanguage}
                    setSourceLanguage={setSourceLanguage}
                />
            </Drawer>
            <div className="my-4 space-x-4">
                <ToggleAutoScrollButton />
                {selectedSub && <TranslateSubtitle selectedSubtitle={selectedSub as Subtitle} SubtitleId={selectedSub?.SubtitleId} />}
                {selectedSub && <SwapTranslationButton selectedSubtitle={selectedSub as Subtitle} />}
            </div>
            <hr />
            <div className="my-5">
                <FileBrowser onVideoSelect={handleVideoSelect} handleAddSubtitles={handleAddSubtitlesButton} />
            </div>
        </div >
    );
};

export default Home;