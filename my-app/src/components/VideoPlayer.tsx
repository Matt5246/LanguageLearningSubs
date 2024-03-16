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

    />;
};

export default VideoPlayer;
