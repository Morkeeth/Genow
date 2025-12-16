# Genow - Art Appreciation App
## Build Plan & Current Status

**Last Updated:** November 2024  
**Status:** 🟡 In Development - Core Features Implemented, Needs Polish & Completion

---

## 🎯 Project Overview

**Genow** is an art appreciation application that helps users discover their personal resonance with art through:
- LLM-generated courses with poetic, philosophical narratives
- Interactive epoch exploration with timelines
- Artwork connection visualization
- Personal preference tracking (like choosing postcards in a museum gift shop)
- Beautiful animated UI with floating elements

**Philosophy:** *"We go into the museum and expect to like everything—an overwhelming feeling. But we truly understand in the gift shop when we buy a postcard what we truly like."*

---

## ✅ Current Status

### **What's Working:**

1. **Core Infrastructure** ✅
   - Next.js 14 App Router setup
   - TypeScript configuration
   - Tailwind CSS v4 (recently fixed)
   - Framer Motion animations
   - Basic routing structure

2. **Pages Implemented** ✅
   - `/` - Homepage with animated background and navigation
   - `/courses` - Course generation interface
   - `/courses/[slug]` - Dynamic course viewer (basic)
   - `/epochs` - Epoch timeline and exploration
   - `/explore` - Artwork browsing with connections
   - `/preferences` - User preference management

3. **Components Built** ✅
   - `AnimatedBackground` - Floating colored circles
   - `CourseViewer` - Course display with lessons
   - `EpochTimeline` - Timeline visualization
   - `EpochCard` - Epoch information cards
   - `ArtworkCard` - Artwork display cards
   - `ArtworkDetail` - Artwork detail modal
   - `ConnectionGraph` - Artwork connection visualization
   - `LessonCard` - Lesson display
   - `FloatingArtwork` - Animated artwork cards
   - `PreferenceButton` - Save artwork preference

4. **Backend/API** ✅
   - `/api/courses/generate` - Course generation endpoint
   - `/api/courses/[id]` - Course retrieval (basic)
   - `/api/preferences` - Preference management (basic)

5. **Data & Storage** ✅
   - Epoch data (`app/lib/art/epochs.ts`)
   - Sample artworks & connections (`app/lib/art/connections.ts`)
   - LocalStorage preference system (`app/lib/preferences/storage.ts`)
   - LLM integration with OpenAI (`app/lib/llm/courseGenerator.ts`)

6. **Styling** ✅
   - Global CSS with poetic text styling
   - Dark mode support
   - Custom animations
   - Responsive design

---

## 🚧 What Needs Work

### **Critical Issues:**

1. **Tailwind CSS v4 Migration** ⚠️
   - ✅ Fixed PostCSS configuration
   - ✅ Updated CSS imports
   - ⚠️ May need further testing/compatibility fixes
   - Consider: Downgrade to Tailwind v3 for stability if issues persist

2. **Missing Environment Setup** ⚠️
   - No `.env.local` file (required for OpenAI API)
   - Need to document API key setup

3. **Course Persistence** ❌
   - Courses are generated but not saved to database
   - No course retrieval by slug (only hardcoded Matisse course)
   - Need database integration (PostgreSQL/SQLite/Prisma)

4. **Image Handling** ❌
   - Artwork images are URLs/descriptions, not actual images
   - Need image optimization with Next.js Image component
   - Consider: Integration with art API (Met Museum, Rijksmuseum, etc.)

### **Feature Gaps:**

1. **Course Management** 🔴
   - [ ] Course storage in database
   - [ ] Course listing with search/filter
   - [ ] Course favorites/bookmarks
   - [ ] Course progress tracking
   - [ ] Course sharing functionality

2. **Artwork System** 🟡
   - [ ] Real artwork images from APIs
   - [ ] Artwork search functionality
   - [ ] Artwork detail pages with high-res images
   - [ ] Artwork collections/curations
   - [ ] Artwork metadata enrichment

3. **Connection Graph** 🟡
   - [ ] Interactive connection visualization (D3.js/vis.js)
   - [ ] Connection strength visualization
   - [ ] Connection story generation
   - [ ] Connection filtering/search

4. **Preference System** 🟡
   - [ ] Enhanced recommendation algorithm
   - [ ] Preference-based course suggestions
   - [ ] Preference export/import
   - [ ] Preference analytics/insights

