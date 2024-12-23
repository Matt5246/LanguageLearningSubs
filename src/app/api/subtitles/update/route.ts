import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
const prisma = new PrismaClient();

export async function POST(req: Request) {
    if (req.method === 'POST') {
        try {
            const { youtubeUrl, subtitleTitle, subtitleData, userId, SubtitleId, episode, sourceLang, targetLang } = await req.json();
            const data: any = {
                subtitleTitle,
            };

            if (youtubeUrl) {
                data.youtubeUrl = youtubeUrl;
            }

            const existingSubtitle = await prisma.subtitle.findFirst({
                where: { userId, SubtitleId },
            });
            if(existingSubtitle?.episode){
                data.episode = parseInt(episode) || existingSubtitle.episode;
            }
            if (sourceLang || targetLang) {
                data.sourceLang = sourceLang || existingSubtitle?.sourceLang;
                data.targetLang = targetLang || existingSubtitle?.targetLang;
            }
            if (existingSubtitle) {
                if (subtitleData && subtitleData.length > 0) {
                    const updatedSubtitle = await prisma.$transaction([
                        prisma.subtitleData.deleteMany({
                        where: { subtitleDataId: existingSubtitle.SubtitleId },
                    }),
                    prisma.subtitle.update({
                        where: { SubtitleId: existingSubtitle.SubtitleId },
                        data: {
                            ...data,
                            subtitleData: { createMany: { data: subtitleData } },
                        },
                        
                    })])

                    
                    return NextResponse.json(updatedSubtitle);
                }else{
                    const updatedSubtitle = await prisma.subtitle.update({
                        where: { SubtitleId: existingSubtitle.SubtitleId },
                        data: {
                            ...data, 
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
