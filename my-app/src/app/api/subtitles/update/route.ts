import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
const prisma = new PrismaClient();

export async function POST(req: Request) {
    if (req.method === 'POST') {
        try {
            const { email, youtubeUrl, subtitleTitle, subtitleData, userId } = await req.json();

            if (!userId) {


                if (!email) {
                    throw new Error('Email is required');
                }

                const user = await prisma.user.findUnique({ where: { email } });
                if (!user) {
                    throw new Error('User not found');
                }

                const userId = user.id;
            }
            // Check if the subtitle already exists for the user and YouTube URL
            const existingSubtitle = await prisma.subtitle.findFirst({
                where: { userId, youtubeUrl },
            });
            console.log(existingSubtitle)
            if (existingSubtitle) {
                // If the subtitle already exists, update it
                const updatedSubtitle = await prisma.subtitle.update({
                    where: { SubtitleId: existingSubtitle.SubtitleId },
                    data: {
                        subtitleTitle: subtitleTitle,
                        // subtitleData: { set: subtitleData }, // Update the subtitle data
                    },
                });

                return NextResponse.json(updatedSubtitle);
            } else {
                // If the subtitle does not exist, create a new one
                const newSubtitle = await prisma.subtitle.create({
                    data: {
                        userId,
                        youtubeUrl,
                        subtitleTitle,
                        // hardWords: {},
                    },
                });

                return NextResponse.json(newSubtitle);
            }
        } catch (error) {
            console.error('Error creating or updating subtitle:', error);
            return NextResponse.json({ error: error });
        }
    } else {
        return NextResponse.json({ error: 'Method Not Allowed' });
    }
}
