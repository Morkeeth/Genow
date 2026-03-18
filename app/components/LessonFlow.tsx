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

type Phase =
  | 'curiosity'     // NEW: Opening question — hooks the brain
  | 'content'       // Editorial content
  | 'notice'        // NEW: "What do you notice?" before comparison
  | 'comparison'    // A/B image pick
  | 'reflection'    // NEW: "Why did you pick that?"
  | 'quiz'          // Multiple choice
  | 'result'        // Correct/incorrect + deeper insight
  | 'complete'      // Course done

export default function LessonFlow({ course }: LessonFlowProps) {
  const router = useRouter()
  const [lessonIndex, setLessonIndex] = useState(0)
  const [phase, setPhase] = useState<Phase>('curiosity')
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [contentRevealed, setContentRevealed] = useState(false)
  const [score, setScore] = useState({ correct: 0, total: 0 })
  const [comparisonChoice, setComparisonChoice] = useState<'a' | 'b' | null>(null)
  const [stableAdded, setStableAdded] = useState<Record<string, boolean>>({})
  const [showConnection, setShowConnection] = useState(false)

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

  useEffect(() => {
    if (lesson) {
      setStableAdded(prev => ({
        ...prev,
        [lesson.id]: isInStable(lesson.title),
      }))
    }
  }, [lesson?.id, lesson?.title])

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

  // Determine what comes next based on available content
  const getNextPhase = useCallback((currentPhase: Phase): Phase | 'next-lesson' => {
    switch (currentPhase) {
      case 'curiosity':
        return 'content'
      case 'content':
        if (lesson.noticePrompt && lesson.comparison) return 'notice'
        if (lesson.comparison) return 'comparison'
        if (lesson.quiz) return 'quiz'
        return 'next-lesson'
      case 'notice':
        return 'comparison'
      case 'comparison':
        return 'reflection'
      case 'reflection':
        if (lesson.quiz) return 'quiz'
        return 'next-lesson'
      case 'quiz':
        return 'result'
      case 'result':
        return 'next-lesson'
      default:
        return 'next-lesson'
    }
  }, [lesson])

  const advance = useCallback((fromPhase: Phase) => {
    const next = getNextPhase(fromPhase)
    if (next === 'next-lesson') {
      handleNextLesson(undefined)
    } else {
      setPhase(next)
      if (next === 'quiz') {
        setSelectedAnswer(null)
        setIsCorrect(null)
      }
      if (next === 'comparison') {
        setComparisonChoice(null)
      }
    }
  }, [getNextPhase])

  const handleComparisonPick = (choice: 'a' | 'b') => {
    setComparisonChoice(choice)
    // If there's a reflection prompt, go there after a beat. Otherwise skip to next.
    setTimeout(() => {
      if (lesson.comparison?.reflectionPrompt) {
        setPhase('reflection')
      } else {
        advance('reflection')
      }
    }, 1500)
  }

  const handleAnswerSelect = (index: number) => {
    if (selectedAnswer !== null) return
    setSelectedAnswer(index)
    const correct = index === lesson.quiz!.correctIndex
    setIsCorrect(correct)
    setScore(prev => ({ correct: prev.correct + (correct ? 1 : 0), total: prev.total + 1 }))
    completeLesson(course.id, lesson.id, correct)
    setTimeout(() => setPhase('result'), 800)
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
      setPhase(course.lessons[lessonIndex + 1]?.openingQuestion ? 'curiosity' : 'content')
      setSelectedAnswer(null)
      setIsCorrect(null)
      setComparisonChoice(null)
      setShowConnection(false)
    }
  }

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') router.back()
      if ((e.key === ' ' || e.key === 'Enter') && ['curiosity', 'content', 'notice', 'reflection'].includes(phase)) {
        e.preventDefault()
        advance(phase)
      }
      if (phase === 'result' && (e.key === ' ' || e.key === 'Enter')) {
        e.preventDefault()
        handleNextLesson(isCorrect ?? undefined)
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [phase, advance, isCorrect, router])

  // Calculate progress more granularly
  const phaseWeights: Record<Phase, number> = {
    curiosity: 0, content: 0.2, notice: 0.35, comparison: 0.5,
    reflection: 0.6, quiz: 0.7, result: 0.9, complete: 1,
  }
  const progressPct = ((lessonIndex + (phaseWeights[phase] || 0)) / course.lessons.length) * 100

  // ── Course Complete ──
  if (phase === 'complete') {
    const accuracy = score.total > 0 ? Math.round((score.correct / score.total) * 100) : 100
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
                animate={{ width: `${progressPct}%` }}
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
        {/* ══════════════════════════════════════ */}
        {/* CURIOSITY HOOK — "Wait, really?"      */}
        {/* ══════════════════════════════════════ */}
        {phase === 'curiosity' && lesson.openingQuestion && (
          <motion.div
            key={`curiosity-${lesson.id}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.5 }}
            className="pt-16 px-6 md:px-12 min-h-screen flex flex-col justify-center"
          >
            <div className="max-w-2xl mx-auto w-full text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <p className="text-xs uppercase tracking-[0.3em] text-white/20 mb-8">Before we begin</p>

                <h2 className="text-2xl md:text-4xl font-serif font-light leading-[1.5] mb-12 text-white/90">
                  {lesson.openingQuestion}
                </h2>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2 }}
                  className="flex flex-col items-center gap-3"
                >
                  <div className="w-px h-12 bg-gradient-to-b from-transparent via-white/20 to-transparent" />
                  <button
                    onClick={() => advance('curiosity')}
                    className="text-white/40 hover:text-white/70 text-sm font-light transition-colors tracking-wide"
                  >
                    Find out →
                  </button>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* ══════════════════════════════════════ */}
        {/* CONTENT — Editorial lesson             */}
        {/* ══════════════════════════════════════ */}
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
                  onClick={() => advance('content')}
                  className="w-full bg-white/10 hover:bg-white/20 text-white py-4 rounded-xl font-light text-lg transition-colors"
                >
                  {lesson.comparison
                    ? (lesson.noticePrompt ? 'Time to look closer →' : 'Your turn to pick →')
                    : lesson.quiz ? 'Test yourself →' : 'Continue →'}
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        {/* ══════════════════════════════════════ */}
        {/* NOTICE — "What do you notice?"         */}
        {/* ══════════════════════════════════════ */}
        {phase === 'notice' && lesson.noticePrompt && lesson.comparison && (
          <motion.div
            key={`notice-${lesson.id}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="pt-16 px-6 md:px-12 min-h-screen flex flex-col justify-center"
          >
            <div className="max-w-4xl mx-auto w-full">
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-xs uppercase tracking-[0.3em] text-white/20 mb-6 text-center"
              >
                Before you choose
              </motion.p>

              {/* Show both images side by side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-10">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="relative rounded-2xl overflow-hidden aspect-[4/3]"
                >
                  <Image
                    src={lesson.comparison.imageA.url}
                    alt={lesson.comparison.imageA.label}
                    fill className="object-cover" sizes="50vw"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <p className="text-sm font-serif text-white/80">{lesson.comparison.imageA.label}</p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="relative rounded-2xl overflow-hidden aspect-[4/3]"
                >
                  <Image
                    src={lesson.comparison.imageB.url}
                    alt={lesson.comparison.imageB.label}
                    fill className="object-cover" sizes="50vw"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <p className="text-sm font-serif text-white/80">{lesson.comparison.imageB.label}</p>
                  </div>
                </motion.div>
              </div>

              {/* Notice prompt */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="text-center"
              >
                <div className="inline-block bg-white/[0.03] border border-white/10 rounded-2xl px-8 py-6 max-w-lg">
                  <p className="text-lg md:text-xl font-serif font-light text-white/80 leading-relaxed italic">
                    {lesson.noticePrompt}
                  </p>
                </div>

                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5 }}
                  onClick={() => advance('notice')}
                  className="mt-8 block mx-auto text-white/40 hover:text-white/70 text-sm font-light transition-colors"
                >
                  Now choose →
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* ══════════════════════════════════════ */}
        {/* COMPARISON — A/B image pick             */}
        {/* ══════════════════════════════════════ */}
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
                    comparisonChoice === 'a' ? 'ring-2 ring-white/60 scale-[1.02]' :
                    comparisonChoice === 'b' ? 'opacity-30 scale-95' : 'hover:ring-1 hover:ring-white/20 hover:scale-[1.01]'
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
                    comparisonChoice === 'b' ? 'ring-2 ring-white/60 scale-[1.02]' :
                    comparisonChoice === 'a' ? 'opacity-30 scale-95' : 'hover:ring-1 hover:ring-white/20 hover:scale-[1.01]'
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

        {/* ══════════════════════════════════════ */}
        {/* REFLECTION — "Why did you pick that?"  */}
        {/* ══════════════════════════════════════ */}
        {phase === 'reflection' && lesson.comparison?.reflectionPrompt && (
          <motion.div
            key={`reflect-${lesson.id}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="pt-16 px-6 md:px-12 min-h-screen flex flex-col justify-center"
          >
            <div className="max-w-xl mx-auto w-full text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <p className="text-xs uppercase tracking-[0.3em] text-white/20 mb-6">Reflect</p>

                <div className="mb-8">
                  <p className="text-sm text-white/30 font-light mb-2">You chose</p>
                  <p className="text-xl font-serif text-white/80">
                    {comparisonChoice === 'a' ? lesson.comparison.imageA.label : lesson.comparison.imageB.label}
                  </p>
                </div>

                <div className="bg-white/[0.03] border border-white/10 rounded-2xl px-8 py-8 mb-10">
                  <p className="text-xl md:text-2xl font-serif font-light text-white/70 leading-relaxed italic">
                    {lesson.comparison.reflectionPrompt}
                  </p>
                </div>

                <p className="text-white/30 font-light text-sm mb-8 max-w-md mx-auto leading-relaxed">
                  There's no right answer. But knowing <em>why</em> you're drawn to something is half the journey of taste.
                </p>

                <button
                  onClick={() => advance('reflection')}
                  className="bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-full font-light transition-colors"
                >
                  {lesson.quiz ? 'Test yourself →' : 'Continue →'}
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* ══════════════════════════════════════ */}
        {/* QUIZ — Multiple choice                 */}
        {/* ══════════════════════════════════════ */}
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

        {/* ══════════════════════════════════════ */}
        {/* RESULT — Deeper insight + connection   */}
        {/* ══════════════════════════════════════ */}
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
                className={`text-5xl mb-4 ${isCorrect ? 'text-green-400' : 'text-red-400'}`}
              >
                {isCorrect ? '✓' : '✗'}
              </motion.div>
              <h3 className={`text-2xl font-serif mb-3 ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                {isCorrect ? 'Correct' : 'Not quite'}
              </h3>
              <p className="text-white/60 font-light leading-relaxed mb-6 max-w-md mx-auto">
                {lesson.quiz.explanation}
              </p>

              {/* Deeper insight — the real takeaway */}
              {lesson.deeperInsight && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-white/[0.03] border border-white/8 rounded-2xl px-6 py-5 mb-6 text-left"
                >
                  <p className="text-xs uppercase tracking-[0.2em] text-white/25 mb-3">What most people miss</p>
                  <p className="text-white/60 font-serif font-light leading-relaxed italic text-sm">
                    {lesson.deeperInsight}
                  </p>
                </motion.div>
              )}

              {/* Cross-domain connection */}
              {lesson.connectionTo && !showConnection && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  onClick={() => setShowConnection(true)}
                  className="text-xs text-white/30 hover:text-white/60 font-light transition-colors mb-6 inline-block"
                >
                  See a connection →
                </motion.button>
              )}

              {showConnection && lesson.connectionTo && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/[0.02] border border-white/5 rounded-xl px-5 py-4 mb-6 text-left"
                >
                  <p className="text-xs uppercase tracking-[0.15em] text-white/20 mb-2">Connects to</p>
                  <p className="text-white/50 font-light text-sm leading-relaxed">
                    {lesson.connectionTo.insight}
                  </p>
                </motion.div>
              )}

              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                onClick={() => handleNextLesson(isCorrect ?? undefined)}
                className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-xl font-light text-lg transition-colors mt-4"
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
      category: cat as 'art' | 'wine' | 'design' | 'style' | 'nature' | 'place',
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
