export type Domain = 'art' | 'wine' | 'culture'

// A course is a sequence of lessons on a topic
export interface Course {
  id: string
  domain: Domain
  title: string
  subtitle: string
  description: string
  imageUrl: string
  color: string
  lessons: Lesson[]
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  estimatedMinutes: number
}

// A lesson is one "page" in a course — content + optional quiz
export interface Lesson {
  id: string
  title: string
  imageUrl: string
  imageCredit?: string
  content: string         // the teaching content (paragraphs)
  funFact?: string        // a memorable one-liner
  quiz?: QuizQuestion     // optional quiz after content
}

export interface QuizQuestion {
  question: string
  options: string[]
  correctIndex: number
  explanation: string     // shown after answering
}

// Progress tracking
export interface CourseProgress {
  courseId: string
  currentLessonIndex: number
  completedLessons: string[]  // lesson IDs
  quizResults: Record<string, boolean>  // lessonId -> correct/wrong
  startedAt: string
  completedAt?: string
}

export interface UserProgress {
  courses: Record<string, CourseProgress>
  savedCourseIds: string[]
  lastDomain: Domain | 'all'
  streak: number
  lastActiveDate: string
  deviceId: string
}
