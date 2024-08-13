import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
const prisma = new PrismaClient();

export async function POST(req: Request) {
    if (req.method === 'POST') {
        try {
            const { youtubeUrl, subtitleTitle, subtitleData, userId, SubtitleId } = await req.json();
            const data: any = {
                userId,
                subtitleTitle,
            };

            if (youtubeUrl) {
                data.youtubeUrl = youtubeUrl;
            }

            const existingSubtitle = await prisma.subtitle.findFirst({
                where: { userId, SubtitleId },
            });

            if (existingSubtitle) {
                // If the subtitle already exists, update it
                const updatedSubtitle = await prisma.subtitle.update({
                    where: { SubtitleId: existingSubtitle.SubtitleId },
                    data: {
                        subtitleTitle: subtitleTitle,
                    },
                });

                return NextResponse.json(updatedSubtitle);
            } else {
                // If the subtitle does not exist, create a new one
                const newSubtitle = await prisma.subtitle.create({
                    data: {
                        ...data
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
