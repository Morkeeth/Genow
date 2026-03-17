'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { getArchetypeForProfile } from '@/app/lib/tasteQuiz'
import type { TasteProfile } from '@/app/lib/types'

interface TasteCardProps {
  profile: TasteProfile
  stats: {
    streak: number
    coursesCompleted: number
    lessonsCompleted: number
    quizAccuracy: number
    stableItems: number
  }
}

const archetypeGradients: Record<string, string> = {
  'The Connoisseur': 'from-amber-900/20 via-transparent to-stone-900/20',
  'The Romantic': 'from-rose-900/20 via-transparent to-amber-900/20',
  'The Modernist': 'from-slate-800/30 via-transparent to-zinc-900/20',
  'The Radical': 'from-red-900/20 via-transparent to-purple-900/20',
  'The Observer': 'from-blue-900/20 via-transparent to-slate-900/20',
  'The Essentialist': 'from-zinc-800/20 via-transparent to-stone-900/20',
  'The Explorer': 'from-emerald-900/20 via-transparent to-blue-900/20',
}

export default function TasteCard({ profile, stats }: TasteCardProps) {
  const archetype = getArchetypeForProfile(profile)
  const [shared, setShared] = useState(false)
  const gradient = archetypeGradients[archetype.name] || archetypeGradients['The Explorer']

  const handleShare = async () => {
    const text = `My taste profile: ${archetype.name}\n${archetype.description}\n\nDiscover yours at Genow`
    if (navigator.share) {
      try {
        await navigator.share({ title: 'My Taste Profile', text })
      } catch { /* cancelled */ }
    } else {
      await navigator.clipboard.writeText(text)
      setShared(true)
      setTimeout(() => setShared(false), 2000)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`relative rounded-2xl border border-white/[0.06] overflow-hidden bg-gradient-to-br ${gradient}`}
    >
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
        backgroundSize: '24px 24px',
      }} />

      <div className="relative p-6 md:p-8">
        {/* Label */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-[10px] uppercase tracking-[0.4em] text-white/25 mb-4"
        >
          Your Taste Profile
        </motion.p>

        {/* Archetype name */}
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-3xl md:text-4xl font-serif font-light mb-3"
        >
          {archetype.name}
        </motion.h2>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-sm text-white/40 font-light leading-relaxed mb-6 max-w-md font-serif italic"
        >
          {archetype.yourTaste}
        </motion.p>

        {/* Spectrum bars */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="space-y-3 mb-6"
        >
          <SpectrumBar label="Classic" labelRight="Contemporary" value={profile.classic_vs_modern} delay={0.6} />
          <SpectrumBar label="Subtle" labelRight="Bold" value={profile.subtle_vs_bold} delay={0.7} />
          <SpectrumBar label="Minimalist" labelRight="Expressive" value={profile.minimalist_vs_expressive} delay={0.8} />
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="flex gap-6 mb-6 flex-wrap"
        >
          <StatChip value={stats.stableItems} label="collected" />
          <StatChip value={stats.coursesCompleted} label="courses" />
          <StatChip value={stats.lessonsCompleted} label="lessons" />
          {stats.quizAccuracy > 0 && <StatChip value={stats.quizAccuracy} label="% accuracy" />}
          {stats.streak > 0 && <StatChip value={stats.streak} label="day streak" />}
        </motion.div>

        {/* Share button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          onClick={handleShare}
          className="text-xs text-white/25 hover:text-white/50 font-light transition-colors border border-white/[0.06] hover:border-white/10 rounded-full px-4 py-1.5"
        >
          {shared ? '✓ Copied' : '↗ Share your taste'}
        </motion.button>
      </div>
    </motion.div>
  )
}

function SpectrumBar({ label, labelRight, value, delay }: { label: string; labelRight: string; value: number; delay: number }) {
  const pct = ((value + 1) / 2) * 100

  return (
    <div>
      <div className="flex justify-between text-[9px] uppercase tracking-[0.15em] text-white/20 mb-1">
        <span>{label}</span>
        <span>{labelRight}</span>
      </div>
      <div className="h-1 bg-white/[0.04] rounded-full overflow-hidden relative">
        <motion.div
          className="absolute top-0 h-full w-2.5 bg-white/50 rounded-full"
          initial={{ left: '50%' }}
          animate={{ left: `${pct}%` }}
          transition={{ duration: 0.8, delay }}
          style={{ transform: 'translateX(-50%)' }}
        />
      </div>
    </div>
  )
}

function StatChip({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex items-baseline gap-1.5">
      <motion.span
        className="text-lg font-serif text-white/70"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {value}
      </motion.span>
      <span className="text-[10px] text-white/25 font-light">{label}</span>
    </div>
  )
}
