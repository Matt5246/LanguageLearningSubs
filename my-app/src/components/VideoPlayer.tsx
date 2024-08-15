"use client";
import React, { useEffect, useRef, useState } from 'react';
import ReactPlayer from 'react-player/lazy';


interface VideoPlayerProps {
    url: string;
    track?: any;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ url, track }) => {
    const [isReady, setIsReady] = useState(false);
    const [playing, setPlaying] = useState(false);
    const playerRef = useRef<any>(null);
    const isBlobUrl = (url: string) => url.startsWith('blob:');

    let vttUrl
    if (track) {
        vttUrl = convertToVTT(track);
    } else {
        vttUrl = convertToVTT([{ start: 0, dur: 2, text: "No subtitles available" }]);
    }

    useEffect(() => {
        if (isReady) {
            const savedTime = localStorage.getItem(`videoCurrentTime-${url}`);
            const savedPlaying = localStorage.getItem(`videoPlaying-${url}`);

            if (savedTime && playerRef.current) {
                playerRef.current.seekTo(parseFloat(savedTime), 'seconds');
            }
            if (savedPlaying === 'true') {
                setPlaying(savedPlaying === 'true');
            } else {
                setPlaying(false);
            }
        }
    }, [url, isReady]);

    const handleProgress = (state: { playedSeconds: number }) => {
        if (!isBlobUrl(url)) {
            localStorage.setItem(`videoCurrentTime-${url}`, state.playedSeconds.toString());
        }
    };

    const handlePlay = () => {
        if (!isBlobUrl(url)) {
            localStorage.setItem(`videoPlaying-${url}`, 'true');
        }
        setPlaying(true);
    };

    const handlePause = () => {
        if (!isBlobUrl(url)) {
            localStorage.setItem(`videoPlaying-${url}`, 'false');
        }
        setPlaying(false);
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
                        { kind: 'subtitles', src: vttUrl, srcLang: 'en', label: 'Subtitles', default: true }
                    ]
                }
            }}
        />
    );
};

export default VideoPlayer;

const convertToVTT = (subtitles: any) => {
    if (!Array.isArray(subtitles)) {
        throw new TypeError("Expected an array of subtitles");
    }

    const formatTime = (time: any) => {
        const date = new Date(0);
        date.setSeconds(time); // set seconds into date object

        const hours = String(date.getUTCHours()).padStart(2, '0');
        const minutes = String(date.getUTCMinutes()).padStart(2, '0');
        const seconds = String(date.getUTCSeconds()).padStart(2, '0');
        const milliseconds = String((time % 1).toFixed(3)).substring(2);

        return `${hours}:${minutes}:${seconds}.${milliseconds}`;
    };

    let vtt = 'WEBVTT\n';

    subtitles.forEach((subtitle, index) => {
        const startTime = subtitle.start;
        const endTime = subtitle.dur;

        // Check if startTime and endTime are valid numbers
        if (typeof startTime !== 'number' || typeof endTime !== 'number') {
            console.error(`Invalid start or end time at subtitle ${index}`, subtitle);
            return; // Skip this subtitle if the values are invalid
        }

        const startFormatted = formatTime(startTime);
        const endFormatted = formatTime(endTime);

        vtt += `${startFormatted} --> ${endFormatted}\n${subtitle.text}\n`;
    });
    const vttBlob = new Blob([vtt], { type: 'text/vtt' });

    return URL.createObjectURL(vttBlob);
};
