import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();
export const primaryTranslationServiceURL = "http://127.0.0.1:5000/translate";
export const fallbackTranslationServiceURL = "https://translate.terraprint.co/translate";

export async function POST(req: Request) {
    if (req.method === 'POST') {
        try {
            const data = await req.json();
            const { userId, youtubeUrl, subtitleTitle, subtitleData, text, target, source } = data;
            let translatedSubtitleData;
            try {
                const translationResponse = await fetch(primaryTranslationServiceURL, {
                    method: "POST",
                    body: JSON.stringify({
                        q: text,
                        source: source || "auto",
                        target: target || "en",
                        format: "text"
                    }),
                    headers: { "Content-Type": "application/json" }
                });
                const result = await translationResponse.json();
                translatedSubtitleData = result.translatedText;
            } catch (primaryTranslationError) {
                console.error('Error from primary translation service:', primaryTranslationError);
                console.log('Falling back to the alternative translation service...');

                // Fallback to the alternative translation service
                const fallbackTranslationResponse = await fetch(fallbackTranslationServiceURL, {
                    method: "POST",
                    body: JSON.stringify({
                        q: text,
                        source: source || "auto",
                        target: target || "en",
                        format: "text"
                    }),
                    headers: { "Content-Type": "application/json" }
                });
                const fallbackResult = await fallbackTranslationResponse.json();
                translatedSubtitleData = fallbackResult.translatedText;
            }


            const existingSubtitle = await prisma.subtitle.findFirst({
                where: { userId, youtubeUrl },
            });

            const subtitleDataId = existingSubtitle?.SubtitleId
            await prisma.subtitleData.deleteMany({
                where: { subtitleDataId },
            });

            const combinedSubtitles = subtitleData.map((subtitle: SubtitleData, index: number) => ({
                text: subtitle.text,
                translation: translatedSubtitleData[index],
                dur: parseFloat(subtitle.dur),
                start: parseFloat(subtitle.start),
            }));
            console.log(combinedSubtitles)
            if (existingSubtitle) {
                const createdSubtitleData = await prisma.subtitle.update({
                    where: { SubtitleId: existingSubtitle.SubtitleId },
                    data: {
                        subtitleData: { createMany: { data: combinedSubtitles } },
                    },
                });
                console.log("successfully added translation to subtitle.")
                return NextResponse.json({ createdSubtitleData, combinedSubtitles });
            } else {
                const newSubtitle = await prisma.subtitle.create({
                    data: {
                        userId,
                        youtubeUrl,
                        subtitleTitle,
                        subtitleData: { createMany: { data: combinedSubtitles } },
                    },
                });

                return NextResponse.json({ newSubtitle });
            }
        } catch (error) {
            console.error('Error creating or updating subtitle:', error);
            return NextResponse.json({ error: error });
        }
    } else {
        return NextResponse.json({ error: 'Method Not Allowed' });
    }
}
