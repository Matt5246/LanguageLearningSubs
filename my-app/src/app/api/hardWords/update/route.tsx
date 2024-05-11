import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

export const prisma = new PrismaClient();

export async function POST(req: Request) {
    if (req.method === 'POST') {
        try {
            const { hardWords } = await req.json();

            const response = await Promise.all(hardWords.map(async (hardWordData: any) => {
                const { id, learnState } = hardWordData;

                const existingHardWord = await prisma.hardWord.findFirst({
                    where: { id },
                });

                if (!existingHardWord) {
                    return { error: 'Hard word not found' };
                }

                await prisma.hardWord.update({
                    where: { id },
                    data: { learnState },
                });

                console.log("Successfully updated learn state for hard word with ID:", id);
                return { id, updatedLearnState: learnState };
            }));

            return NextResponse.json(response);
        } catch (error) {
            console.error('Error updating learn state for hard words:', error);
            return NextResponse.json({ error: error });
        }
    } else {
        return NextResponse.json({ error: 'Method Not Allowed' });
    }
}
