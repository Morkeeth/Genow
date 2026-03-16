'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import ScrollReveal from './components/ScrollReveal'
import CourseCard from './components/CourseCard'
import TasteQuiz from './components/TasteQuiz'
import { getAllCourses } from './lib/data'
import { updateStreak, getStats, hasTasteProfile, getTasteProfile } from './lib/storage'
import { getArchetypeForProfile } from './lib/tasteQuiz'
import type { Course, TasteProfile } from './lib/types'

function groupByDomain(courses: Course[]) {
  const groups: Record<string, Course[]> = {}
  for (const c of courses) {
    if (!groups[c.domain]) groups[c.domain] = []
    groups[c.domain].push(c)
  }
  return groups
}

const domainMeta: Record<string, { title: string; description: string; accent: string }> = {
  art: {
    title: 'Art',
    description: 'The human eye sees what no algorithm can. Every brushstroke carries a decision, a doubt, a conviction. Machines can replicate style. They cannot replicate the trembling hand of a painter at 3am deciding to cover the canvas in red.',
    accent: '#c23b22',
  },
  wine: {
    title: 'Wine',
    description: 'We could engineer the chemically perfect wine tomorrow. Every molecule measured, every compound balanced. It would score 100 points. And it would have nothing to say. The story of wine is the story of place, weather, soil, and a person who chose to wait one more week before harvest.',
    accent: '#722F37',
  },
  culture: {
    title: 'Culture & Design',
    description: 'Dieter Rams said "less, but better." Not less because a machine optimized it — less because a human decided what matters. The Bauhaus lasted 14 years. Every minimal interface you\'ve ever loved is still living in those 14 years.',
    accent: '#C5A55A',
  },
}

