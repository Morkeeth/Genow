import type { Course } from '@/app/types/course'
import sampleCourseData from './sampleCourse.json'

export const sampleCourse: Course = {
  ...sampleCourseData,
  generatedAt: new Date(sampleCourseData.generatedAt),
} as Course

export function getSampleCourseBySlug(slug: string): Course | null {
  if (slug === 'kandinsky-color-theory-and-spiritual-dimension') {
    return sampleCourse
  }
  return null
}

export function getAllSampleCourses(): Course[] {
  return [sampleCourse]
}

