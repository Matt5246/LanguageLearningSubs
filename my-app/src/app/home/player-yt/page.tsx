'use client'
import { useState, useEffect } from "react";
import VideoPlayer from "@/components/VideoPlayer";
import { Input } from "@/components/ui/input";
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
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { useAppDispatch } from '@/lib/hooks';
import { addSubtitle } from '@/lib/features/subtitles/subtitleSlice';
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
import { EuropeLanguages, AsiaLanguages } from '@/lib/utils';
import { useSelector } from 'react-redux'
import TranslateSubtitle from "../subtitles/TranslateSubtitle";
import { Separator } from "@radix-ui/react-select";

const Home = () => {
    const [url, setUrl] = useState<string>('');
    const { toast } = useToast();
    const session = useSession();
    const userEmail = session?.data?.user?.email;
    const dispatch = useAppDispatch();
    const [title, setTitle] = useState<string>('Subtitle Title');
    const isMobile = useIsMobile();
    const [targetLanguage, setTargetLanguage] = useState("");
    const [sourceLanguage, setSourceLanguage] = useState("");
    const selectedSub: Subtitle = useSelector((state: any) => state.subtitle.subtitles.find((subtitle: any) => subtitle.SubtitleId === state.subtitle.selectedSubtitle));

    const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUrl(event.target.value);
        console.log("refetch")
        refetch();
    };
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
        enabled: !!url,
        retry: true,
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

    if (error) {
        toast({
            title: "Ups something went wrong!",
            description: error ? error.toString() : undefined,
            action: <ToastAction altText="Ok!">Ok!</ToastAction>,
            variant: 'destructive',
        })
    }
    const VideoPlayerBlock = () => {
        return <div className="flex flex-col h-full p-2">
            <div className="flex">
                <Input type="text" value={url} onChange={handleUrlChange} placeholder="Enter YouTube URL" className="mr-2" />
                {userEmail ?
                    <><Button onClick={() => refetch2()} disabled={isLoading || isFetching}> {isLoading || isFetching ? 'Loading...' : 'Save Subtitles'}</Button>
                        <DrawerTrigger asChild><Button variant="secondary" className="p-2 ml-2"><GearIcon className="w-5 h-5" /></Button></DrawerTrigger>
                    </>
                    : <span className="text-nowrap m-2 font-bold">Log in to save subs</span>}

            </div>
            <div className="p-2 h-full">
                <VideoPlayer url={url} />
            </div>
        </div>;
    }
    return (
        <div className="m-4 h-[1000px]" >
            <Drawer>

                {isMobile ?
                    <>
                        <div className="rounded-lg border min-h-[300px]">
                            <VideoPlayerBlock />
                        </div>
                        {isLoading ? (
                            <SubtitlesSkeleton />
                        ) : (
                            data ? (
                                <DataTable captions={data as Caption[]} height="1000px" />
                            ) : null
                        )}
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
                            {isLoading ? (
                                <SubtitlesSkeleton />
                            ) : (
                                data ? (
                                    <DataTable captions={data as Caption[]} height="1000px" />
                                ) : null
                            )}
                        </ResizablePanel>
                    </ResizablePanelGroup>
                }
                <DrawerContent>
                    <DrawerHeader className="text-left">
                        <DrawerTitle className="text-center">Edit subtitle profile</DrawerTitle>
                        <DrawerDescription className="text-center">
                            Make changes to your subtitle profile here. Click save when you're done.
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
            </Drawer>
        </div >
    );


};

export default Home;

