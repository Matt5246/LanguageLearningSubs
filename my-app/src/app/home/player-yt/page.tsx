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
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast"
import { ToastAction } from "@/components/ui/toast"

const Home = () => {
    const [url, setUrl] = useState<string>('');
    const { toast } = useToast();

    const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUrl(event.target.value);
    };
    const { data, error, isLoading } = useQuery({
        queryKey: ['captions', url],
        queryFn: async () => {
            const response = await axios.get(`/api/captions?url=${url}`);
            return response.data;
        },
    })
    if (error) {
        toast({
            title: "Ups something went wrong!",
            description: error ? error.toString() : undefined,
            action: <ToastAction altText="Ok!">Ok!</ToastAction>,
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
                        <Input type="text" value={url} onChange={handleUrlChange} placeholder="Enter YouTube URL" className="mr-2" />
                        <div className="p-2 h-full">
                            <VideoPlayer url={url} />
                        </div>
                    </div>
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={35}>
                    {isLoading ?
                        <SubtitlesSkeleton /> : <SubtitlesList captions={data as Caption[]} />}
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    );
};

export default Home;

