'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { loadPreferences } from '@/app/lib/preferences/storage'
import { getAllArtworks } from '@/app/lib/art/allArtworks'
import type { Artwork } from '@/app/types/course'

export default function SavedPage() {
  const router = useRouter()
  const [savedArtworks, setSavedArtworks] = useState<Artwork[]>([])
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null)

  useEffect(() => {
    const prefs = loadPreferences()
    const allArtworks = getAllArtworks()
    const saved = allArtworks.filter(artwork =>
      prefs.artworks.some(pref => pref.artworkId === artwork.id)
    )
    setSavedArtworks(saved)
  }, [])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        if (selectedArtwork) {
          setSelectedArtwork(null)
        } else {
          router.push('/')
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedArtwork, router])

  if (savedArtworks.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-3xl md:text-4xl font-serif font-light mb-6 text-white/70">
            Your collection is empty
          </p>
          <p className="text-lg text-white/50 mb-8 font-light">
            Save artworks that resonate with you
          </p>
          <button
            onClick={() => router.push('/')}
            className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full transition-all border border-white/10 text-white font-light"
          >
            Explore Artworks →
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <>
      <div className="min-h-screen bg-black">
        {/* Header */}
        <div className="max-w-7xl mx-auto px-8 pt-12 pb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-12"
          >
            <div>
              <h1 className="text-5xl md:text-7xl font-serif font-light text-white mb-2">
                Your Collection
              </h1>
              <p className="text-xl text-white/50 font-light">
                {savedArtworks.length} {savedArtworks.length === 1 ? 'artwork' : 'artworks'}
              </p>
            </div>
            <button
              onClick={() => router.push('/')}
              className="text-white/60 hover:text-white/90 text-sm font-light transition-all"
            >
              ← Back
            </button>
          </motion.div>
          
          {/* Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            <AnimatePresence>
              {savedArtworks.map((artwork, index) => (
                <motion.div
                  key={artwork.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                  className="relative aspect-square cursor-pointer group"
                  onClick={() => router.push(`/story/${artwork.id}`)}
                >
                  {artwork.imageUrl ? (
                    <Image
                      src={artwork.imageUrl}
                      alt={artwork.title}
                      fill
                      className="object-cover rounded-lg"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-800 rounded-lg flex items-center justify-center">
                      <span className="text-gray-400 text-sm">{artwork.title}</span>
                    </div>
                  )}
                  
                  {/* Minimal overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 rounded-lg transition-all duration-300" />
                  
                  {/* Title on hover */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-white text-sm font-serif font-light truncate">
                      {artwork.title}
                    </p>
                    <p className="text-white/70 text-xs font-light truncate">
                      {artwork.artist}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </>
  )
}

