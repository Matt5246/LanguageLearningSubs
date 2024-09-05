'use client'
import { useSelector } from 'react-redux';
import { selectFlashCardData } from '@/lib/features/subtitles/subtitleSlice';
import { Separator } from "@/components/ui/separator"

const Home = () => {
    const flashCardData: Subtitle[] = useSelector(selectFlashCardData) || [];

    const sortedHardWords = flashCardData
        .flatMap(data => data.hardWords)
        .filter(word => word && word.word).sort((a, b) => {
            if (a && a.word && b && b.word) {
                return a.word.localeCompare(b.word);
            }
            return 0;

        });
    console.log(sortedHardWords)
    return (
        <div className="flex justify-center mt-6 select-text">
            {sortedHardWords.length > 0 ? (
                <div>
                    {sortedHardWords.map((row, index) => (
                        <div key={index}>
                            <strong>{row?.word}</strong> - {row?.translation}

                            <Separator orientation="horizontal" />
                        </div>

                    ))}

                </div>
            ) : (
                <p className="mt-12 text-center text-gray-500">
                    Add your hard words to the database first to use this component.
                </p>
            )}
        </div>
    );
};

export default Home;
