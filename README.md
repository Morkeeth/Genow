# Genow — Made by Humans

**Genow is an editorial micro-learning site for art, wine and culture: find your taste, learn in short interactive lessons, and keep a collection of favourites.**

- Problem: not a course library, but one long scrolling story with lessons woven in.
- For: people who want to know what they like in art, wine, design and style, and why.
- What is built: a 7-question taste quiz with archetypes, 9 courses and 31 lessons with image comparisons and quizzes, a personal "Stable" of favourites, and streaks and progress saved in localStorage.
- Try it: [genow-one.vercel.app](https://genow-one.vercel.app) or `npm install && npm run dev`. Built December 2025 to March 2026.


Premium editorial micro-learning for art, wine, and culture. Discover your taste, learn through interactive courses, build your personal collection of favorites.

**[PROJECT.md](PROJECT.md)** — What this is, how it works, design principles
**[ROADMAP.md](ROADMAP.md)** — Everything needed to take this to production

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Stack

Next.js 14 · TypeScript · Tailwind CSS 4 · Framer Motion · Playfair Display + Inter

## What's Built

- Editorial homepage (one long scroll, dark theme)
- 7-question taste discovery quiz → archetype + spectrum scores
- 9 courses, 31 lessons with quizzes and image comparisons
- Interactive lesson engine: content → comparison → quiz → result
- Personal "Stable" — collect your favorites across art, wine, design, style, nature, place
- Streak tracking, course progress, all persisted in localStorage
