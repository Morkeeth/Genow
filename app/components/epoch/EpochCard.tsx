'use client'

import { motion } from 'framer-motion'
import type { Epoch } from '@/app/types/epoch'
import { fadeInUp } from '@/app/lib/utils/animations'
import PoeticText from '../ui/PoeticText'
import FloatingInsight from '../floating/FloatingInsight'

interface EpochCardProps {
  epoch: Epoch
  onSelect?: (epoch: Epoch) => void
}

export default function EpochCard({ epoch, onSelect }: EpochCardProps) {
  return (
    <motion.div
      variants={fadeInUp}
      initial="initial"
      animate="animate"
      className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow"
      onClick={() => onSelect?.(epoch)}
      style={{
        borderLeft: `4px solid ${epoch.color || '#666'}`,
      }}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-2xl font-serif font-bold mb-2">{epoch.name}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {epoch.startYear} - {epoch.endYear}
          </p>
        </div>
        <FloatingInsight
          title={epoch.name}
          content={epoch.culturalContext}
          position="top"
          trigger="hover"
        />
      </div>

      <p className="text-gray-700 dark:text-gray-300 mb-4 poetic-text">
        {epoch.description}
      </p>

      {epoch.story && (
        <div className="mb-4">
          <PoeticText text={epoch.story} />
        </div>
      )}

      <div className="mb-4">
        <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
          Key Artists
        </h4>
        <div className="flex flex-wrap gap-2">
          {epoch.keyArtists.map((artist) => (
            <span
              key={artist}
              className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm"
            >
              {artist}
            </span>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
          Movements
        </h4>
        <div className="flex flex-wrap gap-2">
          {epoch.movements.map((movement) => (
            <span
              key={movement}
              className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-sm"
            >
              {movement}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  )
}


