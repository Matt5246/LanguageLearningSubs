"use client";
import React, { useEffect, useRef, useState } from 'react';
import ReactPlayer from 'react-player/lazy';
import { useDispatch } from 'react-redux';
import { setPlayedSeconds } from '@/lib/features/subtitles/subtitleSlice';


interface VideoPlayerProps {
    url: string;
    track?: any;
    light?: boolean;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ url, track, light }) => {
    const dispatch = useDispatch();
    const [isReady, setIsReady] = useState(false);
    const [playing, setPlaying] = useState(false);
    const playerRef = useRef<any>(null);
    const isBlobUrl = (url: string) => url.startsWith('blob:');

    const { originalVTTUrl, translationVTTUrl, mixedVTTUrl } = convertToVTT(track || [{ start: 0, end: 2, text: "No subtitles available" }]);

    const subtitleTracks = [
        { kind: 'subtitles', src: originalVTTUrl, srcLang: 'en', label: 'Original' },
        { kind: 'subtitles', src: translationVTTUrl, srcLang: 'en', label: 'Translation' },
        { kind: 'subtitles', src: mixedVTTUrl, srcLang: 'en', label: 'Both', default: true }
    ].filter(track => track.src);

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
        dispatch(setPlayedSeconds(state.playedSeconds));
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
            light={light}
            onProgress={handleProgress}
            playing={playing}
            config={{
                file: {
                    tracks: subtitleTracks
                }
            }}
        />
    );
};

export default VideoPlayer;

const convertToVTT = (subtitles: { start: number, dur: number, text: string, translation?: string }) => {
    if (!Array.isArray(subtitles)) {
        throw new TypeError("Expected an array of subtitles");
    }

    const formatTime = (time: any) => {
        const date = new Date(0);
        date.setSeconds(time);

        const hours = String(date.getUTCHours()).padStart(2, '0');
        const minutes = String(date.getUTCMinutes()).padStart(2, '0');
        const seconds = String(date.getUTCSeconds()).padStart(2, '0');
        const milliseconds = String((time % 1).toFixed(3)).substring(2);

        return `${hours}:${minutes}:${seconds}.${milliseconds}`;
    };

    const createVTT = (getText: (subtitle: { start: number, end: number, text: string, translation?: string }) => string) => {
        let vtt = 'WEBVTT\n';
        subtitles.forEach((subtitle, index) => {
            const startTime = subtitle.start;
            const endTime = subtitle.end;
            const text = getText(subtitle);

            if (typeof startTime !== 'number' || typeof endTime !== 'number') {
                console.error(`Invalid start or end time at subtitle ${index}`, subtitle);
                return;
            }

            const startFormatted = formatTime(startTime);
            const endFormatted = formatTime(endTime);

            vtt += `${startFormatted} --> ${endFormatted}\n${text}\n`;
        });

        const vttBlob = new Blob([vtt], { type: 'text/vtt' });
        return URL.createObjectURL(vttBlob);
    };

    const originalVTTUrl = createVTT(subtitle => subtitle.text);
    const translationVTTUrl = subtitles.some(sub => sub.translation) ? createVTT(subtitle => subtitle.translation || '') : '';
    const mixedVTTUrl = subtitles.some(sub => sub.translation) ? createVTT(subtitle => subtitle.translation ? `${subtitle.text}\n(${subtitle.translation})` : subtitle.text) : '';


    return { originalVTTUrl, translationVTTUrl, mixedVTTUrl };
};

