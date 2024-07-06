"use client"
import React, { useEffect, useRef, useState } from 'react';
import ReactPlayer from 'react-player/lazy';

interface VideoPlayerProps {
    url: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ url }) => {
    const [isReady, setIsReady] = useState(false);
    const [playing, setPlaying] = useState(false);
    const playerRef = useRef<any>(null);

    useEffect(() => {
        if (isReady) {
            const savedTime = localStorage.getItem(`videoCurrentTime-${url}`);
            if (savedTime && playerRef.current) {
                playerRef.current.seekTo(parseFloat(savedTime), 'seconds');
                setPlaying(true);
            }
        }
    }, [url, isReady]);

    const handleProgress = (state: { playedSeconds: number }) => {
        localStorage.setItem(`videoCurrentTime-${url}`, state.playedSeconds.toString());
    };

    const handleReady = () => {
        setIsReady(true);
    };

    return (
        <ReactPlayer
            ref={(player) => {
                playerRef.current = player;
                if (player) {
                    handleReady();
                    console.log(playerRef);
                }
            }}
            controls
            url={url}
            height="100%"
            width="100%"
            onProgress={handleProgress}
            playing={playing}
        />
    );
};

export default VideoPlayer;
