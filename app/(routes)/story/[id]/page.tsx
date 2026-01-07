'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { getAllArtworks } from '@/app/lib/art/allArtworks'
import { sampleCourse } from '@/app/lib/art/sampleCourses'
import { addArtworkPreference, loadPreferences } from '@/app/lib/preferences/storage'
import type { Artwork } from '@/app/types/course'

export default function StoryPage() {
  const params = useParams()
  const router = useRouter()
  const artworkId = params.id as string
  
  const [artwork, setArtwork] = useState<Artwork | null>(null)
  const [relatedArtworks, setRelatedArtworks] = useState<Artwork[]>([])
  const [insights, setInsights] = useState<string[]>([])
  const [isSaved, setIsSaved] = useState(false)
  const [currentInsightIndex, setCurrentInsightIndex] = useState(0)

  useEffect(() => {
    const allArtworks = getAllArtworks()
    const foundArtwork = allArtworks.find(a => a.id === artworkId)
    
    if (foundArtwork) {
      setArtwork(foundArtwork)
      
      // Find related artworks from the course
      const course = sampleCourse
      const lesson = course.lessons.find(l => 
        l.artworks?.includes(artworkId)
      )
      
      if (lesson) {
        const related = course.artworks.filter(a => 
          lesson.artworks?.includes(a.id) && a.id !== artworkId
        )
        setRelatedArtworks(related)
        
        // Extract insights from lesson content
        const content = lesson.content.split('\n\n').filter(p => p.length > 50)
        setInsights(content)
      }
    }
  }, [artworkId])

  useEffect(() => {
    const prefs = loadPreferences()
    setIsSaved(prefs.artworks.some(a => a.artworkId === artworkId))
  }, [artworkId])

  const handleSave = () => {
    if (artwork && !isSaved) {
      addArtworkPreference(artwork.id, artwork.title, artwork.artist)
      setIsSaved(true)
    }
  }

  const handleNextInsight = () => {
    if (currentInsightIndex < insights.length - 1) {
      setCurrentInsightIndex(prev => prev + 1)
    } else if (relatedArtworks.length > 0) {
      // Move to next artwork
      router.push(`/story/${relatedArtworks[0].id}`)
    }
  }

  if (!artwork) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-black text-white">
        <p>Artwork not found</p>
      </div>
    )
  }

  return (
    <div className="h-screen w-screen overflow-hidden bg-black flex flex-col">
      {/* Artwork - Fixed Top (70vh) */}
      <div className="relative w-full flex-1 min-h-0" style={{ height: '70vh' }}>
        {artwork.imageUrl ? (
          <Image
            src={artwork.imageUrl}
            alt={artwork.title}
            fill
            className="object-contain"
            priority
            sizes="100vw"
          />
        ) : (
          <div className="w-full h-full bg-gray-900 flex items-center justify-center">
            <span className="text-gray-400 text-2xl">{artwork.title}</span>
          </div>
        )}
      </div>

      {/* Text Content - Scrollable Bottom (30vh) */}
      <div className="bg-black text-white overflow-y-auto" style={{ height: '30vh', maxHeight: '30vh' }}>
        <div className="max-w-3xl mx-auto px-8 md:px-12 py-12 md:py-16">
          {/* Artwork Info */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-serif font-light mb-2">
              {artwork.title}
            </h1>
            <p className="text-xl md:text-2xl text-white/70 font-light">
              {artwork.artist}, {artwork.year}
            </p>
          </div>

          {/* Insights */}
          {insights.length > 0 && (
            <div className="space-y-8">
              {insights.slice(0, currentInsightIndex + 1).map((insight, index) => (
                <motion.p
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className="text-lg md:text-xl font-serif leading-relaxed text-white/90"
                  style={{ lineHeight: '1.8' }}
                >
                  {insight}
                </motion.p>
              ))}
            </div>
          )}

          {/* Navigation */}
          <div className="mt-12 flex items-center gap-4">
            <button
              onClick={handleNextInsight}
              className="px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full text-white transition-all"
            >
              {currentInsightIndex < insights.length - 1 ? 'Continue' : relatedArtworks.length > 0 ? 'Next Artwork →' : 'Done'}
            </button>
            
            <button
              onClick={handleSave}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                isSaved ? 'bg-white/20' : 'bg-white/10 hover:bg-white/20'
              } backdrop-blur-sm`}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill={isSaved ? 'currentColor' : 'none'}
                stroke="currentColor"
                strokeWidth="2"
                className="text-white"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

