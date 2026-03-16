# Genow — BMAD Build Plan

**Date:** March 16, 2026
**Goal:** Ship a production-grade micro-learning app for art, wine, and general knowledge

---

## B — Business

### What is Genow?

A **micro-learning app** that makes you more cultured, one swipe at a time.
Three domains: **Art**, **Wine**, **Elegance** (etiquette, history, design, philosophy).

The core loop: **Discover → Learn → Save → Return**

Think: Duolingo meets Pinterest meets a museum — beautiful, addictive, and you actually learn something.

### Why it works

- **Micro-learning is proven** — Duolingo proved people will learn in 2-minute sessions
- **Culture is aspirational** — people *want* to know about art and wine, they just don't know where to start
- **Visual-first beats text-first** — show a Rothko, then tell the story. Not the other way around
- **No existing app does this well** — wine apps are databases, art apps are encyclopedias. Nobody makes it *feel* beautiful

### Revenue model (future, not now)

- Free tier: 5 cards/day across all domains
- Premium: unlimited access, personal collections, offline mode
- No ads. Ever. The aesthetic IS the product.

### Success = ship v1 with

- [ ] 50+ art cards with real images and stories
- [ ] 30+ wine cards (regions, grapes, tasting, pairing)
- [ ] 20+ elegance cards (etiquette, design principles, cultural knowledge)
- [ ] Persistent user progress (saved items, seen items)
- [ ] Deployed and shareable URL

---

## M — Market & Content Strategy

### Domain 1: Art 🎨

**Content types:**
- Artwork cards (painting + story + insight)
- Artist spotlights (life, style, why they matter)
- Movement overviews (Impressionism, Cubism, etc.)
- "Did you know?" micro-facts

**Image sources:**
- Met Museum API (public domain, free, high-quality)
- Art Institute of Chicago API (public domain, free)
- Unsplash (supplementary, photographer credit required)

**Sample cards:**
- "The Red Studio — Matisse painted everything red. Why? Because color IS emotion."
- "Starry Night — Van Gogh painted this from an asylum window. The swirls aren't chaos — they're turbulent fluid dynamics."

### Domain 2: Wine 🍷

**Content types:**
- Grape variety cards (Pinot Noir, Cabernet, Riesling...)
- Region spotlights (Burgundy, Napa, Barossa...)
- Tasting vocabulary (what "minerality" actually means)
- Food pairing guides
- Wine history moments

**Image sources:**
- Unsplash (excellent wine/vineyard photography, free with credit)
- AI-generated (DALL-E for stylized illustrations)

**Sample cards:**
- "Pinot Noir — The heartbreak grape. Thin-skinned, impossible to grow, and when it's right, it's transcendent."
- "Burgundy vs Bordeaux — One worships the grape. The other worships the blend."

### Domain 3: Elegance & General Knowledge 🎩

**Content types:**
- Design principles (Dieter Rams, less is more)
- Cultural etiquette (dining, travel, conversation)
- Architecture highlights (buildings that changed everything)
- Philosophy bites (Stoicism, Wabi-sabi, Hygge)
- Style & fashion history

**Image sources:**
- Unsplash (architecture, design, fashion)
- AI-generated for abstract concepts

**Sample cards:**
- "Wabi-sabi — The Japanese art of finding beauty in imperfection. That cracked teacup isn't broken — it's complete."
- "The 10 Commandments of Dieter Rams — 'Good design is as little design as possible.'"

---

## A — Architecture

### Current state (what exists)

```
Next.js 14 → Art-only carousel → Hardcoded data → localStorage → No DB → No deployment
```

### Target state

```
Next.js 14 → Multi-domain card experience → Supabase DB → Real images → Vercel → Production
```

### Tech decisions

| Decision | Choice | Why |
|----------|--------|-----|
| **Database** | Supabase (PostgreSQL) | Oscar already uses it for Loop, free tier is generous, auth built-in if needed later |
| **ORM** | Supabase JS client (no Prisma) | Simpler, fewer deps, Oscar knows it |
| **Images** | Unsplash API + Met Museum API + static fallbacks | Free, high-quality, covers all domains |
| **LLM** | OpenAI GPT-4o (upgrade from gpt-4-turbo) | For generating card content in bulk, not at runtime |
| **Content strategy** | Pre-generate & seed DB, not generate on-the-fly | Faster UX, no API costs per user, quality control |
| **Deployment** | Vercel | Obvious for Next.js, Oscar's comfort zone |
| **Auth** | None for v1 | Ship fast. Add Supabase Auth in v2 if needed |
| **State** | URL + Zustand (already installed) + Supabase | URL for navigation, Zustand for UI state, Supabase for persistence |
| **Animations** | Framer Motion (already installed) | Keep it, it's great |

### Database schema

