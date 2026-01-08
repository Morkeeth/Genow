'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
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
  const textContainerRef = useRef<HTMLDivElement>(null)

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

  const handleNextInsight = useCallback(() => {
    if (currentInsightIndex < insights.length - 1) {
      setCurrentInsightIndex(prev => prev + 1)
      // Auto-scroll to show new content
      setTimeout(() => {
        textContainerRef.current?.scrollBy({ top: 200, behavior: 'smooth' })
      }, 100)
    } else if (relatedArtworks.length > 0) {
      // Move to next artwork
      router.push(`/story/${relatedArtworks[0].id}`)
    } else {
      router.push('/')
    }
  }, [currentInsightIndex, insights.length, relatedArtworks, router])

  // Auto-advance insights on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (!textContainerRef.current) return
      const { scrollTop, scrollHeight, clientHeight } = textContainerRef.current
      const scrollPercentage = scrollTop / (scrollHeight - clientHeight)
      
      // Auto-advance when scrolled 80% down
      if (scrollPercentage > 0.8 && currentInsightIndex < insights.length - 1) {
        setCurrentInsightIndex(prev => prev + 1)
      }
    }

    const container = textContainerRef.current
    container?.addEventListener('scroll', handleScroll)
    return () => container?.removeEventListener('scroll', handleScroll)
  }, [currentInsightIndex, insights.length])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault()
        handleNextInsight()
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        if (currentInsightIndex > 0) {
          setCurrentInsightIndex(prev => prev - 1)
        } else {
          router.push('/')
        }
      }
      if (e.key === 'Escape') {
        e.preventDefault()
        router.push('/')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentInsightIndex, insights.length, relatedArtworks.length, handleNextInsight, router])

  if (!artwork) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-black text-white">
        <p>Artwork not found</p>
      </div>
    )
  }

  return (
    <div className="h-screen w-screen overflow-hidden bg-black flex flex-col">
      {/* Back Button */}
      <button
        onClick={() => router.push('/')}
        className="absolute top-6 left-6 z-30 text-white/60 hover:text-white/90 text-sm font-light transition-all backdrop-blur-sm bg-black/20 px-4 py-2 rounded-full"
      >
        ← Back
      </button>

      {/* Artwork - Fixed Top (70vh) */}
      <motion.div 
        className="relative w-full flex-1 min-h-0" 
        style={{ height: '70vh' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
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
      </motion.div>

      {/* Text Content - Scrollable Bottom (30vh) */}
      <div 
        ref={textContainerRef}
        className="bg-black text-white overflow-y-auto scroll-smooth" 
        style={{ height: '30vh', maxHeight: '30vh' }}
      >
        <div className="max-w-4xl mx-auto px-8 md:px-16 py-16 md:py-20">
          {/* Artwork Info */}
          <motion.div 
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-6xl font-serif font-light mb-3 tracking-tight">
              {artwork.title}
            </h1>
            <p className="text-2xl md:text-3xl text-white/60 font-light">
              {artwork.artist}, {artwork.year}
            </p>
          </motion.div>

          {/* Insights */}
          {insights.length > 0 ? (
            <div className="space-y-10 md:space-y-12">
              {insights.slice(0, currentInsightIndex + 1).map((insight, index) => (
                <motion.p
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.15 }}
                  className="text-xl md:text-2xl font-serif leading-relaxed text-white/85"
                  style={{ lineHeight: '2', letterSpacing: '0.01em' }}
                >
                  {insight}
                </motion.p>
              ))}
            </div>
          ) : (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="text-xl md:text-2xl font-serif leading-relaxed text-white/70 italic"
              style={{ lineHeight: '2' }}
            >
              {artwork.description || 'Explore this artwork and discover what resonates with you.'}
            </motion.p>
          )}

          {/* Navigation */}
          <motion.div 
            className="mt-16 flex items-center gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <button
              onClick={handleNextInsight}
              className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full text-white text-lg font-light transition-all border border-white/10"
            >
              {currentInsightIndex < insights.length - 1 
                ? 'Continue Reading →' 
                : relatedArtworks.length > 0 
                  ? 'Next Artwork →' 
                  : 'Back to Gallery'}
            </button>
            
            <button
              onClick={handleSave}
              className={`w-14 h-14 rounded-full flex items-center justify-center transition-all backdrop-blur-sm border ${
                isSaved 
                  ? 'bg-white/20 border-white/30' 
                  : 'bg-white/10 hover:bg-white/20 border-white/10'
              }`}
            >
              <motion.svg
                width="26"
                height="26"
                viewBox="0 0 24 24"
                fill={isSaved ? 'currentColor' : 'none'}
                stroke="currentColor"
                strokeWidth="2"
                className="text-white"
                animate={isSaved ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 0.3 }}
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </motion.svg>
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

