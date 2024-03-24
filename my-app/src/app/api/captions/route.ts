import { YoutubeTranscript } from 'youtube-transcript';
import { NextResponse } from 'next/server';


export async function POST(req: Request) {

    if (req.method === 'POST') {
        try {

            const { youtubeUrl } = await req.json();

            const transcript = await YoutubeTranscript.fetchTranscript(youtubeUrl);

            return NextResponse.json(transcript);
        }
        catch (error) {
            console.log(error);
            return NextResponse.json({ error: 'Something went wrong' });
        }
    } else {
        return NextResponse.json({ error: 'Method Not Allowed' });
    }
}