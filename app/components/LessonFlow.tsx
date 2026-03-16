'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import type { Course, Lesson } from '@/app/lib/types'
import { completeLesson, advanceLesson, startCourse, getCourseProgress, addToStable, isInStable } from '@/app/lib/storage'

interface LessonFlowProps {
  course: Course
}

type Phase = 'content' | 'comparison' | 'quiz' | 'result' | 'complete'

export default function LessonFlow({ course }: LessonFlowProps) {
  const router = useRouter()
  const [lessonIndex, setLessonIndex] = useState(0)
  const [phase, setPhase] = useState<Phase>('content')
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [contentRevealed, setContentRevealed] = useState(false)
  const [score, setScore] = useState({ correct: 0, total: 0 })
  const [comparisonChoice, setComparisonChoice] = useState<'a' | 'b' | null>(null)
  const [stableAdded, setStableAdded] = useState<Record<string, boolean>>({})

  const lesson = course.lessons[lessonIndex]
  const isLastLesson = lessonIndex === course.lessons.length - 1

  useEffect(() => {
    startCourse(course.id)
    const cp = getCourseProgress(course.id)
    if (cp && cp.currentLessonIndex > 0 && cp.currentLessonIndex < course.lessons.length) {
      setLessonIndex(cp.currentLessonIndex)
    }
  }, [course.id, course.lessons.length])

  useEffect(() => {
    setContentRevealed(false)
    const timer = setTimeout(() => setContentRevealed(true), 400)
    return () => clearTimeout(timer)
  }, [lessonIndex])

  // Check stable status for current lesson
  useEffect(() => {
    if (lesson) {
      setStableAdded(prev => ({
        ...prev,
        [lesson.id]: isInStable(lesson.title),
      }))
    }
  }, [lesson?.id])

  const handleAddToStable = () => {
    if (!lesson || stableAdded[lesson.id]) return
    const domainCategory = course.domain === 'wine' ? 'wine' : course.domain === 'culture' ? 'design' : 'art'
    addToStable({
      category: domainCategory,
      title: lesson.title,
      subtitle: lesson.funFact || undefined,
      imageUrl: lesson.imageUrl || undefined,
      fromCourse: course.id,
    })
    setStableAdded(prev => ({ ...prev, [lesson.id]: true }))
  }

  const handleContinue = useCallback(() => {
    if (lesson.comparison && phase === 'content') {
      setPhase('comparison')
      setComparisonChoice(null)
    } else if (lesson.quiz && (phase === 'content' || phase === 'comparison')) {
      setPhase('quiz')
      setSelectedAnswer(null)
      setIsCorrect(null)
    } else {
      handleNextLesson(undefined)
    }
  }, [lesson, phase])

  const handleComparisonPick = (choice: 'a' | 'b') => {
    setComparisonChoice(choice)
    // Auto-advance after a beat
    setTimeout(() => {
      if (lesson.quiz) {
        setPhase('quiz')
        setSelectedAnswer(null)
        setIsCorrect(null)
      } else {
        handleNextLesson(undefined)
      }
    }, 2000)
  }

  const handleAnswerSelect = (index: number) => {
    if (selectedAnswer !== null) return
    setSelectedAnswer(index)
    const correct = index === lesson.quiz!.correctIndex
    setIsCorrect(correct)
    setScore(prev => ({ correct: prev.correct + (correct ? 1 : 0), total: prev.total + 1 }))
    completeLesson(course.id, lesson.id, correct)
    setTimeout(() => setPhase('result'), 600)
  }

  const handleNextLesson = (quizCorrect: boolean | undefined) => {
    if (!lesson.quiz && quizCorrect === undefined) {
      completeLesson(course.id, lesson.id)
    }
    advanceLesson(course.id, course.lessons.length)

    if (isLastLesson) {
      setPhase('complete')
    } else {
      setLessonIndex(prev => prev + 1)
      setPhase('content')
      setSelectedAnswer(null)
      setIsCorrect(null)
      setComparisonChoice(null)
    }
  }

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') router.back()
      if (phase === 'content' && (e.key === ' ' || e.key === 'Enter')) {
        e.preventDefault()
        handleContinue()
      }
      if (phase === 'result' && (e.key === ' ' || e.key === 'Enter')) {
        e.preventDefault()
        handleNextLesson(isCorrect ?? undefined)
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [phase, handleContinue, isCorrect, router])

  // ── Course Complete ──
  if (phase === 'complete') {
    const accuracy = score.total > 0 ? Math.round((score.correct / score.total) * 100) : 100
    // Suggest stable items from lessons
    const suggestions = course.lessons.filter(l => !isInStable(l.title)).slice(0, 3)

    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-6 py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md w-full"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="text-6xl mb-6"
          >
            {accuracy >= 80 ? '🎉' : accuracy >= 50 ? '👏' : '💪'}
          </motion.div>

          <h1 className="text-3xl md:text-4xl font-serif mb-3">Course Complete</h1>
          <p className="text-white/60 text-lg font-light mb-8">{course.title}</p>

          <div className="grid grid-cols-3 gap-4 mb-10">
            <div className="bg-white/5 rounded-xl p-4">
              <p className="text-2xl font-serif">{course.lessons.length}</p>
              <p className="text-xs text-white/40 mt-1">Lessons</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4">
              <p className="text-2xl font-serif">{score.correct}/{score.total}</p>
              <p className="text-xs text-white/40 mt-1">Correct</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4">
              <p className="text-2xl font-serif">{accuracy}%</p>
              <p className="text-xs text-white/40 mt-1">Accuracy</p>
            </div>
          </div>

          {/* Stable suggestions */}
          {suggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-10"
            >
              <p className="text-xs uppercase tracking-[0.2em] text-white/25 mb-4">Add to your stable?</p>
              <div className="space-y-2">
                {suggestions.map(s => (
                  <StableSuggestion key={s.id} lesson={s} courseId={course.id} domain={course.domain} />
                ))}
              </div>
            </motion.div>
          )}

          <button
            onClick={() => router.push('/')}
            className="bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-full font-light transition-colors"
          >
            Back to courses
          </button>
        </motion.div>
      </div>
    )
  }

  const paragraphs = lesson.content.split('\n\n').filter(Boolean)

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Top bar */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-black/80 backdrop-blur-md">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => router.back()}
            className="text-white/40 hover:text-white/80 text-sm font-light transition-colors"
          >
            ✕
          </button>
          <div className="flex-1 mx-4">
            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-white/60 rounded-full"
                animate={{ width: `${((lessonIndex + (phase === 'content' ? 0 : 0.5)) / course.lessons.length) * 100}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>
          </div>
          <span className="text-white/30 text-xs font-light">
            {lessonIndex + 1}/{course.lessons.length}
          </span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* ── Content Phase ── */}
        {phase === 'content' && (
          <motion.div
            key={`content-${lesson.id}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.4 }}
          >
            {/* Hero image */}
            <div className="relative w-full h-[45vh] md:h-[50vh]">
              <div
                className="absolute inset-0"
                style={{ background: `linear-gradient(135deg, ${course.color} 0%, #0a0a0a 100%)` }}
              />
              {lesson.imageUrl && (
                <Image
                  src={lesson.imageUrl}
                  alt={lesson.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="100vw"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                />
              )}
              <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent" />
            </div>

            {/* Content */}
            <div className="px-6 md:px-12 -mt-16 relative pb-32">
              <div className="max-w-2xl mx-auto">
                <motion.h2
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: contentRevealed ? 1 : 0, y: contentRevealed ? 0 : 15 }}
                  className="text-2xl md:text-4xl font-serif font-light mb-8 leading-tight"
                >
                  {lesson.title}
                </motion.h2>

                {paragraphs.map((p, i) => (
                  <motion.p
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: contentRevealed ? 1 : 0, y: contentRevealed ? 0 : 10 }}
                    transition={{ delay: 0.1 + i * 0.08 }}
                    className="text-base md:text-lg text-white/75 font-light leading-[1.85] mb-6 font-serif"
                  >
                    {p}
                  </motion.p>
                ))}

                {/* Fun fact */}
                {lesson.funFact && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: contentRevealed ? 1 : 0, y: contentRevealed ? 0 : 10 }}
                    transition={{ delay: 0.1 + paragraphs.length * 0.08 }}
                    className="bg-white/5 rounded-xl p-5 mt-8 border border-white/5"
                  >
                    <p className="text-xs uppercase tracking-[0.2em] text-white/30 mb-2">Remember this</p>
                    <p className="text-white/70 font-light italic">{lesson.funFact}</p>
                  </motion.div>
                )}

                {/* Add to stable */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: contentRevealed ? 1 : 0 }}
                  transition={{ delay: 0.3 + paragraphs.length * 0.08 }}
                  className="mt-6"
                >
                  <button
                    onClick={handleAddToStable}
                    disabled={stableAdded[lesson.id]}
                    className={`text-xs font-light transition-all rounded-full px-4 py-2 border ${
                      stableAdded[lesson.id]
                        ? 'border-white/10 text-white/20'
                        : 'border-white/10 text-white/40 hover:text-white/70 hover:border-white/20'
                    }`}
                  >
                    {stableAdded[lesson.id] ? '✓ In your stable' : '♡ Add to your stable'}
                  </button>
                </motion.div>
              </div>
            </div>

            {/* Continue button */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black/90 to-transparent">
              <div className="max-w-2xl mx-auto">
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  onClick={handleContinue}
                  className="w-full bg-white/10 hover:bg-white/20 text-white py-4 rounded-xl font-light text-lg transition-colors"
                >
                  {lesson.comparison ? 'Your turn to pick →' : lesson.quiz ? 'Test yourself →' : 'Continue →'}
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── Comparison Phase ── */}
        {phase === 'comparison' && lesson.comparison && (
          <motion.div
            key={`comp-${lesson.id}`}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.4 }}
            className="pt-16 px-6 md:px-12 min-h-screen flex flex-col justify-center"
          >
            <div className="max-w-4xl mx-auto w-full">
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs uppercase tracking-[0.2em] text-white/30 mb-4 text-center"
              >
                Your instinct
              </motion.p>

              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xl md:text-2xl font-serif font-light text-center mb-8 leading-relaxed"
              >
                {lesson.comparison.prompt}
              </motion.h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  onClick={() => handleComparisonPick('a')}
                  disabled={comparisonChoice !== null}
                  className={`relative rounded-2xl overflow-hidden aspect-[4/3] transition-all duration-500 ${
                    comparisonChoice === 'a' ? 'ring-2 ring-white/60' :
                    comparisonChoice === 'b' ? 'opacity-30 scale-95' : 'hover:ring-1 hover:ring-white/20'
                  }`}
                >
                  <Image
                    src={lesson.comparison.imageA.url}
                    alt={lesson.comparison.imageA.label}
                    fill className="object-cover" sizes="50vw"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-lg font-serif text-white">{lesson.comparison.imageA.label}</p>
                    <p className="text-xs text-white/50 font-light">{lesson.comparison.imageA.description}</p>
                  </div>
                </motion.button>

                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  onClick={() => handleComparisonPick('b')}
                  disabled={comparisonChoice !== null}
                  className={`relative rounded-2xl overflow-hidden aspect-[4/3] transition-all duration-500 ${
                    comparisonChoice === 'b' ? 'ring-2 ring-white/60' :
                    comparisonChoice === 'a' ? 'opacity-30 scale-95' : 'hover:ring-1 hover:ring-white/20'
                  }`}
                >
                  <Image
                    src={lesson.comparison.imageB.url}
                    alt={lesson.comparison.imageB.label}
                    fill className="object-cover" sizes="50vw"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-lg font-serif text-white">{lesson.comparison.imageB.label}</p>
                    <p className="text-xs text-white/50 font-light">{lesson.comparison.imageB.description}</p>
                  </div>
                </motion.button>
              </div>

              {/* Insight after choosing */}
              <AnimatePresence>
                {comparisonChoice && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mt-8 text-center"
                  >
                    <p className="text-white/50 font-light font-serif italic max-w-lg mx-auto leading-relaxed">
                      {lesson.comparison.insight}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {/* ── Quiz Phase ── */}
        {phase === 'quiz' && lesson.quiz && (
          <motion.div
            key={`quiz-${lesson.id}`}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.4 }}
            className="pt-16 px-6 md:px-12 min-h-screen flex flex-col justify-center"
          >
            <div className="max-w-xl mx-auto w-full">
              <p className="text-xs uppercase tracking-[0.2em] text-white/30 mb-4">Quick check</p>
              <h3 className="text-xl md:text-2xl font-serif font-light mb-8 leading-relaxed">
                {lesson.quiz.question}
              </h3>
              <div className="space-y-3">
                {lesson.quiz.options.map((option, i) => {
                  let style = 'bg-white/5 hover:bg-white/10 border-white/5'
                  if (selectedAnswer !== null) {
                    if (i === lesson.quiz!.correctIndex) style = 'bg-green-500/20 border-green-500/50'
                    else if (i === selectedAnswer && !isCorrect) style = 'bg-red-500/20 border-red-500/50'
                    else style = 'bg-white/5 border-white/5 opacity-40'
                  }
                  return (
                    <motion.button
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08 }}
                      onClick={() => handleAnswerSelect(i)}
                      disabled={selectedAnswer !== null}
                      className={`w-full text-left p-4 rounded-xl border transition-all font-light ${style}`}
                    >
                      <span className="text-white/30 mr-3 text-sm">{String.fromCharCode(65 + i)}</span>
                      <span className="text-white/80">{option}</span>
                    </motion.button>
                  )
                })}
              </div>
            </div>
          </motion.div>
        )}

        {/* ── Result Phase ── */}
        {phase === 'result' && lesson.quiz && (
          <motion.div
            key={`result-${lesson.id}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="pt-16 px-6 md:px-12 min-h-screen flex flex-col justify-center"
          >
            <div className="max-w-xl mx-auto w-full text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                className="text-5xl mb-4"
              >
                {isCorrect ? '✓' : '✗'}
              </motion.div>
              <h3 className={`text-2xl font-serif mb-3 ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                {isCorrect ? 'Correct!' : 'Not quite'}
              </h3>
              <p className="text-white/60 font-light leading-relaxed mb-10 max-w-md mx-auto">
                {lesson.quiz.explanation}
              </p>
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                onClick={() => handleNextLesson(isCorrect ?? undefined)}
                className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-xl font-light text-lg transition-colors"
              >
                {isLastLesson ? 'Finish course →' : 'Next lesson →'}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Stable suggestion chip on course complete ──
function StableSuggestion({ lesson, courseId, domain }: { lesson: Lesson; courseId: string; domain: string }) {
  const [added, setAdded] = useState(false)

  const handleAdd = () => {
    const cat = domain === 'wine' ? 'wine' : domain === 'culture' ? 'design' : 'art'
    addToStable({
      category: cat as any,
      title: lesson.title,
      subtitle: lesson.funFact || undefined,
      imageUrl: lesson.imageUrl || undefined,
      fromCourse: courseId,
    })
    setAdded(true)
  }

  return (
    <button
      onClick={handleAdd}
      disabled={added}
      className={`w-full text-left p-3 rounded-xl border transition-all ${
        added ? 'border-white/10 bg-white/5' : 'border-white/5 bg-white/[0.02] hover:bg-white/5'
      }`}
    >
      <div className="flex items-center gap-3">
        <span className="text-sm">{added ? '✓' : '♡'}</span>
        <div>
          <p className="text-sm text-white/70 font-light">{lesson.title}</p>
          {lesson.funFact && (
            <p className="text-xs text-white/30 font-light italic">{lesson.funFact}</p>
          )}
        </div>
      </div>
    </button>
  )
}
