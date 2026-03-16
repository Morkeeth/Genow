'use client'

import type { UserProgress, CourseProgress, Domain } from './types'

const STORAGE_KEY = 'genow_progress'

function generateDeviceId(): string {
  return 'dev_' + Math.random().toString(36).substring(2) + Date.now().toString(36)
}

function todayStr(): string {
  return new Date().toISOString().split('T')[0]
}

export function getProgress(): UserProgress {
  if (typeof window === 'undefined') {
    return { courses: {}, savedCourseIds: [], lastDomain: 'all', streak: 0, lastActiveDate: '', deviceId: '' }
  }

  const raw = localStorage.getItem(STORAGE_KEY)
  if (raw) {
    try {
      return JSON.parse(raw)
    } catch {
      // corrupted
    }
  }

  const fresh: UserProgress = {
    courses: {},
    savedCourseIds: [],
    lastDomain: 'all',
    streak: 0,
    lastActiveDate: '',
    deviceId: generateDeviceId(),
  }
  save(fresh)
  return fresh
}

function save(progress: UserProgress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
}

// ── Streak ──

export function updateStreak() {
  const progress = getProgress()
  const today = todayStr()

  if (progress.lastActiveDate === today) return // already counted

  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = yesterday.toISOString().split('T')[0]

  if (progress.lastActiveDate === yesterdayStr) {
    progress.streak += 1
  } else if (progress.lastActiveDate !== today) {
    progress.streak = 1
  }

  progress.lastActiveDate = today
  save(progress)
}

// ── Course Progress ──

export function getCourseProgress(courseId: string): CourseProgress | null {
  return getProgress().courses[courseId] || null
}

export function startCourse(courseId: string) {
  const progress = getProgress()
  if (!progress.courses[courseId]) {
    progress.courses[courseId] = {
      courseId,
      currentLessonIndex: 0,
      completedLessons: [],
      quizResults: {},
      startedAt: new Date().toISOString(),
    }
    save(progress)
  }
}

export function completeLesson(courseId: string, lessonId: string, quizCorrect?: boolean) {
  const progress = getProgress()
  const cp = progress.courses[courseId]
  if (!cp) return

  if (!cp.completedLessons.includes(lessonId)) {
    cp.completedLessons.push(lessonId)
  }
  if (quizCorrect !== undefined) {
    cp.quizResults[lessonId] = quizCorrect
  }

  save(progress)
  updateStreak()
}

export function advanceLesson(courseId: string, totalLessons: number) {
  const progress = getProgress()
  const cp = progress.courses[courseId]
  if (!cp) return

  if (cp.currentLessonIndex < totalLessons - 1) {
    cp.currentLessonIndex += 1
  } else {
    cp.completedAt = new Date().toISOString()
  }

  save(progress)
}

export function isCourseCompleted(courseId: string, totalLessons: number): boolean {
  const cp = getCourseProgress(courseId)
  if (!cp) return false
  return cp.completedLessons.length >= totalLessons
}

// ── Domain preference ──

export function setLastDomain(domain: Domain | 'all') {
  const progress = getProgress()
  progress.lastDomain = domain
  save(progress)
}

export function getLastDomain(): Domain | 'all' {
  return getProgress().lastDomain
}

// ── Stats ──

export function getStats() {
  const progress = getProgress()
  const courses = Object.values(progress.courses)
  const totalLessons = courses.reduce((sum, c) => sum + c.completedLessons.length, 0)
  const totalQuizzes = courses.reduce((sum, c) => sum + Object.keys(c.quizResults).length, 0)
  const correctQuizzes = courses.reduce((sum, c) => sum + Object.values(c.quizResults).filter(Boolean).length, 0)

  return {
    streak: progress.streak,
    coursesStarted: courses.length,
    coursesCompleted: courses.filter(c => c.completedAt).length,
    lessonsCompleted: totalLessons,
    quizAccuracy: totalQuizzes > 0 ? Math.round((correctQuizzes / totalQuizzes) * 100) : 0,
  }
}
