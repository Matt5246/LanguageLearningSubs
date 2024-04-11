import * as deepl from 'deepl-node';
import { NextResponse } from 'next/server';

const deeplKey = process.env.DEEPL_KEY || "";
const translator = new deepl.Translator(deeplKey);

export async function POST(req: Request) {
    if (req.method === 'POST') {
        try {
            const { text, language, formality, subtitleData } = await req.json();


            console.log(text)
            const response = await fetch("http://127.0.0.1:5000/translate", {
                method: "POST",
                body: JSON.stringify({
                    q: text,
                    source: "en",
                    target: "de",
                    format: "text"
                }),
                headers: { "Content-Type": "application/json" }
            });

            //const result = await translator.translateText(text.toString(), null, language || 'en-GB');// { formality: formality || 'more' } only works with german
            //console.log(Array.isArray(result) ? result[0].text : result.text);
            //return NextResponse.json(Array.isArray(result) ? result[0].text : result.text);

            const result = await response.json()
            console.log(result.translatedText)
            return NextResponse.json(result.translatedText);

        } catch (error) {
            console.error('Error translating:', error);
            return NextResponse.json({ error: error });
        }
    } else {
        return NextResponse.json({ error: 'Method Not Allowed' });
    }
}

