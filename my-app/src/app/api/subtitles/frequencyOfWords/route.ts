import { NextResponse} from 'next/server';
import axios from 'axios';


export async function POST(req: Request) {
  if (req.method === 'POST') {
    try {
        const { uniqueWords } = await req.json();

        const response = await axios.post('http://127.0.0.1:8080/frequency', {
         uniqueWords
        });

        console.log('Response from Flask:', response.data);
        return NextResponse.json(response.data); 
    } catch (error) {

      console.error('Error processing word frequency:', error);
      return NextResponse.json({ error: 'Error processing word frequency' });
    }
  } else {
    return NextResponse.json({ error: 'Method Not Allowed' });
  }
}
