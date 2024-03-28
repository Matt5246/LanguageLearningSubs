import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
const prisma = new PrismaClient();

export async function POST(req: Request) {
    if (req.method === 'POST') {
        try {

            const { email, youtubeUrl, subtitleTitle, subtitleData } = await req.json();

            if (!email) {
                throw new Error('Email is required');
            }
            const user = await prisma.user.findUnique({ where: { email } });
            if (!user) {
                throw new Error('User not found');
            }
            const userId = user.id

            const subtitle = await prisma.subtitle.create({
                data: {
                    userId,
                    youtubeUrl,
                    subtitleTitle,
                    // subtitleData: { createMany: { data: subtitleData } },
                    // hardWords: {},
                },
            });
            return NextResponse.json(subtitle)
        } catch (error) {
            console.error('Error creating subtitle:', error);
            return NextResponse.json({ error: error });
        }
    } else {
        return NextResponse.json({ error: 'Method Not Allowed' });
    }
}
