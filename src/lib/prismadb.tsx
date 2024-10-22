
import { PrismaClient } from "@prisma/client";

const client = (globalThis as any).prisma || new PrismaClient();
if (process.env.NODE_ENV === "production") (globalThis as any).prisma = client;



export async function fetchSubtitlesFromDB(email: string) {
    return client.subtitle.findMany({
        where: {
            email,
        },
        include: {
            subtitleData: true,
            hardWords: true,
        },
    });
}

export async function updateSubtitleInDB(subtitleId: string, updatedSubtitle: string) {
    return client.subtitle.update({
        where: {
            SubtitleId: subtitleId,
        },
        data: updatedSubtitle,
    });
}
export default client;
