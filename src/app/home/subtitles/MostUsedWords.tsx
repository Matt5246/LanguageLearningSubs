import { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';


interface MostUsedWordsButtonProps {
    selectedSubtitle: Subtitle;
}

const germanStopwords = [
    "ich", "und", "du", "der", "die", "das", "wir", "nicht", "er", "es", "sie",
    "ihr", "dein", "sein", "mein", "bei", "von", "in", "auf", "mit", "zu", "für",
    "dass", "aber", "wie", "im", "den", "dem", "des", "einen", "eine", "einer", "über"
];

const filterStopwords = (words: string[]) => {
    return words.filter((word) => !germanStopwords.includes(word.toLowerCase()));
};

const removePunctuation = (word: string) => {
    return word.replace(/[.,/#!$%?"^&*;:{}=\-_`~()]/g, "").trim();
};

export function MostUsedWordsButton({ selectedSubtitle }: MostUsedWordsButtonProps) {
    const [topWords, setTopWords] = useState<[string, number][]>([]);
    const [open, setOpen] = useState(false);
    const [filteredWords, setFilteredWords] = useState<[string, number][]>([]);
    const [frequency, setFrequency] = useState<number>(5);
    const { toast } = useToast();

    const handleMostUsedWords = async () => {
        if (!selectedSubtitle.subtitleData || selectedSubtitle.subtitleData.length === 0) {
            toast({
                title: "Error",
                description: "No subtitle data found for the selected subtitle.",
                variant: "destructive",
            });
            return;
        }

        try {
            const subtitles = selectedSubtitle.subtitleData.map((caption) => caption.text);
            const allWords = subtitles.flatMap((subtitle) => subtitle?.split(/\s+/));
            const cleanedWords = allWords.filter((word): word is string => word !== undefined).map(removePunctuation).filter((word) => word.length > 0);
            const filteredWords = filterStopwords(cleanedWords);
            const uniqueWords = Array.from(new Set(filteredWords.map((word) => word.toLowerCase())));

            const response = await axios.post('/api/subtitles/frequencyOfWords', { uniqueWords });

            const lemmatizedWords: { [key: string]: string } = response.data.data.reduce((acc: { [key: string]: string }, item: { word: string, lemma: string }) => {
                acc[item.word] = item.lemma;
                return acc;
            }, {});

            const wordCount: { [key: string]: number } = {};
            filteredWords.forEach((word) => {
                const lemma = lemmatizedWords[word.toLowerCase()] || word.toLowerCase();
                wordCount[lemma] = (wordCount[lemma] || 0) + 1;
            });

            const frequentWords = Object.entries(wordCount)
                .sort(([, a], [, b]) => b - a);

            setTopWords(frequentWords);
            setOpen(true);

        } catch (error) {
            console.error('Error fetching most used words:', error);
            toast({
                title: "Error",
                description: `There was a problem processing the subtitles. \n ${error || 'Unknown error'}`,
                variant: "destructive",
            });
        }
    };
    useEffect(() => {
        const filtered = topWords.filter(([, count]) => count >= frequency);
        setFilteredWords(filtered);
    }, [frequency, topWords]);
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">Most Used Words</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Most Used Words</DialogTitle>
                </DialogHeader>
                <div className="mt-2 max-h-[400px] overflow-y-auto">
                    <div className="mb-4">
                        <label className="block text-sm font-medium ">Minimum Frequency:</label>
                        <Input
                            type="number"
                            min="1"
                            value={frequency}
                            onChange={(e) => setFrequency(Number(e.target.value))}
                            className="mt-1 block border border-gray-300 rounded-md shadow-sm"
                        />
                    </div>
                    {filteredWords.length > 0 ? (
                        <ul>
                            {filteredWords.map(([word, count]) => (
                                <li key={word}>{word}: {count}</li>
                            ))}
                        </ul>
                    ) : (
                        <p>No words found with frequency greater than {frequency}.</p>
                    )}
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>Close</Button>
                    <Button variant="default" onClick={handleMostUsedWords} className="ml-2">Send request for words</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
