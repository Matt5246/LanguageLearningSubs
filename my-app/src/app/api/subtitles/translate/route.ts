/* eslint-disable */
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { primaryTranslationServiceURL, fallbackTranslationServiceURL } from '@/lib/utils'
const prisma = new PrismaClient();

interface SubtitleData {
    text: string;
    end: string;
    start: string;
}

interface RequestData {
    SubtitleId: string,
    userId: string;
    youtubeUrl?: string;
    subtitleTitle: string;
    subtitleData: SubtitleData[];
    text: string;
    target?: string;
    source?: string;
}

export async function POST(req: Request) {
    try {
        const data: RequestData = await req.json();

        const { userId, youtubeUrl, subtitleTitle, subtitleData, text, target, source, SubtitleId } = data;

        let translatedSubtitleData: string[];
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
            console.log(translatedSubtitleData)
        }

        const existingSubtitle = await prisma.subtitle.findFirst({
            where: { userId, SubtitleId },
        });


        const subtitleDataId = existingSubtitle?.SubtitleId;

        if (subtitleDataId) {
            await prisma.subtitleData.deleteMany({
                where: { subtitleDataId },
            });
        }

        const combinedSubtitles = subtitleData.map((subtitle: SubtitleData, index: number) => ({
            text: subtitle.text,
            translation: translatedSubtitleData[index] || null, 
            end: parseFloat(subtitle.end),
            start: parseFloat(subtitle.start),
        }));

        console.log(combinedSubtitles[1]);

        if (existingSubtitle) {
            const updatedSubtitle = await prisma.subtitle.update({
                where: { SubtitleId: existingSubtitle.SubtitleId },
                data: {
                    subtitleData: { createMany: { data: combinedSubtitles } },
                },
            });

            console.log("Successfully updated subtitle with translation.");
            return NextResponse.json({ updatedSubtitle, combinedSubtitles });
        } else {
            const data: any = {
                userId,
                subtitleTitle,
            };

            if (youtubeUrl) {
                data.youtubeUrl = youtubeUrl;
            }


            const newSubtitle = await prisma.subtitle.create({
                data: {
                    ...data,
                    subtitleData: { createMany: { data: combinedSubtitles } },
                },
            });

            console.log("Successfully created new subtitle with translation.");
            return NextResponse.json({ newSubtitle });
        }
    } catch (error: any) {
        console.error('Error creating or updating subtitle:', error);
        return NextResponse.json({ error: error.message })
    }

}