```sql
-- Core content
CREATE TABLE cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  domain TEXT NOT NULL CHECK (domain IN ('art', 'wine', 'elegance')),
  category TEXT NOT NULL,          -- e.g. 'artwork', 'grape', 'design-principle'
  title TEXT NOT NULL,
  subtitle TEXT,                    -- artist name, region, author
  year TEXT,                        -- "1911", "19th century", null
  image_url TEXT NOT NULL,
  image_credit TEXT,                -- photographer/source attribution
  story TEXT NOT NULL,              -- the main learning content (markdown)
  insight TEXT,                     -- one-liner "did you know" hook
  tags TEXT[] DEFAULT '{}',
  metadata JSONB DEFAULT '{}',     -- flexible: { medium, dimensions, grape_type, abv, etc. }
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- User progress (anonymous for v1, keyed by device fingerprint or local ID)
CREATE TABLE user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id TEXT NOT NULL,          -- generated client-side, stored in localStorage
  card_id UUID REFERENCES cards(id),
  action TEXT NOT NULL CHECK (action IN ('seen', 'saved', 'dismissed')),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(device_id, card_id, action)
);

-- Collections (curated sequences of cards)
CREATE TABLE collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  domain TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  slug TEXT UNIQUE NOT NULL,
  card_ids UUID[] DEFAULT '{}',
  cover_image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX idx_cards_domain ON cards(domain);
CREATE INDEX idx_cards_category ON cards(domain, category);
CREATE INDEX idx_progress_device ON user_progress(device_id);
CREATE INDEX idx_progress_card ON user_progress(card_id);
```

### Project structure (target)

```
Genow/
├── app/
│   ├── page.tsx                    # Landing → domain picker or daily feed
│   ├── layout.tsx                  # Root layout, fonts, global styles
│   ├── [domain]/                   # /art, /wine, /elegance
│   │   ├── page.tsx                # Domain feed (swipeable cards)
│   │   └── [id]/page.tsx           # Single card deep view (story)
│   ├── saved/page.tsx              # Saved cards grid
│   ├── collections/
│   │   └── [slug]/page.tsx         # Curated collection view
│   └── api/
│       ├── cards/route.ts          # GET cards (with filters)
│       ├── progress/route.ts       # POST save/seen/dismiss
│       └── seed/route.ts           # DEV ONLY: seed database
├── components/
│   ├── CardCarousel.tsx            # Swipeable card stack (core UX)
│   ├── CardStory.tsx               # Full story view
│   ├── DomainPicker.tsx            # Art / Wine / Elegance selector
│   ├── SaveButton.tsx              # Heart/bookmark action
│   ├── CardGrid.tsx                # Grid layout for saved/collections
│   └── ui/                         # Shared: transitions, backgrounds, text
├── lib/
│   ├── supabase.ts                 # Supabase client
│   ├── cards.ts                    # Card fetching & filtering
│   ├── progress.ts                 # User progress tracking
│   ├── images.ts                   # Unsplash/Met Museum helpers
│   └── seed/                       # Content seed scripts
│       ├── art.ts                  # 50+ art cards
│       ├── wine.ts                 # 30+ wine cards
│       └── elegance.ts             # 20+ elegance cards
├── types/
│   └── index.ts                    # Card, Collection, Progress types
├── supabase/
│   └── migrations/                 # SQL migrations
│       └── 001_initial.sql
└── scripts/
    └── seed.ts                     # Run with: npx tsx scripts/seed.ts
```

---

## D — Design

### Core UX: The Card Stack

The app revolves around ONE interaction: **swipe through beautiful cards**.

```
┌─────────────────────────┐
│                         │
│                         │
│      [Full-screen       │
│       Image]            │
│                         │
│                         │
├─────────────────────────┤
│  Title                  │
│  Subtitle · Year        │
│                         │
│  "One-liner insight     │
│   that hooks you..."    │
│                         │
│              ♡  →       │
└─────────────────────────┘
     ← swipe / tap →
```

- **Tap card** → Full story view (image stays, text scrolls below)
- **Swipe left** → Next card
- **Swipe right** → Previous card
- **Heart** → Save to collection
- **Domain tabs** at top: 🎨 Art · 🍷 Wine · 🎩 Elegance

### Visual identity

- **Dark background** (museum/wine-cellar feel)
- **Serif headlines** (Playfair Display — already in use)
- **Sans-serif body** (Inter or system font for readability)
- **High-quality photography** that fills the viewport
- **Generous whitespace** — content breathes
- **Subtle animations** — fade-ins, parallax on scroll, card transitions
- **No clutter** — no nav bars, no sidebars, no badges

### Color by domain

