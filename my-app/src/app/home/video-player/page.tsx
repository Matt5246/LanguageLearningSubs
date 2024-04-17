'use client'
import { useState } from "react";
import VideoPlayer from "@/components/VideoPlayer";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";

const Home = () => {
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [url, setUrl] = useState<string>('');

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        if (file.type.startsWith('video/')) {
            setVideoFile(file);
            setUrl(URL.createObjectURL(file));
        } else {
            alert('Please drop a video file.');
        }
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
    };

    const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUrl(event.target.value);
    };

    const handleSaveSubtitles = () => {
        // Implement logic to save subtitles for the local video file
        alert('Subtitles saved!');
    };
    return (
        <div className="flex flex-col h-full p-2">
            <div
               
                onDrop={handleDrop}
                onDragOver={handleDragOver}
            >
                {!videoFile && (
                    <>
                        <p className="mb-4 text-gray-600">Drop your video here</p>
                        <input
                            type="file"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    setVideoFile(file);
                                    setUrl(URL.createObjectURL(file));
                                }
                            }}
                        />
                    </>
                )}
                {videoFile && (
                    <>
                        <VideoPlayer url={url} />
                        <Popover>
                            <PopoverTrigger>
                                <Button className="mt-4">Add Subtitles</Button>
                            </PopoverTrigger>
                            <PopoverContent className="p-4 bg-white rounded-lg shadow-md">
                                <div>
                                    <Input type="text" placeholder="Enter subtitle text" className="mb-2" />
                                    <Button onClick={handleSaveSubtitles}>Save Subtitles</Button>
                                </div>
                            </PopoverContent>
                        </Popover>
                    </>
                )}
            </div>
        </div>
    );
};

export default Home;
