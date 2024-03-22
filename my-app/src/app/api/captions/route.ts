import { YoutubeTranscript } from 'youtube-transcript';
import { NextResponse } from 'next/server';


export async function GET(req: Request) {
    const url = req.url;
    try {
        const transcript = await YoutubeTranscript.fetchTranscript(url);
        return NextResponse.json(transcript);
    }
    catch (error) {
        console.log(error);
        return NextResponse.json({ error: 'Something went wrong' });
    }
}