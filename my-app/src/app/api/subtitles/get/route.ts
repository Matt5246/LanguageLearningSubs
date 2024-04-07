
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req: Request) {
    if (req.method === 'POST') {
        try {
            const data = await req.json();
            const { email } = data;


            if (!email) {
                throw new Error('Email is required');
            }
            const user = await prisma.user.findUnique({ where: { email } });
            if (!user) {
                throw new Error('User not found');
            }


            const subtitles = await prisma.subtitle.findMany({
                where: {
                    userId: user.id,
                },
                include: {
                    subtitleData: true,
                    hardWords: true,
                },
            });
            return NextResponse.json(subtitles);
        } catch (error) {
            console.error('Error fetching subtitles:', error);
            return NextResponse.json({ error: 'Error fetching subtitles' });
        }
    } else {
        return NextResponse.json({ error: 'Method Not Allowed' });
    }
}