export default function Home() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [showQuiz, setShowQuiz] = useState(false)
  const [hasProfile, setHasProfile] = useState(false)
  const [profile, setProfile] = useState<TasteProfile | null>(null)
  const [stats, setStats] = useState({ streak: 0, lessonsCompleted: 0, quizAccuracy: 0, coursesStarted: 0, coursesCompleted: 0, stableItems: 0 })

  useEffect(() => {
    setMounted(true)
    updateStreak()
    setStats(getStats())
    const has = hasTasteProfile()
    setHasProfile(has)
    if (has) setProfile(getTasteProfile())
  }, [])

  const handleQuizComplete = (p: TasteProfile) => {
    setProfile(p)
    setHasProfile(true)
    setShowQuiz(false)
  }

  const courses = getAllCourses()
  const grouped = groupByDomain(courses)
  const archetype = profile ? getArchetypeForProfile(profile) : null

  // Show quiz if user chose to take it
  if (showQuiz) {
    return <TasteQuiz onComplete={handleQuizComplete} />
  }

  return (
    <main className="bg-black text-white">

      {/* ═══════════════════════════════════════ */}
      {/* FIXED NAV — minimal */}
      {/* ═══════════════════════════════════════ */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-md border-b border-white/5">
        <div className="max-w-5xl mx-auto flex items-center justify-between px-6 py-3">
          <span className="text-sm font-serif tracking-wider text-white/60">Genow</span>
          <div className="flex items-center gap-5">
            {hasProfile && (
              <button
                onClick={() => router.push('/stable')}
                className="text-xs text-white/30 hover:text-white/60 font-light transition-colors tracking-wide"
              >
                Your Stable
              </button>
            )}
            {!hasProfile ? (
              <button
                onClick={() => setShowQuiz(true)}
                className="text-xs text-white/50 hover:text-white/80 font-light transition-colors bg-white/5 hover:bg-white/10 rounded-full px-4 py-1.5"
              >
                Discover your taste
              </button>
            ) : (
              <span className="text-xs text-white/20 font-light italic">{archetype?.name}</span>
            )}
          </div>
        </div>
      </nav>

      {/* ═══════════════════════════════════════ */}
      {/* HERO */}
      {/* ═══════════════════════════════════════ */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")',
        }} />

        <div className="relative z-10 text-center px-6 max-w-4xl">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-xs uppercase tracking-[0.4em] text-white/30 mb-8"
          >
            General Knowledge at its Finest
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-5xl md:text-7xl lg:text-8xl font-serif font-light leading-[1.1] mb-8"
          >
            Made by<br />
            <span className="italic">Humans</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="text-lg md:text-xl text-white/50 font-light leading-relaxed max-w-2xl mx-auto mb-12"
          >
            In the age of AI, the craft is the story. Art, wine, design, technology —
            the things worth knowing are the things made by hand, shaped by time,
            and impossible to replicate.
          </motion.p>

          {/* CTA — quiz or scroll */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="flex flex-col items-center gap-4"
          >
            {!hasProfile && (
              <button
                onClick={() => setShowQuiz(true)}
                className="bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-full font-light transition-colors"
              >
                Discover your taste →
              </button>
            )}
            <a href="#thesis" className="text-white/20 hover:text-white/40 transition-colors text-xs tracking-widest uppercase">
              {hasProfile ? 'Continue exploring ↓' : 'or scroll to explore ↓'}
            </a>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent" />
      </section>

      {/* ═══════════════════════════════════════ */}
      {/* TASTE PROFILE (if completed) */}
      {/* ═══════════════════════════════════════ */}
      {mounted && hasProfile && archetype && (
        <section className="py-20 px-6 border-t border-white/5">
          <div className="max-w-3xl mx-auto text-center">
            <ScrollReveal>
              <p className="text-xs uppercase tracking-[0.3em] text-white/20 mb-4">Your Taste Profile</p>
              <h2 className="text-3xl md:text-4xl font-serif font-light mb-4">{archetype.name}</h2>
              <p className="text-white/40 font-light font-serif italic mb-8 max-w-lg mx-auto">{archetype.description}</p>
              <button
                onClick={() => router.push('/stable')}
                className="text-sm text-white/30 hover:text-white/60 font-light transition-colors border border-white/10 hover:border-white/20 rounded-full px-5 py-2"
              >
                Build your stable →
              </button>
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════ */}
      {/* THE THESIS */}
      {/* ═══════════════════════════════════════ */}
      <section id="thesis" className="py-32 md:py-48 px-6 border-t border-white/5">
        <div className="max-w-3xl mx-auto">
          <ScrollReveal>
            <p className="text-xs uppercase tracking-[0.3em] text-white/20 mb-12">The Thesis</p>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <h2 className="text-3xl md:text-5xl font-serif font-light leading-[1.4] mb-12">
              AI will generate a million paintings tonight.
              None of them will have been painted at 3am by someone
              who couldn't sleep because the color wasn't right.
            </h2>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <p className="text-lg md:text-xl text-white/50 font-light leading-[1.9] mb-8 font-serif">
              We can synthesize a wine that scores 100 points. We can generate an image
              indistinguishable from a Vermeer. We can write code that writes code.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.3}>
            <p className="text-lg md:text-xl text-white/50 font-light leading-[1.9] mb-8 font-serif">
              And none of it will carry the weight of a decision made by a human hand.
              The slight asymmetry of a hand-thrown pot. The vintage that almost didn't happen
              because it rained in September. The brushstroke that changed direction mid-air
              because the painter had a new idea.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.4}>
            <p className="text-lg md:text-xl text-white/70 font-light leading-[1.9] font-serif">
              <strong className="text-white">Genow</strong> is a place to learn the stories behind the craft.
              Not to memorize facts — to understand why the human-made things are the ones worth knowing.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════ */}
      {/* DOMAIN SECTIONS */}
      {/* ═══════════════════════════════════════ */}
      {Object.entries(domainMeta).map(([domain, meta]) => (
        <section key={domain} className="py-24 md:py-36 px-6 border-t border-white/5">
          <div className="max-w-5xl mx-auto">
            <ScrollReveal>
              <div className="mb-16 max-w-3xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-px" style={{ backgroundColor: meta.accent }} />
                  <p className="text-xs uppercase tracking-[0.3em]" style={{ color: meta.accent }}>
                    {meta.title}
                  </p>
                </div>
                <p className="text-xl md:text-2xl text-white/60 font-serif font-light leading-[1.7]">
                  {meta.description}
                </p>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {(grouped[domain] || []).map((course, index) => (
                <ScrollReveal key={course.id} delay={index * 0.1}>
                  <CourseCard course={course} index={0} />
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* ═══════════════════════════════════════ */}
      {/* YOUR STABLE CTA */}
      {/* ═══════════════════════════════════════ */}
      <section className="py-24 md:py-32 px-6 border-t border-white/5">
        <div className="max-w-3xl mx-auto text-center">
          <ScrollReveal>
            <p className="text-xs uppercase tracking-[0.3em] text-white/20 mb-8">Your Collection</p>
            <h2 className="text-3xl md:text-4xl font-serif font-light leading-[1.4] mb-6">
              Build your stable
            </h2>
            <p className="text-lg text-white/40 font-light leading-[1.9] mb-8 font-serif max-w-xl mx-auto">
              Everyone should know their favorites. Your light red Bourgogne.
              Your double tulips. Your Matisse. The alpaca coat you can't stop wearing.
              The things that make you, <em>you</em>.
            </p>
            <button
              onClick={() => router.push('/stable')}
              className="bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-full font-light transition-colors"
            >
              {mounted && stats.stableItems > 0
                ? `Your stable (${stats.stableItems}) →`
                : 'Start your collection →'
              }
            </button>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════ */}
      {/* THE MANIFESTO */}
      {/* ═══════════════════════════════════════ */}
      <section className="py-32 md:py-48 px-6 border-t border-white/5">
        <div className="max-w-3xl mx-auto text-center">
          <ScrollReveal>
            <p className="text-xs uppercase tracking-[0.3em] text-white/20 mb-12">A Manifesto</p>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <h2 className="text-3xl md:text-5xl font-serif font-light leading-[1.4] mb-12">
              The future belongs to people who know things.
            </h2>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <p className="text-lg text-white/50 font-light leading-[1.9] mb-6 font-serif">
              Not people who can Google things. Not people who can prompt things.
              People who have <em>tasted</em> the wine, <em>stood</em> in front of the painting,
              <em> understood</em> why the chair is shaped that way.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.3}>
            <p className="text-lg text-white/50 font-light leading-[1.9] mb-6 font-serif">
              Knowledge you carry in your body is different from knowledge you carry in your pocket.
              One makes you interesting at dinner. The other makes you a search engine.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.4}>
            <p className="text-xl text-white/80 font-serif leading-[1.9]">
              Learn the craft. Taste the wine. See the art.
              <br />
              <strong className="text-white">The human story is the only story.</strong>
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════ */}
      {/* STATS (if user has progress) */}
      {/* ═══════════════════════════════════════ */}
      {mounted && stats.lessonsCompleted > 0 && (
        <section className="py-16 px-6 border-t border-white/5">
          <div className="max-w-3xl mx-auto">
            <ScrollReveal>
              <p className="text-xs uppercase tracking-[0.3em] text-white/20 mb-8 text-center">Your Progress</p>
              <div className="grid grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-serif">{stats.streak}</p>
                  <p className="text-[10px] uppercase tracking-wider text-white/30 mt-1">Day streak</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-serif">{stats.lessonsCompleted}</p>
                  <p className="text-[10px] uppercase tracking-wider text-white/30 mt-1">Lessons</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-serif">{stats.coursesCompleted}</p>
                  <p className="text-[10px] uppercase tracking-wider text-white/30 mt-1">Courses</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-serif">{stats.quizAccuracy}%</p>
                  <p className="text-[10px] uppercase tracking-wider text-white/30 mt-1">Accuracy</p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════ */}
      {/* FOOTER */}
      {/* ═══════════════════════════════════════ */}
      <footer className="py-16 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-lg font-serif tracking-wider">Genow</p>
            <p className="text-xs text-white/20 mt-1">Made by humans. For humans.</p>
          </div>
          <p className="text-xs text-white/15">
            Craft · Art · Wine · Design · Technology
          </p>
        </div>
      </footer>
    </main>
  )
}
