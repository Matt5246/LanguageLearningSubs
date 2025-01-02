import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import axios from 'axios';
import { primaryTranslationServiceURL } from '@/lib/utils'

const prisma = new PrismaClient();
async function fetchLemmaAndPOS(word: string, sourceLang: string) {
    try {
        const response = await axios.post('http://127.0.0.1:8080/nlp', { word, sourceLang });
        const { result } = response.data;
        return result;
    } catch (error) {
        console.error('Error fetching lemma and POS:', error);
        return { lemma: null, pos: null };
    }
}
async function fetchTranslation(word: string, sourceLang: string, targetLang: string) {
    try {
        const translationResponse = await fetch(primaryTranslationServiceURL, {
            method: "POST",
            body: JSON.stringify({
                q: word,
                source: sourceLang || "auto",
                target: targetLang || "en",
                format: "text"
            }),
            headers: { "Content-Type": "application/json" }
        });
        const translationResult = await translationResponse.json();
        return translationResult.translatedText;
    } catch (error) {
        console.error('Error fetching translation:', error);
        return null;
    }
}
export async function POST(req: Request) {
    if (req.method === 'POST') {
        try {
            const { email, youtubeUrl, hardWord, subtitleTitle, userId, sentence, sentenceTranslation, sourceLang } = await req.json();

            if (!email && !userId) {
                throw new Error('Email is required');
            }

            if (email) {

                const user = await prisma.user.findUnique({ where: { email } });
                if (!user && !userId) {
                    throw new Error('User not found');
                }
            }
            //@ts-ignore
            const selectedUserId = userId || user.id;
            const subtitle = await prisma.subtitle.findFirst({
                where: {
                    userId: selectedUserId,
                    OR: [
                        { youtubeUrl: youtubeUrl || undefined },
                        { subtitleTitle: subtitleTitle || undefined }
                    ],
                },
            });

            if (!subtitle) {
                return NextResponse.json({ error: 'subtitle not found!' });
            }

            const existingHardWord = await prisma.hardWord.findFirst({
                where: { Subtitle: { userId: selectedUserId }, word: hardWord },
            });
            if (existingHardWord) {
                return NextResponse.json({ error: 'Word already exists in user\'s other subtitles' })
            }
            // const existingSentence = await prisma.sentence.findFirst({
            //     where: { sentence: sentence },
            // });
            const sentenceData = {
                sentence,
                translation: sentenceTranslation,
            }
            let hardWordData: {
                word: string;
                Subtitle: { connect: { SubtitleId: string; } };
                lemma?: string | null;
                pos?: string | null;
                translation?: string | null;
            } = {
                word: hardWord,
                Subtitle: { connect: { SubtitleId: subtitle.SubtitleId } },
            }
            const { lemma, pos } = await fetchLemmaAndPOS(hardWord, sourceLang);
            const translation = await fetchTranslation(lemma ? lemma : hardWord, subtitle?.sourceLang || "auto", subtitle?.targetLang || 'en');

            if (lemma) {
                hardWordData = {
                    ...hardWordData,
                    lemma,
                    pos,
                };
            }else{
                hardWordData = {
                    ...hardWordData,
                    lemma: hardWord,
                    pos: null,
                };
            }
            if (translation) {
                hardWordData = {
                    ...hardWordData,
                    translation
                };
            }

            // if (existingSentence) {
            //     await prisma.hardWord.create({
            //         data: {
            //             ...hardWordData,
            //             sentences: { connect: { id: existingSentence?.id } }
            //         },
            //     });
            //     return NextResponse.json({ word: hardWord, sentenceData });
            // }

            console.log('hardword:', hardWordData)
            await prisma.hardWord.create({
                data: {
                    ...hardWordData,
                    sentences: { create: sentenceTranslation ? sentenceData : sentence },
                },
            });
            console.log("successfully added hardword:", hardWord)
            return NextResponse.json({ word: hardWord, sentenceData, success: 'successfully added hardword' });
        } catch (error) {
            console.error('Error creating/updating subtitle:', error);
            return NextResponse.json({ error: error });
        }
    } else {
        return NextResponse.json({ error: 'Method Not Allowed' });
    }
}
