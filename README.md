# Art Appreciation App

A general knowledge app for refined palates, featuring inspiring courses about art, epochs, and cultural figures. Discover your personal resonance with art through poetic writing and philosophical understanding.

## Features

- **LLM-Generated Courses**: Dynamic course generation using OpenAI API with poetic, philosophical narratives
- **Epoch Exploration**: Explore art epochs through interactive timelines and stories
- **Artwork Connections**: Visualize connections between artists and artworks (e.g., Matisse → Rothko)
- **Preference Tracking**: Save artworks that resonate with you, like choosing postcards in a museum gift shop
- **Floating UI Elements**: Beautiful animated components that reveal insights and connections
- **Hybrid Navigation**: Structured learning paths with optional deep-dives

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- OpenAI API key (for course generation)

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory:
```
OPENAI_API_KEY=your_openai_api_key_here
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
/app
  /api              # API routes for course generation and preferences
  /components       # React components (floating, course, artwork, epoch, ui)
  /lib              # Utility functions (LLM, art data, preferences)
  /types            # TypeScript type definitions
  /(routes)         # Page routes (courses, epochs, explore, preferences)
```

## Key Features

### Course Generation
Generate courses dynamically using LLM integration. Example: "Matisse Red Studio → Rothko" course explores how Matisse's revolutionary use of color influenced Rothko's color field paintings.

### Preference System
Track artworks, artists, and epochs that resonate with you. The system learns your preferences and provides recommendations.

### Floating Elements
- **FloatingArtwork**: Artwork cards with parallax animations
- **FloatingInsight**: Hover/click to reveal insights
- **FloatingConnection**: Visual connections between related artworks

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Framer Motion** (animations)
- **OpenAI API** (course generation)
- **Zustand** (state management)

## Philosophy

This app is built on the idea that we often go into museums expecting to like everything—an overwhelming feeling. But we truly understand our preferences when we buy a postcard in the gift shop. This app helps you discover what truly resonates with you in art.

## License

ISC


