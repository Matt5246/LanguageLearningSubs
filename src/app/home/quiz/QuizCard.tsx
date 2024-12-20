import { useEffect, useState } from "react"
import { Check, X } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"

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
        if (feedback) return; 
        
        setSelectedOption(option)
        const isCorrect = option.toLowerCase() === correctAnswer.toLowerCase()
        setFeedback(isCorrect ? 'correct' : 'incorrect')
        onSubmit(option)
    }

    return (
        <div className="relative">
            <div className="absolute -top-4 right-0 bg-primary text-background px-3 py-1 rounded-full text-sm">
                Streak: {streak}/3
            </div>
            
            <Card className="w-full max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center mb-4">{word}</CardTitle>
                </CardHeader>
                
                <CardContent>
                    <div className="grid grid-cols-2 gap-3">
                        {options.map((option, index) => (
                            <Button
                                key={index}
                                variant={selectedOption === option ? "default" : "outline"}
                                className={`w-full p-6 text-lg font-medium transition-all ${
                                    feedback && selectedOption === option
                                        ? feedback === 'correct'
                                            ? 'bg-green-500 hover:bg-green-500 text-white'
                                            : 'bg-red-500 hover:bg-red-500 text-white'
                                        : ''
                                }`}
                                onClick={() => handleSubmit(option)}
                                disabled={feedback !== null}
                            >
                                {option}
                            </Button>
                        ))}
                    </div>
                    <div className="h-8 mt-4">
                    <AnimatePresence mode="wait">
                        {feedback && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="text-center"
                            >
                                {feedback === 'correct' ? (
                                    <p className="text-green-600 font-medium flex items-center justify-center gap-2">
                                        <Check className="w-5 h-5" /> Correct!
                                    </p>
                                ) : (
                                    <p className="text-red-600 font-medium">
                                        {correctAnswer}
                                    </p>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default QuizCard