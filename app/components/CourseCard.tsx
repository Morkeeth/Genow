'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import type { Course } from '@/app/lib/types'
import { getCourseProgress } from '@/app/lib/storage'

interface CourseCardProps {
  course: Course
  index: number
}

const domainLabels: Record<string, string> = {
  art: '🎨 Art',
  wine: '🍷 Wine',
  culture: '🏛️ Culture',
}

export default function CourseCard({ course, index }: CourseCardProps) {
  const router = useRouter()
  const progress = typeof window !== 'undefined' ? getCourseProgress(course.id) : null
  const completedCount = progress?.completedLessons.length || 0
  const totalLessons = course.lessons.length
  const progressPct = totalLessons > 0 ? (completedCount / totalLessons) * 100 : 0
  const isStarted = completedCount > 0
  const isCompleted = completedCount >= totalLessons

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
      onClick={() => router.push(`/course/${course.id}`)}
      className="group cursor-pointer"
    >
      <div className="relative rounded-2xl overflow-hidden aspect-[4/3] mb-3">
        {/* Background */}
        <div
          className="absolute inset-0"
          style={{ background: `linear-gradient(135deg, ${course.color} 0%, #0a0a0a 100%)` }}
        />

        {course.imageUrl && (
          <Image
            src={course.imageUrl}
            alt={course.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none'
            }}
          />
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Domain + difficulty badge */}
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="text-[10px] uppercase tracking-[0.15em] text-white/60 bg-black/30 backdrop-blur-sm rounded-full px-3 py-1">
            {domainLabels[course.domain] || course.domain}
          </span>
          <span className="text-[10px] uppercase tracking-[0.15em] text-white/40 bg-black/30 backdrop-blur-sm rounded-full px-3 py-1">
            {course.difficulty}
          </span>
        </div>

        {/* Progress indicator */}
        {isStarted && (
          <div className="absolute top-3 right-3">
            {isCompleted ? (
              <span className="text-xs bg-green-500/80 text-white rounded-full px-3 py-1 backdrop-blur-sm">
                ✓ Done
              </span>
            ) : (
              <span className="text-xs bg-white/15 text-white rounded-full px-3 py-1 backdrop-blur-sm">
                {completedCount}/{totalLessons}
              </span>
            )}
          </div>
        )}

        {/* Bottom info */}
        <div className="absolute bottom-3 left-3 right-3">
          <p className="text-white/50 text-xs mb-1">
            {course.lessons.length} lessons · {course.estimatedMinutes} min
          </p>
          {isStarted && !isCompleted && (
            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-white/60 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progressPct}%` }}
                transition={{ duration: 0.6 }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Text below card */}
      <h3 className="text-lg font-serif text-white group-hover:text-white/90 transition-colors leading-tight mb-1">
        {course.title}
      </h3>
      <p className="text-sm text-white/40 font-light leading-relaxed">
        {course.subtitle}
      </p>
    </motion.div>
  )
}
