import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();
function generateRandomTitle() {
    const randomNumber = Math.floor(Math.random() * 1000) + 1; // Generate a random number between 1 and 1000
    return `Subtitle ${randomNumber}`;
}
export async function POST(req: Request) {
    if (req.method === 'POST') {
        try {
            const { email, youtubeUrl, hardWord, subtitleTitle } = await req.json();

            if (!email) {
                throw new Error('Email is required');
            }

            const user = await prisma.user.findUnique({ where: { email } });
            if (!user) {
                throw new Error('User not found');
            }

            const subtitle = await prisma.subtitle.findFirst({
                where: { userId: user.id, youtubeUrl },
            });
            if (!subtitle) {
                const newSubtitle = await prisma.subtitle.create({
                    data: {
                        userId: user.id,
                        youtubeUrl,
                        subtitleTitle: subtitleTitle || generateRandomTitle(),
                    },
                });
                return NextResponse.json(newSubtitle);
            }

            const existingHardWord = await prisma.hardWords.findFirst({
                where: { Subtitle: { userId: user.id }, word: hardWord },
            });
            if (existingHardWord) {
                throw new Error('Word already exists in user\'s other subtitles');
            }

            const createdHardWord = await prisma.hardWords.create({
                data: {
                    word: hardWord,
                    Subtitle: { connect: { SubtitleId: subtitle.SubtitleId } },
                },
            });

            return NextResponse.json(createdHardWord);
        } catch (error) {
            console.error('Error creating/updating subtitle:', error);
            return NextResponse.json({ error: error });
        }
    } else {
        return NextResponse.json({ error: 'Method Not Allowed' });
    }
}
