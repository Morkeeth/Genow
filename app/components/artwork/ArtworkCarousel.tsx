'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import type { Artwork } from '@/app/types/course'
import { addArtworkPreference, loadPreferences } from '@/app/lib/preferences/storage'

interface ArtworkCarouselProps {
  artworks: Artwork[]
  onArtworkClick?: (artwork: Artwork) => void
}

export default function ArtworkCarousel({ artworks, onArtworkClick }: ArtworkCarouselProps) {
  const router = useRouter()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isSaved, setIsSaved] = useState<Record<string, boolean>>({})
  const [showText, setShowText] = useState(false)

  useEffect(() => {
    // Check which artworks are saved
    const prefs = loadPreferences()
    const savedIds = new Set(prefs.artworks.map(a => a.artworkId))
    const savedMap: Record<string, boolean> = {}
    artworks.forEach(artwork => {
      savedMap[artwork.id] = savedIds.has(artwork.id)
    })
    setIsSaved(savedMap)
  }, [artworks])

  useEffect(() => {
    // Show text after 2 seconds
    const timer = setTimeout(() => setShowText(true), 2000)
    return () => clearTimeout(timer)
  }, [currentIndex])

  const currentArtwork = artworks[currentIndex]

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % artworks.length)
    setShowText(false)
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + artworks.length) % artworks.length)
    setShowText(false)
  }

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation()
    const artwork = artworks[currentIndex]
    if (!isSaved[artwork.id]) {
      addArtworkPreference(artwork.id, artwork.title, artwork.artist)
      setIsSaved({ ...isSaved, [artwork.id]: true })
    }
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') handlePrev()
    if (e.key === 'ArrowRight') handleNext()
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  if (!currentArtwork) return null

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* Artwork Image - Full Screen */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentArtwork.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={(e, { offset, velocity }) => {
            const swipe = Math.abs(offset.x) * velocity.x
            
            if (swipe < -10000) {
              handleNext()
            } else if (swipe > 10000) {
              handlePrev()
            }
          }}
        >
          {currentArtwork.imageUrl ? (
            <Image
              src={currentArtwork.imageUrl}
              alt={currentArtwork.title}
              fill
              className="object-contain"
              priority
              sizes="100vw"
            />
          ) : (
            <div className="w-full h-full bg-gray-900 flex items-center justify-center">
              <span className="text-gray-400 text-2xl">{currentArtwork.title}</span>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Text Overlay - Minimal */}
      <AnimatePresence>
        {showText && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/60 to-transparent p-12 md:p-20"
            onClick={() => onArtworkClick?.(currentArtwork)}
          >
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl md:text-6xl font-serif font-light text-white mb-2">
                {currentArtwork.title}
              </h2>
              <p className="text-xl md:text-2xl text-white/90 font-light">
                {currentArtwork.artist}, {currentArtwork.year}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation Arrows */}
      <button
        onClick={handlePrev}
        className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center text-white text-2xl transition-all z-20"
        aria-label="Previous artwork"
      >
        ←
      </button>
      <button
        onClick={handleNext}
        className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center text-white text-2xl transition-all z-20"
        aria-label="Next artwork"
      >
        →
      </button>

      {/* Save Button - Heart Icon */}
      <motion.button
        onClick={handleSave}
        className="absolute bottom-6 right-6 w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center text-white transition-all z-20"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Save artwork"
      >
        <motion.svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill={isSaved[currentArtwork.id] ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth="2"
          animate={{ scale: isSaved[currentArtwork.id] ? [1, 1.2, 1] : 1 }}
          transition={{ duration: 0.3 }}
        >
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </motion.svg>
      </motion.button>

      {/* Progress Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {artworks.map((_, index) => (
          <div
            key={index}
            className={`h-1 transition-all duration-300 ${
              index === currentIndex ? 'w-8 bg-white' : 'w-1 bg-white/30'
            }`}
          />
        ))}
      </div>

      {/* Saved Link - Subtle */}
      <button
        onClick={() => router.push('/saved')}
        className="absolute top-6 right-6 text-white/60 hover:text-white/90 text-sm font-light transition-all z-20"
      >
        Saved
      </button>
    </div>
  )
}

