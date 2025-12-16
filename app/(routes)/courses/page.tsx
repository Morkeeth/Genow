'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { fadeInUp, staggerContainer } from '@/app/lib/utils/animations'
import type { Course } from '@/app/types/course'

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationParams, setGenerationParams] = useState({
    topic: '',
    artist: '',
    epoch: '',
    focus: '',
  })

  const handleGenerateCourse = async () => {
    setIsGenerating(true)
    try {
      const response = await fetch('/api/courses/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(generationParams),
      })

      if (response.ok) {
        const course = await response.json()
        setCourses([...courses, course])
        setGenerationParams({ topic: '', artist: '', epoch: '', focus: '' })
      } else {
        console.error('Failed to generate course')
      }
    } catch (error) {
      console.error('Error generating course:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-serif font-bold mb-8">Courses</h1>

        {/* Course Generation Form */}
        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8"
        >
          <h2 className="text-2xl font-serif font-semibold mb-4">
            Generate New Course
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              placeholder="Topic (e.g., Color Theory)"
              value={generationParams.topic}
              onChange={(e) =>
                setGenerationParams({ ...generationParams, topic: e.target.value })
              }
              className="px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            />
            <input
              type="text"
              placeholder="Artist (e.g., Henri Matisse)"
              value={generationParams.artist}
              onChange={(e) =>
                setGenerationParams({ ...generationParams, artist: e.target.value })
              }
              className="px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            />
            <input
              type="text"
              placeholder="Epoch (e.g., Modernism)"
              value={generationParams.epoch}
              onChange={(e) =>
                setGenerationParams({ ...generationParams, epoch: e.target.value })
              }
              className="px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            />
            <input
              type="text"
              placeholder="Focus (e.g., Influence on Rothko)"
              value={generationParams.focus}
              onChange={(e) =>
                setGenerationParams({ ...generationParams, focus: e.target.value })
              }
              className="px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <button
            onClick={handleGenerateCourse}
            disabled={isGenerating}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? 'Generating...' : 'Generate Course'}
          </button>
        </motion.div>

        {/* Course List */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {courses.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400 col-span-full text-center py-12">
              No courses yet. Generate your first course above!
            </p>
          ) : (
            courses.map((course) => (
              <motion.div
                key={course.id}
                variants={fadeInUp}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                <h3 className="text-xl font-serif font-semibold mb-2">
                  {course.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                  {course.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded text-xs">
                    {course.epoch}
                  </span>
                  <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded text-xs">
                    {course.lessons.length} lessons
                  </span>
                </div>
                <Link
                  href={`/courses/${course.slug}`}
                  className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  View Course
                </Link>
              </motion.div>
            ))
          )}
        </motion.div>
      </div>
    </div>
  )
}


