'use client'
import { useSelector } from 'react-redux';
import { selectFlashCardData } from '@/lib/features/subtitles/subtitleSlice';

const Home = () => {
    const flashCardData: any[] = useSelector(selectFlashCardData);
    console.log(flashCardData)


    flashCardData.sort((a, b) => a.hardWords[0]?.word.localeCompare(b.hardWords[0]?.word));

    return (
        <div className="flex justify-center mt-6 select-text">
            {flashCardData?.length > 0 ? (
                <ul>

                    {flashCardData.map((data) => (
                        data?.hardWords.map((row: any) =>
                            (<li><strong>{row.word}</strong> - {row.translation}</li>))
                    ))}

                </ul>
            ) : (
                <p className="mt-12 text-center text-gray-500">
                    Add your hard words to the database first to use this component.
                </p>
            )}
        </div>
    );
};

export default Home;
