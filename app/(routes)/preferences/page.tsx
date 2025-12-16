'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { loadPreferences, generateRecommendations, clearPreferences } from '@/app/lib/preferences/storage'
import type { UserPreferences, PreferenceRecommendation } from '@/app/types/preference'
import { fadeInUp, staggerContainer } from '@/app/lib/utils/animations'
import Link from 'next/link'

export default function PreferencesPage() {
  const [preferences, setPreferences] = useState<UserPreferences | null>(null)
  const [recommendations, setRecommendations] = useState<PreferenceRecommendation[]>([])

  useEffect(() => {
    const prefs = loadPreferences()
    setPreferences(prefs)
    const recs = generateRecommendations(prefs)
    setRecommendations(recs)
  }, [])

  const handleClear = () => {
    if (confirm('Are you sure you want to clear all preferences?')) {
      clearPreferences()
      setPreferences({
        artworks: [],
        artists: [],
        epochs: [],
        lastUpdated: new Date(),
      })
      setRecommendations([])
    }
  }

  if (!preferences) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Loading preferences...</p>
      </div>
    )
  }

  const hasPreferences =
    preferences.artworks.length > 0 ||
    preferences.artists.length > 0 ||
    preferences.epochs.length > 0

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-serif font-bold">My Preferences</h1>
          {hasPreferences && (
            <button
              onClick={handleClear}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Clear All
            </button>
          )}
        </div>

        {!hasPreferences ? (
          <motion.div
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-12 text-center"
          >
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">
              You haven't saved any preferences yet.
            </p>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Start exploring artworks and click "This Resonates With Me" to
              save your favorites.
            </p>
            <Link
              href="/explore"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Explore Artworks
            </Link>
          </motion.div>
        ) : (
          <>
            {/* Recommendations */}
            {recommendations.length > 0 && (
              <motion.div
                variants={fadeInUp}
                initial="initial"
                animate="animate"
                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8"
              >
                <h2 className="text-2xl font-serif font-semibold mb-4">
                  Recommendations
                </h2>
                <div className="space-y-3">
                  {recommendations.map((rec) => (
                    <div
                      key={rec.id}
                      className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg"
                    >
                      <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-1">
                        {rec.title}
                      </h3>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                        {rec.reason}
                      </p>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${rec.confidence * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Artwork Preferences */}
            {preferences.artworks.length > 0 && (
              <motion.div
                variants={fadeInUp}
                initial="initial"
                animate="animate"
                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8"
              >
                <h2 className="text-2xl font-serif font-semibold mb-4">
                  Saved Artworks ({preferences.artworks.length})
                </h2>
                <motion.div
                  variants={staggerContainer}
                  initial="initial"
                  animate="animate"
                  className="space-y-3"
                >
                  {preferences.artworks.map((artwork) => (
                    <motion.div
                      key={artwork.artworkId}
                      variants={fadeInUp}
                      className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                        {artwork.artworkTitle}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {artwork.artist}
                      </p>
                      {artwork.rating && (
                        <div className="flex items-center gap-1 mb-2">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            Rating:
                          </span>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <span
                                key={i}
                                className={`text-lg ${
                                  i < artwork.rating!
                                    ? 'text-yellow-400'
                                    : 'text-gray-300 dark:text-gray-600'
                                }`}
                              >
                                ★
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {artwork.notes && (
                        <p className="text-sm text-gray-700 dark:text-gray-300 italic">
                          "{artwork.notes}"
                        </p>
                      )}
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        Saved on{' '}
                        {new Date(artwork.timestamp).toLocaleDateString()}
                      </p>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            )}

            {/* Artist Preferences */}
            {preferences.artists.length > 0 && (
              <motion.div
                variants={fadeInUp}
                initial="initial"
                animate="animate"
                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8"
              >
                <h2 className="text-2xl font-serif font-semibold mb-4">
                  Favorite Artists ({preferences.artists.length})
                </h2>
                <div className="flex flex-wrap gap-3">
                  {preferences.artists.map((artist) => (
                    <div
                      key={artist.artistId}
                      className="px-4 py-2 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full"
                    >
                      {artist.artistName}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Epoch Preferences */}
            {preferences.epochs.length > 0 && (
              <motion.div
                variants={fadeInUp}
                initial="initial"
                animate="animate"
                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
              >
                <h2 className="text-2xl font-serif font-semibold mb-4">
                  Favorite Epochs ({preferences.epochs.length})
                </h2>
                <div className="flex flex-wrap gap-3">
                  {preferences.epochs.map((epoch) => (
                    <div
                      key={epoch.epochId}
                      className="px-4 py-2 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full"
                    >
                      {epoch.epochName}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  )
}


