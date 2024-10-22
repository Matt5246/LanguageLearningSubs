import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function DELETE(req: Request) {
    if (req.method === 'DELETE') {
        try {
            const { SubtitleId } = await req.json();


            if (!SubtitleId) {
                throw new Error('Subtitle ID is required');
            }

            // Check if the subtitle exists
            const subtitle = await prisma.subtitle.findUnique({
                where: {
                    SubtitleId: SubtitleId,
                },
            });

            if (!subtitle) {
                throw new Error('Subtitle not found');
            }

            // Delete the subtitle
            await prisma.subtitle.delete({
                where: {
                    SubtitleId: SubtitleId,
                },
            });

            return NextResponse.json({ success: true, message: 'Subtitle deleted successfully' });
        } catch (error) {
            console.error('Error deleting subtitle:', error);
            return NextResponse.json({ error: 'Error deleting subtitle' });
        }
    } else {
        return NextResponse.json({ error: 'Method Not Allowed' });
    }
}
