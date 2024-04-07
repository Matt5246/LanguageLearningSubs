import { NextResponse } from 'next/server';
import { getSubtitles, getVideoDetails } from 'youtube-caption-extractor';

export async function POST(req: Request) {
    const { youtubeUrl } = await req.json();

    try {
        const videoID = await extractVideoId(youtubeUrl)
        const subtitles = await getSubtitles({ videoID }); // call this if you only need the subtitles
        const videoDetails = await getVideoDetails({ videoID });

        // call this if you need the video title and description, along with the subtitles
        return NextResponse.json({ subtitles, videoDetails });
    } catch (error) {
        return NextResponse.json({ error: error });
    }
}

function extractVideoId(url: string): string | null {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?/]+)/);
    return match ? match[1].trim() : null;
}
