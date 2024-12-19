'use client'

import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { selectQuizData, updateWordSRS, SubtitlesState } from '@/lib/features/subtitles/subtitleSlice'
import { motion, AnimatePresence } from 'framer-motion'
import QuizCard from './QuizCard'
import { Button } from '@/components/ui/button'
import { Trophy } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { shuffle } from 'lodash'

interface WordStreak {
  correctCount: number;
  isLearned: boolean;
}

const QuizPage = () => {
  const dispatch = useDispatch()
  const allQuizData = useSelector(selectQuizData)
  const { subtitles } = useSelector((state: { subtitle: SubtitlesState }) => state.subtitle)
  const [currentWord, setCurrentWord] = useState<any | null>(null)
  const [score, setScore] = useState({ correct: 0, total: 0 })
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [options, setOptions] = useState<string[]>([])
  const [streaks, setStreaks] = useState<{ [key: string]: WordStreak }>({})
  const [wordCount, setWordCount] = useState<number>(10)
  const [quizStarted, setQuizStarted] = useState(false)
  const [quizData, setQuizData] = useState<any[]>([])
  const [round, setRound] = useState(1)

  const startQuiz = () => {
    if (allQuizData.length === 0) return;
    
    // First reset everything
    resetQuizState()
    setStreaks({})
    setRound(1)
    
    // Then set up new quiz
    const selectedWords = shuffle(allQuizData).slice(0, wordCount)
    setQuizData(selectedWords)
    setQuizStarted(true)
    
    // Finally, set the first word after a short delay to ensure state is updated
    setTimeout(() => {
      const firstWord = selectedWords[0]
      setCurrentWord(firstWord)
      const correctAnswer = firstWord.translation
      const otherOptions = getRandomTranslations(correctAnswer)
      setOptions(shuffle([...otherOptions, correctAnswer]))
    }, 0)
  }

  const resetQuizState = () => {
    setScore({ correct: 0, total: 0 })
    setQuizCompleted(false)
  }

  const getRandomTranslations = (exclude: string) => {
    return subtitles
      .flatMap(sub => sub.hardWords || [])
      .filter(word => word.translation && word.translation !== exclude)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
      .map(word => word.translation!)
  }

  const setNextWord = () => {
    // Filter out learned words
    const unlearned = quizData.filter(word => !streaks[word.word]?.isLearned)
    
    if (unlearned.length === 0) {
      setQuizCompleted(true)
      return
    }

    // Get current word index
    const currentIndex = unlearned.findIndex(word => word.word === currentWord?.word)
    
    // Get next word (if at end, shuffle and start from beginning)
    let nextWord
    if (currentIndex === unlearned.length - 1 || currentIndex === -1) {
      nextWord = unlearned[0]
    } else {
      nextWord = unlearned[currentIndex + 1]
    }
    
    setCurrentWord(nextWord)
    
    // Generate new options
    const correctAnswer = nextWord.translation
    const otherOptions = getRandomTranslations(correctAnswer)
    setOptions(shuffle([...otherOptions, correctAnswer]))
  }

  const handleAnswer = (isCorrect: boolean, answer: string) => {
    if (currentWord) {
      const currentStreak = streaks[currentWord.word] || { correctCount: 0, isLearned: false }
      const newCorrectCount = isCorrect ? currentStreak.correctCount + 1 : 0
      const isNowLearned = newCorrectCount >= 3

      setStreaks(prev => ({
        ...prev,
        [currentWord.word]: {
          correctCount: newCorrectCount,
          isLearned: isNowLearned
        }
      }))

      if (isNowLearned && !currentStreak.isLearned) {
        dispatch(
          updateWordSRS({
            SubtitleId: currentWord.SubtitleId,
            word: currentWord.word,
            quality: 4
          })
        )
      }

      setScore(prev => ({
        correct: prev.correct + (isCorrect ? 1 : 0),
        total: prev.total + 1
      }))

      // Move to next word after 1.5 seconds
      setTimeout(() => setNextWord(), 1500)
    }
  }

  const restartQuiz = () => {
    setQuizStarted(false)
    setStreaks({})
    setRound(1)
    resetQuizState()
  }

  if (!quizStarted) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="p-6 w-full max-w-md">
          <h2 className="text-xl font-semibold mb-4 text-center">Quiz Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-600 block mb-2">
                Number of words to learn (max {allQuizData.length})
              </label>
              <Input
                type="number"
                value={wordCount}
                onChange={(e) => setWordCount(Math.min(Math.max(1, parseInt(e.target.value) || 1), allQuizData.length))}
                className="w-full"
              />
            </div>
            <Button 
              onClick={startQuiz} 
              className="w-full"
              disabled={allQuizData.length === 0}
            >
              Start Quiz
            </Button>
            {allQuizData.length === 0 && (
              <p className="text-sm text-red-500 text-center">
                No words available. Add some words to your vocabulary first.
              </p>
            )}
          </div>
        </Card>
      </div>
    )
  }

  if (quizCompleted) {
    const percentage = Math.round((score.correct / score.total) * 100)
    const learnedWordsCount = Object.values(streaks).filter(s => s.isLearned).length
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center min-h-[60vh] space-y-6"
      >
        <Trophy className="w-16 h-16 text-yellow-400" />
        <h2 className="text-2xl font-bold">Congratulations!</h2>
        <div className="text-center">
          <p className="text-4xl font-bold text-blue-500 mb-2">{percentage}%</p>
          <p className="text-gray-600">You got {score.correct} out of {score.total} correct</p>
          <p className="text-green-600 mt-2">
            All {learnedWordsCount} words mastered!
          </p>
        </div>
        <Button onClick={restartQuiz} className="mt-4">
          Start New Quiz
        </Button>
      </motion.div>
    )
  }

  const currentStreak = currentWord ? streaks[currentWord.word] || { correctCount: 0, isLearned: false } : null
  const remainingWords = quizData.filter(word => !streaks[word.word]?.isLearned).length

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center space-y-6">
        <div className="text-center mb-4">
          <p className="text-sm text-gray-500">Remaining words: {remainingWords}</p>
        </div>

        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait">
            {currentWord && (
              <QuizCard
                key={currentWord.word}
                word={currentWord.word}
                translation={currentWord.translation}
                options={options}
                onSubmit={handleAnswer}
                streak={currentStreak?.correctCount || 0}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

export default QuizPage