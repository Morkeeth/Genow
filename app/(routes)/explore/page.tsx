'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { sampleArtworks, sampleConnections, getConnectionsForArtwork } from '@/app/lib/art/connections'
import ArtworkCard from '@/app/components/artwork/ArtworkCard'
import ArtworkDetail from '@/app/components/artwork/ArtworkDetail'
import ConnectionGraph from '@/app/components/course/ConnectionGraph'
import FloatingConnection from '@/app/components/floating/FloatingConnection'
import type { Artwork, Connection } from '@/app/types/course'
import { staggerContainer } from '@/app/lib/utils/animations'

export default function ExplorePage() {
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null)
  const [selectedConnection, setSelectedConnection] = useState<Connection | null>(null)
  const [showConnections, setShowConnections] = useState(true)

  const handleArtworkClick = (artwork: Artwork) => {
    setSelectedArtwork(artwork)
  }

  const handleConnectionClick = (connection: Connection) => {
    setSelectedConnection(connection)
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-serif font-bold mb-4">Explore Artworks</h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 poetic-text mb-8">
          Discover artworks and their connections. Find what resonates with you.
          What would you buy as a postcard in the museum gift shop?
        </p>

        {/* Connection Graph */}
        {showConnections && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-12"
          >
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-serif font-semibold mb-4">
                Artwork Connections
              </h2>
              <ConnectionGraph
                connections={sampleConnections}
                artworks={sampleArtworks}
                onConnectionClick={handleConnectionClick}
              />
            </div>
          </motion.div>
        )}

        {/* Connection Story Modal */}
        {selectedConnection && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedConnection(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-serif font-semibold mb-4">
                Connection Story
              </h2>
              <p className="text-gray-700 dark:text-gray-300 poetic-text mb-4">
                {selectedConnection.story}
              </p>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm">
                  {selectedConnection.type}
                </span>
                <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-sm">
                  Strength: {Math.round((selectedConnection.strength || 0) * 100)}%
                </span>
              </div>
              <button
                onClick={() => setSelectedConnection(null)}
                className="mt-4 px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}

        {/* Toggle Connections */}
        <div className="mb-8">
          <button
            onClick={() => setShowConnections(!showConnections)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {showConnections ? 'Hide' : 'Show'} Connections
          </button>
        </div>

        {/* Artworks Grid */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {sampleArtworks.map((artwork) => (
            <ArtworkCard
              key={artwork.id}
              artwork={artwork}
              onClick={() => handleArtworkClick(artwork)}
              showPreference={true}
            />
          ))}
        </motion.div>

        {/* Artwork Detail Modal */}
        {selectedArtwork && (
          <ArtworkDetail
            artwork={selectedArtwork}
            onClose={() => setSelectedArtwork(null)}
          />
        )}
      </div>
    </div>
  )
}


