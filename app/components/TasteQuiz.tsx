'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { tasteQuestions, computeProfile, getArchetypeForProfile } from '@/app/lib/tasteQuiz'
import { saveTasteProfile } from '@/app/lib/storage'
import type { TasteProfile } from '@/app/lib/types'

interface TasteQuizProps {
  onComplete: (profile: TasteProfile) => void
}

export default function TasteQuiz({ onComplete }: TasteQuizProps) {
  const [step, setStep] = useState(0) // 0 = intro, 1-7 = questions, 8 = result
  const [answers, setAnswers] = useState<Record<string, 'a' | 'b'>>({})
  const [result, setResult] = useState<TasteProfile | null>(null)

  const isIntro = step === 0
  const isResult = step === tasteQuestions.length + 1
  const question = !isIntro && !isResult ? tasteQuestions[step - 1] : null
  const progress = step / (tasteQuestions.length + 1)

  const handleChoice = (choice: 'a' | 'b') => {
    if (!question) return
    const newAnswers = { ...answers, [question.id]: choice }
    setAnswers(newAnswers)

    // Small delay for the selection animation
    setTimeout(() => {
      if (step === tasteQuestions.length) {
        // Last question — compute result
        const profile = computeProfile(newAnswers)
        saveTasteProfile(profile)
        setResult(profile)
        setStep(step + 1)
      } else {
        setStep(step + 1)
      }
    }, 500)
  }

  const archetype = result ? getArchetypeForProfile(result) : null

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Progress bar */}
      {!isIntro && (
        <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-white/5">
          <motion.div
            className="h-full bg-white/40"
            animate={{ width: `${progress * 100}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      )}

      <AnimatePresence mode="wait">
        {/* ── INTRO ── */}
        {isIntro && (
          <motion.div
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -30 }}
            className="flex-1 flex items-center justify-center px-6"
          >
            <div className="text-center max-w-lg">
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-xs uppercase tracking-[0.4em] text-white/30 mb-6"
              >
                7 Questions
              </motion.p>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-4xl md:text-5xl font-serif font-light leading-tight mb-6"
              >
                Discover Your<br /><em>Taste</em>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-lg text-white/40 font-light leading-relaxed mb-10"
              >
                Pick the one that speaks to you. No right answers —
                just your instinct. Takes 60 seconds.
              </motion.p>

              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                onClick={() => setStep(1)}
                className="bg-white/10 hover:bg-white/20 text-white px-10 py-4 rounded-full text-lg font-light transition-colors"
              >
                Let's go
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* ── QUESTION ── */}
        {question && (
          <motion.div
            key={question.id}
            initial={{ opacity: 0, x: 80 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -80 }}
            transition={{ duration: 0.4 }}
            className="flex-1 flex flex-col justify-center px-6 py-16"
          >
            <div className="max-w-4xl mx-auto w-full">
              {/* Question prompt */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-2xl md:text-3xl font-serif font-light text-center mb-10 leading-relaxed"
              >
                {question.prompt}
              </motion.p>

              {/* Two options side by side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {/* Option A */}
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  onClick={() => handleChoice('a')}
                  className={`group relative rounded-2xl overflow-hidden aspect-[4/3] transition-all duration-300 ${
                    answers[question.id] === 'a'
                      ? 'ring-2 ring-white/60 scale-[0.98]'
                      : answers[question.id] === 'b'
                      ? 'opacity-30 scale-95'
                      : 'hover:ring-1 hover:ring-white/20'
                  }`}
                  disabled={!!answers[question.id]}
                >
                  <Image
                    src={question.optionA.imageUrl}
                    alt={question.optionA.label}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
                    <p className="text-lg font-serif text-white mb-1">{question.optionA.label}</p>
                    <p className="text-xs text-white/50 font-light">{question.optionA.vibe}</p>
                  </div>
                </motion.button>

                {/* Option B */}
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  onClick={() => handleChoice('b')}
                  className={`group relative rounded-2xl overflow-hidden aspect-[4/3] transition-all duration-300 ${
                    answers[question.id] === 'b'
                      ? 'ring-2 ring-white/60 scale-[0.98]'
                      : answers[question.id] === 'a'
                      ? 'opacity-30 scale-95'
                      : 'hover:ring-1 hover:ring-white/20'
                  }`}
                  disabled={!!answers[question.id]}
                >
                  <Image
                    src={question.optionB.imageUrl}
                    alt={question.optionB.label}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
                    <p className="text-lg font-serif text-white mb-1">{question.optionB.label}</p>
                    <p className="text-xs text-white/50 font-light">{question.optionB.vibe}</p>
                  </div>
                </motion.button>
              </div>

              {/* Step counter */}
              <p className="text-center text-white/15 text-xs mt-8 tracking-widest">
                {step} / {tasteQuestions.length}
              </p>
            </div>
          </motion.div>
        )}

        {/* ── RESULT ── */}
        {isResult && archetype && (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="flex-1 flex items-center justify-center px-6 py-16"
          >
            <div className="text-center max-w-lg">
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-xs uppercase tracking-[0.4em] text-white/30 mb-4"
              >
                Your Taste Profile
              </motion.p>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-4xl md:text-6xl font-serif font-light mb-6"
              >
                {archetype.name}
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-lg text-white/50 font-light leading-relaxed mb-8 font-serif"
              >
                {archetype.description}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="bg-white/5 rounded-xl p-6 mb-10 text-left"
              >
                <p className="text-xs uppercase tracking-[0.2em] text-white/25 mb-3">Your favorites might include</p>
                <p className="text-white/60 font-light font-serif italic leading-relaxed">
                  {archetype.yourTaste}
                </p>
              </motion.div>

              {/* Taste spectrum bars */}
              {result && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="space-y-4 mb-10"
                >
                  <TasteBar label="Classic" labelRight="Contemporary" value={result.classic_vs_modern} />
                  <TasteBar label="Subtle" labelRight="Bold" value={result.subtle_vs_bold} />
                  <TasteBar label="Minimalist" labelRight="Expressive" value={result.minimalist_vs_expressive} />
                </motion.div>
              )}

              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                onClick={() => onComplete(result!)}
                className="bg-white/10 hover:bg-white/20 text-white px-10 py-4 rounded-full text-lg font-light transition-colors"
              >
                Start learning →
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function TasteBar({ label, labelRight, value }: { label: string; labelRight: string; value: number }) {
  // value: -1 (left) to +1 (right)
  const pct = ((value + 1) / 2) * 100

  return (
    <div>
      <div className="flex justify-between text-[10px] uppercase tracking-wider text-white/25 mb-1">
        <span>{label}</span>
        <span>{labelRight}</span>
      </div>
      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden relative">
        <motion.div
          className="absolute top-0 h-full w-3 bg-white/60 rounded-full"
          initial={{ left: '50%' }}
          animate={{ left: `${pct}%` }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{ transform: 'translateX(-50%)' }}
        />
      </div>
    </div>
  )
}
