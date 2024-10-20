"use client"
import React, { useState } from 'react'
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress"
import { useIsMobile } from '@/hooks/useMobile';
import { useSelector } from 'react-redux';
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";

interface InputWord {
    word?: string;
    translation?: string;
    handleEasy: () => void;
}
export default function InputFlashCard({ word, translation, handleEasy }: InputWord) {
    const [userAnswer, setUserAnswer] = useState("")
    const [showFeedback, setShowFeedback] = useState(false)
    const [feedbackMessage, setFeedbackMessage] = useState("")

    const handleCheckAnswer = (answer?: string) => {
        if (answer) {
            if (answer.trim().toLowerCase() === translation?.toLowerCase()) {
                setFeedbackMessage("Correct!")
                setShowFeedback(true)
                setTimeout(handleEasy, 2000)
            }
        } else {
            if (userAnswer.trim().toLowerCase() === translation?.toLowerCase()) {
                setFeedbackMessage("Correct!")
                setShowFeedback(true)
                setTimeout(handleEasy, 2000)
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
