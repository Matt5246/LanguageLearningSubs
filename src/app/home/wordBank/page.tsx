'use client';
import { useSelector } from 'react-redux';
import { selectFlashCardData } from '@/lib/features/subtitles/subtitleSlice';
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';

interface Subtitle {
    hardWords: Word[];
}

interface Word {
    word: string;
    translation: string;
}

const Home: React.FC = () => {
    const flashCardData: Subtitle[] = useSelector(selectFlashCardData) || [];
    const [isLoaded, setIsLoaded] = useState(false);
    const [fontSize, setFontSize] = useState('text-xl');

    const sortedHardWords: Word[] = flashCardData
        .flatMap(data => data.hardWords)
        .filter(word => word && word.word)
        .sort((a, b) => a.word.localeCompare(b.word));

    const groupedWords: { [key: string]: Word[] } = sortedHardWords.reduce((acc, word) => {
        const firstLetter = word.word.charAt(0).toUpperCase();
        if (!acc[firstLetter]) {
            acc[firstLetter] = [];
        }
        acc[firstLetter].push(word);
        return acc;
    }, {} as { [key: string]: Word[] });

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    const increaseFontSize = () => {
        setFontSize((prevSize) => prevSize === 'text-lg' ? 'text-xl' : 'text-2xl');
    };

    const decreaseFontSize = () => {
        setFontSize((prevSize) => prevSize === 'text-2xl' ? 'text-xl' : 'text-lg');
    };

    const scrollTo = (letter: string) => {
        const element = document.getElementById(letter);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            element.classList.add('highlight');
            setTimeout(() => {
                element.classList.replace('highlight', 'highlight-remove');
            }, 1500);
        }
    };

    if (!isLoaded) {
        return (
            <h1 className="text-2xl font-bold mt-9 ml-9">Word Bank
                <Spinner />
            </h1>
        );
    }

    return (
        <>
            <h1 className="text-2xl font-bold mt-6 ml-6 md:text-3xl">
                Word Bank {sortedHardWords.length ? `of ${sortedHardWords.length} words` : null}
            </h1>

            <div className="flex justify-center mt-4 space-x-4">
                <Button onClick={decreaseFontSize}>A-</Button>
                <Button onClick={increaseFontSize}>A+</Button>
            </div>
            <div className='absolute'>
                {Object.keys(groupedWords).length > 0 ? (
                    <div className='flex flex-col justify-center sticky m-2'>
                        {Object.keys(groupedWords).map((letter, letterIndex) => (
                            <Button className="" key={letter} onClick={() => scrollTo(letter)}>{letter}</Button>
                        ))}

                    </div>
                ) : null}
            </div>
            <div className="flex justify-center select-text">
                {Object.keys(groupedWords).length > 0 ? (
                    <div className="mt-9 w-full px-4 md:w-[700px]">
                        {Object.keys(groupedWords).map((letter, letterIndex) => (
                            <div key={letter} id={letter} className="mb-3">
                                <motion.h2
                                    initial={{ opacity: 0, y: 23 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: letterIndex * 0.1 }}
                                    className="text-2xl md:text-3xl font-semibold mb-2"
                                    id={letter}
                                >
                                    {letter}
                                </motion.h2>

                                {groupedWords[letter].map((row, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3, delay: letterIndex * 0.1 + index * 0.05 }}
                                        className={`flex justify-between p-1.5 md:p-0 ${fontSize}`}
                                    >
                                        <div className="w-1/2 break-words">
                                            <strong>{row.word.charAt(0).toUpperCase() + row.word.slice(1)}</strong>
                                        </div>
                                        <div className="w-1/2 break-words">
                                            {row.translation}
                                        </div>
                                    </motion.div>
                                ))}
                                <Separator orientation="horizontal" className="my-2" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="mt-12 text-center text-gray-500">
                        Add your hard words to the database first to use this component.
                    </p>
                )}
            </div>
        </>
    );
};

export default Home;
