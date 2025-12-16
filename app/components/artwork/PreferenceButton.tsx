'use client'

import { useState } from 'react'
import { addArtworkPreference, removeArtworkPreference, loadPreferences } from '@/app/lib/preferences/storage'

interface PreferenceButtonProps {
  artworkId: string
  artworkTitle: string
  artist: string
}

export default function PreferenceButton({
  artworkId,
  artworkTitle,
  artist,
}: PreferenceButtonProps) {
  const [isSaved, setIsSaved] = useState(() => {
    if (typeof window === 'undefined') return false
    const preferences = loadPreferences()
    return preferences.artworks.some((a) => a.artworkId === artworkId)
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleClick = async () => {
    setIsLoading(true)
    
    try {
      if (isSaved) {
        removeArtworkPreference(artworkId)
        setIsSaved(false)
      } else {
        addArtworkPreference(artworkId, artworkTitle, artist)
        setIsSaved(true)
      }
    } catch (error) {
      console.error('Error updating preference:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
        isSaved
          ? 'bg-green-500 text-white hover:bg-green-600'
          : 'bg-orange-500 text-white hover:bg-orange-600'
      } disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {isLoading
        ? 'Saving...'
        : isSaved
        ? '✓ Saved to Preferences'
        : '💝 This Resonates With Me'}
    </button>
  )
}


