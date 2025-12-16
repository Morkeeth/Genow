'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import type { Connection, Artwork } from '@/app/types/course'
import FloatingConnection from '../floating/FloatingConnection'
import FloatingInsight from '../floating/FloatingInsight'

interface ConnectionGraphProps {
  connections: Connection[]
  artworks: Artwork[]
  onConnectionClick?: (connection: Connection) => void
}

export default function ConnectionGraph({
  connections,
  artworks,
  onConnectionClick,
}: ConnectionGraphProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [positions, setPositions] = useState<Record<string, { x: number; y: number }>>({})

  useEffect(() => {
    // Calculate positions for artworks in a circular or grid layout
    const newPositions: Record<string, { x: number; y: number }> = {}
    const radius = 200
    const centerX = 300
    const centerY = 300

    artworks.forEach((artwork, index) => {
      const angle = (index / artworks.length) * 2 * Math.PI
      newPositions[artwork.id] = {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
      }
    })

    setPositions(newPositions)
  }, [artworks])

  return (
    <div
      ref={containerRef}
      className="relative w-full h-96 bg-gray-50 dark:bg-gray-900 rounded-lg overflow-hidden"
    >
      {/* Artwork nodes */}
      {artworks.map((artwork) => {
        const pos = positions[artwork.id]
        if (!pos) return null

        return (
          <motion.div
            key={artwork.id}
            className="absolute w-12 h-12 rounded-full bg-blue-500 shadow-lg cursor-pointer flex items-center justify-center text-white font-semibold text-xs"
            style={{
              left: pos.x - 24,
              top: pos.y - 24,
            }}
            whileHover={{ scale: 1.2 }}
            title={artwork.title}
          >
            {artwork.artist.charAt(0)}
          </motion.div>
        )
      })}

      {/* Connection lines */}
      {connections.map((connection) => {
        const fromPos = positions[connection.from]
        const toPos = positions[connection.to]
        
        if (!fromPos || !toPos) return null

        return (
          <FloatingConnection
            key={connection.id}
            connection={connection}
            fromPosition={fromPos}
            toPosition={toPos}
            onConnectionClick={onConnectionClick}
          />
        )
      })}

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-lg">
        <p className="text-xs text-gray-600 dark:text-gray-400">
          Click connections to explore relationships
        </p>
      </div>
    </div>
  )
}


