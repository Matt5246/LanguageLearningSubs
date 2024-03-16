'use client'
import { useState, Suspense, useEffect } from "react";
import VideoPlayer from "@/components/VideoPlayer";
import { Input } from "@/components/ui/input";
import { Button } from '@/components/ui/button'
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable"
import SubtitlesList from "@/components/SubtitlesList"
import axios from 'axios';
interface Caption {
    text: string;
    duration: number; // Duration in milliseconds
    offset: number; // Offset in milliseconds
}
const Home = () => {
    const [url, setUrl] = useState<string>('');
    const [captions, setCaptions] = useState<Caption[]>([]);

    const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUrl(event.target.value);
        fetchTranscript();
    };
    const fetchTranscript = async () => {
        try {
            const response = await axios.get(`/api/captions?url=${url}`);
            const data = response.data;
            setCaptions(data);
        } catch (error) {
            console.error('Error fetching transcript:', error);
        }
    };

    return (
        <div className="m-4 " style={{ height: "1000px" }}>
            <ResizablePanelGroup
                direction="horizontal"
                className=" rounded-lg border"
            >
                <ResizablePanel defaultSize={65}>
                    <div className="flex flex-col h-full p-2">
                        <div className="flex w-full">
                            <Input type="text" value={url} onChange={handleUrlChange} placeholder="Enter YouTube URL" className="mr-2" />
                            <Button onClick={fetchTranscript}>Fetch Transcript</Button>
                        </div>
                        <div className="p-2 h-full">
                            <VideoPlayer url={url} />
                        </div>
                    </div>
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={35} >
                    <SubtitlesList captions={captions} />

                </ResizablePanel>

            </ResizablePanelGroup>

        </div>
    );
};

export default Home;