import * as deepl from 'deepl-node';
import { NextResponse } from 'next/server';


const deeplKey = process.env.DEEPL_KEY || "";
const translator = new deepl.Translator(deeplKey);

export async function POST(req: Request) {
    if (req.method === 'POST') {
        try {
            const { text, language, formality } = await req.json();

            const result = await translator.translateText(text.toString(), null, language || 'de', { formality: formality || 'more' });
            console.log(Array.isArray(result) ? result[0].text : result.text);
            return NextResponse.json(Array.isArray(result) ? result[0].text : result.text);

        } catch (error) {
            console.error('Error translating:', error);
            return NextResponse.json({ error: error });
        }
    } else {
        return NextResponse.json({ error: 'Method Not Allowed' });
    }
}

