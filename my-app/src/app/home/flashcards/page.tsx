import { YoutubeTranscript } from 'youtube-transcript';
interface Caption {
    text: string;
    duration: number; // Duration in milliseconds
    offset: number; // Offset in milliseconds
}

export default async function Home() {
    const url = "https://www.youtube.com/watch?v=g7rE5exVQRk";

    const captions: Caption[] = await YoutubeTranscript.fetchTranscript(url);
    return (
        <>
            <div className="text-center">
                <h1 className="font-bold text-2xl">Introduction</h1>
                <ul>
                    {captions.map(data =>
                        <li key={data.offset}>
                            <p>time:{data.offset / 1000} text: {data.text}</p>
                        </li>
                    )}
                </ul>
            </div>
        </>
    );
}

