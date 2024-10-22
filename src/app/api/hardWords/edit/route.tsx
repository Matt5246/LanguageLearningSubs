import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req: Request) {
    try {
        const { hardWord } = await req.json();

        const { id } = hardWord;
        const existingHardWord = await prisma.hardWord.findFirst({
            where: { id },
        });
        if (!existingHardWord) {
            return NextResponse.json({ error: 'Hard word not found' }, { status: 404 });
        }
        const updatedHardWord = {
            word: hardWord.word,
            translation: hardWord.translation,
            lemma: hardWord.lemma,
            pos: hardWord.pos,
        }

        const response = await prisma.hardWord.update({
            where: { id },
            data: updatedHardWord,
        });

        console.log("Successfully updated hardword:", hardWord.word);
        return NextResponse.json(response);
    } catch (error: any) {
        console.error('Error updating learn state for hard words:', error);
        return NextResponse.json({ error: error.message });
    }
}
