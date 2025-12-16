'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import CourseViewer from '@/app/components/course/CourseViewer'
import type { Course } from '@/app/types/course'

export default function CoursePage() {
  const params = useParams()
  const slug = params.slug as string
  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In a real app, fetch course by slug
    // For now, we'll generate a course if it's the Matisse course
    if (slug === 'matisse-red-studio-and-its-influence') {
      generateMatisseCourse()
    } else {
      setLoading(false)
    }
  }, [slug])

  const generateMatisseCourse = async () => {
    try {
      const response = await fetch('/api/courses/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic: 'Matisse Red Studio and its influence',
          artist: 'Henri Matisse',
          epoch: 'Modernism',
          focus: 'Influence on Mark Rothko',
        }),
      })

      if (response.ok) {
        const generatedCourse = await response.json()
        setCourse(generatedCourse)
      }
    } catch (error) {
      console.error('Error generating course:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Loading course...</p>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Course not found</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8">
      <CourseViewer course={course} />
    </div>
  )
}


