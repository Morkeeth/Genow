# Genow PRD: The Minimal Art Learning Experience

## The Core Problem

**Current State:** Feels like a course platform. Too many buttons, cards, modals, tags. Art is small, buried, secondary.

**Desired State:** That "WOW" moment when art hits you. Like standing in front of a painting in a museum. Pure, focused, emotional.

---

## The Vision

**One artwork. One moment. One insight.**

Think: **The New Yorker meets museum gallery meets poetry reading.**

---

## Core Principles

### 1. **Art First, Always**
- Artwork takes 70-80% of viewport
- Full-screen, high-quality images
- No UI chrome competing for attention
- Minimal metadata (artist, year, title only)

### 2. **Progressive Revelation**
- One thing at a time
- Scroll = discovery
- No modals, no popups, no cards
- Text reveals as you scroll
- Like reading a beautiful essay

### 3. **Minimal UI**
- No buttons unless absolutely necessary
- No tags, badges, or labels
- No "View Artwork" buttons
- No connection graphs (hide complexity)
- Just: artwork + text + subtle navigation

### 4. **The Gift Shop Moment**
- One action: "This resonates" (heart icon, bottom right)
- That's it. No ratings, no notes, no complexity
- Save what moves you, like buying a postcard

### 5. **Typography as Art**
- Large, beautiful serif fonts
- Generous whitespace
- Text feels like poetry, not course material
- Readable, contemplative, slow

---

## The Experience Flow

### **Homepage: The Gallery**
- Full-screen artwork carousel
- One artwork at a time, swipe/arrow to navigate
- Minimal text overlay: artist name, title, year
- Bottom: subtle "Explore" or "Start" prompt
- No navigation menu, no buttons, no clutter

### **Course/Story: The Journey**
- Full-screen artwork (70% of viewport)
- Text flows below (30% of viewport)
- Scroll down = next artwork + next insight
- No "lessons", no "deep dives", no buttons
- Just: artwork → insight → artwork → insight
- Like a visual essay

### **Navigation: Invisible**
- Swipe left/right = next artwork
- Scroll down = more content
- Back button = return
- That's it. No menus, no tabs, no navigation bars

---

## What We Remove

❌ **Remove:**
- All buttons (except "This resonates")
- All cards and containers
- All modals and popups
- All tags and badges
- Connection graphs
- "Deep dives" sections
- "View Artwork" buttons
- Navigation menus
- Course generation forms (move to separate admin)
- Preference pages (just show saved items)
- Epoch pages (integrate into stories)
- Explore page (homepage IS explore)

✅ **Keep:**
- Full-screen artwork display
- Beautiful typography
- Poetic text content
- One "This resonates" action
- Simple scroll/swipe navigation

---

## The New Structure

### **Single Page App Flow:**

1. **Homepage** = Full-screen artwork carousel
   - Swipe through artworks
   - Tap to enter story/course
   - Heart icon to save

2. **Story View** = Full-screen artwork + scrollable text
   - Artwork stays fixed (70% viewport)
   - Text scrolls below (30% viewport)
   - Scroll reveals next artwork + next insight
   - Like Medium article meets museum

3. **Saved** = Simple list of saved artworks
   - Just images in a grid
   - Tap to view full-screen
   - That's it

---

## Design Language

### **Typography:**
- Headlines: 48-72px serif (Playfair Display)
- Body: 20-24px serif, generous line-height (1.8-2.0)
- Minimal: 14px sans-serif for metadata only

### **Spacing:**
- Massive whitespace
- 80-120px margins
- Content max-width: 600-700px (text only)

### **Colors:**
- White/black background
- Artwork colors only
- No UI colors competing

### **Interactions:**
- Smooth scroll
- Fade transitions
- No hover states (mobile-first)
- Swipe gestures

---

## The "WOW" Moments

### **Moment 1: First Load**
- Full-screen artwork fills viewport
- No UI, no chrome, just art
- Text fades in after 2 seconds
- "This resonates" appears subtly

### **Moment 2: Scroll Discovery**
- Artwork stays fixed
- Text scrolls smoothly
- Next artwork fades in as you scroll
- Seamless transition

### **Moment 3: The Insight**
- Beautiful typography
- Poetic, philosophical text
- One insight per artwork
- No clutter, just meaning

### **Moment 4: The Save**
- Heart icon pulses gently
- Save = subtle animation
- No confirmation, no popup
- Just: saved, move on

---

## Technical Approach

### **Layout:**
- CSS Grid: `grid-template-rows: 70vh 30vh`
- Top: artwork (fixed/sticky)
- Bottom: text (scrollable)
- Full viewport, no padding

### **Navigation:**
- URL-based routing (Next.js)
- `/artwork/[id]` = single artwork
- `/story/[slug]` = story flow
- Browser back/forward = navigation

### **State:**
- Minimal state management
- URL = source of truth
- LocalStorage for saved items only

---

## Success Metrics

### **The "WOW" Test:**
- Does it feel like a museum?
- Does the art dominate?
- Can you lose yourself in it?
- Does it feel minimal and focused?

### **User Actions:**
- Time spent viewing artwork (target: 2+ min per artwork)
- Scroll depth (target: 80%+ read)
- Save rate (target: 30%+ of viewed artworks)
- Return rate (target: 50%+ return within week)

---

## Implementation Phases

### **Phase 1: Minimal Homepage** (Week 1)
- Full-screen artwork carousel
- Remove all navigation
- Remove all buttons
- Just: artwork + swipe

### **Phase 2: Story View** (Week 1-2)
- Full-screen artwork + scrollable text
- Remove all cards, modals, buttons
- Just: artwork + text + scroll

### **Phase 3: Save Action** (Week 2)
- Heart icon (bottom right)
- Save to localStorage
- Simple saved view

### **Phase 4: Polish** (Week 3)
- Typography refinement
- Spacing refinement
- Smooth animations
- Mobile optimization

---

## Questions to Answer

1. **How do users discover new artworks?**
   - Homepage carousel? Search? Recommendations?

2. **How do stories/courses work?**
   - One story = one scrollable page?
   - Multiple artworks in sequence?
   - How do you navigate between stories?

3. **What about the "gift shop" metaphor?**
   - Is saved = postcard collection?
   - How do you view saved items?

4. **How minimal is too minimal?**
   - Do we need any navigation?
   - How do you get back home?

---

## The North Star

**"If you showed this to someone in a museum, would they say 'I want to learn art this way'?"**

If yes → We're on track.  
If no → Too much UI, not enough art.

---

**Next Steps:**
1. Build Phase 1: Minimal homepage
2. Test with users
3. Iterate based on "WOW" factor
4. Build Phase 2: Story view
5. Repeat

