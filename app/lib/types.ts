export type Domain = 'art' | 'wine' | 'culture'

// ── Courses & Lessons ──

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

export interface Lesson {
  id: string
  title: string
  imageUrl: string
  imageCredit?: string
  content: string
  funFact?: string
  quiz?: QuizQuestion
  comparison?: ComparisonQuestion  // image A vs B interactive
  // ── Learning Science ──
  openingQuestion?: string          // Curiosity hook — intriguing question before content
  noticePrompt?: string             // "What do you notice?" — shown before comparison
  deeperInsight?: string            // Richer insight shown after quiz, regardless of correctness
  connectionTo?: {                  // Cross-domain link to another lesson
    lessonId: string
    insight: string
  }
}

export interface QuizQuestion {
  question: string
  options: string[]
  correctIndex: number
  explanation: string
}

export interface ComparisonQuestion {
  prompt: string
  imageA: { url: string; label: string; description: string }
  imageB: { url: string; label: string; description: string }
  insight: string  // shown after choosing
  reflectionPrompt?: string  // "Why did you pick that?" — asked after choice
}

// ── Course Progress ──

export interface CourseProgress {
  courseId: string
  currentLessonIndex: number
  completedLessons: string[]
  completedAt_map?: Record<string, string>  // lessonId → ISO timestamp (for spaced recall)
  quizResults: Record<string, boolean>
  startedAt: string
  completedAt?: string
}

// ── Spaced Recall ──

export interface RecallCard {
  lessonId: string
  courseId: string
  lessonTitle: string
  question: string          // the quiz question or curiosity hook to resurface
  daysSince: number
  domain: Domain
}

// ── Taste Profile ──

export interface TasteProfile {
  // Spectrum scores: -1 (left) to +1 (right)
  classic_vs_modern: number       // Classic ↔ Contemporary
  subtle_vs_bold: number          // Subtle ↔ Bold
  minimalist_vs_expressive: number // Minimalist ↔ Expressive
  archetype: string                // "The Classicist", "The Explorer", etc.
  completedAt: string
}

export interface TasteQuizAnswer {
  questionId: string
  choice: 'a' | 'b'
}

// ── Your Stable (Personal Collection) ──

export interface StableItem {
  id: string
  category: 'art' | 'wine' | 'design' | 'style' | 'nature' | 'place'
  title: string
  subtitle?: string
  imageUrl?: string
  note?: string        // personal note: "reminds me of summer in Provence"
  addedAt: string
  fromCourse?: string  // which course surfaced this
}

// ── User Progress (combined) ──

export interface UserProgress {
  courses: Record<string, CourseProgress>
  savedCourseIds: string[]
  lastDomain: Domain | 'all'
  streak: number
  lastActiveDate: string
  deviceId: string
  tasteProfile?: TasteProfile
  stable: StableItem[]
}
