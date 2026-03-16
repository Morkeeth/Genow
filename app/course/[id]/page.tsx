'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { getCourseById } from '@/app/lib/data'
import LessonFlow from '@/app/components/LessonFlow'
import type { Course } from '@/app/lib/types'

export default function CoursePage() {
  const params = useParams()
  const router = useRouter()
  const [course, setCourse] = useState<Course | null>(null)

  useEffect(() => {
    const id = params.id as string
    const found = getCourseById(id)
    if (found) {
      setCourse(found)
    } else {
      router.push('/')
    }
  }, [params.id, router])

  if (!course) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white/40 text-xl font-light">Loading...</p>
      </main>
    )
  }

  return <LessonFlow course={course} />
}
