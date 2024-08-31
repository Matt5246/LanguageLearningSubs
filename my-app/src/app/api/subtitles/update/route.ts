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
                if (subtitleData && subtitleData.length > 0) {
                    await prisma.subtitleData.deleteMany({
                        where: { subtitleDataId: existingSubtitle.SubtitleId },
                    });
                    const updatedSubtitle = await prisma.subtitle.update({
                        where: { SubtitleId: existingSubtitle.SubtitleId },
                        data: {
                            subtitleData: { createMany: { data: subtitleData } },
                        },
                        
                    });
                    
                    return NextResponse.json(updatedSubtitle);
                }else{
                    const updatedSubtitle = await prisma.subtitle.update({
                        where: { SubtitleId: existingSubtitle.SubtitleId },
                        data: {
                            subtitleTitle: subtitleTitle || existingSubtitle.subtitleTitle,
                            youtubeUrl: youtubeUrl || existingSubtitle.youtubeUrl, 
                        },
                        
                    });
                    return NextResponse.json(updatedSubtitle);
                }
            } 
        } catch (error) {
            console.error('Error creating or updating subtitle:', error);
            return NextResponse.json({ error: error });
        }
    } else {
        return NextResponse.json({ error: 'Method Not Allowed' });
    }
}
