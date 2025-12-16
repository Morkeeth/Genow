'use client'

import { motion } from 'framer-motion'
import type { Lesson } from '@/app/types/course'
import { fadeInUp } from '@/app/lib/utils/animations'
import PoeticText from '../ui/PoeticText'

interface LessonCardProps {
  lesson: Lesson
  onDeepDiveClick?: (deepDiveId: string) => void
  onArtworkClick?: (artworkId: string) => void
}

export default function LessonCard({
  lesson,
  onDeepDiveClick,
  onArtworkClick,
}: LessonCardProps) {
  return (
    <motion.div
      variants={fadeInUp}
      initial="initial"
      animate="animate"
      className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6"
    >
      <h2 className="text-2xl font-serif font-semibold mb-4">
        {lesson.title}
      </h2>
      
      <div className="mb-6">
        <PoeticText text={lesson.content} />
      </div>

      {lesson.artworks && lesson.artworks.length > 0 && (
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
            Related Artworks
          </h3>
          <div className="flex flex-wrap gap-2">
            {lesson.artworks.map((artworkId) => (
              <button
                key={artworkId}
                onClick={() => onArtworkClick?.(artworkId)}
                className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
              >
                View Artwork
              </button>
            ))}
          </div>
        </div>
      )}

      {lesson.deepDives && lesson.deepDives.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
            Deep Dives
          </h3>
          <div className="space-y-2">
            {lesson.deepDives.map((deepDive) => (
              <button
                key={deepDive.id}
                onClick={() => onDeepDiveClick?.(deepDive.id)}
                className="w-full text-left px-4 py-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
              >
                <span className="font-medium text-purple-800 dark:text-purple-200">
                  {deepDive.title}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  )
}


