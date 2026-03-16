'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import DomainTabs from './components/DomainTabs'
import CourseCard from './components/CourseCard'
import { getCoursesByDomain } from './lib/data'
import { getLastDomain, setLastDomain, getStats, updateStreak } from './lib/storage'
import type { Domain } from './lib/types'

export default function Home() {
  const [domain, setDomain] = useState<Domain | 'all'>('all')
  const [mounted, setMounted] = useState(false)
  const [stats, setStats] = useState({ streak: 0, lessonsCompleted: 0, quizAccuracy: 0, coursesStarted: 0, coursesCompleted: 0 })

  useEffect(() => {
    setMounted(true)
    setDomain(getLastDomain())
    updateStreak()
    setStats(getStats())
  }, [])

  const handleDomainChange = (d: Domain | 'all') => {
    setDomain(d)
    setLastDomain(d)
  }

  const filteredCourses = getCoursesByDomain(domain)

  if (!mounted) {
    return <main className="min-h-screen bg-black" />
  }

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="px-6 md:px-12 pt-8">
        <div className="max-w-5xl mx-auto">
          {/* Top row */}
          <div className="flex items-center justify-between mb-8">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-2xl font-serif tracking-wider">Genow</h1>
              <p className="text-white/30 text-sm font-light mt-0.5">Learn something beautiful</p>
            </motion.div>

            {/* Streak */}
            {stats.streak > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white/5 rounded-full px-4 py-2 flex items-center gap-2"
              >
                <span className="text-orange-400">🔥</span>
                <span className="text-sm text-white/60 font-light">{stats.streak} day{stats.streak !== 1 ? 's' : ''}</span>
              </motion.div>
            )}
          </div>

          {/* Stats row (show only if user has done stuff) */}
          {stats.lessonsCompleted > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-3 gap-3 mb-8"
            >
              <div className="bg-white/5 rounded-xl p-3 text-center">
                <p className="text-xl font-serif">{stats.lessonsCompleted}</p>
                <p className="text-[10px] uppercase tracking-wider text-white/30 mt-1">Lessons</p>
              </div>
              <div className="bg-white/5 rounded-xl p-3 text-center">
                <p className="text-xl font-serif">{stats.coursesCompleted}</p>
                <p className="text-[10px] uppercase tracking-wider text-white/30 mt-1">Courses</p>
              </div>
              <div className="bg-white/5 rounded-xl p-3 text-center">
                <p className="text-xl font-serif">{stats.quizAccuracy}%</p>
                <p className="text-[10px] uppercase tracking-wider text-white/30 mt-1">Quiz accuracy</p>
              </div>
            </motion.div>
          )}

          {/* Domain tabs */}
          <div className="flex justify-center mb-8">
            <DomainTabs active={domain} onChange={handleDomainChange} />
          </div>
        </div>
      </div>

      {/* Course grid */}
      <div className="px-6 md:px-12 pb-12">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course, index) => (
              <CourseCard key={course.id} course={course} index={index} />
            ))}
          </div>

          {filteredCourses.length === 0 && (
            <div className="text-center py-20">
              <p className="text-white/30 text-lg font-light">No courses in this domain yet</p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
