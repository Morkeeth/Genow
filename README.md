# Genow

Micro-learning app for art, wine, and culture. Pick a course, learn through interactive lessons, test yourself with quizzes, track your progress.

## Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS 4
- Framer Motion

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Structure

```
app/
  page.tsx                    # Home — course picker with domain tabs
  course/[id]/page.tsx        # Lesson flow — read, quiz, progress
  components/
    CourseCard.tsx             # Course preview card
    DomainTabs.tsx            # Art / Wine / Culture filter
    LessonFlow.tsx            # Interactive lesson + quiz engine
  lib/
    data.ts                   # Course content (6 courses, 21 lessons)
    storage.ts                # localStorage progress tracking
    types.ts                  # TypeScript types
```

## Domains

- **Art** — Impressionism, iconic paintings, art history
- **Wine** — Grape varieties, tasting techniques, regions
- **Culture** — Design movements, social intelligence, philosophy
