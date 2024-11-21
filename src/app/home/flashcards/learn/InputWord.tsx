"use client"
import { CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from 'react';

interface InputWord {
    word?: string;
    translation?: string;
    onCorrect: () => void;
    onIncorrect: () => void;
}
export default function InputFlashCard({ word, translation, onCorrect, onIncorrect }: InputWord) {
    const [userAnswer, setUserAnswer] = useState("")
    const [showFeedback, setShowFeedback] = useState(false)
    const [feedbackMessage, setFeedbackMessage] = useState("")

    const handleCheckAnswer = (answer?: string) => {
        if (answer) {
            if (answer.trim().toLowerCase() === translation?.toLowerCase()) {
                setFeedbackMessage("Correct!")
                setShowFeedback(true)
                setTimeout(onCorrect, 2000)
            }
        } else {
            if (userAnswer.trim().toLowerCase() === translation?.toLowerCase()) {
                setFeedbackMessage("Correct!")
                setShowFeedback(true)
                setTimeout(onCorrect, 2000)
            } else {
                setFeedbackMessage("Incorrect. Try again.");
                setShowFeedback(true);
            }
        }

    };

    return (
        <>
            {word ? (
                <CardContent className="p-0">
                    <div className="grid w-full items-center space-y-1.5">
                        <div className="flex flex-col space-y-1.5">
                            <CardTitle className='text-xl'>{word}</CardTitle>
                        </div>
                        <div className="flex flex-col space-y-1.5 text-xl">
                            {showFeedback && (
                                <p className={`text-lg ${feedbackMessage === 'Correct!' ? 'text-green-500' : 'text-red-500'}`}>
                                    {feedbackMessage}
                                </p>
                            )}
                            <Input
                                value={userAnswer}
                                onChange={(e) => {
                                    setUserAnswer(e.target.value);
                                    handleCheckAnswer(e.target.value);
                                }}
                                placeholder="Type your answer here"
                                className="mt-3"
                            />
                        </div>

                    </div>
                </CardContent>
            ) : (
                <div className="mt-12 text-center text-gray-500 mx-4">
                    Add your hard words to the database first to use this component.
                </div>
            )}
        </>
    );
}
