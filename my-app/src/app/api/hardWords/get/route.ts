import { PrismaClient, HardWord } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req: Request) {
    if (req.method === 'POST') {
        try {
            const { email, youtubeUrl } = await req.json();

            if (!email) {
                throw new Error('Email is required');
            }

            const user = await prisma.user.findUnique({ where: { email } });
            if (!user) {
                throw new Error('User not found');
            }

            const userHardWords = await prisma.hardWord.findMany({
                where: { Subtitle: { userId: user.id } },
                include: { Subtitle: { select: { subtitleTitle: true } }, sentences: { select: { sentence: true, translation: true } } },
            });


            let subtitleHardWords: HardWord[] = [];
            if (youtubeUrl) {
                const subtitle = await prisma.subtitle.findFirst({
                    where: { userId: user.id, youtubeUrl },
                });
                if (!subtitle) {
                    throw new Error('Subtitle not found');
                }
                subtitleHardWords = await prisma.hardWord.findMany({
                    where: { Subtitle: { SubtitleId: subtitle.SubtitleId } },
                });
            }

            return NextResponse.json({ userHardWords, subtitleHardWords });
        } catch (error) {
            console.error('Error fetching hard words:', error);
            return NextResponse.json({ error: error });
        }
    } else {
        return NextResponse.json({ error: 'Method Not Allowed' });
    }
}
