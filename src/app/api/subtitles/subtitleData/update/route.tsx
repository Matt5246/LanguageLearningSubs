import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
const prisma = new PrismaClient();

export async function POST(req: Request) {
    if (req.method === 'POST') {
        try {
            const { id, text, translation, start, end, subtitleDataId } = await req.json();

            const sentenceData: SubtitleData = {
                text,
                translation,
            };
            if (start || end) {
                sentenceData.start = start;
                sentenceData.end = end;
            }

            const existingSentence = await prisma.subtitleData.findFirst({
                where: { id: id },
            });

            if (existingSentence) {
                const updatedSentence = await prisma.subtitleData.update({
                    where: { id },
                    data: {
                        ...sentenceData
                    }
                });
                return NextResponse.json(updatedSentence);
            }

        } catch (error) {
            console.error('Error creating or updating subtitle:', error);
            return NextResponse.json({ error: error });
        }
    } else {
        return NextResponse.json({ error: 'Method Not Allowed' });
    }
}
