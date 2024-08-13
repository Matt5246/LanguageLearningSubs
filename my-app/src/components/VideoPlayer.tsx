"use client";
import React, { useEffect, useRef, useState } from 'react';
import ReactPlayer from 'react-player/lazy';


interface VideoPlayerProps {
    url: string;
    track?: any;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ url }) => {
    const [isReady, setIsReady] = useState(false);
    const [playing, setPlaying] = useState(false);
    const playerRef = useRef<any>(null);
    const vttContent = `WEBVTT
    00:00:20.970 --> 00:00:24.020
    Jeden Morgen öffne ich meine Augen
    00:00:24.190 --> 00:00:27.230
    Jeden Morgen wache ich müde auf
    00:00:27.560 --> 00:00:30.360
    Ich ziehe die Krawatte am Hals
    00:00:30.530 --> 00:00:33.450
    Ganz fest zu`;
    const vttContent2 = `WEBVTT
    00:00:20.970 --> 00:00:24.020
    XD
    00:00:24.190 --> 00:00:27.230
    JXDDD
    00:00:27.560 --> 00:00:30.360
    ASDASD
    00:00:30.530 --> 00:00:33.450
    Ganz XD`;
    const vttBlob = new Blob([vttContent], { type: 'text/vtt' });
    const vttUrl = URL.createObjectURL(vttBlob);
    const vttBlob2 = new Blob([vttContent2], { type: 'text/vtt' });
    const vttUrl2 = URL.createObjectURL(vttBlob2);

    useEffect(() => {
        if (isReady) {
            const savedTime = localStorage.getItem(`videoCurrentTime-${url}`);
            const savedPlaying = localStorage.getItem(`videoPlaying-${url}`);

            if (savedTime && playerRef.current) {
                playerRef.current.seekTo(parseFloat(savedTime), 'seconds');
            }
            console.log("savedPlaying", savedPlaying)
            if (savedPlaying === 'true') {
                setPlaying(savedPlaying === 'true');
            } else {
                setPlaying(false);
            }
        }
    }, [url, isReady]);

    const handleProgress = (state: { playedSeconds: number }) => {
        localStorage.setItem(`videoCurrentTime-${url}`, state.playedSeconds.toString());
    };

    const handlePlay = () => {
        setPlaying(true);
        localStorage.setItem(`videoPlaying-${url}`, 'true');
    };

    const handlePause = () => {
        setPlaying(false);
        localStorage.setItem(`videoPlaying-${url}`, 'false');
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
                }
            }}
            controls
            url={url}
            height="100%"
            width="100%"
            onPlay={handlePlay}
            onPause={handlePause}
            onProgress={handleProgress}
            playing={playing}
            config={{
                file: {
                    tracks: [
                        { kind: 'subtitles', src: vttUrl, srcLang: 'de', label: 'German', default: true },
                        { kind: 'subtitles', src: vttUrl2, srcLang: 'en', label: 'English', default: false },
                    ]
                }
            }}
        />
    );
};

export default VideoPlayer;
