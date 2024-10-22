import { NextResponse } from 'next/server';
import kuromoji from 'kuromoji';

export async function POST(req: Request) {
    if (req.method === 'POST') {
        const { text } = await req.json();
        try {
            const tokenizer = await new Promise<kuromoji.Tokenizer<any>>((resolve, reject) => {
                kuromoji.builder({ dicPath: 'node_modules/kuromoji/dict' }).build((err, tokenizer) => {
                    if (err) reject(err);
                    else resolve(tokenizer);
                });
            });

            const tokens = tokenizer.tokenize(text);

            return NextResponse.json({ tokens });
        } catch (error) {
            console.error('Tokenization error:', error);
            return NextResponse.json({ error: 'Tokenization failed', details: error });
        }
    } else {
        return NextResponse.json({ error: 'Method Not Allowed' });
    }
}
