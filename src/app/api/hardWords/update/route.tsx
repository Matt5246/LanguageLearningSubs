import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req: Request) {
    try {
        const { hardWords } = await req.json();

        const response = await Promise.all(hardWords.map(async (hardWordData: any) => {
            const { id, learnState, dueDate, repetitions } = hardWordData;

            const existingHardWord = await prisma.hardWord.findFirst({
                where: { id },
            });

            if (!existingHardWord) {
                return { error: 'Hard word not found' };
            }

            const updateData: any = {
                learnState,
            };

            if (learnState === 100 && !existingHardWord.learnedAt) {
                updateData.learnedAt = new Date();
            }
            if (dueDate && repetitions) {
                updateData.dueDate = dueDate;
                updateData.repetitions = repetitions;
            }

            await prisma.hardWord.update({
                where: { id },
                data: updateData,
            });

            console.log("Successfully updated learn state for hard word with ID:", id);
            return { id, updatedLearnState: learnState };
        }));

        return NextResponse.json(response);
    } catch (error: any) {
        console.error('Error updating learn state for hard words:', error);
        return NextResponse.json({ error: error.message });
    }
}
