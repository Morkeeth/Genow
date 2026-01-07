'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { loadPreferences } from '@/app/lib/preferences/storage'
import { getAllArtworks } from '@/app/lib/art/allArtworks'
import type { Artwork } from '@/app/types/course'

export default function SavedPage() {
  const router = useRouter()
  const [savedArtworks, setSavedArtworks] = useState<Artwork[]>([])

  useEffect(() => {
    const prefs = loadPreferences()
    const allArtworks = getAllArtworks()
    const saved = allArtworks.filter(artwork =>
      prefs.artworks.some(pref => pref.artworkId === artwork.id)
    )
    setSavedArtworks(saved)
  }, [])

  if (savedArtworks.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl font-serif mb-4">No saved artworks yet</p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full transition-all"
          >
            Explore Artworks
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-serif font-light text-white mb-12">
          Your Collection
        </h1>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {savedArtworks.map((artwork) => (
            <motion.div
              key={artwork.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
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
                  <span className="text-gray-400">{artwork.title}</span>
                </div>
              )}
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 rounded-lg transition-all flex items-center justify-center">
                <p className="text-white opacity-0 group-hover:opacity-100 transition-opacity text-sm font-serif px-4 text-center">
                  {artwork.title}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

