'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import type { Course, Lesson, DeepDive } from '@/app/types/course'
import LessonCard from './LessonCard'
import ConnectionGraph from './ConnectionGraph'
import FloatingArtwork from '../floating/FloatingArtwork'
import ArtworkDetail from '../artwork/ArtworkDetail'
import { staggerContainer } from '@/app/lib/utils/animations'

interface CourseViewerProps {
  course: Course
  onArtworkClick?: (artworkId: string) => void
  onConnectionClick?: (connectionId: string) => void
}

export default function CourseViewer({
  course,
  onArtworkClick,
  onConnectionClick,
}: CourseViewerProps) {
  const [selectedLesson, setSelectedLesson] = useState<number | null>(null)
  const [selectedDeepDive, setSelectedDeepDive] = useState<DeepDive | null>(null)
  const [selectedArtwork, setSelectedArtwork] = useState<string | null>(null)
  const [showConnections, setShowConnections] = useState(false)

  const sortedLessons = [...course.lessons].sort((a, b) => a.order - b.order)

  const handleDeepDiveClick = (deepDiveId: string) => {
    const deepDive = sortedLessons
      .flatMap((l) => l.deepDives || [])
      .find((d) => d.id === deepDiveId)
    if (deepDive) {
      setSelectedDeepDive(deepDive)
    }
  }

  const handleArtworkClick = (artworkId: string) => {
    setSelectedArtwork(artworkId)
    onArtworkClick?.(artworkId)
  }

  const selectedArtworkData = course.artworks.find((a) => a.id === selectedArtwork)

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Course Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-serif font-bold mb-4">{course.title}</h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 poetic-text mb-4">
          {course.description}
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-sm">
            {course.epoch}
          </span>
          {course.tags?.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full text-sm"
            >
              {tag}
            </span>
          ))}
        </div>
        <button
          onClick={() => setShowConnections(!showConnections)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {showConnections ? 'Hide' : 'Show'} Connections
        </button>
      </motion.div>

      {/* Connection Graph */}
      {showConnections && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mb-8"
        >
          <ConnectionGraph
            connections={course.connections}
            artworks={course.artworks}
            onConnectionClick={(conn) => onConnectionClick?.(conn.id)}
          />
        </motion.div>
      )}

      {/* Lessons */}
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="mb-8"
      >
        {sortedLessons.map((lesson, index) => (
          <div key={lesson.id}>
            <LessonCard
              lesson={lesson}
              onDeepDiveClick={handleDeepDiveClick}
              onArtworkClick={handleArtworkClick}
            />
          </div>
        ))}
      </motion.div>

      {/* Deep Dive Modal */}
      {selectedDeepDive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedDeepDive(null)}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-serif font-semibold mb-4">
              {selectedDeepDive.title}
            </h2>
            <p className="text-gray-700 dark:text-gray-300 poetic-text">
              {selectedDeepDive.content}
            </p>
            <button
              onClick={() => setSelectedDeepDive(null)}
              className="mt-4 px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}

      {/* Artwork Detail Modal */}
      {selectedArtworkData && (
        <ArtworkDetail
          artwork={selectedArtworkData}
          onClose={() => setSelectedArtwork(null)}
        />
      )}

      {/* Floating Artworks */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {course.artworks.slice(0, 6).map((artwork, index) => (
          <FloatingArtwork
            key={artwork.id}
            artwork={artwork}
            onClick={() => handleArtworkClick(artwork.id)}
            delay={index * 0.1}
          />
        ))}
      </div>
    </div>
  )
}


