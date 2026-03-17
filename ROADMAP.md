# Roadmap to Production

## Phase 1: Content & Polish ← IN PROGRESS

### Content Expansion
- [x] Add comparisons to all lessons — every lesson has an A/B interaction (46 total)
- [x] Flesh out thin courses: How to Taste Wine (3→4), Social Intelligence (2→4), White Grapes (3→4)
- [x] New course: **Photography as Art** (art) — Cartier-Bresson, Ansel Adams, Cindy Sherman, phone vs camera
- [x] New course: **Wine Regions That Matter** (wine) — Burgundy, Bordeaux, New World, Natural Wine
- [x] New course: **The Art of the Table** (culture) — setting tables, hosting, coffee & tea, bread
- [x] ~~Target: 12 courses, ~47 lessons~~ **Done: 12 courses, 46 lessons, all with comparisons and quizzes**

### Stable Page — macOS Desktop Metaphor
- [x] Folder icons per category with thumbnail previews
- [x] macOS-style window chrome (red/yellow/green dots, title bar)
- [x] Click folder → opens window with file icon grid inside
- [x] Dock at bottom with quick-access to folders + add + home
- [x] Taste profile popover in top bar with spectrum bars + stats
- [x] Suggested additions from completed courses
- [x] Double-click file icons for info popover (title, note, date added)
- [x] Empty state with ghost folders
- [ ] Actual drag-and-drop to reorder items within folders
- [ ] Drag items between folders to recategorize
- [ ] Desktop wallpaper that changes based on taste archetype

### Performance & Images
- [x] Next.js image optimization config (avif/webp, specific domains, device sizes)
- [x] Self-hosted 8 key art masterworks in /public/images (Monet, Van Gogh, Hopper, Hokusai, Renoir, Vermeer, Klimt, Monet Sunrise)
- [x] Images resized to max 1200px for fast loading
- [ ] Self-host remaining Wikimedia images (Guernica, Degas, Matisse, Pantheon — blocked by Wikimedia CDN)
- [ ] Replace Unsplash URLs with self-hosted versions for wine/culture
- [ ] Add blur placeholder data URLs for key images
- [ ] Lazy load off-screen course sections on homepage
- [ ] Color-gradient fallbacks already exist via onError handlers

---

## Phase 2: Deploy & Auth ← NEXT

### Vercel Deployment
- [ ] Deploy to Vercel
- [ ] Custom domain (genow.app or similar)
- [ ] OG images for sharing — auto-generated taste card as OG image
- [ ] Analytics (Vercel Analytics or Plausible)

### Supabase Integration
- [ ] Set up Supabase project
- [ ] Auth: email/password + Google OAuth
- [ ] Migrate localStorage schema to Supabase tables:
  - `users` (id, email, created_at)
  - `taste_profiles` (user_id, classic_vs_modern, subtle_vs_bold, minimalist_vs_expressive, archetype)
  - `course_progress` (user_id, course_id, current_lesson, completed_lessons[], quiz_results{})
  - `stable_items` (user_id, category, title, subtitle, image_url, note, from_course)
  - `streaks` (user_id, current_streak, last_active_date)
- [ ] Offline-first: keep localStorage as cache, sync to Supabase when online
- [ ] Migration path: import existing localStorage data on first login

---

## Phase 3: Engagement & Growth

### Make It Sticky
- [ ] Course recommendations based on taste profile — "Courses for The Connoisseur"
- [ ] Daily streak notifications (push or email)
- [ ] "Lesson of the day" — surface one lesson on homepage, rotating
- [ ] Achievement badges (First course, 7-day streak, All art courses, etc.)
- [ ] Retake taste quiz — see how your profile evolves

### Social & Sharing
- [ ] Shareable taste profile URL (/taste/[user-id])
- [ ] OG card auto-generated per archetype
- [ ] "Compare tastes" — see how your profile differs from a friend's
- [ ] Shareable course completion cards

### Richer Interactions
- [ ] Drag-to-rank: order 4 wines from lightest to boldest
- [ ] Timeline ordering: put paintings in chronological order
- [ ] Zoom into paintings — high-res detail exploration
- [ ] Audio narration option for lessons

---

## Phase 4: Scale Content

### New Domains
- [ ] **Literature** — poetry, novels, essays. "Books That Changed Thinking"
- [ ] **Philosophy** — stoicism, existentialism, eastern philosophy
- [ ] **Music** — classical, jazz, how to listen. "What Makes a Song"
- [ ] **Film** — cinematography, directors, visual storytelling
- [ ] **Food** — ingredients, techniques, flavor science

### Content Pipeline
- [ ] CMS or admin panel for adding courses without code changes
- [ ] Contributor model — expert writers per domain
- [ ] AI-assisted lesson drafting with human editorial review
- [ ] User-submitted stable items with community voting

### Personalization
- [ ] AI-generated lesson recommendations based on stable + quiz history
- [ ] Adaptive difficulty — harder quizzes for users who ace everything
- [ ] Personal "taste evolution" timeline — how your profile changed over courses

---

## Phase 5: Platform

### Mobile
- [ ] PWA optimization (manifest, service worker, offline support)
- [ ] Or: React Native / Capacitor wrapper for App Store
- [ ] Haptic feedback on quiz answers and comparisons
- [ ] Swipe gestures for lesson navigation

### Monetization (if applicable)
- [ ] Freemium: 3 courses free, rest behind subscription
- [ ] Or: all content free, premium taste analytics + social features
- [ ] Gift subscriptions ("Give the gift of taste")
- [ ] Partner with wineries / galleries / publishers for sponsored courses

### Infrastructure
- [ ] Split data.ts into per-domain files (data/art.ts, data/wine.ts, etc.)
- [ ] Move content to database/CMS for dynamic loading
- [ ] Image CDN with responsive sizes
- [ ] Rate limiting and abuse protection on API routes
- [ ] Error monitoring (Sentry)
- [ ] E2E tests (Playwright) for critical flows: quiz → course → stable

---

## Priority Order

| Priority | What | Status |
|----------|------|--------|
| **P0** | Content expansion — 12 courses, 46 lessons, all with comparisons | ✅ Done |
| **P0** | Stable as macOS desktop | ✅ Done (folders, dock, windows) |
| **P0** | Self-host critical images | ✅ Done (8 masterworks in /public) |
| **P0** | Deploy to Vercel | **Next up** |
| **P1** | Supabase auth + persistence | After deploy |
| **P2** | Sharing + OG cards | After auth |
| **P2** | Streaks + daily lesson | After auth |
| **P3** | New domains + richer interactions | Scale phase |
| **P4** | Mobile app + monetization | After product-market fit |
