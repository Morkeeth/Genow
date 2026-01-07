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
    router.push(`/story/${artwork.id}`)
  }

  if (artworks.length === 0) {
    return (
      <main className="h-screen w-screen overflow-hidden bg-black flex items-center justify-center text-white">
        <p>Loading artworks...</p>
      </main>
    )
  }

  return (
    <main className="h-screen w-screen overflow-hidden">
      <ArtworkCarousel artworks={artworks} onArtworkClick={handleArtworkClick} />
    </main>
  )
}