5. **User Experience** 🟡
   - [ ] Loading states for all async operations
   - [ ] Error handling and user feedback
   - [ ] Toast notifications
   - [ ] Skeleton loaders
   - [ ] Offline support (PWA)

6. **Epoch Features** 🟡
   - [ ] Epoch story caching
   - [ ] Epoch comparison view
   - [ ] Epoch artwork gallery
   - [ ] Epoch timeline interactions

7. **Search & Discovery** 🔴
   - [ ] Global search (artworks, artists, epochs, courses)
   - [ ] Filtering system
   - [ ] Sorting options
   - [ ] Advanced search with multiple criteria

8. **Social Features** 🔴 (Optional)
   - [ ] User accounts/authentication
   - [ ] Share courses/artworks
   - [ ] User collections/public galleries
   - [ ] Comments/discussions

---

## 📋 Build Plan - Phases

### **Phase 1: Foundation & Stability** (Week 1-2)
**Goal:** Make the app production-ready with core features working reliably

- [ ] **Database Setup**
  - Choose database (PostgreSQL recommended)
  - Set up Prisma ORM
  - Create schema for courses, artworks, preferences, users
  - Migration scripts

- [ ] **Course Persistence**
  - Save generated courses to database
  - Implement course retrieval by slug/ID
  - Course listing with pagination
  - Course update/delete functionality

- [ ] **Environment Configuration**
  - Create `.env.example` file
  - Document all required environment variables
  - Set up environment validation

- [ ] **Error Handling**
  - Global error boundary
  - API error handling
  - User-friendly error messages
  - Error logging (Sentry or similar)

- [ ] **Testing Setup**
  - Jest/React Testing Library
  - API route tests
  - Component tests
  - E2E tests (Playwright)

### **Phase 2: Artwork Enhancement** (Week 3-4)
**Goal:** Rich artwork experience with real images and metadata

- [ ] **Art API Integration**
  - Research and integrate art APIs:
    - Met Museum API
    - Rijksmuseum API
    - Europeana API
    - Art Institute of Chicago API
  - Image proxy/optimization service
  - Fallback for missing images

- [ ] **Artwork Detail Pages**
  - Full artwork detail view
  - High-resolution image viewer
  - Artwork metadata display
  - Related artworks section
  - Save to preferences from detail page

- [ ] **Image Optimization**
  - Next.js Image component integration
  - Lazy loading
  - Responsive images
  - Image caching strategy

- [ ] **Artwork Search**
  - Search by title, artist, epoch
  - Filter by date range, medium, location
  - Search result pagination
  - Search history

### **Phase 3: Enhanced Features** (Week 5-6)
**Goal:** Polish and enhance existing features

- [ ] **Connection Graph Enhancement**
  - Interactive D3.js visualization
  - Zoom/pan functionality
  - Connection strength visualization
  - Click to view connection stories
  - Filter connections by type

- [ ] **Course Improvements**
  - Course progress tracking
  - Lesson completion status
  - Course bookmarks/favorites
  - Course recommendations based on preferences
  - Course sharing (URL generation)

- [ ] **Preference System Enhancement**
  - Improved recommendation algorithm
  - Preference-based course suggestions
  - Preference insights/analytics
  - Export preferences as JSON
  - Import preferences

- [ ] **Epoch Enhancements**
  - Epoch story caching
  - Epoch comparison view
  - Epoch artwork galleries
  - Interactive timeline with zoom

### **Phase 4: User Experience** (Week 7-8)
**Goal:** Polish UI/UX and add quality-of-life features

- [ ] **Loading States**
  - Skeleton loaders for all pages
  - Progress indicators for course generation
  - Loading animations

- [ ] **Notifications**
  - Toast notification system
  - Success/error messages
  - Course generation completion notifications

- [ ] **Accessibility**
  - ARIA labels
  - Keyboard navigation
  - Screen reader support
  - Focus management
  - Color contrast checks

- [ ] **Performance**
  - Code splitting
  - Image optimization
  - API response caching
  - Bundle size optimization
  - Lighthouse score > 90

- [ ] **Mobile Experience**
  - Mobile-responsive design improvements
  - Touch gestures
  - Mobile-specific UI adjustments
  - PWA setup (optional)

