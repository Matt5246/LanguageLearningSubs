import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
const prisma = new PrismaClient();

export async function POST(req: Request) {
    if (req.method === 'POST') {
        try {
            const { sentence, translation, userId, sentenceId } = await req.json();

            const sentenceData: sentences = {
                sentence,
                translation,
            };

            const existingSentence = await prisma.sentence.findFirst({
                where: { sentenceId: sentenceId },
            });

            if (existingSentence) {
                const updatedSentence = await prisma.sentence.update({
                    where: { id: existingSentence.id },
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
