'use client'

import { useRouter } from 'next/navigation'
import ArtworkCarousel from './components/artwork/ArtworkCarousel'
import { getAllArtworks } from './lib/art/allArtworks'
import type { Artwork } from './types/course'

export default function Home() {
  const router = useRouter()
  const artworks = getAllArtworks()

  const handleArtworkClick = (artwork: Artwork) => {
    // Navigate to story view for this artwork
    // For now, navigate to a story page if it exists
    router.push(`/story/${artwork.id}`)
  }

  return (
    <main className="h-screen w-screen overflow-hidden">
      <ArtworkCarousel artworks={artworks} onArtworkClick={handleArtworkClick} />
    </main>
  )
}