### **Phase 5: Advanced Features** (Week 9-10)
**Goal:** Add advanced features and polish

- [ ] **Search & Discovery**
  - Global search functionality
  - Advanced search filters
  - Search suggestions/autocomplete
  - Search result ranking

- [ ] **Analytics & Insights**
  - User preference analytics
  - Most popular courses/artworks
  - Personal art journey visualization
  - Preference trends over time

- [ ] **Content Management**
  - Admin panel for course management
  - Content moderation
  - Featured courses/artworks
  - Content curation tools

- [ ] **Export & Sharing**
  - Export course as PDF
  - Share artwork collections
  - Generate shareable links
  - Social media integration

---

## 🛠️ Technical Debt & Improvements

### **Code Quality:**
- [ ] Add JSDoc comments to all functions
- [ ] Set up ESLint with strict rules
- [ ] Set up Prettier for code formatting
- [ ] Add TypeScript strict mode
- [ ] Refactor duplicate code
- [ ] Extract magic numbers to constants

### **Architecture:**
- [ ] Set up state management (Zustand store already installed, needs implementation)
- [ ] API response caching strategy
- [ ] Rate limiting for OpenAI API calls
- [ ] Request validation (Zod)
- [ ] API versioning

### **Security:**
- [ ] Input sanitization
- [ ] XSS protection
- [ ] CSRF protection
- [ ] API authentication (if adding user accounts)
- [ ] Environment variable security

### **Documentation:**
- [ ] API documentation (OpenAPI/Swagger)
- [ ] Component documentation (Storybook)
- [ ] User guide/documentation
- [ ] Developer setup guide
- [ ] Deployment guide

---

## 🚀 Deployment Checklist

### **Pre-Deployment:**
- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] Build succeeds without errors
- [ ] All tests passing
- [ ] Performance optimized
- [ ] Security audit completed
- [ ] Error tracking set up (Sentry)

### **Deployment:**
- [ ] Choose hosting platform (Vercel recommended for Next.js)
- [ ] Set up CI/CD pipeline
- [ ] Configure production database
- [ ] Set up CDN for images
- [ ] Configure domain and SSL
- [ ] Set up monitoring and alerts

### **Post-Deployment:**
- [ ] Smoke tests
- [ ] Monitor error rates
- [ ] Monitor performance metrics
- [ ] User feedback collection
- [ ] Analytics setup (Google Analytics/Plausible)

---

## 📊 Success Metrics

### **Technical Metrics:**
- Lighthouse Performance Score: > 90
- Lighthouse Accessibility Score: > 95
- API Response Time: < 500ms (p95)
- Page Load Time: < 2s
- Error Rate: < 0.1%

### **User Metrics:**
- Course Generation Success Rate: > 95%
- User Engagement: Average session duration > 5 minutes
- Preference Save Rate: > 30% of artworks viewed
- Course Completion Rate: > 40% of started courses

---

## 🎨 Design Improvements Needed

- [ ] Consistent spacing system
- [ ] Typography scale refinement
- [ ] Color palette expansion
- [ ] Icon system (Heroicons/Lucide)
- [ ] Loading state designs
- [ ] Empty state designs
- [ ] Error state designs
- [ ] Mobile navigation menu
- [ ] Dark mode polish

---

## 📝 Notes

### **Current Dependencies:**
- Next.js 14.2.33
- React 18.3.1
- TypeScript 5.9.3
- Tailwind CSS 4.1.17
- Framer Motion 12.23.24
- OpenAI 6.8.1
- Zustand 5.0.8

### **Recommended Additions:**
- Prisma (database ORM)
- Zod (validation)
- React Query (data fetching)
- D3.js or vis.js (connection graph)
- date-fns (date handling)
- React Hook Form (form handling)

### **API Considerations:**
- OpenAI API costs (monitor usage)
- Art API rate limits
- Image storage/CDN costs
- Database hosting costs

---

## 🎯 Immediate Next Steps

1. **Set up database** (PostgreSQL + Prisma)
2. **Create course persistence** (save/retrieve courses)
3. **Add environment variable documentation**
4. **Implement error handling**
5. **Add loading states**
6. **Integrate art API for real images**

---

**Status:** Ready for Phase 1 development  
**Priority:** Database setup → Course persistence → Art API integration

