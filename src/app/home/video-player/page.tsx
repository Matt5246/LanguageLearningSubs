'use client'
import { useState, useEffect } from "react"
import { useSelector, useDispatch } from 'react-redux'
import { useQuery } from "@tanstack/react-query"
import { useSession } from "next-auth/react"
import axios from 'axios'
import VideoPlayer from "@/components/VideoPlayer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Drawer, DrawerTrigger } from "@/components/ui/drawer"
import { Card, CardContent } from "@/components/ui/card"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { useToast } from "@/components/ui/use-toast"
import { SubtitlesDropDown } from "../subtitles/SubtitlesDropDown"
import { DataTable } from "@/components/Subtitles/SubtitlesListTanstack"
import { AddSubtitlesButton } from "@/components/AddSubtitlesButton"
import { ToggleAutoScrollButton } from "@/components/ToggleAutoScrollButton"
import { GearButton } from "@/components/SettingsButton"
import TranslateSubtitle from "../subtitles/TranslateSubtitle"
import SwapTranslationButton from '@/app/home/subtitles/SwapTranslationButton'
import FileBrowser from "./fileBrowser"
import SettingsDrawerContent from "@/components/SettingsDrawer"
import { useIsMobile } from '@/hooks/useMobile'
import { SubtitlesState, initializeSubtitles } from '@/lib/features/subtitles/subtitleSlice'
import { getSubs } from "@/components/NavBar"
import mkvExtract from "@/lib/mkvExtract"
import { Save, Subtitles, Upload } from "lucide-react"

interface VideoUploadAreaProps {
    onDrop: (event: React.DragEvent<HTMLDivElement>) => void;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    videoFile: File | null;
    url: string;
}
interface SubtitleAreaProps {
    subtitleConverted: Caption[];
    height: string;
}
interface ControlButtonsProps {
    selectedSub: Subtitle | null;
    handleAddSubtitles: (subtitleConverted: any, updateTitle: any) => void;
    refetch2: () => void;
    isFetching: boolean;
    titleAndEpisode: { subtitleTitle: string; episode: string | null } | undefined;
    subtitleConverted: any;
}

const VideoUploadArea: React.FC<VideoUploadAreaProps> = ({ onDrop, onChange, videoFile, url }) => (
    <div
        className={`relative h-full ${videoFile ? 'border-2 border-dashed border-gray-300' : 'border-none'}  rounded-lg flex items-center justify-center`}
        onDrop={onDrop}
        onDragOver={(e) => e.preventDefault()}
    >
        {!videoFile && !url ? (
            <div className="text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-1 text-sm text-gray-600">Drag and drop your video here or</p>
                <Input
                    type="file"
                    className="mt-2 mx-auto w-64"
                    onChange={onChange}
                />
            </div>
        ) : (
            <VideoPlayer url={url} track={[]} />
        )}
    </div>
)

const SubtitleArea: React.FC<SubtitleAreaProps> = ({ subtitleConverted, height }) => (
    subtitleConverted?.length > 0 ? (
        <DataTable captions={subtitleConverted as Caption[]} height={height} />
    ) : (
        <div className="flex flex-col items-center justify-center h-full min-h-[64px]">

            <Subtitles className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-center text-gray-600">No subtitles detected. Add subtitles or select a video with embedded subtitles.</p>
        </div>
    )
)

const ControlButtons: React.FC<ControlButtonsProps> = ({ selectedSub, handleAddSubtitles, refetch2, isFetching, titleAndEpisode, subtitleConverted }) => (
    <div className="flex gap-2">
        {!selectedSub && (
            <>
                <AddSubtitlesButton handleAddSubtitles={handleAddSubtitles} />
                <HoverCard>
                    <HoverCardTrigger>
                        <Button onClick={() => refetch2()} disabled={isFetching}>
                            <Save className="w-4 h-4 mr-2" />
                            {isFetching ? 'Saving...' : 'Save Subtitles'}
                        </Button>
                    </HoverCardTrigger>
                    {titleAndEpisode && (
                        <HoverCardContent className="p-4 shadow-lg rounded-lg">
                            <div className="text-sm">
                                <span className="font-semibold">{titleAndEpisode?.subtitleTitle}</span>
                                <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
                                    {titleAndEpisode?.episode && (
                                        <p>Episode: <span className="font-medium">{titleAndEpisode?.episode}</span></p>
                                    )}
                                    <p>Rows: <span className="font-medium">{subtitleConverted?.length}</span></p>
                                </div>
                            </div>
                        </HoverCardContent>
                    )}
                </HoverCard>
                <DrawerTrigger asChild>
                    <GearButton />
                </DrawerTrigger>
            </>
        )}

    </div>
)

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
                    sourceLang: sourceLanguage || 'auto',
                    targetLang: targetLanguage || null,
                    hardWords: [],
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
                                <div className="flex space-y-4 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4 mb-2">
                                    <SubtitlesDropDown data={subtitlesData as any[]} />
                                    {!videoTitle && !url.startsWith('blob:') ? (
                                        <Input type="text" value={url} disabled placeholder="Your video URL" className="hidden sm:inline flex-1" />
                                    ) : (
                                        <div className="flex-grow text-center hidden sm:inline">{videoTitle}</div>
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
                                <div className={`${isMobile ? "h-[430px]" : "h-[830px]"} `}>
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
                            <SubtitleArea subtitleConverted={subtitleConverted} height='500px' />
                        </Card>
                    </TabsContent>
                    <TabsContent value="both">
                        {isMobile ? (
                            <div className="space-y-4">
                                <Card>
                                    <CardContent className="p-3">
                                        <div className="flex flex-col space-y-4 mb-2">
                                            <SubtitlesDropDown data={subtitlesData as any[]} />
                                            {!videoTitle && !url.startsWith('blob:') ? (
                                                <Input type="text" value={url} disabled placeholder="Your video URL" className="w-[300px] hidden sm:inline" />
                                            ) : (
                                                <div className="text-center">{videoTitle}</div>
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
                                <SubtitleArea subtitleConverted={subtitleConverted} height='500px' />
                            </div>
                        ) : (
                            <ResizablePanelGroup direction="horizontal" className="rounded-lg border">
                                <ResizablePanel defaultSize={65}>
                                    <div className="flex flex-col h-full p-3">
                                        <div className="flex flex-wrap items-center gap-4 mb-2">
                                            <SubtitlesDropDown data={subtitlesData as any[]} />
                                            {!videoTitle && !url.startsWith('blob:') ? (
                                                <Input type="text" value={url} disabled placeholder="Your video URL" className="flex-1 hidden sm:inline" />
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
                                    <SubtitleArea subtitleConverted={subtitleConverted} height='1000px' />
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