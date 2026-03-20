'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import type { Course, Lesson } from '@/app/lib/types'
import { completeLesson, advanceLesson, startCourse, getCourseProgress, addToStable, isInStable } from '@/app/lib/storage'

interface LessonFlowProps {
  course: Course
}

type Phase =
  | 'curiosity'     // Opening question — hooks the brain
  | 'content'       // Editorial content
  | 'notice'        // "What do you notice?" before comparison
  | 'comparison'    // A/B image pick
  | 'reflection'    // "Why did you pick that?"
  | 'quiz'          // Multiple choice
  | 'result'        // Correct/incorrect + deeper insight
  | 'complete'      // Course done

// Smooth fade transition used everywhere
const fade = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.5 },
}

const slideUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
}

export default function LessonFlow({ course }: LessonFlowProps) {
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)
  const [lessonIndex, setLessonIndex] = useState(0)
  const [phase, setPhase] = useState<Phase>('curiosity')
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [score, setScore] = useState({ correct: 0, total: 0 })
  const [comparisonChoice, setComparisonChoice] = useState<'a' | 'b' | null>(null)
  const [stableAdded, setStableAdded] = useState<Record<string, boolean>>({})
  const [showConnection, setShowConnection] = useState(false)
  const [curiosityVisible, setCuriosityVisible] = useState(false)
  const [contentStep, setContentStep] = useState(0)

  const lesson = course.lessons[lessonIndex]
  const isLastLesson = lessonIndex === course.lessons.length - 1

  // Scroll to top on phase change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [phase, lessonIndex])

  useEffect(() => {
    startCourse(course.id)
    const cp = getCourseProgress(course.id)
    if (cp && cp.currentLessonIndex > 0 && cp.currentLessonIndex < course.lessons.length) {
      setLessonIndex(cp.currentLessonIndex)
    }
  }, [course.id, course.lessons.length])

  // Curiosity hook reveal timing
  useEffect(() => {
    if (phase === 'curiosity') {
      setCuriosityVisible(false)
      const t = setTimeout(() => setCuriosityVisible(true), 300)
      return () => clearTimeout(t)
    }
  }, [phase, lessonIndex])

  // Content stagger reveal
  useEffect(() => {
    if (phase === 'content') {
      setContentStep(0)
      const t = setTimeout(() => setContentStep(1), 500)
      return () => clearTimeout(t)
    }
  }, [phase, lessonIndex])

  useEffect(() => {
    if (lesson) {
      setStableAdded(prev => ({
        ...prev,
        [lesson.id]: isInStable(lesson.title),
      }))
    }
  }, [lesson?.id, lesson?.title])

  // Preload next lesson's hero image
  useEffect(() => {
    if (!isLastLesson) {
      const next = course.lessons[lessonIndex + 1]
      if (next?.imageUrl) {
        const img = new window.Image()
        img.src = next.imageUrl
      }
    }
    // Also preload comparison images for current lesson
    if (lesson?.comparison) {
      const imgA = new window.Image()
      imgA.src = lesson.comparison.imageA.url
      const imgB = new window.Image()
      imgB.src = lesson.comparison.imageB.url
    }
  }, [lessonIndex, lesson, course.lessons, isLastLesson])

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

  const getNextPhase = useCallback((currentPhase: Phase): Phase | 'next-lesson' => {
    switch (currentPhase) {
      case 'curiosity': return 'content'
      case 'content':
        if (lesson.noticePrompt && lesson.comparison) return 'notice'
        if (lesson.comparison) return 'comparison'
        if (lesson.quiz) return 'quiz'
        return 'next-lesson'
      case 'notice': return 'comparison'
      case 'comparison': return 'reflection'
      case 'reflection':
        if (lesson.quiz) return 'quiz'
        return 'next-lesson'
      case 'quiz': return 'result'
      case 'result': return 'next-lesson'
      default: return 'next-lesson'
    }
  }, [lesson])

  const advance = useCallback((fromPhase: Phase) => {
    const next = getNextPhase(fromPhase)
    if (next === 'next-lesson') {
      handleNextLesson(undefined)
    } else {
      setPhase(next)
      if (next === 'quiz') { setSelectedAnswer(null); setIsCorrect(null) }
      if (next === 'comparison') { setComparisonChoice(null) }
    }
  }, [getNextPhase])

  const handleComparisonPick = (choice: 'a' | 'b') => {
    setComparisonChoice(choice)
    setTimeout(() => {
      if (lesson.comparison?.reflectionPrompt) {
        setPhase('reflection')
      } else {
        advance('reflection')
      }
    }, 2500) // More time to absorb
  }

  const handleAnswerSelect = (index: number) => {
    if (selectedAnswer !== null) return
    setSelectedAnswer(index)
    const correct = index === lesson.quiz!.correctIndex
    setIsCorrect(correct)
    setScore(prev => ({ correct: prev.correct + (correct ? 1 : 0), total: prev.total + 1 }))
    completeLesson(course.id, lesson.id, correct)
    setTimeout(() => setPhase('result'), 1000) // Linger on answer
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

  const phaseWeights: Record<Phase, number> = {
    curiosity: 0, content: 0.2, notice: 0.35, comparison: 0.5,
    reflection: 0.6, quiz: 0.7, result: 0.9, complete: 1,
  }
  const progressPct = ((lessonIndex + (phaseWeights[phase] || 0)) / course.lessons.length) * 100

  // ══════════════════════════════════════
  // COURSE COMPLETE
  // ══════════════════════════════════════
  if (phase === 'complete') {
    const accuracy = score.total > 0 ? Math.round((score.correct / score.total) * 100) : 100
    const suggestions = course.lessons.filter(l => !isInStable(l.title)).slice(0, 3)

    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-6 py-16">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-md w-full"
        >
          {/* Celebration */}
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 150, damping: 12 }}
            className="text-7xl mb-8"
          >
            {accuracy >= 80 ? '🎉' : accuracy >= 50 ? '👏' : '💪'}
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <p className="text-xs uppercase tracking-[0.3em] text-white/20 mb-3">Course Complete</p>
            <h1 className="text-3xl md:text-4xl font-serif mb-2">{course.title}</h1>
            <p className="text-white/40 font-light font-serif italic mb-10">{course.subtitle}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="grid grid-cols-3 gap-4 mb-10"
          >
            <div className="bg-white/[0.04] rounded-2xl p-5 border border-white/5">
              <p className="text-3xl font-serif">{course.lessons.length}</p>
              <p className="text-[10px] uppercase tracking-wider text-white/30 mt-2">Lessons</p>
            </div>
            <div className="bg-white/[0.04] rounded-2xl p-5 border border-white/5">
              <p className="text-3xl font-serif">{score.correct}<span className="text-lg text-white/30">/{score.total}</span></p>
              <p className="text-[10px] uppercase tracking-wider text-white/30 mt-2">Correct</p>
            </div>
            <div className={`rounded-2xl p-5 border ${accuracy >= 80 ? 'bg-green-500/10 border-green-500/20' : accuracy >= 50 ? 'bg-yellow-500/10 border-yellow-500/20' : 'bg-white/[0.04] border-white/5'}`}>
              <p className="text-3xl font-serif">{accuracy}%</p>
              <p className="text-[10px] uppercase tracking-wider text-white/30 mt-2">Accuracy</p>
            </div>
          </motion.div>

          {suggestions.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }} className="mb-10">
              <p className="text-xs uppercase tracking-[0.2em] text-white/20 mb-4">Add to your stable?</p>
              <div className="space-y-2">
                {suggestions.map((s, i) => (
                  <motion.div key={s.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1 + i * 0.1 }}>
                    <StableSuggestion lesson={s} courseId={course.id} domain={course.domain} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            onClick={() => router.push('/')}
            className="bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-full font-light transition-all hover:scale-105"
          >
            Back to courses
          </motion.button>
        </motion.div>
      </div>
    )
  }

  const paragraphs = lesson.content.split('\n\n').filter(Boolean)

  return (
    <div ref={containerRef} className="min-h-screen bg-black text-white">
      {/* ── Top bar ── */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-black/80 backdrop-blur-xl">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => router.back()}
            className="text-white/40 hover:text-white/80 text-sm font-light transition-colors w-8"
          >
            ✕
          </button>
          <div className="flex-1 mx-4">
            <div className="h-[3px] bg-white/[0.06] rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: 'linear-gradient(90deg, rgba(255,255,255,0.3), rgba(255,255,255,0.6))' }}
                animate={{ width: `${progressPct}%` }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              />
            </div>
          </div>
          <span className="text-white/25 text-xs font-light w-8 text-right">
            {lessonIndex + 1}/{course.lessons.length}
          </span>
        </div>
        {/* Lesson title subtitle */}
        <div className="text-center pb-2">
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/15">{lesson.title}</p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* ══════════════════════════════════════ */}
        {/* CURIOSITY HOOK                         */}
        {/* ══════════════════════════════════════ */}
        {phase === 'curiosity' && lesson.openingQuestion && (
          <motion.div
            key={`curiosity-${lesson.id}`}
            {...fade}
            className="pt-20 px-6 md:px-12 min-h-screen flex flex-col justify-center"
          >
            <div className="max-w-2xl mx-auto w-full text-center">
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: curiosityVisible ? 0.2 : 0 }}
                transition={{ duration: 0.8 }}
                className="text-xs uppercase tracking-[0.3em] text-white mb-10"
              >
                Before we begin
              </motion.p>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: curiosityVisible ? 1 : 0, y: curiosityVisible ? 0 : 20 }}
                transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
                className="text-2xl md:text-4xl lg:text-5xl font-serif font-light leading-[1.4] mb-16 text-white/90"
              >
                {lesson.openingQuestion}
              </motion.h2>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: curiosityVisible ? 1 : 0 }}
                transition={{ delay: 1.5, duration: 0.6 }}
                className="flex flex-col items-center gap-6"
              >
                <motion.div
                  animate={{ height: [0, 48] }}
                  transition={{ delay: 1.5, duration: 0.8, ease: 'easeOut' }}
                  className="w-px bg-gradient-to-b from-transparent via-white/20 to-transparent overflow-hidden"
                />
                <button
                  onClick={() => advance('curiosity')}
                  className="text-white/40 hover:text-white/80 text-sm font-light transition-all hover:tracking-wider duration-300"
                >
                  Find out →
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* ══════════════════════════════════════ */}
        {/* CONTENT                                */}
        {/* ══════════════════════════════════════ */}
        {phase === 'content' && (
          <motion.div
            key={`content-${lesson.id}`}
            {...fade}
          >
            {/* Hero image — cinematic */}
            <div className="relative w-full h-[50vh] md:h-[55vh]">
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
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/10" />

              {/* Title over hero */}
              <div className="absolute bottom-0 left-0 right-0 px-6 md:px-12 pb-8">
                <div className="max-w-2xl mx-auto">
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: contentStep >= 1 ? 1 : 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-xs uppercase tracking-[0.2em] text-white/30 mb-3"
                  >
                    {course.title}
                  </motion.p>
                  <motion.h2
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: contentStep >= 1 ? 1 : 0, y: contentStep >= 1 ? 0 : 15 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="text-3xl md:text-5xl font-serif font-light leading-tight"
                  >
                    {lesson.title}
                  </motion.h2>
                </div>
              </div>
            </div>

            {/* Content body */}
            <div className="px-6 md:px-12 pt-10 pb-32">
              <div className="max-w-2xl mx-auto">
                {paragraphs.map((p, i) => (
                  <motion.p
                    key={i}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: contentStep >= 1 ? 1 : 0, y: contentStep >= 1 ? 0 : 12 }}
                    transition={{ delay: 0.3 + i * 0.12, duration: 0.5 }}
                    className="text-base md:text-lg text-white/75 font-light leading-[1.9] mb-7 font-serif"
                  >
                    {p}
                  </motion.p>
                ))}

                {/* Fun fact */}
                {lesson.funFact && (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: contentStep >= 1 ? 1 : 0, y: contentStep >= 1 ? 0 : 12 }}
                    transition={{ delay: 0.3 + paragraphs.length * 0.12, duration: 0.5 }}
                    className="bg-white/[0.03] rounded-2xl p-6 mt-10 border border-white/[0.06]"
                  >
                    <p className="text-[10px] uppercase tracking-[0.25em] text-white/25 mb-3">Remember this</p>
                    <p className="text-white/60 font-light italic font-serif leading-relaxed">{lesson.funFact}</p>
                  </motion.div>
                )}

                {/* Add to stable */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: contentStep >= 1 ? 1 : 0 }}
                  transition={{ delay: 0.5 + paragraphs.length * 0.12 }}
                  className="mt-8"
                >
                  <button
                    onClick={handleAddToStable}
                    disabled={stableAdded[lesson.id]}
                    className={`text-xs font-light transition-all duration-300 rounded-full px-5 py-2.5 border ${
                      stableAdded[lesson.id]
                        ? 'border-white/10 text-white/20'
                        : 'border-white/10 text-white/40 hover:text-white/70 hover:border-white/25 hover:bg-white/[0.03]'
                    }`}
                  >
                    {stableAdded[lesson.id] ? '✓ In your stable' : '♡ Add to your stable'}
                  </button>
                </motion.div>
              </div>
            </div>

            {/* Continue button */}
            <div className="fixed bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black via-black/95 to-transparent">
              <div className="max-w-2xl mx-auto">
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                  onClick={() => advance('content')}
                  className="w-full bg-white/[0.08] hover:bg-white/[0.15] text-white py-4 rounded-2xl font-light text-lg transition-all duration-300 border border-white/[0.06] hover:border-white/[0.12]"
                >
                  {lesson.comparison
                    ? (lesson.noticePrompt ? 'Look closer →' : 'Your turn →')
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
            {...fade}
            className="pt-20 px-6 md:px-12 min-h-screen flex flex-col justify-center"
          >
            <div className="max-w-4xl mx-auto w-full">
              <motion.p
                {...slideUp}
                transition={{ ...slideUp.transition, delay: 0.2 }}
                className="text-xs uppercase tracking-[0.3em] text-white/20 mb-8 text-center"
              >
                Before you choose
              </motion.p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-12">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className="relative rounded-2xl overflow-hidden aspect-[4/3]"
                >
                  <Image
                    src={lesson.comparison.imageA.url}
                    alt={lesson.comparison.imageA.label}
                    fill className="object-cover" sizes="50vw"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <p className="absolute bottom-3 left-4 text-sm font-serif text-white/70">{lesson.comparison.imageA.label}</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                  className="relative rounded-2xl overflow-hidden aspect-[4/3]"
                >
                  <Image
                    src={lesson.comparison.imageB.url}
                    alt={lesson.comparison.imageB.label}
                    fill className="object-cover" sizes="50vw"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <p className="absolute bottom-3 left-4 text-sm font-serif text-white/70">{lesson.comparison.imageB.label}</p>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.6 }}
                className="text-center"
              >
                <div className="inline-block bg-white/[0.02] border border-white/[0.08] rounded-2xl px-8 py-7 max-w-lg">
                  <p className="text-lg md:text-xl font-serif font-light text-white/70 leading-relaxed italic">
                    {lesson.noticePrompt}
                  </p>
                </div>

                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2 }}
                  onClick={() => advance('notice')}
                  className="mt-10 block mx-auto text-white/30 hover:text-white/70 text-sm font-light transition-all duration-300"
                >
                  Now choose →
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* ══════════════════════════════════════ */}
        {/* COMPARISON                             */}
        {/* ══════════════════════════════════════ */}
        {phase === 'comparison' && lesson.comparison && (
          <motion.div
            key={`comp-${lesson.id}`}
            {...fade}
            className="pt-20 px-6 md:px-12 min-h-screen flex flex-col justify-center"
          >
            <div className="max-w-4xl mx-auto w-full">
              <motion.p
                {...slideUp}
                className="text-xs uppercase tracking-[0.2em] text-white/20 mb-3 text-center"
              >
                Your instinct
              </motion.p>

              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="text-xl md:text-2xl font-serif font-light text-center mb-10 leading-relaxed"
              >
                {lesson.comparison.prompt}
              </motion.h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {(['a', 'b'] as const).map((side, idx) => {
                  const img = side === 'a' ? lesson.comparison!.imageA : lesson.comparison!.imageB
                  const chosen = comparisonChoice === side
                  const other = comparisonChoice !== null && comparisonChoice !== side

                  return (
                    <motion.button
                      key={side}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + idx * 0.12, duration: 0.5 }}
                      onClick={() => handleComparisonPick(side)}
                      disabled={comparisonChoice !== null}
                      className={`relative rounded-2xl overflow-hidden aspect-[4/3] transition-all duration-700 ease-out ${
                        chosen ? 'ring-2 ring-white/50 scale-[1.02] shadow-2xl' :
                        other ? 'opacity-20 scale-[0.96] blur-[1px]' :
                        'hover:ring-1 hover:ring-white/15 hover:scale-[1.01]'
                      }`}
                    >
                      <Image
                        src={img.url}
                        alt={img.label}
                        fill className="object-cover" sizes="50vw"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-5">
                        <p className="text-lg font-serif text-white">{img.label}</p>
                        <p className="text-xs text-white/40 font-light mt-1">{img.description}</p>
                      </div>
                    </motion.button>
                  )
                })}
              </div>

              {/* Insight */}
              <AnimatePresence>
                {comparisonChoice && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                    className="mt-10 text-center"
                  >
                    <p className="text-white/50 font-light font-serif italic max-w-lg mx-auto leading-relaxed text-base">
                      {lesson.comparison.insight}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {/* ══════════════════════════════════════ */}
        {/* REFLECTION                             */}
        {/* ══════════════════════════════════════ */}
        {phase === 'reflection' && lesson.comparison?.reflectionPrompt && (
          <motion.div
            key={`reflect-${lesson.id}`}
            {...fade}
            className="pt-20 px-6 md:px-12 min-h-screen flex flex-col justify-center"
          >
            <div className="max-w-xl mx-auto w-full text-center">
              <motion.div {...slideUp} transition={{ ...slideUp.transition, delay: 0.2 }}>
                <p className="text-xs uppercase tracking-[0.3em] text-white/20 mb-8">Reflect</p>

                <div className="mb-8">
                  <p className="text-sm text-white/25 font-light mb-2">You chose</p>
                  <p className="text-xl font-serif text-white/80">
                    {comparisonChoice === 'a' ? lesson.comparison.imageA.label : lesson.comparison.imageB.label}
                  </p>
                </div>

                <div className="bg-white/[0.02] border border-white/[0.08] rounded-2xl px-8 py-8 mb-10">
                  <p className="text-xl md:text-2xl font-serif font-light text-white/60 leading-relaxed italic">
                    {lesson.comparison.reflectionPrompt}
                  </p>
                </div>

                <p className="text-white/25 font-light text-sm mb-10 max-w-md mx-auto leading-relaxed">
                  There's no right answer. But knowing <em>why</em> you're drawn to something — that's taste.
                </p>

                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  onClick={() => advance('reflection')}
                  className="bg-white/[0.08] hover:bg-white/[0.15] text-white px-8 py-3.5 rounded-full font-light transition-all duration-300 border border-white/[0.06]"
                >
                  {lesson.quiz ? 'Test yourself →' : 'Continue →'}
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* ══════════════════════════════════════ */}
        {/* QUIZ                                   */}
        {/* ══════════════════════════════════════ */}
        {phase === 'quiz' && lesson.quiz && (
          <motion.div
            key={`quiz-${lesson.id}`}
            {...fade}
            className="pt-20 px-6 md:px-12 min-h-screen flex flex-col justify-center"
          >
            <div className="max-w-xl mx-auto w-full">
              <motion.p {...slideUp} className="text-xs uppercase tracking-[0.2em] text-white/20 mb-5">
                Quick check
              </motion.p>
              <motion.h3
                {...slideUp}
                transition={{ ...slideUp.transition, delay: 0.1 }}
                className="text-xl md:text-2xl font-serif font-light mb-10 leading-relaxed"
              >
                {lesson.quiz.question}
              </motion.h3>
              <div className="space-y-3">
                {lesson.quiz.options.map((option, i) => {
                  const isSelected = selectedAnswer === i
                  const isAnswer = i === lesson.quiz!.correctIndex
                  const answered = selectedAnswer !== null

                  let style = 'bg-white/[0.04] hover:bg-white/[0.08] border-white/[0.06] hover:border-white/[0.12]'
                  if (answered) {
                    if (isAnswer) style = 'bg-green-500/15 border-green-500/40 shadow-[0_0_20px_rgba(34,197,94,0.1)]'
                    else if (isSelected && !isCorrect) style = 'bg-red-500/15 border-red-500/40 shadow-[0_0_20px_rgba(239,68,68,0.1)]'
                    else style = 'bg-white/[0.02] border-white/[0.04] opacity-30'
                  }

                  return (
                    <motion.button
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + i * 0.08 }}
                      onClick={() => handleAnswerSelect(i)}
                      disabled={answered}
                      className={`w-full text-left p-5 rounded-2xl border transition-all duration-500 font-light ${style}`}
                    >
                      <span className="text-white/25 mr-3 text-sm font-mono">{String.fromCharCode(65 + i)}</span>
                      <span className="text-white/80">{option}</span>
                      {answered && isAnswer && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 300 }}
                          className="float-right text-green-400"
                        >✓</motion.span>
                      )}
                      {answered && isSelected && !isCorrect && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 300 }}
                          className="float-right text-red-400"
                        >✗</motion.span>
                      )}
                    </motion.button>
                  )
                })}
              </div>
            </div>
          </motion.div>
        )}

        {/* ══════════════════════════════════════ */}
        {/* RESULT                                 */}
        {/* ══════════════════════════════════════ */}
        {phase === 'result' && lesson.quiz && (
          <motion.div
            key={`result-${lesson.id}`}
            {...fade}
            className="pt-20 px-6 md:px-12 min-h-screen flex flex-col justify-center"
          >
            <div className="max-w-xl mx-auto w-full text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 12 }}
                className={`text-5xl mb-5 ${isCorrect ? 'text-green-400' : 'text-red-400'}`}
              >
                {isCorrect ? '✓' : '✗'}
              </motion.div>

              <motion.h3
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className={`text-2xl font-serif mb-4 ${isCorrect ? 'text-green-400' : 'text-red-400'}`}
              >
                {isCorrect ? 'Correct' : 'Not quite'}
              </motion.h3>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-white/50 font-light leading-relaxed mb-8 max-w-md mx-auto"
              >
                {lesson.quiz.explanation}
              </motion.p>

              {/* Deeper insight */}
              {lesson.deeperInsight && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                  className="bg-white/[0.02] border border-white/[0.06] rounded-2xl px-6 py-6 mb-8 text-left"
                >
                  <p className="text-[10px] uppercase tracking-[0.25em] text-white/20 mb-3">What most people miss</p>
                  <p className="text-white/50 font-serif font-light leading-relaxed italic">
                    {lesson.deeperInsight}
                  </p>
                </motion.div>
              )}

              {/* Cross-domain connection */}
              {lesson.connectionTo && !showConnection && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  onClick={() => setShowConnection(true)}
                  className="text-xs text-white/25 hover:text-white/50 font-light transition-all duration-300 mb-8 inline-block border-b border-white/10 hover:border-white/25 pb-0.5"
                >
                  See a connection across domains →
                </motion.button>
              )}

              <AnimatePresence>
                {showConnection && lesson.connectionTo && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-white/[0.015] border border-white/[0.05] rounded-2xl px-6 py-5 mb-8 text-left overflow-hidden"
                  >
                    <p className="text-[10px] uppercase tracking-[0.2em] text-white/15 mb-2">Connects to</p>
                    <p className="text-white/40 font-light text-sm leading-relaxed font-serif">
                      {lesson.connectionTo.insight}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                onClick={() => handleNextLesson(isCorrect ?? undefined)}
                className="bg-white/[0.08] hover:bg-white/[0.15] text-white px-8 py-4 rounded-2xl font-light text-lg transition-all duration-300 border border-white/[0.06] hover:scale-[1.02]"
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

// ── Stable suggestion on course complete ──
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
      className={`w-full text-left p-4 rounded-xl border transition-all duration-300 ${
        added ? 'border-white/10 bg-white/[0.04]' : 'border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/[0.1]'
      }`}
    >
      <div className="flex items-center gap-3">
        <motion.span
          animate={added ? { scale: [1, 1.3, 1] } : {}}
          className="text-sm"
        >
          {added ? '✓' : '♡'}
        </motion.span>
        <div>
          <p className="text-sm text-white/70 font-light">{lesson.title}</p>
          {lesson.funFact && (
            <p className="text-xs text-white/25 font-light italic mt-0.5">{lesson.funFact}</p>
          )}
        </div>
      </div>
    </button>
  )
}
