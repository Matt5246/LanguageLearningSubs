import { YoutubeTranscript } from 'youtube-transcript';
import { NextResponse } from 'next/server';


export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const url = searchParams.get("url")!;
    try {
        const transcript = await YoutubeTranscript.fetchTranscript(url);
        return NextResponse.json(transcript);
    }
    catch (error) {
        console.log(error);
        return NextResponse.json({ error: 'Something went wrong' });
    }
}