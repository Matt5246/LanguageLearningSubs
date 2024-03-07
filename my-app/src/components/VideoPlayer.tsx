"use client"
import dynamic from 'next/dynamic';
import React from 'react';

const ReactPlayer = dynamic(() => import('react-player'), { ssr: false });

interface VideoPlayerProps {
    url: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ url }) => {
    return <ReactPlayer
        controls
        url={url}
        height="100%"
        width="100%"
        config={{
            file: {
                tracks: [
                    { kind: 'subtitles', src: 'subs/subtitles.en.vtt', srcLang: 'en', default: true, label: "english" },
                    { kind: 'subtitles', src: 'subs/subtitles.ja.vtt', srcLang: 'ja', label: "japanese" },
                    { kind: 'subtitles', src: 'subs/subtitles.de.vtt', srcLang: 'de', label: "deutschland" }
                ]
            }
        }}
    />;
};

export default VideoPlayer;
