'use client'
import { useState } from "react";
import VideoPlayer from "@/components/VideoPlayer";
import { Input } from "@/components/ui/input";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable"
import SubtitlesList from "@/components/Subtitles/SubtitlesList"
import axios from 'axios';
import SubtitlesSkeleton from "@/components/Subtitles/SubtitlesSkeleton"
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast"
import { ToastAction } from "@/components/ui/toast"
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { addSubtitle } from '@/lib/features/subtitles/subtitleSlice';

const Home = () => {
    const [url, setUrl] = useState<string>('');
    const { toast } = useToast();
    const session = useSession();
    const userEmail = session?.data?.user?.email;
    const dispatch = useAppDispatch();

    const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUrl(event.target.value);
    };
    const { data, error, isLoading } = useQuery({
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
            return response.data;
        },
        enabled: !!url,
        retry: false,
    })

    const handleSaveSubtitles = async () => {
        try {
            const subtitle = {
                email: userEmail,
                youtubeUrl: url,
                subtitleTitle: 'Subtitle Title Here',
                subtitleData: data,
                hardWords: [],
            }
            dispatch(addSubtitle(subtitle))
            if (!userEmail) {
                throw new Error('User email not found in session.');
            }
            console.log(userEmail)
            await axios.post('/api/subtitles/create', {
                email: userEmail,
                youtubeUrl: url,
                subtitleTitle: 'Subtitle Title Here',
                subtitleData: data,
                hardWords: [],
            },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            ).then(response => console.log(response)
            ).catch((e) => toast({
                title: "Error saving subtitles",
                description: e ? e.toString() : "Something went wrong while saving subtitles.",
                variant: 'destructive',
            }));

        } catch (error) {
            console.error('Error saving subtitles:', error);
            toast({
                title: "Error saving subtitles",
                description: error ? error.toString() : "Something went wrong while saving subtitles.",
                variant: 'destructive',
            });
        }
    };
    if (error) {
        toast({
            title: "Ups something went wrong!",
            description: error ? error.toString() : undefined,
            action: <ToastAction altText="Ok!">Ok!</ToastAction>,
            variant: 'destructive',
        })
    }

    return (
        <div className="m-4 " style={{ height: "1000px" }}>
            <ResizablePanelGroup
                direction="horizontal"
                className=" rounded-lg border"
            >
                <ResizablePanel defaultSize={65}>
                    <div className="flex flex-col h-full p-2">
                        <div className="flex">
                            <Input type="text" value={url} onChange={handleUrlChange} placeholder="Enter YouTube URL" className="mr-2" />
                            <Button onClick={handleSaveSubtitles}>Save Subtitles</Button>
                        </div>
                        <div className="p-2 h-full">
                            <VideoPlayer url={url} />
                        </div>
                    </div>
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={35}>
                    {isLoading ?
                        <SubtitlesSkeleton /> : <SubtitlesList captions={data as Caption[]} url={url} userEmail={userEmail} />}
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    );
};

export default Home;

