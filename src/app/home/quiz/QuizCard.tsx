'use client'

import { useEffect, useState } from "react"
import { Check, X, Zap } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export interface QuizCardProps {
    word: string
    correctAnswer: string
    options?: string[]
    onSubmit: (selectedTranslation: string) => void
    streak: number
}

const QuizCard = ({ word, correctAnswer, options = [], onSubmit, streak }: QuizCardProps) => {
    const [selectedOption, setSelectedOption] = useState<string | null>(null)
    const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null)

    useEffect(() => {
        if (feedback) {
            setFeedback(null)
            setSelectedOption(null)
        }
    }, [options])

    const handleSubmit = (option: string) => {
        if (feedback) return

        setSelectedOption(option)
        const isCorrect = option?.toLowerCase() === correctAnswer?.toLowerCase()
        setFeedback(isCorrect ? 'correct' : 'incorrect')
        onSubmit(option)
    }

    return (
        <Card className="w-full max-w-2xl mx-auto shadow-lg">
            <CardHeader className="text-center">
                <div className="flex justify-between items-center mb-4">
                    <Badge variant="outline" className="text-sm font-semibold">
                        Quiz
                    </Badge>
                    <div className="flex items-center gap-1">
                        <Zap className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm font-medium">Streak: {streak}/3</span>
                    </div>
                </div>
                <CardTitle className="text-4xl font-bold mb-2">{word}</CardTitle>
                <CardDescription>Choose the correct translation</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
                <div className="grid grid-cols-2 gap-4 mb-6">
                    {options.map((option, index) => (
                        <Button
                            key={index}
                            variant={selectedOption === option ? "default" : "outline"}
                            className={`w-full p-6 text-lg font-medium transition-all ${feedback && selectedOption === option
                                ? feedback === 'correct'
                                    ? 'bg-green-500 hover:bg-green-600 text-white'
                                    : 'bg-red-500 hover:bg-red-600 text-white'
                                : ''
                                }`}
                            onClick={() => handleSubmit(option)}
                            disabled={feedback !== null}
                        >
                            {option}
                        </Button>
                    ))}
                </div>
                <div className="h-12">
                    <AnimatePresence mode="wait">
                        {feedback && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                transition={{ duration: 0.3 }}
                                className="text-center p-4 rounded-lg"
                            >
                                {feedback === 'correct' ? (
                                    <div className="flex items-center justify-center gap-2 text-green-600">
                                        <Check className="w-6 h-6" />
                                        <span className="text-xl font-semibold">Correct!</span>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-center gap-2 text-red-600">
                                            <X className="w-6 h-6" />
                                            <span className="text-xl font-semibold">Incorrect</span>
                                        </div>
                                        <p className="text-lg">
                                            The correct answer is: <span className="font-bold">{correctAnswer}</span>
                                        </p>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="mt-6">
                    <div className="flex justify-between text-sm text-muted-foreground mb-2">
                        <span>Word progress</span>
                        <span>{streak}/3</span>
                    </div>
                    <Progress value={(streak / 3) * 100} className="h-2" />
                </div>
            </CardContent>
        </Card>
    )
}

export default QuizCard