| Domain | Accent | Vibe |
|--------|--------|------|
| Art | Warm red/ochre `#c23b22` | Museum gallery |
| Wine | Deep burgundy `#722F37` | Wine cellar |
| Elegance | Gold/cream `#C5A55A` | Luxury, refinement |

### Animations (Framer Motion)

- **Card enter**: slide up + fade in (0.4s ease-out)
- **Card exit**: slide left + fade out (0.3s ease-out)
- **Story reveal**: text paragraphs stagger in on scroll
- **Save**: heart scales up 1.2x → back to 1x with color fill
- **Domain switch**: crossfade with slight zoom
- **Page transitions**: shared layout animations on card → story

### Mobile-first

- Cards are full-viewport on mobile
- Swipe gestures are primary navigation
- Desktop gets subtle hover states and keyboard nav (arrows, space)
- No hamburger menus. Tabs at top or bottom, that's it.

---

## Sprint Plan

### Sprint 0: Foundation (TODAY)

**Goal:** Database + new data model + gut the old code

- [ ] Set up Supabase project (or reuse existing if appropriate)
- [ ] Create `cards`, `user_progress`, `collections` tables
- [ ] Replace old types with new `Card` type (domain-aware)
- [ ] Set up Supabase client in `lib/supabase.ts`
- [ ] Remove old hardcoded data files
- [ ] Remove unused pages (courses, epochs, explore, preferences)
- [ ] Create seed script with 10 cards (mix of art/wine/elegance)
- [ ] Verify: cards load from Supabase → render in carousel

### Sprint 1: Core Experience (3-5 days)

**Goal:** The main loop works end-to-end

- [ ] **CardCarousel component** — swipeable card stack pulling from Supabase
- [ ] **Domain tabs** — filter by art/wine/elegance
- [ ] **Card story view** — tap card → full story with image + scrollable text
- [ ] **Save action** — heart button persists to `user_progress` table
- [ ] **Saved page** — grid of saved cards
- [ ] **Real images** — Unsplash integration for wine/elegance, Met Museum for art
- [ ] **Device ID** — generate anonymous ID, store in localStorage

### Sprint 2: Content & Polish (3-5 days)

**Goal:** Enough content to be interesting, polished enough to share

- [ ] **Seed 100+ cards** using GPT-4o batch generation
  - 50 art cards (with Met Museum image URLs)
  - 30 wine cards (with Unsplash URLs)
  - 20 elegance cards (with Unsplash URLs)
- [ ] **Collections** — curated sequences ("Introduction to Impressionism", "Red Wines 101")
- [ ] **Animations polish** — card transitions, scroll reveals, save feedback
- [ ] **Loading states** — skeleton cards while fetching
- [ ] **Empty states** — "You haven't saved anything yet"
- [ ] **Image optimization** — Next.js Image with blur placeholders
- [ ] **Typography & spacing** — final pass on readability

### Sprint 3: Ship It (2-3 days)

**Goal:** Live on the internet, shareable URL

- [ ] **Deploy to Vercel** — connect GitHub repo
- [ ] **Environment variables** — Supabase URL/key in Vercel
- [ ] **Domain** — set up genow.xyz or similar (or subdomain)
- [ ] **OG tags** — social sharing cards (title, image, description)
- [ ] **PWA basics** — manifest.json, app icon, "Add to Home Screen"
- [ ] **Analytics** — Plausible or Vercel Analytics (lightweight, privacy-friendly)
- [ ] **Performance audit** — Lighthouse > 90 on all scores
- [ ] **README update** — clean, professional, with screenshots

### Future (v2, not now)

- User auth (Supabase Auth) → sync across devices
- Daily digest — push notification with 3 new cards
- Spaced repetition — resurface cards you saved but haven't reviewed
- Quiz mode — test yourself on what you've learned
- Social sharing — share a card as a beautiful image
- Admin panel — add/edit cards without code
- AI personalization — learn what the user likes, surface similar content

---

## Key Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Image licensing issues | Legal | Use only public domain (Met Museum) and Unsplash (free with credit) |
| Content quality from LLM | Bad UX | Pre-generate, human-review, then seed. Not runtime generation |
| Scope creep | Never ships | This plan is the scope. Nothing else until v1 is live |
| OpenAI costs for content gen | $$ | One-time batch generation (~$5-10), not per-user |
| Supabase free tier limits | Scaling | 500MB DB, 1GB storage, 50k monthly active users — plenty for v1 |

---

## Definition of Done (v1)

- [ ] App loads fast (< 2s) on mobile
- [ ] 100+ cards across 3 domains with real images
- [ ] Swipe through cards feels smooth and delightful
- [ ] Tap to read full story works
- [ ] Save cards persists across sessions
- [ ] Deployed on Vercel with a real URL
- [ ] Looks good enough to screenshot and share
- [ ] Oscar would show it to a friend and say "I built this"
