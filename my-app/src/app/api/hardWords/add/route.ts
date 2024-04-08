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
            const { email, youtubeUrl, hardWord, subtitleTitle, userId } = await req.json();

            if (!email && !userId) {
                throw new Error('Email is required');
            }

            if (email) {

                const user = await prisma.user.findUnique({ where: { email } });
                if (!user && !userId) {
                    throw new Error('User not found');
                }
            }
            //@ts-ignore
            const selectedUserId = userId || user.id;

            const subtitle = await prisma.subtitle.findFirst({
                where: { userId: selectedUserId, youtubeUrl },
            });
            if (!subtitle) {
                const newSubtitle = await prisma.subtitle.create({
                    data: {
                        userId: selectedUserId,
                        youtubeUrl,
                        subtitleTitle: subtitleTitle || generateRandomTitle(),

                    },
                });
                return NextResponse.json(newSubtitle);
            }

            const existingHardWord = await prisma.hardWords.findFirst({
                where: { Subtitle: { userId: selectedUserId }, word: hardWord },
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
            console.log("successfully added hardword:", hardWord)
            return NextResponse.json(createdHardWord);
        } catch (error) {
            console.error('Error creating/updating subtitle:', error);
            return NextResponse.json({ error: error });
        }
    } else {
        return NextResponse.json({ error: 'Method Not Allowed' });
    }
}
