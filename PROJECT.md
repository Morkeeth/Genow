# Genow — Made by Humans

## What This Is

Genow is a premium editorial micro-learning platform celebrating human craft in the age of AI. Art, wine, design, architecture — the things worth knowing are made by hand.

The thesis: we'll be able to synthesize the perfect wine, generate any image, engineer any flavor. But the craft, the authenticity, the scarcity — that's the real story. Made by Humans.

## The Experience

One long editorial homepage (inspired by [thewayofcode.com](https://www.thewayofcode.com/)) with interactive courses woven in. Not a course library — a story you scroll through, with rabbit holes you can dive into.

### Core Loop

1. **Discover your taste** — 7-question visual quiz. Pick between Monet and Matisse, light Burgundy and bold Napa. Get a taste archetype (The Connoisseur, The Modernist, The Radical, etc.) with spectrum scores across three axes.

2. **Learn through courses** — Each lesson: editorial content → image comparison (pick A or B, get an insight) → quiz → result. Every interaction surfaces your taste. Lessons read like magazine features, not textbooks.

3. **Build your stable** — Your personal collection of favorites. The things you love: white tulips, light Burgundy, Matisse's Red Studio, an alpaca coat. Everyone should know their favorites.

### Domains

| Domain | Courses | What It Covers |
|--------|---------|----------------|
| **Art** | Impressionism 101, Iconic Paintings, How Color Works, Photography as Art | Movements, masterworks, color science, decisive moments |
| **Wine** | Red Grapes, White Grapes, How to Taste, Wine Regions | Grape varieties, tasting technique, terroir, natural wine |
| **Culture** | Design Principles, Social Intelligence, Architecture, Art of the Table | Bauhaus to wabi-sabi, conversation, hosting, coffee & bread |

### Current Numbers

- 12 courses, 46 lessons across 3 domains
- Every lesson has a quiz AND an image A/B comparison (46 each)
- 8 key art images self-hosted for fast loading
- 7 taste archetypes
- 6 stable categories (art, wine, design, style, nature, place)
- macOS desktop metaphor for stable (folders, dock, windows)

## Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS 4 |
| Animation | Framer Motion |
| Fonts | Playfair Display (serif) + Inter (sans) |
| Persistence | localStorage (Supabase planned) |
| Images | Wikimedia Commons (public domain art), Unsplash (wine/culture) |
| Hosting | Vercel (planned) |

## File Structure

```
app/
  page.tsx                          # Editorial homepage — one long scroll
  stable/page.tsx                   # Personal collection page
  course/[id]/page.tsx              # Course wrapper (loads LessonFlow)
  components/
    LessonFlow.tsx                  # Lesson engine: content → comparison → quiz → result → complete
    TasteQuiz.tsx                   # 7-question taste discovery quiz
    CourseCard.tsx                   # Course preview card with progress
    DomainTabs.tsx                  # Art / Wine / Culture filter with animated pill
    ScrollReveal.tsx                # Scroll-triggered fade+slide animation
  lib/
    data.ts                         # All course content (courses, lessons, quizzes, comparisons)
    storage.ts                      # localStorage: progress, streaks, taste profile, stable
    tasteQuiz.ts                    # Quiz questions, profile computation, archetype mapping
    types.ts                        # All TypeScript interfaces
  styles/
    globals.css                     # Tailwind config, fonts, scrollbar styles
```

## Design Principles

- **Editorial, not educational** — reads like a magazine, not a textbook
- **Taste over knowledge** — every interaction reveals something about the user
- **Black canvas** — dark theme, high contrast, images do the talking
- **Handcrafted feel** — the app itself should feel Made by Humans
- **No pretension** — wine doesn't need snobbery, art doesn't need jargon
- **Interactions, not lectures** — comparisons, quizzes, personal collection > passive reading
