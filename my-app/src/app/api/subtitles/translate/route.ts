import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

import axios from 'axios';

const prisma = new PrismaClient();

export async function POST(req: Request) {
    if (req.method === 'POST') {
        try {
            const data = await req.json();
            const { userId, youtubeUrl, subtitleTitle, subtitleData } = data;

            if (!Array.isArray(subtitleData)) {
                throw new Error('Subtitle data is not in the expected format');
            }

            const textsToTranslate = subtitleData.map(subtitle => subtitle.text);

            const translationResponse = await axios.post('http://localhost:5000/translate', {
                data: textsToTranslate,
            });

            // Handle translation response
            if (translationResponse.status !== 200 || !translationResponse.data.data) {
                throw new Error('Failed to translate subtitles');
            }

            const translatedSubtitleData = translationResponse.data.data;
            // console.log(translatedSubtitleData)

            const combinedSubtitles = subtitleData.map((subtitle, index) => ({
                id: subtitle.id,
                text: subtitle.text,
                translation: translatedSubtitleData[index],
                dur: parseFloat(subtitle.dur),
                start: parseFloat(subtitle.start),
            }));
            console.log(combinedSubtitles)

            const existingSubtitle = await prisma.subtitle.findFirst({
                where: { userId, youtubeUrl },
            });

            if (existingSubtitle) {
                await prisma.subtitleData.deleteMany({
                    where: { subtitleDataId: existingSubtitle.SubtitleId },
                });
            }

            if (existingSubtitle) {
                const updatedSubtitle = await prisma.subtitle.update({
                    where: { SubtitleId: existingSubtitle.SubtitleId },
                    data: {
                        subtitleData: { createMany: { data: combinedSubtitles } },
                    },
                });

                return NextResponse.json({ updatedSubtitle });
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
