import { NextResponse } from 'next/server';
import { getSubtitles, getVideoDetails } from 'youtube-caption-extractor';

export async function POST(req: Request) {
    const { youtubeUrl, sourceLanguage } = await req.json();

    try {
        const videoID = await extractVideoId(youtubeUrl);
        const enSubtitles = await getSubtitles({ videoID: videoID as string, lang: 'en' });
        const deSubtitles = await getSubtitles({ videoID: videoID as string, lang: 'de' });
        const sourceLangSubtitles = await getSubtitles({ videoID: videoID as string, lang: sourceLanguage });
        const videoDetails = await getVideoDetails({ videoID: videoID as string, lang: '' });

        return NextResponse.json({ enSubtitles, deSubtitles, videoDetails, sourceLangSubtitles });
    } catch (error) {
        return NextResponse.json({ error: error });
    }
}

function extractVideoId(url: string): string | null {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?/]+)/);
    return match ? match[1].trim() : null;
}
