'use client'
import { useState } from "react";
import VideoPlayer from "@/components/VideoPlayer";
import { Input } from "@/components/ui/input";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable"
import SubtitlesList from "@/components/SubtitlesList"
interface VideoPlayerProps {
    data: string;
}

const Home = () => {
    const [url, setUrl] = useState<string>('');

    const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUrl(event.target.value);
    };

    return (
        <div className="m-4 " style={{ height: "1000px" }}>
            <ResizablePanelGroup
                direction="horizontal"
                className=" rounded-lg border"
            >
                <ResizablePanel defaultSize={65}>
                    <div className="flex flex-col h-full p-2">
                        <Input type="text" value={url} onChange={handleUrlChange} placeholder="Enter YouTube URL" className="w-full" />
                        <div className="p-2 h-full">
                            <VideoPlayer url={url} />
                        </div>
                    </div>
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={35}>
                    <SubtitlesList />
                </ResizablePanel>
            </ResizablePanelGroup>

        </div>
    );
};

export default Home;