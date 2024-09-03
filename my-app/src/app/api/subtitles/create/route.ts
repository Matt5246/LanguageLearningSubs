import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import axios from 'axios'
const prisma = new PrismaClient();

export async function POST(req: Request) {
    if (req.method === 'POST') {
        try {

            const { email, youtubeUrl, subtitleTitle, subtitleData, sourceLang, targetLang } = await req.json();

            if (!email) {
                throw new Error('Email is required');
            }
            const user = await prisma.user.findUnique({ where: { email } });
            if (!user) {
                throw new Error('User not found');
            }
            const userId = user.id

            const translatedSubtitleData = targetLang ? await translateSubtitleData(subtitleData, sourceLang, targetLang) : subtitleData;

            const updatedSubtitleData = subtitleData.map((data: any, index: number) => ({
                text: data?.text,
                translation: translatedSubtitleData[index] ? translatedSubtitleData[index] : undefined,
                start: parseFloat(data.start),
                end: parseFloat(data.end)
            }));

            const data: any = {
                userId,
                subtitleTitle,
            };
            console.log("data:", data)

            if (youtubeUrl) {
                data.youtubeUrl = youtubeUrl;
            }
            console.log(updatedSubtitleData)
            const subtitle = await prisma.subtitle.create({
                data: {
                    ...data,
                    sourceLang,
                    targetLang,
                    subtitleData: {
                        createMany: { data: updatedSubtitleData },
                    },
                }
            });
            console.log("successfully added:", subtitle)
            return NextResponse.json(subtitle)
        } catch (error) {
            console.error('Error creating subtitle:', error);
            return NextResponse.json({ error: error });
        }
    } else {
        return NextResponse.json({ error: 'Method Not Allowed' });
    }
}
async function translateSubtitleData(subtitleData: SubtitleData[], sourceLang: string, targetLang: string) {
    try {
        const texts = subtitleData.map(subtitle => subtitle?.text);
        const response = await axios.post("http://127.0.0.1:5000/translate", {
            q: texts,
            source: sourceLang || "auto",
            target: targetLang,
            format: "text"
        });
        return response.data.translatedText;
    } catch (error) {
        console.error('Error translating subtitles:', error);
        throw new Error('Failed to translate subtitles');
    }
}