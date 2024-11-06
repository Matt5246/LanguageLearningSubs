import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function DELETE(req: Request) {
    if (req.method === 'DELETE') {
        try {
            const { email, hardWord } = await req.json();

            if (!email) {
                throw new Error('Email is required');
            }

            const user = await prisma.user.findUnique({ where: { email } });
            if (!user) {
                throw new Error('User not found');
            }

            const subtitle = await prisma.subtitle.findFirst({
                where: { userId: user.id, hardWords: { some: { word: hardWord } },},
            });
            if (!subtitle) {
                throw new Error('Subtitle not found');
            }

            const deletedHardWord = await prisma.hardWord.deleteMany({
                where: { Subtitle: { SubtitleId: subtitle.SubtitleId }, word: hardWord },
            });

            return NextResponse.json(deletedHardWord);
        } catch (error) {
            console.error('Error deleting hard word:', error);
            return NextResponse.json({ error: error });
        }
    } else {
        return NextResponse.json({ error: 'Method Not Allowed' });
    }
}
