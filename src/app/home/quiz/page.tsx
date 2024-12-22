'use client'

import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { selectQuizData, updateHardWords, SubtitlesState, calculateNextReviewDate } from '@/lib/features/subtitles/subtitleSlice'
import { WordTable } from './WordTable'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion, AnimatePresence } from 'framer-motion'
import QuizCard from './QuizCard'
import { Button } from '@/components/ui/button'
import { Trophy } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { shuffle } from 'lodash'
import { Progress } from "@/components/ui/progress"
import axios from 'axios'
import { Badge } from '@/components/ui/badge'

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
  const [selectedWords, setSelectedWords] = useState<string[]>([])


  const getWordKey = (word: any) => `${word.word}_${word.id}`
  console.log(allQuizData)
  useEffect(() => {
    const saveProgress = async () => {
      if (quizCompleted) {
        const learnedWords = quizData
          .filter(word => streaks[getWordKey(word)]?.isLearned)
          .map(word => ({
            id: word.id,
            word: word.word,
            dueDate: calculateNextReviewDate(word.repetitions + 1),
            repetitions: word.repetitions + 1
          }))

        try {
          await axios.post('/api/hardWords/update', { hardWords: learnedWords })
          dispatch(updateHardWords({ hardWords: learnedWords }))
          console.log('Progress saved successfully')
        } catch (error) {
          console.error('Error saving progress:', error)
        }
      }
    }

    saveProgress()
  }, [quizCompleted, quizData, streaks])

  const startQuiz = () => {
    if (allQuizData.length === 0) return;

    resetQuizState()
    setStreaks({})
    const wordsToQuiz = selectedWords.length > 0 
      ? allQuizData.filter(word => selectedWords.includes(word.word!))
      : allQuizData.slice(0, wordCount);
    
    setQuizData(shuffle(wordsToQuiz))
    setQuizStarted(true)
    // setScore({ correct: 0, total: 0 })
    // setQuizCompleted(false)
    setTimeout(() => {
      const firstWord = wordsToQuiz[0]
      setCurrentWord(firstWord)
      const correctAnswer = firstWord.translation
      const otherOptions = getRandomTranslations(correctAnswer!)
      setOptions(shuffle([...otherOptions, correctAnswer!]))
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

  const handleAnswer = (selectedTranslation: string) => {
    if (!currentWord) return

    const isCorrect = selectedTranslation === currentWord.translation
    const wordKey = getWordKey(currentWord)

    setStreaks(prev => {
      const currentStreak = prev[wordKey] || { correctCount: 0, isLearned: false }
      const newCorrectCount = isCorrect ? currentStreak.correctCount + 1 : 0
      const newStreak = {
        correctCount: newCorrectCount,
        isLearned: newCorrectCount >= 3
      }

      const newStreaks = {
        ...prev,
        [wordKey]: newStreak
      }

      const allLearned = quizData.every(word => {
        const streak = word.id === currentWord.id ? newStreak : newStreaks[getWordKey(word)]
        return streak?.isLearned
      })

      if (allLearned) {
        setTimeout(() => setQuizCompleted(true), 0)
      }
      return newStreaks
    })

    setScore(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1
    }))

    if (!quizCompleted) {
      setTimeout(() => setNextWord(), 1500)
    }
  }

  const setNextWord = () => {
    const unlearned = quizData.filter(word => !streaks[getWordKey(word)]?.isLearned)

    if (unlearned.length === 0) {
      setQuizCompleted(true)
      return
    }

    if (unlearned.length === 1 && unlearned[0].id === currentWord?.id) {
      const word = unlearned[0]
      setCurrentWord({ ...word })
      const correctAnswer = word.translation
      const otherOptions = getRandomTranslations(correctAnswer)
      setOptions(shuffle([...otherOptions, correctAnswer]))
      return
    }

    const currentIndex = unlearned.findIndex(word =>
      currentWord && getWordKey(word) === getWordKey(currentWord)
    )
    const nextIndex = (currentIndex + 1) % unlearned.length
    const nextWord = unlearned[nextIndex]

    if (nextWord) {
      setCurrentWord(nextWord)
      const correctAnswer = nextWord.translation
      const otherOptions = getRandomTranslations(correctAnswer)
      setOptions(shuffle([...otherOptions, correctAnswer]))
    } else if (unlearned.length > 0) {
      const firstUnlearned = unlearned[0]
      setCurrentWord(firstUnlearned)
      const correctAnswer = firstUnlearned.translation
      const otherOptions = getRandomTranslations(correctAnswer)
      setOptions(shuffle([...otherOptions, correctAnswer]))
    }
  }

  const restartQuiz = () => {
    setQuizStarted(false)

    setStreaks({})
    resetQuizState()
  }

  if (!quizStarted) {
    return (
      <div className="container mx-auto py-8">
        <Tabs defaultValue="settings" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="settings">Quiz Settings</TabsTrigger>
            <TabsTrigger value="words">Word List</TabsTrigger>
          </TabsList>

          <TabsContent value="settings">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Quiz Settings</h2>
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
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    Selected words: <Badge variant="secondary">{selectedWords.length}</Badge>
                  </p>
                  {selectedWords.length > 0 && (
                    <Button variant="outline" onClick={() => setSelectedWords([])}>
                      Clear Selection
                    </Button>
                  )}
                </div>
                <Button
                  onClick={startQuiz}
                  className="w-full"
                  disabled={allQuizData.length === 0}
                >
                  Start Quiz {selectedWords.length > 0 ? `with ${selectedWords.length} words` : ''}
                </Button>
                {allQuizData.length === 0 && (
                  <p className="text-sm text-red-500 text-center">
                    No words available. Add some words to your vocabulary first.
                  </p>
                )}
                <p className="text-sm text-gray-600 text-center">
                  <span className="font-semibold">{allQuizData.length}</span> words in your vocabulary
                </p>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="words">
            <WordTable 
              words={allQuizData} 
              selectedWords={selectedWords}
              onSelectionChange={setSelectedWords}
            />
          </TabsContent>
        </Tabs>
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

  const totalWords = quizData.length;
  const learnedWords = Object.values(streaks).filter(streak => streak.isLearned).length;
  const progress = (learnedWords / totalWords) * 100;

  const currentStreak = currentWord ? streaks[getWordKey(currentWord)] || { correctCount: 0, isLearned: false } : null
  const remainingWords = quizData.filter(word => !streaks[getWordKey(word)]?.isLearned).length

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center space-y-6">
        <div className="text-center mb-4">
        <div className="text-sm text-gray-600">Learned: {learnedWords}/{totalWords}</div>
        </div>
        <Progress value={progress} className="w-full" />      
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait">
            {currentWord && (
              <QuizCard
                key={getWordKey(currentWord)}
                word={currentWord.word}
                correctAnswer={currentWord.translation}
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